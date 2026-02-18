"use client";

import { useEffect, useState, useCallback } from "react";
import { createBrowserClient } from "@/lib/supabase";
import { Strategy, Trade } from "@/lib/types";

interface StrategyWithStats extends Strategy {
  tradeCount: number;
  totalPnl: number;
}

export default function StrategiesPage() {
  const [strategies, setStrategies] = useState<StrategyWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchStrategies = useCallback(async () => {
    const supabase = createBrowserClient();

    const [{ data: strats }, { data: trades }] = await Promise.all([
      supabase
        .from("strategies")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase.from("trades").select("strategy, pnl"),
    ]);

    const tradesByStrategy: Record<string, { count: number; pnl: number }> = {};
    for (const t of (trades as Pick<Trade, "strategy" | "pnl">[]) || []) {
      if (t.strategy) {
        if (!tradesByStrategy[t.strategy]) {
          tradesByStrategy[t.strategy] = { count: 0, pnl: 0 };
        }
        tradesByStrategy[t.strategy].count++;
        tradesByStrategy[t.strategy].pnl += t.pnl || 0;
      }
    }

    const enriched: StrategyWithStats[] = ((strats as Strategy[]) || []).map(
      (s) => ({
        ...s,
        tradeCount: tradesByStrategy[s.name]?.count || 0,
        totalPnl: Math.round((tradesByStrategy[s.name]?.pnl || 0) * 100) / 100,
      })
    );

    setStrategies(enriched);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStrategies();
  }, [fetchStrategies]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);

    const supabase = createBrowserClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSaving(false);
      return;
    }

    await supabase.from("strategies").insert({
      user_id: user.id,
      name: name.trim(),
      description: description.trim() || null,
    });

    setName("");
    setDescription("");
    setSaving(false);
    fetchStrategies();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-text-muted text-[13px] font-light">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-serif text-3xl mb-1">Strategies</h1>
      <p className="text-text-muted text-[13px] font-light mb-8">
        Define and track your trading strategies
      </p>

      {/* Add form */}
      <form
        onSubmit={handleAdd}
        className="bg-bg-card border border-border rounded-2xl p-5 mb-6"
      >
        <h3 className="text-[13px] font-semibold mb-4">Add Strategy</h3>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Strategy name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="flex-1 px-3 py-2.5 bg-bg border border-border rounded-lg text-text font-mono text-[13px] outline-none transition-colors focus:border-accent"
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="flex-[2] px-3 py-2.5 bg-bg border border-border rounded-lg text-text font-mono text-[13px] outline-none transition-colors focus:border-accent"
          />
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 bg-text text-bg border-none rounded-lg font-mono text-[13px] font-semibold cursor-pointer transition-all hover:-translate-y-px hover:shadow-[0_4px_20px_rgba(255,255,255,0.15)] disabled:opacity-50 shrink-0"
          >
            {saving ? "Adding..." : "Add"}
          </button>
        </div>
      </form>

      {/* Strategy cards */}
      {strategies.length === 0 ? (
        <div className="bg-bg-card border border-border rounded-2xl p-12 text-center">
          <p className="text-text-muted text-[13px] font-light">
            No strategies yet. Add one above to start tracking performance by
            strategy.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {strategies.map((s) => (
            <div
              key={s.id}
              className="bg-bg-card border border-border rounded-2xl p-5"
            >
              <h3 className="text-[15px] font-semibold mb-1">{s.name}</h3>
              {s.description && (
                <p className="text-[13px] text-text-muted font-light mb-3">
                  {s.description}
                </p>
              )}
              <div className="flex gap-4 mt-3 pt-3 border-t border-border">
                <div>
                  <div className="text-[11px] text-text-muted uppercase tracking-wider">
                    Trades
                  </div>
                  <div className="text-sm font-medium">{s.tradeCount}</div>
                </div>
                <div>
                  <div className="text-[11px] text-text-muted uppercase tracking-wider">
                    P&L
                  </div>
                  <div
                    className={`text-sm font-medium ${
                      s.totalPnl > 0
                        ? "text-green"
                        : s.totalPnl < 0
                        ? "text-red"
                        : "text-text"
                    }`}
                  >
                    {s.totalPnl >= 0 ? "+" : ""}${s.totalPnl.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
