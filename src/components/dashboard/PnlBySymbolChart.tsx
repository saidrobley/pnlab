"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

interface PnlBySymbolChartProps {
  data: { symbol: string; pnl: number }[];
}

export default function PnlBySymbolChart({ data }: PnlBySymbolChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-bg-card border border-border rounded-2xl p-5 flex items-center justify-center h-[320px]">
        <p className="text-text-muted text-[13px] font-light">
          No trade data yet
        </p>
      </div>
    );
  }

  return (
    <div className="bg-bg-card border border-border rounded-2xl p-5">
      <h3 className="text-[13px] font-semibold mb-4 tracking-tight">
        P&L by Symbol
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis
            dataKey="symbol"
            tick={{ fill: "#71717a", fontSize: 11 }}
            axisLine={{ stroke: "#27272a" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#71717a", fontSize: 11 }}
            axisLine={{ stroke: "#27272a" }}
            tickLine={false}
            tickFormatter={(v) => `$${v}`}
          />
          <Tooltip
            contentStyle={{
              background: "#111113",
              border: "1px solid #27272a",
              borderRadius: "8px",
              fontSize: "12px",
              color: "#fafafa",
            }}
            formatter={(value: number | undefined) => [
              value !== undefined ? `$${value.toFixed(2)}` : "$0.00",
              "P&L",
            ]}
          />
          <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.pnl >= 0 ? "#22c55e" : "#ef4444"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
