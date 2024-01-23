"use client";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { navItems } from "@/config/dashboard-config";

export function Nav() {
  const path = usePathname();
  return (
    <div className="flex h-full w-full flex-col gap-2">
      {navItems.map((item, idx) => (
        <Button
          key={idx}
          variant={path === item.href ? "secondary" : "ghost"}
          className="justify-start"
          asChild
        >
          <Link href={item.href}>{item.title}</Link>
        </Button>
      ))}
    </div>
  );
}
