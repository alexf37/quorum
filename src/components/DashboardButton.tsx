"use client";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardButton({ href }: { href: string }) {
  return (
    <Button className="group px-2" variant="ghost" asChild>
      <Link href={href}>
        <ChevronLeft />
        <div className="w-0 overflow-hidden transition-all">Dashboard</div>
      </Link>
    </Button>
  );
}
