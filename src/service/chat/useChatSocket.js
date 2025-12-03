import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";

export default function useChatSocket(userId, onMessageReceived) {
  const client = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    client.current = new Client({
      brokerURL: "ws://localhost:8080/ws", // WebSocket trực tiếp — KHÔNG SOCKJS
      reconnectDelay: 5000,
      debug: (msg) => console.log("[STOMP]", msg),

      onConnect: () => {
        console.log("🟢 WebSocket Connected");
        setConnected(true);

        // Subscribe topic theo user Id
        client.current.subscribe(`/topic/chat/${userId}`, (message) => {
          if (onMessageReceived) {
            onMessageReceived(JSON.parse(message.body));
          }
        });
      },

      onDisconnect: () => {
        console.log("🔴 WebSocket Disconnected");
      },
    });

    client.current.activate();

    return () => {
      if (client.current) {
        client.current.deactivate();
      }
    };
  }, [userId]);

  const sendMessage = (msg) => {
    if (!connected || !client.current) {
      console.warn("⛔ WebSocket chưa sẵn sàng — không gửi được tin");
      return;
    }

    client.current.publish({
      destination: "/app/chat/send",
      body: JSON.stringify(msg),
    });
  };

  return { connected, sendMessage };
}
