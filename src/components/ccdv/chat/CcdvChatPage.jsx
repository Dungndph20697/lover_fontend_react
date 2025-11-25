import React, { useState, useEffect } from "react";
import ChatList from "../../shared/ChatList";
import ChatWindow from "../../shared/ChatWindow";
import useChatSocket from "../../../service/chat/useChatSocket";
import { chatUserService } from "../../../service/chat/chatUserService ";
import { useSearchParams } from "react-router-dom";

export default function CcdvChatPage() {
  const raw = localStorage.getItem("user");
  const me = raw ? JSON.parse(raw) : null;

  const [params] = useSearchParams();
  const startChatUserId = params.get("to"); // <-- GET ?to=ID từ URL

  const [target, setTarget] = useState(null);
  const [incoming, setIncoming] = useState(null);

  const { sendMessage } = useChatSocket(me.id, setIncoming);

  // 🔥 Load người mà CCDV muốn chat khi bấm "chat ngay"
  useEffect(() => {
    console.log(startChatUserId);
    if (startChatUserId) {
      chatUserService.getUserInfoById(startChatUserId).then((user) => {
        setTarget({
          userId: startChatUserId,
          firstName: user.firstName,
          nickname: user.nickname,
        });
      });
    }
  }, [startChatUserId]);

  return (
    <div className="d-flex" style={{ height: "90vh" }}>
      <ChatList
        me={me}
        loadUsers={chatUserService.getChatUsers}
        onSelect={setTarget}
        incoming={incoming}
      />

      <ChatWindow
        me={me}
        target={target}
        loadConversation={chatUserService.getConversation}
        sendMsg={sendMessage}
        incoming={incoming}
      />
    </div>
  );
}
