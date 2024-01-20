"use client";
import { signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function AuthButton({ authed }: { authed: boolean }) {
  if (authed) {
    return (
      <Button
        type="button"
        variant="ghost"
        onClick={async () => {
          await signOut();
        }}
      >
        Sign Out
      </Button>
    );
  }
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={async () => {
        await signIn("discord", { callbackUrl: "/dashboard" });
      }}
    >
      Sign In
    </Button>
  );
}
