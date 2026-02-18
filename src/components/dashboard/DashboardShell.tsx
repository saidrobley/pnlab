"use client";

import { useState, useCallback } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface DashboardShellProps {
  email: string;
  children: React.ReactNode;
}

export default function DashboardShell({
  email,
  children,
}: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => setSidebarOpen((o) => !o), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <div className="flex min-h-screen bg-bg">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile drawer */}
      <div className="lg:hidden">
        <Sidebar mobile open={sidebarOpen} onClose={closeSidebar} />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <Header email={email} onMenuClick={toggleSidebar} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
