"use client";

import { useEffect, useState, useMemo } from "react";
import { createBrowserClient } from "@/lib/supabase";
import { Trade } from "@/lib/types";
import { computeStats, computeCumulativePnl, computePnlBySymbol } from "@/lib/stats";

type Period = "7d" | "1m" | "3m" | "6m" | "1y" | "all";

const PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: "7d", label: "7D" },
  { value: "1m", label: "1M" },
  { value: "3m", label: "3M" },
  { value: "6m", label: "6M" },
  { value: "1y", label: "1Y" },
  { value: "all", label: "All" },
];

import StatCard from "./StatCard";
import PnlCumulativeChart from "./PnlCumulativeChart";
import PnlBySymbolChart from "./PnlBySymbolChart";

const PERIOD_DAYS: Record<Period, number | null> = {
  "7d": 7,
  "1m": 30,
  "3m": 90,
  "6m": 180,
  "1y": 365,
  all: null,
};

function formatUsd(value: number): string {
  const prefix = value >= 0 ? "+$" : "-$";
  return `${prefix}${Math.abs(value).toFixed(2)}`;
}

export default function DashboardOverview() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>("3m");

  useEffect(() => {
    async function fetchTrades() {
      const supabase = createBrowserClient();
      const { data } = await supabase
        .from("trades")
        .select("*")
        .is("deleted_at", null)
        .not("pnl", "is", null)
        .order("closed_at", { ascending: true });

      setTrades((data as Trade[]) || []);
      setLoading(false);
    }
    fetchTrades();
  }, []);

  const filteredTrades = useMemo(() => {
    const days = PERIOD_DAYS[period];
    if (days === null) return trades;
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    return trades.filter((t) => t.closed_at && new Date(t.closed_at).getTime() >= cutoff);
  }, [trades, period]);

  const stats = computeStats(filteredTrades);
  const cumulativeData = computeCumulativePnl(filteredTrades);
  const symbolData = computePnlBySymbol(filteredTrades);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-text-muted text-[13px] font-light">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-serif text-2xl md:text-3xl mb-1">Overview</h1>
      <p className="text-text-muted text-[13px] font-light mb-4">
        Your trading performance at a glance
      </p>

      {/* Period filter */}
      <div className="flex gap-2 mb-6 md:mb-8">
        {PERIOD_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setPeriod(opt.value)}
            className={`px-4 py-2 rounded-lg font-mono text-[13px] font-medium transition-colors ${
              period === opt.value
                ? "bg-accent text-white"
                : "bg-bg-elevated text-text-muted hover:text-text border border-border"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6 md:mb-8">
        <StatCard label="Total P&L" value={formatUsd(stats.totalPnl)} colored />
        <StatCard label="Win Rate" value={`${stats.winRate.toFixed(1)}%`} />
        <StatCard label="Total Trades" value={String(stats.totalTrades)} />
        <StatCard label="Avg Win" value={formatUsd(stats.avgWin)} colored />
        <StatCard label="Avg Loss" value={formatUsd(stats.avgLoss)} colored />
        <StatCard
          label="Best Trade"
          value={formatUsd(stats.bestTrade)}
          colored
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PnlCumulativeChart data={cumulativeData} />
        <PnlBySymbolChart data={symbolData} />
      </div>
    </div>
  );
}
