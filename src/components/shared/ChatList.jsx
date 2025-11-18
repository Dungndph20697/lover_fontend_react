import React, { useState, useEffect } from "react";

export default function ChatList({ me, loadUsers, onSelect, incoming }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers(me.id).then((data) => setUsers(data));
    // loadUsers().then((data) => setUsers(data));
    console.log(me);
  }, [me.id, incoming]);

  return (
    <div className="border-end p-3" style={{ width: "260px" }}>
      <h5 className="mb-3">Tin nhắn</h5>

      {users.map((u) => (
        <div
          key={u.userId}
          className="p-2 rounded hover-bg-light"
          style={{ cursor: "pointer" }}
          onClick={() => onSelect(u)}
        >
          <div className="fw-semibold">{u.nickname || u.firstName}</div>
          <small className="text-muted">{u.lastMessage || "..."}</small>
        </div>
      ))}
    </div>
  );
}
