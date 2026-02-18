"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase";
import { Trade } from "@/lib/types";
import { computeStats, computeCumulativePnl, computePnlBySymbol } from "@/lib/stats";
import StatCard from "./StatCard";
import PnlCumulativeChart from "./PnlCumulativeChart";
import PnlBySymbolChart from "./PnlBySymbolChart";

function formatUsd(value: number): string {
  const prefix = value >= 0 ? "+$" : "-$";
  return `${prefix}${Math.abs(value).toFixed(2)}`;
}

export default function DashboardOverview() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

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

  const stats = computeStats(trades);
  const cumulativeData = computeCumulativePnl(trades);
  const symbolData = computePnlBySymbol(trades);

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
      <p className="text-text-muted text-[13px] font-light mb-6 md:mb-8">
        Your trading performance at a glance
      </p>

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
