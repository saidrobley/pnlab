import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { syncHyperliquidForUser } from "@/lib/hyperliquid";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();

  const { data: connections, error } = await admin
    .from("exchange_connections")
    .select("*");

  if (error) {
    return NextResponse.json(
      { error: "Failed to fetch connections" },
      { status: 500 }
    );
  }

  const results: Array<{
    userId: string;
    inserted: number;
    skipped: number;
    error?: string;
  }> = [];

  for (const conn of connections ?? []) {
    try {
      const result = await syncHyperliquidForUser(
        admin,
        conn.user_id,
        conn.wallet_address,
        conn.sync_period
      );

      await admin
        .from("exchange_connections")
        .update({ last_synced_at: new Date().toISOString() })
        .eq("id", conn.id);

      results.push({ userId: conn.user_id, ...result });
    } catch (err) {
      results.push({
        userId: conn.user_id,
        inserted: 0,
        skipped: 0,
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  return NextResponse.json({ synced: results.length, results });
}
