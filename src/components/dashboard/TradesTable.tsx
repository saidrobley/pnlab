"use client";

import { Trade } from "@/lib/types";

interface TradesTableProps {
  trades: Trade[];
  onEdit: (trade: Trade) => void;
  onDelete: (trade: Trade) => void;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatPrice(value: number): string {
  const abs = Math.abs(value);
  if (abs === 0) return "$0.00";
  if (abs < 0.01) return `$${value.toPrecision(4)}`;
  if (abs < 1) return `$${value.toFixed(4)}`;
  return `$${value.toFixed(2)}`;
}

function formatUsd(value: number | null): string {
  if (value === null) return "—";
  const prefix = value >= 0 ? "+$" : "-$";
  return `${prefix}${Math.abs(value).toFixed(2)}`;
}

export default function TradesTable({ trades, onEdit, onDelete }: TradesTableProps) {
  if (trades.length === 0) {
    return (
      <div className="bg-bg-card border border-border rounded-2xl p-12 text-center">
        <p className="text-text-muted text-[13px] font-light">
          No trades found. Add your first trade to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-bg-card border border-border rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border">
              {[
                "Date",
                "Symbol",
                "Direction",
                "Entry",
                "Exit",
                "Size",
                "P&L",
                "Fees",
                "Strategy",
                "Exchange",
                "Notes",
                "",
              ].map((h, i) => (
                <th
                  key={i}
                  className="text-left px-3 py-2 md:px-4 md:py-3 text-[11px] text-text-muted font-medium uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {trades.map((trade) => (
              <tr
                key={trade.id}
                className="border-b border-border/50 hover:bg-bg-elevated/30 transition-colors"
              >
                <td className="px-3 py-2 md:px-4 md:py-3 text-text-muted font-light whitespace-nowrap">
                  {formatDate(trade.closed_at || trade.opened_at)}
                </td>
                <td className="px-3 py-2 md:px-4 md:py-3 font-medium">
                  {trade.symbol}
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded ml-1.5 ${
                      trade.source === "manual"
                        ? "bg-bg-elevated text-text-muted"
                        : "bg-green-dim text-green"
                    }`}
                  >
                    {trade.source === "manual" ? "Manual" : "Synced"}
                  </span>
                </td>
                <td className="px-3 py-2 md:px-4 md:py-3">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                      trade.direction === "long"
                        ? "bg-green-dim text-green"
                        : "bg-red-dim text-red"
                    }`}
                  >
                    {trade.direction.toUpperCase()}
                  </span>
                </td>
                <td className="px-3 py-2 md:px-4 md:py-3 font-light">
                  {formatPrice(Number(trade.entry_price))}
                </td>
                <td className="px-3 py-2 md:px-4 md:py-3 font-light">
                  {trade.exit_price !== null
                    ? formatPrice(Number(trade.exit_price))
                    : "—"}
                </td>
                <td className="px-3 py-2 md:px-4 md:py-3 font-light">{Number(trade.size)}</td>
                <td
                  className={`px-4 py-3 font-medium ${
                    trade.pnl !== null && trade.pnl >= 0
                      ? "text-green"
                      : "text-red"
                  }`}
                >
                  {formatUsd(trade.pnl)}
                </td>
                <td className="px-3 py-2 md:px-4 md:py-3 font-light text-text-muted">
                  ${Number(trade.fees).toFixed(2)}
                </td>
                <td className="px-3 py-2 md:px-4 md:py-3 font-light text-text-muted">
                  {trade.strategy || "—"}
                </td>
                <td className="px-3 py-2 md:px-4 md:py-3 font-light text-text-muted">
                  {trade.exchange}
                </td>
                <td
                  className="px-3 py-2 md:px-4 md:py-3 font-light text-text-muted max-w-[200px] truncate"
                  title={trade.notes || undefined}
                >
                  {trade.notes
                    ? trade.notes.length > 30
                      ? trade.notes.slice(0, 30) + "..."
                      : trade.notes
                    : "—"}
                </td>
                <td className="px-3 py-2 md:px-4 md:py-3 whitespace-nowrap">
                  <button
                    onClick={() => onEdit(trade)}
                    aria-label="Edit trade"
                    className="text-text-muted hover:text-text p-1.5 rounded hover:bg-bg-elevated/50 transition-colors mr-1"
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11.5 1.5l3 3L5 14H2v-3L11.5 1.5z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(trade)}
                    aria-label="Delete trade"
                    className="text-text-muted hover:text-red p-1.5 rounded hover:bg-bg-elevated/50 transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 4h12M5.333 4V2.667a1.333 1.333 0 011.334-1.334h2.666a1.333 1.333 0 011.334 1.334V4m2 0v9.333a1.333 1.333 0 01-1.334 1.334H4.667a1.333 1.333 0 01-1.334-1.334V4h9.334z" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
