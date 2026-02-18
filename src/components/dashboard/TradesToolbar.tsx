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
      dateFrom: "",
      dateTo: "",
    });
  }

  const hasFilters = Object.values(filters).some((v) => v !== "");

  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <input
        type="text"
        placeholder="Symbol"
        value={filters.symbol}
        onChange={(e) => update({ symbol: e.target.value })}
        className={`${inputClass} w-[120px]`}
      />
      <select
        value={filters.direction}
        onChange={(e) =>
          update({ direction: e.target.value as TradeFilters["direction"] })
        }
        className={`${inputClass} w-[120px]`}
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
        className={`${inputClass} w-[140px]`}
      />
      <input
        type="date"
        value={filters.dateFrom}
        onChange={(e) => update({ dateFrom: e.target.value })}
        className={inputClass}
      />
      <input
        type="date"
        value={filters.dateTo}
        onChange={(e) => update({ dateTo: e.target.value })}
        className={inputClass}
      />
      {hasFilters && (
        <button
          onClick={clearFilters}
          className="text-[13px] text-text-muted hover:text-text transition-colors bg-transparent border-none font-mono cursor-pointer"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}
