"use client";

import { navItems } from "@/config/dashboard-config";
import { usePathname } from "next/navigation";

export function DashboardPageHead() {
  const path = usePathname();
  const navItem = navItems.find((item) => item.href === path);
  const header = navItem?.longTitle ?? navItem?.title ?? "Dashboard";
  return (
    <div className="flex items-center gap-2 bg-white px-8 pb-5 pt-6 text-primary max-sm:hidden">
      <div className="h-9 w-0"></div>
      <h1 className="text-3xl font-bold tracking-tight">{header}</h1>
    </div>
  );
}
