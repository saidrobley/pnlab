import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { fetchHyperliquidAccountState } from "@/lib/hyperliquid";

export async function GET() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: connection } = await supabase
    .from("exchange_connections")
    .select("wallet_address")
    .eq("user_id", user.id)
    .eq("exchange", "hyperliquid")
    .single();

  if (!connection) {
    return NextResponse.json({ connected: false });
  }

  try {
    const { accountValue, unrealizedPnl } =
      await fetchHyperliquidAccountState(connection.wallet_address);
    return NextResponse.json({ connected: true, accountValue, unrealizedPnl });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch account state";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
