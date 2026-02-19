import { SupabaseClient } from "@supabase/supabase-js";
import { HyperliquidFill } from "./types";

const HL_API_URL = "https://api.hyperliquid.xyz/info";

export async function fetchHyperliquidFills(
  wallet: string
): Promise<HyperliquidFill[]> {
  const body: Record<string, unknown> = {
    type: "userFills",
    user: wallet,
  };

  const res = await fetch(HL_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Hyperliquid API error: ${res.status}`);
  }

  return res.json();
}

export function mapFillToTrade(fill: HyperliquidFill, userId: string) {
  const direction = fill.dir.includes("Long") ? "long" : "short";
  const exitPrice = parseFloat(fill.px);
  const size = parseFloat(fill.sz);
  const pnl = parseFloat(fill.closedPnl);

  // Back-calculate entry price from closed P&L:
  // Long:  pnl ≈ (exit - entry) * size  →  entry = exit - pnl/size
  // Short: pnl ≈ (entry - exit) * size  →  entry = exit + pnl/size
  const entryPrice =
    size > 0
      ? direction === "long"
        ? exitPrice - pnl / size
        : exitPrice + pnl / size
      : exitPrice;

  const closedAt = new Date(fill.time).toISOString();

  return {
    user_id: userId,
    symbol: fill.coin,
    direction,
    entry_price: entryPrice,
    exit_price: exitPrice,
    size,
    fees: parseFloat(fill.fee),
    pnl,
    opened_at: closedAt,
    closed_at: closedAt,
    exchange: "Hyperliquid",
    source: "hyperliquid",
    source_id: String(fill.tid),
  };
}

export async function syncHyperliquidForUser(
  supabase: SupabaseClient,
  userId: string,
  wallet: string
) {
  // Fetch fills and keep only closing fills (completed trades with P&L)
  const allFills = await fetchHyperliquidFills(wallet);
  const fills = allFills.filter((f) => f.dir.startsWith("Close"));

  if (fills.length === 0) {
    return { inserted: 0, skipped: 0 };
  }

  // Get existing source_ids for dedup
  const tids = fills.map((f) => String(f.tid));
  const { data: existing } = await supabase
    .from("trades")
    .select("source_id")
    .eq("user_id", userId)
    .eq("source", "hyperliquid")
    .in("source_id", tids);

  const existingIds = new Set((existing ?? []).map((r) => r.source_id));

  // Filter out already-synced fills
  const newFills = fills.filter((f) => !existingIds.has(String(f.tid)));

  if (newFills.length === 0) {
    return { inserted: 0, skipped: fills.length };
  }

  // Map and batch insert
  const rows = newFills.map((f) => mapFillToTrade(f, userId));
  const { error } = await supabase.from("trades").insert(rows);

  if (error) {
    throw new Error(`Failed to insert trades: ${error.message}`);
  }

  return { inserted: newFills.length, skipped: fills.length - newFills.length };
}
