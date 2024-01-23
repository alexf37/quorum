"use client";

import { navItems } from "@/config/dashboard-config";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/ModeToggle";

export function DashboardPageHead() {
  const path = usePathname();
  const navItem = navItems.find((item) => item.href === path);
  const header = navItem?.longTitle ?? navItem?.title ?? "Dashboard";
  return (
    <div className="flex h-20 items-center gap-2 bg-background px-8 pb-5 pt-6 text-primary max-sm:hidden">
      <h1 className="text-3xl font-bold tracking-tight">{header}</h1>
      <div className="ml-auto">
        <ModeToggle />
      </div>
    </div>
  );
}
