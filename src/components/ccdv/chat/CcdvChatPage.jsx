import React, { useState } from "react";
import ChatList from "../../shared/ChatList";
import ChatWindow from "../../shared/ChatWindow";
import useChatSocket from "../../../service/chat/useChatSocket";
import { chatUserService } from "../../../service/chat/chatUserService ";

export default function CcdvChatPage() {
  const [target, setTarget] = useState(null);
  const [incoming, setIncoming] = useState(null);
  const raw = localStorage.getItem("user");
  const me = raw ? JSON.parse(raw) : null;

  if (!me) {
    return (
      <div className="text-center mt-5">
        Bạn cần đăng nhập để sử dụng tính năng chat.
      </div>
    );
  }

  // const { send } = useChatSocket(me.id, setIncoming);
  const { sendMessage } = useChatSocket(me.id, setIncoming);

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
