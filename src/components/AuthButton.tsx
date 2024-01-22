"use client";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LoginModal } from "./LoginModal";

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
    <LoginModal>
      <Button type="button" variant="ghost">
        Sign In
      </Button>
    </LoginModal>
  );
}
