export interface Trade {
  id: string;
  user_id: string;
  symbol: string;
  direction: "long" | "short";
  entry_price: number;
  exit_price: number | null;
  size: number;
  pnl: number | null;
  fees: number;
  strategy: string | null;
  notes: string | null;
  exchange: string | null;
  source: string;
  deleted_at: string | null;
  opened_at: string;
  closed_at: string | null;
  created_at: string;
}

export interface Strategy {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface TradeFormData {
  symbol: string;
  direction: "long" | "short";
  entry_price: string;
  exit_price: string;
  size: string;
  fees: string;
  pnl: string;
  strategy: string;
  exchange: string;
  opened_at: string;
  closed_at: string;
  notes: string;
}

export interface TradeFilters {
  symbol: string;
  direction: "" | "long" | "short";
  strategy: string;
  exchange: string;
  dateFrom: string;
  dateTo: string;
}

export interface PnlStats {
  totalPnl: number;
  winRate: number;
  avgWin: number;
  avgLoss: number;
  totalTrades: number;
  bestTrade: number;
  worstTrade: number;
}
