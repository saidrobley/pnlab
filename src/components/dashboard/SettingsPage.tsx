"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { createBrowserClient } from "@/lib/supabase";
import type { ExchangeConnection } from "@/lib/types";

interface SettingsPageProps {
  email: string;
}

export default function SettingsPage({ email }: SettingsPageProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [defaultCurrency, setDefaultCurrency] = useState("USD");
  const [defaultExchange, setDefaultExchange] = useState("Binance");

  // Exchange connection state
  const [connection, setConnection] = useState<ExchangeConnection | null>(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [syncPeriod, setSyncPeriod] = useState<"7d" | "30d" | "90d" | "180d">("30d");
  const [connecting, setConnecting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);
  const [disconnecting, setDisconnecting] = useState(false);
  const [walletError, setWalletError] = useState("");

  useEffect(() => {
    setMounted(true);

    async function fetchProfile() {
      const supabase = createBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("display_name, created_at")
          .eq("id", user.id)
          .single();

        if (data) {
          setDisplayName(data.display_name || "");
          setCreatedAt(
            new Date(data.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          );
        }

        // Fetch exchange connection
        const { data: conn } = await supabase
          .from("exchange_connections")
          .select("*")
          .eq("user_id", user.id)
          .eq("exchange", "hyperliquid")
          .maybeSingle();

        if (conn) {
          setConnection(conn);
          setSyncPeriod(conn.sync_period);
        }
      }
    }
    fetchProfile();

    const storedCurrency = localStorage.getItem("pnlab_default_currency");
    const storedExchange = localStorage.getItem("pnlab_default_exchange");
    if (storedCurrency) setDefaultCurrency(storedCurrency);
    if (storedExchange) setDefaultExchange(storedExchange);
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    const supabase = createBrowserClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase
        .from("profiles")
        .update({ display_name: displayName.trim() || null })
        .eq("id", user.id);
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleConnect(e: React.FormEvent) {
    e.preventDefault();
    setWalletError("");
    setSyncResult(null);

    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      setWalletError("Enter a valid Ethereum address (0x...)");
      return;
    }

    setConnecting(true);
    const supabase = createBrowserClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setConnecting(false);
      return;
    }

    const { data: conn, error } = await supabase
      .from("exchange_connections")
      .upsert(
        {
          user_id: user.id,
          exchange: "hyperliquid",
          wallet_address: walletAddress.trim(),
          sync_period: syncPeriod,
        },
        { onConflict: "user_id,exchange" }
      )
      .select()
      .single();

    if (error) {
      setWalletError("Failed to save connection");
      setConnecting(false);
      return;
    }

    setConnection(conn);

    // Trigger initial sync
    try {
      const res = await fetch("/api/sync", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setSyncResult(`Synced ${data.inserted} new trade${data.inserted !== 1 ? "s" : ""}`);
        // Refresh connection for last_synced_at
        const { data: updated } = await supabase
          .from("exchange_connections")
          .select("*")
          .eq("id", conn.id)
          .single();
        if (updated) setConnection(updated);
      } else {
        setSyncResult(data.error || "Sync failed");
      }
    } catch {
      setSyncResult("Sync failed");
    }

    setConnecting(false);
  }

  async function handleSync() {
    setSyncing(true);
    setSyncResult(null);

    try {
      const res = await fetch("/api/sync", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setSyncResult(`Synced ${data.inserted} new trade${data.inserted !== 1 ? "s" : ""}`);
        // Refresh connection for last_synced_at
        if (connection) {
          const supabase = createBrowserClient();
          const { data: updated } = await supabase
            .from("exchange_connections")
            .select("*")
            .eq("id", connection.id)
            .single();
          if (updated) setConnection(updated);
        }
      } else {
        setSyncResult(data.error || "Sync failed");
      }
    } catch {
      setSyncResult("Sync failed");
    }

    setSyncing(false);
  }

  async function handleDisconnect() {
    if (!connection) return;
    if (!confirm("Disconnect Hyperliquid? Your synced trades will be kept.")) return;

    setDisconnecting(true);
    const supabase = createBrowserClient();
    await supabase
      .from("exchange_connections")
      .delete()
      .eq("id", connection.id);

    setConnection(null);
    setWalletAddress("");
    setSyncResult(null);
    setDisconnecting(false);
  }

  async function handleSyncPeriodChange(newPeriod: "7d" | "30d" | "90d" | "180d") {
    setSyncPeriod(newPeriod);
    if (!connection) return;

    const supabase = createBrowserClient();
    await supabase
      .from("exchange_connections")
      .update({ sync_period: newPeriod })
      .eq("id", connection.id);

    setConnection({ ...connection, sync_period: newPeriod });
  }

  function formatRelativeTime(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  const themeOptions = [
    { value: "dark", label: "Dark" },
    { value: "light", label: "Light" },
    { value: "system", label: "System" },
  ] as const;

  const syncPeriodOptions = [
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "90d", label: "Last 90 days" },
    { value: "180d", label: "Last 180 days" },
  ] as const;

  return (
    <div>
      <h1 className="font-serif text-2xl md:text-3xl mb-1">Settings</h1>
      <p className="text-text-muted text-[13px] font-light mb-6 md:mb-8">
        Manage your account
      </p>

      <div className="max-w-[500px] space-y-6">
        {/* Profile */}
        <form
          onSubmit={handleSave}
          className="bg-bg-card border border-border rounded-2xl p-4 md:p-6"
        >
          <h3 className="text-[15px] font-semibold mb-4">Profile</h3>

          <div className="mb-4">
            <label className="block text-[11px] text-text-muted font-medium uppercase tracking-wider mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              className="w-full px-3 py-2.5 bg-bg border border-border rounded-lg text-text font-mono text-[13px] outline-none transition-colors focus:border-accent"
            />
          </div>

          <div className="mb-4">
            <label className="block text-[11px] text-text-muted font-medium uppercase tracking-wider mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full px-3 py-2.5 bg-bg border border-border rounded-lg text-text-muted font-mono text-[13px] cursor-not-allowed"
            />
            <p className="text-[11px] text-text-muted font-light mt-1">
              Email cannot be changed.
            </p>
          </div>

          {createdAt && (
            <p className="text-[12px] text-text-dim font-light mb-4">
              Account created {createdAt}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 bg-text text-bg border-none rounded-lg font-mono text-[13px] font-semibold cursor-pointer transition-all hover:-translate-y-px hover:shadow-[0_4px_20px_rgba(255,255,255,0.15)] disabled:opacity-50"
          >
            {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
          </button>
        </form>

        {/* Connected Exchanges */}
        <div className="bg-bg-card border border-border rounded-2xl p-4 md:p-6">
          <h3 className="text-[15px] font-semibold mb-2">Connected Exchanges</h3>
          <p className="text-[13px] text-text-muted font-light mb-4">
            Connect your exchange wallet to auto-sync trade history.
          </p>

          {connection ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-[13px] font-medium">Hyperliquid</span>
              </div>

              <div>
                <label className="block text-[11px] text-text-muted font-medium uppercase tracking-wider mb-1.5">
                  Wallet Address
                </label>
                <p className="text-[13px] font-mono text-text-muted">
                  {connection.wallet_address.slice(0, 6)}...{connection.wallet_address.slice(-4)}
                </p>
              </div>

              <div>
                <label className="block text-[11px] text-text-muted font-medium uppercase tracking-wider mb-1.5">
                  Sync Period
                </label>
                <select
                  value={syncPeriod}
                  onChange={(e) => handleSyncPeriodChange(e.target.value as "7d" | "30d" | "90d" | "180d")}
                  className="w-full px-3 py-2.5 bg-bg border border-border rounded-lg text-text font-mono text-[13px] outline-none transition-colors focus:border-accent"
                >
                  {syncPeriodOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {connection.last_synced_at && (
                <p className="text-[12px] text-text-dim font-light">
                  Last synced: {formatRelativeTime(connection.last_synced_at)}
                </p>
              )}

              {syncResult && (
                <p className="text-[12px] text-accent font-medium">{syncResult}</p>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleSync}
                  disabled={syncing}
                  className="px-4 py-2 bg-accent text-white rounded-lg font-mono text-[13px] font-medium transition-colors hover:opacity-90 disabled:opacity-50"
                >
                  {syncing ? "Syncing..." : "Sync Now"}
                </button>
                <button
                  onClick={handleDisconnect}
                  disabled={disconnecting}
                  className="px-4 py-2 bg-bg-elevated text-text-muted border border-border rounded-lg font-mono text-[13px] font-medium transition-colors hover:text-red-400 hover:border-red-400/50 disabled:opacity-50"
                >
                  {disconnecting ? "Disconnecting..." : "Disconnect"}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleConnect} className="space-y-4">
              <div>
                <label className="block text-[11px] text-text-muted font-medium uppercase tracking-wider mb-1.5">
                  Wallet Address
                </label>
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => {
                    setWalletAddress(e.target.value);
                    setWalletError("");
                  }}
                  placeholder="0x..."
                  className="w-full px-3 py-2.5 bg-bg border border-border rounded-lg text-text font-mono text-[13px] outline-none transition-colors focus:border-accent"
                />
                {walletError && (
                  <p className="text-[11px] text-red-400 font-light mt-1">{walletError}</p>
                )}
              </div>

              <div>
                <label className="block text-[11px] text-text-muted font-medium uppercase tracking-wider mb-1.5">
                  Sync Period
                </label>
                <select
                  value={syncPeriod}
                  onChange={(e) => setSyncPeriod(e.target.value as "7d" | "30d" | "90d" | "180d")}
                  className="w-full px-3 py-2.5 bg-bg border border-border rounded-lg text-text font-mono text-[13px] outline-none transition-colors focus:border-accent"
                >
                  {syncPeriodOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {syncResult && (
                <p className="text-[12px] text-accent font-medium">{syncResult}</p>
              )}

              <button
                type="submit"
                disabled={connecting}
                className="px-5 py-2.5 bg-text text-bg border-none rounded-lg font-mono text-[13px] font-semibold cursor-pointer transition-all hover:-translate-y-px hover:shadow-[0_4px_20px_rgba(255,255,255,0.15)] disabled:opacity-50"
              >
                {connecting ? "Connecting..." : "Connect & Sync"}
              </button>
            </form>
          )}
        </div>

        {/* Appearance */}
        <div className="bg-bg-card border border-border rounded-2xl p-4 md:p-6">
          <h3 className="text-[15px] font-semibold mb-2">Appearance</h3>
          <p className="text-[13px] text-text-muted font-light mb-4">
            Choose your preferred theme.
          </p>
          {mounted && (
            <div className="flex gap-2">
              {themeOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setTheme(opt.value)}
                  className={`px-4 py-2 rounded-lg font-mono text-[13px] font-medium transition-colors ${
                    theme === opt.value
                      ? "bg-accent text-white"
                      : "bg-bg-elevated text-text-muted hover:text-text border border-border"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Preferences */}
        <div className="bg-bg-card border border-border rounded-2xl p-4 md:p-6">
          <h3 className="text-[15px] font-semibold mb-2">Preferences</h3>
          <p className="text-[13px] text-text-muted font-light mb-4">
            Set your default currency and exchange.
          </p>

          <div className="mb-4">
            <label className="block text-[11px] text-text-muted font-medium uppercase tracking-wider mb-1.5">
              Default Currency
            </label>
            <select
              value={defaultCurrency}
              onChange={(e) => {
                setDefaultCurrency(e.target.value);
                localStorage.setItem("pnlab_default_currency", e.target.value);
              }}
              className="w-full px-3 py-2.5 bg-bg border border-border rounded-lg text-text font-mono text-[13px] outline-none transition-colors focus:border-accent"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="BTC">BTC</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-text-muted font-medium uppercase tracking-wider mb-1.5">
              Default Exchange
            </label>
            <select
              value={defaultExchange}
              onChange={(e) => {
                setDefaultExchange(e.target.value);
                localStorage.setItem("pnlab_default_exchange", e.target.value);
              }}
              className="w-full px-3 py-2.5 bg-bg border border-border rounded-lg text-text font-mono text-[13px] outline-none transition-colors focus:border-accent"
            >
              <option value="Binance">Binance</option>
              <option value="Bybit">Bybit</option>
              <option value="Hyperliquid">Hyperliquid</option>
              <option value="Coinbase">Coinbase</option>
              <option value="Kraken">Kraken</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
