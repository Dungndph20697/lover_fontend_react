import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Users,
  ShoppingCart,
  DollarSign,
  Banknote,
  Star,
  Activity,
} from "lucide-react";
import "./AdminSidebar.css";

const menuItems = [
  {
    id: "approve-account",
    label: "Duyệt tài khoản",
    icon: <Users size={18} />,
  },
  { id: "quanlyuser", label: "Quản lý user", icon: <Users size={18} /> },
  {
    id: "hireSessions",
    label: "Quản lý đơn đặt thuê",
    icon: <ShoppingCart size={18} />,
  },
  { id: "revenues", label: "Doanh thu Idol", icon: <DollarSign size={18} /> },
  { id: "withdraw", label: "Duyệt rút tiền", icon: <Banknote size={18} /> },
  { id: "vip-manager", label: "Quản lý VIP", icon: <Star size={18} /> },
  {
    id: "user-activity",
    label: "Trạng thái hoạt động",
    icon: <Activity size={18} />,
  },
];

export default function AdminSidebar() {
  const location = useLocation();

  return (
    <aside
      className="bg-white shadow-sm p-3 d-flex flex-column"
      style={{
        width: "280px",
        minHeight: "100vh",
        borderRight: "1px solid #eee",
      }}
    >
      <h5 className="text-danger fw-bold mb-3 text-center border-bottom pb-2">
        Quản trị
      </h5>

      <ul className="nav flex-column gap-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === `/admin/${item.id}`;

          return (
            <li key={item.id} className="nav-item">
              <Link to={`/admin/${item.id}`}>
                <button
                  className={`btn admin-sidebar-btn w-100 text-start d-flex align-items-center gap-2 fw-medium shadow-sm 
                    ${
                      isActive
                        ? "btn-danger text-white"
                        : "btn-outline-danger bg-white text-danger"
                    }`}
                  style={{ borderRadius: "10px" }}
                >
                  {item.icon}
                  {item.label}
                </button>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
