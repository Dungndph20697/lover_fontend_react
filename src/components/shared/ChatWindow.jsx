import React, { useState, useEffect } from "react";

export default function ChatWindow({
  me,
  target,
  loadConversation,
  sendMsg,
  incoming,
}) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  // --- Load lịch sử khi chọn user ---
  useEffect(() => {
    if (!target) return;

    loadConversation(me.id, target.userId)
      .then((data) => {
        setMessages(data || []); // nếu chưa có lịch sử thì gán mảng rỗng
      })
      .catch(() => setMessages([]));
  }, [target]);

  // --- Nhận tin realtime ---
  useEffect(() => {
    if (!incoming || !target) return;

    // Nhận tin khi:
    // 1. Người kia gửi cho mình
    // 2. Mình gửi cho người kia
    if (
      (incoming.senderId === target.userId && incoming.receiverId === me.id) ||
      (incoming.senderId === me.id && incoming.receiverId === target.userId)
    ) {
      setMessages((prev) => [...prev, incoming]);
    }
  }, [incoming, target]);

  // --- Gửi tin ---
  const send = () => {
    if (!text.trim()) return;

    const message = {
      senderId: me.id,
      receiverId: target.userId,
      content: text,
    };

    sendMsg(message);
    // setMessages((prev) => [...prev, message]);
    setText("");
  };

  // --- Khi chưa chọn ai ---
  if (!target)
    return (
      <div className="flex-fill d-flex justify-content-center align-items-center text-muted">
        Chọn cuộc trò chuyện
      </div>
    );

  return (
    <div className="flex-fill d-flex flex-column">
      {/* Header */}
      <div className="p-3 border-bottom fw-bold">
        {target.nickname || target.fullName || target.firstName}
      </div>

      {/* Danh sách tin nhắn */}
      <div className="flex-fill p-3" style={{ overflowY: "auto" }}>
        {messages.length === 0 && (
          <div className="text-center text-muted mb-3">
            Chưa có tin nhắn — hãy bắt đầu cuộc trò chuyện 💬
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`d-flex mb-2 ${
              m.senderId === me.id ? "justify-content-end" : ""
            }`}
          >
            <div
              className={`p-2 rounded ${
                m.senderId === me.id ? "bg-primary text-white" : "bg-light"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
      </div>

      {/* Ô nhập tin */}
      <div className="p-3 d-flex">
        <input
          className="form-control"
          placeholder="Nhập tin nhắn..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="btn btn-primary ms-2" onClick={send}>
          Gửi
        </button>
      </div>
    </div>
  );
}
