"use client";
import { useState } from "react";
import { api } from "@/trpc/react";

export default function Session() {
  const [num, setNumber] = useState<number>();
  api.example.randomNumber.useSubscription(undefined, {
    onData(n) {
      setNumber(n);
      console.log("received", n);
    },
  });
  return (
    <div className="grid h-full place-content-center">
      <h1>Session</h1>
      <div>
        Here&apos;s a random number from a sub: {num} <br />
      </div>
    </div>
  );
}
