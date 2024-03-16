"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LandingForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (code) {
            setLoading(true);
            router.push(`/join/${encodeURIComponent(code)}`);
          }
        }}
        className="flex w-full max-w-xs items-center space-x-2 pt-6"
      >
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          type="text"
          placeholder="Class Code"
        />
        <Button disabled={loading}>Join Class</Button>
      </form>
      <small className="pt-2 text-slate-400">
        If you're managing a class,{" "}
        <Link href="/dashboard/manage" className="underline hover:text-primary">
          click here
        </Link>{" "}
        instead.
      </small>
    </>
  );
}
