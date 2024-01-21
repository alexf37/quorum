"use client";

import React from "react";

import { Separator } from "@/components/ui/separator";

export default function Dashboard() {
  return (
    <>
      <div className="h-full flex-1 bg-slate-50">
        <div className="flex items-center gap-2 bg-white px-8 pb-5 pt-6 text-primary max-sm:hidden">
          <div className="h-9 w-0"></div>
          <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        </div>
        <Separator />
      </div>
    </>
  );
}
