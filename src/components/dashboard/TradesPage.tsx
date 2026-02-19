"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { createBrowserClient } from "@/lib/supabase";
import { Trade, TradeFilters } from "@/lib/types";
import TradesToolbar from "./TradesToolbar";
import TradesTable from "./TradesTable";
import TradeModal from "./TradeModal";

type Period = "7d" | "1m" | "3m" | "6m" | "1y" | "all";

const PERIOD_OPTIONS: { value: Period; label: string }[] = [
  { value: "7d", label: "7D" },
  { value: "1m", label: "1M" },
  { value: "3m", label: "3M" },
  { value: "6m", label: "6M" },
  { value: "1y", label: "1Y" },
  { value: "all", label: "All" },
];

const PERIOD_DAYS: Record<Period, number | null> = {
  "7d": 7,
  "1m": 30,
  "3m": 90,
  "6m": 180,
  "1y": 365,
  all: null,
};

const emptyFilters: TradeFilters = {
  symbol: "",
  direction: "",
  strategy: "",
  exchange: "",
  dateFrom: "",
  dateTo: "",
};

export default function TradesPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [filters, setFilters] = useState<TradeFilters>(emptyFilters);
  const [period, setPeriod] = useState<Period>("all");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);

  const fetchTrades = useCallback(async () => {
    const supabase = createBrowserClient();
    const { data } = await supabase
      .from("trades")
      .select("*")
      .is("deleted_at", null)
      .order("opened_at", { ascending: false });

    setTrades((data as Trade[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTrades();
  }, [fetchTrades]);

  const filteredTrades = useMemo(() => {
    const days = PERIOD_DAYS[period];
    const cutoff = days !== null ? Date.now() - days * 24 * 60 * 60 * 1000 : null;

    // DEBUG: remove after verifying
    if (trades.length > 0 && cutoff !== null) {
      const dates = trades.map((t) => new Date(t.opened_at).getTime());
      console.log(`[Trades] period=${period}, days=${days}`);
      console.log(`[Trades] cutoff=${new Date(cutoff).toISOString()}`);
      console.log(`[Trades] earliest trade=${new Date(Math.min(...dates)).toISOString()}`);
      console.log(`[Trades] latest trade=${new Date(Math.max(...dates)).toISOString()}`);
    }

    return trades.filter((t) => {
      if (cutoff !== null && new Date(t.opened_at).getTime() < cutoff) return false;
      if (
        filters.symbol &&
        !t.symbol.toLowerCase().includes(filters.symbol.toLowerCase())
      )
        return false;
      if (filters.direction && t.direction !== filters.direction) return false;
      if (
        filters.strategy &&
        !(t.strategy || "")
          .toLowerCase()
          .includes(filters.strategy.toLowerCase())
      )
        return false;
      if (filters.exchange && t.exchange !== filters.exchange) return false;
      if (filters.dateFrom) {
        const tradeDate = new Date(t.opened_at).toISOString().slice(0, 10);
        if (tradeDate < filters.dateFrom) return false;
      }
      if (filters.dateTo) {
        const tradeDate = new Date(t.opened_at).toISOString().slice(0, 10);
        if (tradeDate > filters.dateTo) return false;
      }
      return true;
    });
  }, [trades, filters, period]);

  function handleEdit(trade: Trade) {
    setEditingTrade(trade);
    setModalOpen(true);
  }

  async function handleDelete(trade: Trade) {
    if (!window.confirm(`Delete trade ${trade.symbol} (${trade.direction})?`)) {
      return;
    }

    const supabase = createBrowserClient();
    await supabase
      .from("trades")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", trade.id);

    fetchTrades();
  }

  function handleModalClose() {
    setModalOpen(false);
    setEditingTrade(null);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl mb-1">Trades</h1>
          <p className="text-text-muted text-[13px] font-light">
            {filteredTrades.length} of {trades.length} trades
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="w-full sm:w-auto px-5 py-2.5 bg-text text-bg border-none rounded-lg font-mono text-[13px] font-semibold cursor-pointer transition-all hover:-translate-y-px hover:shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
        >
          + Add Trade
        </button>
      </div>

      {/* Period filter */}
      <div className="flex gap-2 mb-4">
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

      <TradesToolbar filters={filters} onChange={setFilters} />
      <TradesTable
        trades={filteredTrades}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <TradeModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        onSaved={fetchTrades}
        trade={editingTrade}
      />
    </div>
  );
}
