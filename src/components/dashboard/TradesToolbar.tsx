"use client";

import { TradeFilters } from "@/lib/types";

interface TradesToolbarProps {
  filters: TradeFilters;
  onChange: (filters: TradeFilters) => void;
}

const inputClass =
  "px-3 py-2 bg-bg border border-border rounded-lg text-text font-mono text-[13px] outline-none transition-colors focus:border-accent";

export default function TradesToolbar({
  filters,
  onChange,
}: TradesToolbarProps) {
  function update(partial: Partial<TradeFilters>) {
    onChange({ ...filters, ...partial });
  }

  function clearFilters() {
    onChange({
      symbol: "",
      direction: "",
      strategy: "",
      exchange: "",
      dateFrom: "",
      dateTo: "",
    });
  }

  const hasFilters = Object.values(filters).some((v) => v !== "");

  return (
    <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-3 mb-4">
      <input
        type="text"
        placeholder="Symbol"
        value={filters.symbol}
        onChange={(e) => update({ symbol: e.target.value })}
        className={`${inputClass} w-full sm:w-[120px]`}
      />
      <select
        value={filters.direction}
        onChange={(e) =>
          update({ direction: e.target.value as TradeFilters["direction"] })
        }
        className={`${inputClass} w-full sm:w-[120px]`}
      >
        <option value="">All Directions</option>
        <option value="long">Long</option>
        <option value="short">Short</option>
      </select>
      <input
        type="text"
        placeholder="Strategy"
        value={filters.strategy}
        onChange={(e) => update({ strategy: e.target.value })}
        className={`${inputClass} w-full sm:w-[140px]`}
      />
      <select
        value={filters.exchange}
        onChange={(e) => update({ exchange: e.target.value })}
        className={`${inputClass} w-full sm:w-[140px]`}
      >
        <option value="">All Exchanges</option>
        <option value="Binance">Binance</option>
        <option value="Bybit">Bybit</option>
        <option value="Hyperliquid">Hyperliquid</option>
        <option value="Coinbase">Coinbase</option>
        <option value="Kraken">Kraken</option>
        <option value="Other">Other</option>
      </select>
      <input
        type="date"
        value={filters.dateFrom}
        onChange={(e) => update({ dateFrom: e.target.value })}
        className={`${inputClass} w-full sm:w-auto`}
      />
      <input
        type="date"
        value={filters.dateTo}
        onChange={(e) => update({ dateTo: e.target.value })}
        className={`${inputClass} w-full sm:w-auto`}
      />
      {hasFilters && (
        <button
          onClick={clearFilters}
          className="col-span-2 sm:col-span-1 text-[13px] text-text-muted hover:text-text transition-colors bg-transparent border-none font-mono cursor-pointer"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}
