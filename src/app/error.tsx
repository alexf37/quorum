"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Error() {
  return (
    <div className="flex flex-col items-center gap-4 py-24">
      <div>
        <h1 className="text-center text-6xl font-bold text-primary drop-shadow">
          Uh oh...
        </h1>
        <p className="max-w-md pt-2 text-center text-lg text-muted-foreground">
          Something went wrong.
        </p>
      </div>
      <Button variant="outline" asChild>
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  );
}
