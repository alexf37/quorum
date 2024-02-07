"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

type EndSessionButtonProps = {
  sessionId: string;
};

export function EndSessionButton({ sessionId }: EndSessionButtonProps) {
  const router = useRouter();
  const endSessionMutation = api.sessions.endSession.useMutation({
    onSuccess() {
      router.push("/dashboard/manage");
      router.refresh();
    },
  });
  return (
    <Button
      variant="outline"
      onClick={() => {
        endSessionMutation.mutate({ sessionId });
      }}
    >
      End session
    </Button>
  );
}
