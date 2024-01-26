import { useState, useEffect } from "react";
import io from "socket.io-client";

type MessageResponse = {
  type: string;
  name: string;
  value: string;
};

type useXssSocketListenerOpts = {
  channel: string;
  onData: (sender: string, data: string) => void;
};

// lol
export function useXssSocketListener(opts: useXssSocketListenerOpts) {
  const [latestData, setLatestData] = useState<MessageResponse>();

  useEffect(() => {
    const socket = io("https://connect.xsschat.com");

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
      socket.emit("join", { room: opts.channel, name: "quorumuser" });
    });

    socket.on("message", (message: string) => {
      const parsedMessage = JSON.parse(
        JSON.stringify(message),
      ) as MessageResponse;
      setLatestData(parsedMessage);
      opts.onData(parsedMessage.name, parsedMessage.value);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return {
    latestData,
  };
}
