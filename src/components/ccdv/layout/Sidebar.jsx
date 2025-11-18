import React from "react";
import { useState, useEffect } from "react";
import { User, Briefcase, ClipboardList, History } from "lucide-react";

export default function Sidebar({ selected, setSelected }) {
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      setHasProfile(false);
      return;
    }
    const user = JSON.parse(userData);
    const key = `ccdvProfile_${user.id}`;
    const profile = localStorage.getItem(key);

    // fallback: nếu chưa có key per-user nhưng còn key cũ 'ccdvProfile', không mặc định true
    setHasProfile(!!profile);
  }, []);

  const menuItems = [
    {
      id: "userinfo",
      label: hasProfile ? "Thông tin cá nhân" : "Đăng ký thông tin cá nhân",
      icon: <User size={18} />,
    },
    { id: "services", label: "Dịch vụ của tôi", icon: <Briefcase size={18} /> },
    {
      id: "quanlydon",
      label: "Quản lý đơn",
      icon: <ClipboardList size={18} />,
    },

    {
      id: "lichsuthue",
      label: "Lịch sử thuê",
      icon: <History size={18} />,
    },

    { id: "revenueForm", label: "Tổng doanh thu", icon: <ClipboardList size={18} /> },

  ];

  return (
    <div
      className="d-flex flex-column bg-white shadow-sm p-3"
      style={{
        width: "300px",
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
              className={`btn w-100 text-start d-flex align-items-center gap-2 fw-medium shadow-sm ${
                selected === item.id
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
