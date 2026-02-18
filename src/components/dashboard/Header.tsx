"use client";

import { useRouter } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase";

interface HeaderProps {
  email: string;
  onMenuClick?: () => void;
}

export default function Header({ email, onMenuClick }: HeaderProps) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createBrowserClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="h-16 border-b border-border bg-bg-card flex items-center justify-between px-4 md:px-6 lg:px-8">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 -ml-2 text-text-muted hover:text-text transition-colors bg-transparent border-none cursor-pointer"
        aria-label="Open menu"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M3 5h14M3 10h14M3 15h14" />
        </svg>
      </button>
      <div className="hidden lg:block" />
      <div className="flex items-center gap-4">
        <span className="hidden sm:inline text-[13px] text-text-muted font-light">{email}</span>
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
