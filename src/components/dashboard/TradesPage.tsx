"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { createBrowserClient } from "@/lib/supabase";
import { Trade, TradeFilters } from "@/lib/types";
import TradesToolbar from "./TradesToolbar";
import TradesTable from "./TradesTable";
import TradeModal from "./TradeModal";

const emptyFilters: TradeFilters = {
  symbol: "",
  direction: "",
  strategy: "",
  dateFrom: "",
  dateTo: "",
};

export default function TradesPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [filters, setFilters] = useState<TradeFilters>(emptyFilters);
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
    return trades.filter((t) => {
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
  }, [trades, filters]);

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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl mb-1">Trades</h1>
          <p className="text-text-muted text-[13px] font-light">
            {trades.length} total trades
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-2.5 bg-text text-bg border-none rounded-lg font-mono text-[13px] font-semibold cursor-pointer transition-all hover:-translate-y-px hover:shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
        >
          + Add Trade
        </button>
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
