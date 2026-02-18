"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { createBrowserClient } from "@/lib/supabase";

interface SettingsPageProps {
  email: string;
}

export default function SettingsPage({ email }: SettingsPageProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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
      }
    }
    fetchProfile();
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

  async function handleSignOut() {
    const supabase = createBrowserClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const themeOptions = [
    { value: "dark", label: "Dark" },
    { value: "light", label: "Light" },
    { value: "system", label: "System" },
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

        {/* Sign out */}
        <div className="bg-bg-card border border-border rounded-2xl p-4 md:p-6">
          <h3 className="text-[15px] font-semibold mb-2">Sign Out</h3>
          <p className="text-[13px] text-text-muted font-light mb-4">
            Sign out of your account on this device.
          </p>
          <button
            onClick={handleSignOut}
            className="px-5 py-2.5 bg-transparent text-red border border-red/30 rounded-lg font-mono text-[13px] font-medium cursor-pointer transition-all hover:bg-red-dim"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
