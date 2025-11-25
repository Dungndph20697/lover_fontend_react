import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";
import {
  User,
  Briefcase,
  ClipboardList,
  History,
  MessageCircle,
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) return;

    const user = JSON.parse(userData);
    const key = `ccdvProfile_${user.id}`;
    const profile = localStorage.getItem(key);
    setHasProfile(!!profile);
  }, []);

  const menuItems = [
    {
      path: "/ccdv/userinfo",
      label: hasProfile ? "Thông tin cá nhân" : "Đăng ký thông tin cá nhân",
      icon: <User size={18} />,
    },
    {
      path: "/ccdv/services",
      label: "Dịch vụ của tôi",
      icon: <Briefcase size={18} />,
    },
    {
      path: "/ccdv/withdraw",
      label: "Rút tiền",
      icon: <i className="bi bi-cash-stack"></i>,
    },
    {
      path: "/ccdv/withdraw-history",
      label: "Lịch sử rút tiền",
      icon: <i className="bi bi-clock-history"></i>,
    },
    {
      path: "/ccdv/quanlydon",
      label: "Quản lý đơn",
      icon: <ClipboardList size={18} />,
    },
    {
      path: "/ccdv/lichsuthue",
      label: "Lịch sử thuê",
      icon: <History size={18} />,
    },
    {
      path: "/ccdv/revenue",
      label: "Tổng doanh thu",
      icon: <ClipboardList size={18} />,
    },
    { path: "/ccdv/chat", label: "Chat", icon: <MessageCircle size={18} /> },
  ];

  return (
    <div
      className="d-flex flex-column bg-white shadow-sm p-3"
      style={{ width: "300px", height: "100vh", borderRight: "1px solid #eee" }}
    >
      <h5 className="text-danger fw-bold mb-4 text-center border-bottom pb-2">
        Chức năng
      </h5>

      <ul className="nav flex-column gap-2">
        {menuItems.map((item) => {
          const isActive = currentPath === item.path;

          return (
            <li key={item.path} className="nav-item">
              <Link to={item.path}>
                <button
                  className={`btn sidebar-btn w-100 text-start d-flex align-items-center gap-2 fw-medium shadow-sm ${
                    isActive
                      ? "btn-danger text-white active"
                      : "btn-outline-danger bg-white text-danger"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
