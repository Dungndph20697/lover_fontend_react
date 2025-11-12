import React from "react";
import { User, Briefcase, ClipboardList } from "lucide-react";

export default function Sidebar({ selected, setSelected }) {
  const menuItems = [
    { id: "userinfo", label: "Thông tin cá nhân", icon: <User size={18} /> },
    { id: "services", label: "Dịch vụ của tôi", icon: <Briefcase size={18} /> },
    {
      id: "quanlydon",
      label: "Quản lý đơn",
      icon: <ClipboardList size={18} />,
    },
  ];

  return (
    <div
      className="d-flex flex-column bg-white shadow-sm p-3"
      style={{
        width: "230px",
        height: "100vh",
        borderRight: "1px solid #eee",
      }}
    >
      <h5 className="text-danger fw-bold mb-4 text-center border-bottom pb-2">
        Chức năng
      </h5>

      <ul className="nav flex-column gap-2">
        {menuItems.map((item) => (
          <li key={item.id} className="nav-item">
            <button
              className={`btn w-100 text-start d-flex align-items-center gap-2 fw-medium shadow-sm ${selected === item.id
                  ? "btn-danger text-white"
                  : "btn-outline-danger bg-white"
                }`}
              onClick={() => setSelected(item.id)}
              style={{
                borderRadius: "10px",
                transition: "all 0.2s ease-in-out",
              }}
              onMouseEnter={(e) => {
                if (selected !== item.id)
                  e.currentTarget.classList.add("bg-danger-subtle");
              }}
              onMouseLeave={(e) => {
                e.currentTarget.classList.remove("bg-danger-subtle");
              }}
            >
              {item.icon}
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
