import React, { useState, useEffect } from "react";
import ChatList from "../../shared/ChatList";
import ChatWindow from "../../shared/ChatWindow";
import useChatSocket from "../../../service/chat/useChatSocket";
import { chatUserService } from "../../../service/chat/chatUserService ";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { useSearchParams } from "react-router-dom";

export default function UserChatPage() {
  const raw = localStorage.getItem("user");
  const me = raw ? JSON.parse(raw) : null;

  const [params] = useSearchParams();
  const startChatUserId = params.get("to"); // <-- ID truyền từ nút "Chat ngay"

  const [target, setTarget] = useState(null);
  const [incoming, setIncoming] = useState(null);

  const { sendMessage } = useChatSocket(me.id, setIncoming);

  // 🔥 Nếu có "?to=ID", tự load thông tin người đó và setTarget
  useEffect(() => {
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
    <>
      <Header />
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
      <Footer />
    </>
  );
}
