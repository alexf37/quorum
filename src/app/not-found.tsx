import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-4 py-24">
      <div>
        <h1 className="text-primary text-center text-6xl font-bold drop-shadow">
          404
        </h1>
        <p className="text-muted-foreground max-w-md pt-2 text-center text-lg">
          Page not found.
        </p>
      </div>
      <Button variant="outline" asChild>
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  );
}
