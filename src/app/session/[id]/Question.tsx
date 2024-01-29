"use client";

import { useXssSocketListener } from "@/lib/useXssSocketListener";
import { api } from "@/trpc/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardTitle,
  CardContent,
  CardHeader,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";

export function Question({ sessionId }: { sessionId: string }) {
  const { data, isLoading, isSuccess, isError, error, refetch } =
    api.sessions.getCurrentFreeResponseQuestion.useQuery({
      sessionId: sessionId,
    });
  useXssSocketListener({
    channel: `quorum-listen-${sessionId ?? "waiting"}`,
    onData: (sender, data) => {
      console.log("Received data from", sender, ":", data);
      void refetch();
    },
  });

  return (
    <>
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error: {error?.message}</div>}
      {isSuccess &&
        (data ? (
          <Card className="border-0 pt-2">
            <CardHeader>
              <CardTitle>{`${data.question}`}</CardTitle>
              <CardDescription>
                Please answer in just a few sentences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input type="text" placeholder="Answer here..." />
            </CardContent>
            <CardFooter>
              <Button>Submit Answer</Button>
            </CardFooter>
          </Card>
        ) : (
          <div>Question does not exist.</div>
        ))}
    </>
  );
}
