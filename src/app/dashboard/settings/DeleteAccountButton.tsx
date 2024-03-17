"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { type PropsWithChildren } from "react";

export function DeleteAccountButton({ children }: PropsWithChildren) {
  const router = useRouter();
  const deleteAccountMutation = api.settings.deleteAccount.useMutation({
    onSuccess: () => {
      router.push("/");
    },
  });
  return (
    <Button
      variant="destructive"
      onClick={() => {
        deleteAccountMutation.mutate();
      }}
    >
      {children}
    </Button>
  );
}
