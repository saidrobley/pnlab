import { Trade, PnlStats } from "./types";

export function computeStats(trades: Trade[]): PnlStats {
  const closed = trades.filter((t) => t.pnl !== null);

  if (closed.length === 0) {
    return {
      totalPnl: 0,
      winRate: 0,
      avgWin: 0,
      avgLoss: 0,
      totalTrades: 0,
      bestTrade: 0,
      worstTrade: 0,
    };
  }

  const pnls = closed.map((t) => t.pnl!);
  const wins = pnls.filter((p) => p > 0);
  const losses = pnls.filter((p) => p < 0);

  return {
    totalPnl: pnls.reduce((sum, p) => sum + p, 0),
    winRate: closed.length > 0 ? (wins.length / closed.length) * 100 : 0,
    avgWin: wins.length > 0 ? wins.reduce((s, p) => s + p, 0) / wins.length : 0,
    avgLoss: losses.length > 0 ? losses.reduce((s, p) => s + p, 0) / losses.length : 0,
    totalTrades: closed.length,
    bestTrade: Math.max(...pnls, 0),
    worstTrade: Math.min(...pnls, 0),
  };
}

export function computeCumulativePnl(
  trades: Trade[]
): { date: string; pnl: number }[] {
  const closed = trades
    .filter((t) => t.pnl !== null && t.closed_at !== null)
    .sort(
      (a, b) =>
        new Date(a.closed_at!).getTime() - new Date(b.closed_at!).getTime()
    );

  let cumulative = 0;
  const points = closed.map((t) => {
    cumulative += t.pnl!;
    return {
      date: new Date(t.closed_at!).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      pnl: Math.round(cumulative * 100) / 100,
    };
  });

  if (points.length > 0) {
    points.unshift({ date: "", pnl: 0 });
  }

  return points;
}

export function computePnlBySymbol(
  trades: Trade[]
): { symbol: string; pnl: number }[] {
  const map: Record<string, number> = {};

  for (const t of trades) {
    if (t.pnl !== null) {
      map[t.symbol] = (map[t.symbol] || 0) + t.pnl;
    }
  }

  return Object.entries(map)
    .map(([symbol, pnl]) => ({ symbol, pnl: Math.round(pnl * 100) / 100 }))
    .sort((a, b) => b.pnl - a.pnl);
}
