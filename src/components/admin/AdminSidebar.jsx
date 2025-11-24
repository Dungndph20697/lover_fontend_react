import React from "react";
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  Banknote,
  BarChart2,
  Settings,

  Star,

  ShoppingCart,
  DollarSign,

} from "lucide-react";

const menuItems = [
  { id: "overview", label: "Tổng quan", icon: <LayoutDashboard size={18} /> },
  { id: "approve-account", label: "Duyệt tài khoản", icon: <Users size={18} /> },
  { id: "orders", label: "Quản lý dịch vụ", icon: <ClipboardCheck size={18} /> },
  { id: "hireSessions", label: "Quản lý đơn đặt thuê", icon: <ShoppingCart size={18} /> },
  { id: "revenues", label: "Doanh thu Idol", icon: <DollarSign size={18} /> },
  { id: "withdraw", label: "Duyệt rút tiền", icon: <Banknote size={18} /> },
  { id: "reports", label: "Báo cáo & thống kê", icon: <BarChart2 size={18} /> },
  { id: "settings", label: "Cấu hình hệ thống", icon: <Settings size={18} /> },
  { id: "vip-manager", label: "Quản lý VIP", icon: <Star size={18} /> },

];

export default function AdminSidebar({ selected, setSelected }) {
  return (
    <aside
      className="bg-white shadow-sm p-3 d-flex flex-column"
      style={{ width: "280px", minHeight: "100vh", borderRight: "1px solid #eee" }}
    >
      <h5 className="text-danger fw-bold mb-3 text-center border-bottom pb-2">
        Quản trị
      </h5>

      <ul className="nav flex-column gap-2">
        {menuItems.map((item) => (
          <li key={item.id} className="nav-item">
            <button
              className={`btn w-100 text-start d-flex align-items-center gap-2 fw-medium shadow-sm ${selected === item.id ? "btn-danger text-white" : "btn-outline-danger bg-white"
                }`}
              onClick={() => setSelected(item.id)}
              style={{ borderRadius: "10px", transition: "all 0.2s ease-in-out" }}
              onMouseEnter={(e) => {
                if (selected !== item.id) e.currentTarget.classList.add("bg-danger-subtle");
              }}
              onMouseLeave={(e) => e.currentTarget.classList.remove("bg-danger-subtle")}
            >
              {item.icon}
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}