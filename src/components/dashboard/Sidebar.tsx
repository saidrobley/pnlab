"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: "◎" },
  { label: "Trades", href: "/dashboard/trades", icon: "⇄" },
  { label: "Strategies", href: "/dashboard/strategies", icon: "◆" },
  { label: "Settings", href: "/dashboard/settings", icon: "⚙" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[240px] shrink-0 bg-bg-card border-r border-border flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-6 h-16 flex items-center gap-2 border-b border-border">
        <div className="w-7 h-7 bg-gradient-to-br from-green to-accent rounded-md flex items-center justify-center text-sm font-bold">
          P
        </div>
        <span className="text-lg font-bold tracking-tight">PnLab</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors no-underline ${
                isActive
                  ? "bg-bg-elevated text-text"
                  : "text-text-muted hover:text-text hover:bg-bg-elevated/50"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
