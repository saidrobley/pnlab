import { createServerSupabaseClient } from "@/lib/supabase-server";
import SettingsPage from "@/components/dashboard/SettingsPage";

export default async function SettingsRoute() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <SettingsPage email={user?.email || ""} />;
}
