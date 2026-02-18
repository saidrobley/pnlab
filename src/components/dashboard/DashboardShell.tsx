"use client";

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
  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header email={email} />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
