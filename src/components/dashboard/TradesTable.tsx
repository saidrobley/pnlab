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
                <td className="px-3 py-2 md:px-4 md:py-3 font-medium">{trade.symbol}</td>
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
                  ${Number(trade.entry_price).toFixed(2)}
                </td>
                <td className="px-3 py-2 md:px-4 md:py-3 font-light">
                  {trade.exit_price !== null
                    ? `$${Number(trade.exit_price).toFixed(2)}`
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
                  {trade.exchange || "—"}
                </td>
                <td className="px-3 py-2 md:px-4 md:py-3 whitespace-nowrap">
                  <button
                    onClick={() => onEdit(trade)}
                    className="text-text-muted hover:text-text text-[12px] font-medium mr-3 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(trade)}
                    className="text-text-muted hover:text-red text-[12px] font-medium transition-colors"
                  >
                    Delete
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
