import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";
import { syncHyperliquidForUser } from "@/lib/hyperliquid";

export async function POST() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get user's Hyperliquid connection
  const { data: connection, error: connError } = await supabase
    .from("exchange_connections")
    .select("*")
    .eq("user_id", user.id)
    .eq("exchange", "hyperliquid")
    .single();

  if (connError || !connection) {
    return NextResponse.json(
      { error: "No Hyperliquid connection found" },
      { status: 404 }
    );
  }

  try {
    const admin = createAdminClient();
    const result = await syncHyperliquidForUser(
      admin,
      user.id,
      connection.wallet_address
    );

    // Update last_synced_at
    await admin
      .from("exchange_connections")
      .update({ last_synced_at: new Date().toISOString() })
      .eq("id", connection.id);

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Sync failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
