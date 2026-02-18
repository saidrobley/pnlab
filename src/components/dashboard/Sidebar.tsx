"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: "◎" },
  { label: "Trades", href: "/dashboard/trades", icon: "⇄" },
  { label: "Strategies", href: "/dashboard/strategies", icon: "◆" },
  { label: "Settings", href: "/dashboard/settings", icon: "⚙" },
];

interface SidebarProps {
  mobile?: boolean;
  open?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ mobile, open, onClose }: SidebarProps) {
  const pathname = usePathname();

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobile && open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [mobile, open]);

  const nav = (
    <aside className="w-[240px] shrink-0 bg-bg-card border-r border-border flex flex-col h-screen">
      {/* Logo */}
      <Link href="/" className="px-6 h-16 flex items-center gap-2 border-b border-border no-underline">
        <div className="w-7 h-7 bg-gradient-to-br from-green to-accent rounded-md flex items-center justify-center text-sm font-bold">
          P
        </div>
        <span className="text-lg font-bold tracking-tight">PnLab</span>
      </Link>

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
              onClick={mobile ? onClose : undefined}
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

  if (!mobile) {
    return <div className="sticky top-0 h-screen">{nav}</div>;
  }

  return (
    <div
      className={`fixed inset-0 z-[100] transition-opacity duration-300 ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[rgba(0,0,0,0.6)]"
        onClick={onClose}
      />
      {/* Panel */}
      <div
        className={`absolute top-0 left-0 h-full transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {nav}
      </div>
    </div>
  );
}
