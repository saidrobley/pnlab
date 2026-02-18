"use client";

import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart,
} from "recharts";

interface PnlCumulativeChartProps {
  data: { date: string; pnl: number }[];
}

export default function PnlCumulativeChart({
  data,
}: PnlCumulativeChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-bg-card border border-border rounded-2xl p-4 md:p-5 flex items-center justify-center h-[250px] md:h-[320px]">
        <p className="text-text-muted text-[13px] font-light">
          No trade data yet
        </p>
      </div>
    );
  }

  return (
    <div className="bg-bg-card border border-border rounded-2xl p-4 md:p-5">
      <h3 className="text-[13px] font-semibold mb-4 tracking-tight">
        Cumulative P&L
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="pnlGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--green)" stopOpacity={0.2} />
              <stop offset="100%" stopColor="var(--green)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="date"
            tick={{ fill: "var(--text-muted)", fontSize: 11 }}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "var(--text-muted)", fontSize: 11 }}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={false}
            tickFormatter={(v) => `$${v}`}
          />
          <Tooltip
            contentStyle={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              fontSize: "12px",
              color: "var(--text)",
            }}
            formatter={(value: number | undefined) => [
              value !== undefined ? `$${value.toFixed(2)}` : "$0.00",
              "P&L",
            ]}
          />
          <Area
            type="monotone"
            dataKey="pnl"
            stroke="var(--green)"
            strokeWidth={2}
            fill="url(#pnlGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
