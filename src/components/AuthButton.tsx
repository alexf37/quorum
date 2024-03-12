"use client";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LoginModal } from "./LoginModal";
import { useSearchParams } from "next/navigation";

export function AuthButton({ authed }: { authed: boolean }) {
  const searchParams = useSearchParams();
  const shouldLogin = searchParams.has("login");
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
    <LoginModal defaultOpen={shouldLogin}>
      <Button type="button" variant="ghost">
        Sign In
      </Button>
    </LoginModal>
  );
}
