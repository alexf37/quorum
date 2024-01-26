"use client";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardButton() {
  return (
    <Button className="group" variant="ghost" asChild>
      <Link href="/dashboard/manage">
        <ChevronLeft />
        <div className="w-0 overflow-hidden transition-all group-hover:w-20">
          Dashboard
        </div>
      </Link>
    </Button>
  );
}
