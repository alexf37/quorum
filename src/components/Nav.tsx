"use client";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";

type NavItem = {
  title: string;
  href: string;
};

const navItems: NavItem[] = [
  {
    title: "Overview",
    href: "/dashboard",
  },
  {
    title: "Classes",
    href: "/dashboard/classes",
  },
  {
    title: "Manage",
    href: "/dashboard/manage",
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
  },
];

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
