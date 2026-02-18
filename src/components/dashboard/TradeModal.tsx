"use client";

import { useState, useEffect, useCallback } from "react";
import { createBrowserClient } from "@/lib/supabase";
import { Trade, TradeFormData } from "@/lib/types";

interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  trade?: Trade | null;
}

const emptyForm: TradeFormData = {
  symbol: "",
  direction: "long",
  entry_price: "",
  exit_price: "",
  size: "",
  fees: "0",
  pnl: "",
  strategy: "",
  exchange: "Binance",
  opened_at: new Date().toISOString().slice(0, 16),
  closed_at: new Date().toISOString().slice(0, 16),
  notes: "",
};

const inputClass =
  "w-full px-3 py-2.5 bg-bg border border-border rounded-lg text-text font-mono text-[13px] outline-none transition-colors focus:border-accent";
const labelClass = "block text-[11px] text-text-muted font-medium uppercase tracking-wider mb-1.5";

function tradeToForm(trade: Trade): TradeFormData {
  return {
    symbol: trade.symbol,
    direction: trade.direction,
    entry_price: String(trade.entry_price),
    exit_price: trade.exit_price !== null ? String(trade.exit_price) : "",
    size: String(trade.size),
    fees: String(trade.fees),
    pnl: trade.pnl !== null ? String(trade.pnl) : "",
    strategy: trade.strategy || "",
    exchange: trade.exchange || "Binance",
    opened_at: trade.opened_at ? new Date(trade.opened_at).toISOString().slice(0, 16) : "",
    closed_at: trade.closed_at ? new Date(trade.closed_at).toISOString().slice(0, 16) : "",
    notes: trade.notes || "",
  };
}

export default function TradeModal({
  isOpen,
  onClose,
  onSaved,
  trade,
}: TradeModalProps) {
  const isEdit = !!trade;
  const [form, setForm] = useState<TradeFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Reset form when opening
  useEffect(() => {
    if (isOpen) {
      if (trade) {
        setForm(tradeToForm(trade));
      } else {
        setForm({
          ...emptyForm,
          opened_at: new Date().toISOString().slice(0, 16),
          closed_at: new Date().toISOString().slice(0, 16),
        });
      }
      setError("");
    }
  }, [isOpen, trade]);

  // Auto-calculate PnL
  useEffect(() => {
    const entry = parseFloat(form.entry_price);
    const exit = parseFloat(form.exit_price);
    const size = parseFloat(form.size);
    const fees = parseFloat(form.fees) || 0;

    if (!isNaN(entry) && !isNaN(exit) && !isNaN(size)) {
      const raw =
        form.direction === "long"
          ? (exit - entry) * size - fees
          : (entry - exit) * size - fees;
      setForm((prev) => ({ ...prev, pnl: raw.toFixed(2) }));
    }
  }, [form.entry_price, form.exit_price, form.size, form.fees, form.direction]);

  function update(field: keyof TradeFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const supabase = createBrowserClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Not authenticated");
      setSaving(false);
      return;
    }

    const payload = {
      symbol: form.symbol.toUpperCase(),
      direction: form.direction,
      entry_price: parseFloat(form.entry_price),
      exit_price: form.exit_price ? parseFloat(form.exit_price) : null,
      size: parseFloat(form.size),
      fees: parseFloat(form.fees) || 0,
      pnl: form.pnl ? parseFloat(form.pnl) : null,
      strategy: form.strategy || null,
      exchange: form.exchange,
      opened_at: new Date(form.opened_at).toISOString(),
      closed_at: form.closed_at
        ? new Date(form.closed_at).toISOString()
        : null,
      notes: form.notes || null,
    };

    if (isEdit && trade) {
      const { error: updateError } = await supabase
        .from("trades")
        .update(payload)
        .eq("id", trade.id);

      if (updateError) {
        setError(updateError.message);
        setSaving(false);
        return;
      }
    } else {
      const { error: insertError } = await supabase.from("trades").insert({
        user_id: user.id,
        ...payload,
      });

      if (insertError) {
        setError(insertError.message);
        setSaving(false);
        return;
      }
    }

    setSaving(false);
    onSaved();
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-[rgba(0,0,0,0.7)] backdrop-blur-[8px] z-[200] flex items-center justify-center"
      onClick={handleOverlayClick}
    >
      <div className="bg-bg-card border border-border rounded-2xl p-5 sm:p-8 max-w-[600px] w-[95%] sm:w-[90%] max-h-[90vh] overflow-y-auto">
        <h3 className="font-serif text-2xl mb-6">
          {isEdit ? "Edit Trade" : "Add Trade"}
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Symbol *</label>
              <input
                type="text"
                value={form.symbol}
                onChange={(e) => update("symbol", e.target.value)}
                placeholder="BTC, ETH, SOL..."
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Direction *</label>
              <select
                value={form.direction}
                onChange={(e) => update("direction", e.target.value)}
                className={inputClass}
              >
                <option value="long">Long</option>
                <option value="short">Short</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Entry Price *</label>
              <input
                type="number"
                step="any"
                value={form.entry_price}
                onChange={(e) => update("entry_price", e.target.value)}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Exit Price</label>
              <input
                type="number"
                step="any"
                value={form.exit_price}
                onChange={(e) => update("exit_price", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Size *</label>
              <input
                type="number"
                step="any"
                value={form.size}
                onChange={(e) => update("size", e.target.value)}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Fees</label>
              <input
                type="number"
                step="any"
                value={form.fees}
                onChange={(e) => update("fees", e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>
                P&L (auto-calculated)
              </label>
              <input
                type="number"
                step="any"
                value={form.pnl}
                onChange={(e) => update("pnl", e.target.value)}
                className={`${inputClass} text-text-muted`}
              />
            </div>
            <div>
              <label className={labelClass}>Strategy</label>
              <input
                type="text"
                value={form.strategy}
                onChange={(e) => update("strategy", e.target.value)}
                placeholder="e.g. Scalp, Swing"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Exchange *</label>
              <select
                value={form.exchange}
                onChange={(e) => update("exchange", e.target.value)}
                required
                className={inputClass}
              >
                {["Binance", "Bybit", "Hyperliquid", "Coinbase", "Kraken", "Other"].map((ex) => (
                  <option key={ex} value={ex}>{ex}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Opened At *</label>
              <input
                type="datetime-local"
                value={form.opened_at}
                onChange={(e) => update("opened_at", e.target.value)}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Closed At</label>
              <input
                type="datetime-local"
                value={form.closed_at}
                onChange={(e) => update("closed_at", e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                rows={3}
                placeholder="Trade rationale, observations..."
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>

          {error && (
            <p className="text-red text-[13px] mt-4 font-light">{error}</p>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-transparent text-text border border-border rounded-lg font-mono text-[13px] font-medium cursor-pointer transition-all hover:bg-bg-elevated"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-text text-bg border-none rounded-lg font-mono text-[13px] font-semibold cursor-pointer transition-all hover:-translate-y-px hover:shadow-[0_4px_20px_rgba(255,255,255,0.15)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : isEdit ? "Update Trade" : "Save Trade"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
