"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const controlled = error.cause === "controlled error";
  return (
    <div className="flex flex-col items-center gap-4 py-24">
      <div>
        <h1 className="text-center text-6xl font-bold text-primary drop-shadow">
          {controlled ? "Error" : "Uh oh..."}
        </h1>
        <p className="max-w-md pt-2 text-center text-lg text-muted-foreground">
          {controlled ? error.message : "Something went wrong."}
        </p>
      </div>
      <Button onClick={() => reset()}>Try again</Button>
      <Button variant="outline" asChild>
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  );
}
