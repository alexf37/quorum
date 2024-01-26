"use client";

import { useXssSocketListener } from "@/lib/useXssSocketListener";

export default function Session({ params }: { params: { id: string } }) {
  const { latestData } = useXssSocketListener({
    channel: params.id ?? "quorumwaiting",
    onData: (sender, data) => {
      console.log("Received data from", sender, ":", data);
    },
  });
  return (
    <div className="grid h-full place-content-center">
      <h1>Session</h1>
      {latestData?.value}
    </div>
  );
}
