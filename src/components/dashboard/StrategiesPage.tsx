"use client";

import { useEffect, useState, useCallback } from "react";
import { createBrowserClient } from "@/lib/supabase";
import { Trade } from "@/lib/types";
import { computeStats } from "@/lib/stats";
import type { PnlStats } from "@/lib/types";

interface StrategyGroup {
  name: string;
  stats: PnlStats;
}

function pnlColor(value: number) {
  return value > 0 ? "text-green" : value < 0 ? "text-red" : "text-text";
}

function formatPnl(value: number) {
  const sign = value >= 0 ? "+" : "";
  return `${sign}$${value.toFixed(2)}`;
}

export default function StrategiesPage() {
  const [groups, setGroups] = useState<StrategyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirming, setConfirming] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    const supabase = createBrowserClient();
    const { data: trades } = await supabase
      .from("trades")
      .select("*")
      .is("deleted_at", null)
      .not("pnl", "is", null);

    if (!trades || trades.length === 0) {
      setGroups([]);
      setLoading(false);
      return;
    }

    const grouped: Record<string, Trade[]> = {};
    for (const t of trades as Trade[]) {
      const key = t.strategy?.trim() || "Untagged";
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(t);
    }

    const result: StrategyGroup[] = Object.entries(grouped)
      .map(([name, trades]) => ({ name, stats: computeStats(trades) }))
      .sort((a, b) => b.stats.totalTrades - a.stats.totalTrades);

    setGroups(result);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleRename(oldName: string) {
    const newName = editValue.trim();
    if (!newName || newName === oldName) {
      setEditing(null);
      return;
    }
    setSaving(true);
    const supabase = createBrowserClient();
    await supabase
      .from("trades")
      .update({ strategy: newName })
      .eq("strategy", oldName)
      .is("deleted_at", null);
    setEditing(null);
    setSaving(false);
    fetchData();
  }

  async function handleDelete(name: string) {
    setSaving(true);
    const supabase = createBrowserClient();
    await supabase
      .from("trades")
      .update({ strategy: null })
      .eq("strategy", name)
      .is("deleted_at", null);
    setConfirming(null);
    setSaving(false);
    fetchData();
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
      <h1 className="font-serif text-2xl md:text-3xl mb-1">Strategies</h1>
      <p className="text-text-muted text-[13px] font-light mb-6 md:mb-8">
        Performance breakdown by trading strategy
      </p>

      {groups.length === 0 ? (
        <div className="bg-bg-card border border-border rounded-2xl p-12 text-center">
          <p className="text-text-muted text-[13px] font-light">
            No closed trades yet. Strategy stats will appear here once you have
            trades with P&L.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((g) => (
            <div
              key={g.name}
              className="bg-bg-card border border-border rounded-2xl p-5"
            >
              {/* Header with actions */}
              <div className="flex items-start justify-between mb-4">
                {editing === g.name ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleRename(g.name);
                    }}
                    className="flex-1 flex gap-2"
                  >
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      autoFocus
                      className="flex-1 px-2 py-1 bg-bg border border-border rounded-lg text-text font-mono text-[13px] outline-none transition-colors focus:border-accent"
                    />
                    <button
                      type="submit"
                      disabled={saving}
                      className="text-[12px] text-green hover:underline disabled:opacity-50"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(null)}
                      className="text-[12px] text-text-muted hover:underline"
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <>
                    <h3
                      className={`text-[15px] font-semibold ${
                        g.name === "Untagged"
                          ? "text-text-muted italic font-normal"
                          : ""
                      }`}
                    >
                      {g.name}
                    </h3>
                    {g.name !== "Untagged" && (
                      <div className="flex gap-3 ml-2 shrink-0">
                        <button
                          onClick={() => {
                            setEditing(g.name);
                            setEditValue(g.name);
                            setConfirming(null);
                          }}
                          className="text-[12px] text-text-muted hover:text-text transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setConfirming(g.name);
                            setEditing(null);
                          }}
                          className="text-[12px] text-text-muted hover:text-red transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Delete confirmation */}
              {confirming === g.name && (
                <div className="mb-4 p-3 bg-bg border border-border rounded-lg">
                  <p className="text-[12px] text-text-muted mb-2">
                    Remove &ldquo;{g.name}&rdquo; from {g.stats.totalTrades}{" "}
                    trade{g.stats.totalTrades !== 1 && "s"}? They will become
                    untagged.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(g.name)}
                      disabled={saving}
                      className="text-[12px] text-red hover:underline disabled:opacity-50"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setConfirming(null)}
                      className="text-[12px] text-text-muted hover:underline"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-x-4 gap-y-3">
                <div>
                  <div className="text-[11px] text-text-muted uppercase tracking-wider">
                    Trades
                  </div>
                  <div className="text-sm font-medium">
                    {g.stats.totalTrades}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-text-muted uppercase tracking-wider">
                    Win Rate
                  </div>
                  <div className="text-sm font-medium">
                    {g.stats.winRate.toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-text-muted uppercase tracking-wider">
                    Total P&L
                  </div>
                  <div
                    className={`text-sm font-medium ${pnlColor(g.stats.totalPnl)}`}
                  >
                    {formatPnl(g.stats.totalPnl)}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-text-muted uppercase tracking-wider">
                    Avg Win
                  </div>
                  <div
                    className={`text-sm font-medium ${pnlColor(g.stats.avgWin)}`}
                  >
                    {formatPnl(g.stats.avgWin)}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-text-muted uppercase tracking-wider">
                    Avg Loss
                  </div>
                  <div
                    className={`text-sm font-medium ${pnlColor(g.stats.avgLoss)}`}
                  >
                    {formatPnl(g.stats.avgLoss)}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-text-muted uppercase tracking-wider">
                    Best Trade
                  </div>
                  <div
                    className={`text-sm font-medium ${pnlColor(g.stats.bestTrade)}`}
                  >
                    {formatPnl(g.stats.bestTrade)}
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
