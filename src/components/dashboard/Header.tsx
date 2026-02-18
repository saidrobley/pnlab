"use client";

import { useRouter } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase";

interface HeaderProps {
  email: string;
}

export default function Header({ email }: HeaderProps) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createBrowserClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="h-16 border-b border-border bg-bg-card flex items-center justify-between px-8">
      <div />
      <div className="flex items-center gap-4">
        <span className="text-[13px] text-text-muted font-light">{email}</span>
        <button
          onClick={handleLogout}
          className="text-[13px] text-text-muted hover:text-text transition-colors bg-transparent border border-border px-3 py-1.5 rounded-lg font-mono cursor-pointer hover:bg-bg-elevated"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}
