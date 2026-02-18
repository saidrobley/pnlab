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
              <h3
                className={`text-[15px] font-semibold mb-4 ${
                  g.name === "Untagged"
                    ? "text-text-muted italic font-normal"
                    : ""
                }`}
              >
                {g.name}
              </h3>

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
