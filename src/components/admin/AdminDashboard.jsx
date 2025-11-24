import React, { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import AdminOverview from "./AdminOverview";
import AdminUsers from "./AdminUsers";
import AdminOrders from "./AdminOrders";
import AdminReports from "./AdminReports";
import AdminWithdraw from "./AdminWithdraw";
import AdminFooter from "./AdminFooter";
import QuanLiDonThueAdmin from "./QuanLiDonThueAdmin";
import AdminRevenueList from "./AdminRevenueList";

const sectionMap = {
  overview: {
    title: "Tổng quan",
    component: <AdminOverview />,
  },
  users: {
    title: "Người dùng",
    component: <AdminUsers />,
  },
  orders: {
    title: "Đơn dịch vụ",
    component: <AdminOrders />,
  },
  hireSessions: {
    title: "Quản Lý Đơn Đặt Thuê",
    component: <QuanLiDonThueAdmin/>,
  },
  revenues: {
  title: "Doanh Thu Idol",
  component: <AdminRevenueList />,
  },
  withdraw: {
    title: "Duyệt rút tiền",
    component: <AdminWithdraw />,
  },
  reports: {
    title: "Báo cáo",
    component: <AdminReports />,
  },
  settings: {
    title: "Cấu hình",
    component: (
      <div className="card shadow-sm">
        <div className="card-body">
          <h4 className="card-title">⚙️ Cấu hình hệ thống</h4>
          <p className="text-muted mb-0">
            Khu vực cấu hình sẽ sớm được bổ sung. Vui lòng chọn một mục khác trong thanh bên.
          </p>
        </div>
      </div>
    ),
  },
};

export default function AdminDashboard() {
  const [selected, setSelected] = useState("overview");
  const userInfo = localStorage.getItem("user");
  let isAdmin = false;

  if (userInfo) {
    try {
      const parsed = JSON.parse(userInfo);
      const roleName = parsed?.role?.name?.toUpperCase();
      const roleId = parsed?.role?.id;
      isAdmin = roleName === "ADMIN" || roleId === 3;
    } catch {
      isAdmin = false;
    }
  }

  if (!isAdmin) {
    localStorage.removeItem("adminToken");
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      localStorage.setItem("adminToken", token);
    }
    return () => {
      localStorage.removeItem("adminToken");
    };
  }, []);

  const activeSection = useMemo(() => {
    return sectionMap[selected] || sectionMap.overview;
  }, [selected]);

  return (
    <div className="bg-light d-flex flex-column min-vh-100">
      <AdminHeader />

      <div className="flex-grow-1 d-flex">
        <AdminSidebar selected={selected} setSelected={setSelected} />

        <main className="flex-grow-1 p-4 bg-light">
          <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h2 className="mb-0">{activeSection.title}</h2>
                <small className="text-muted">
                  Trang quản trị hệ thống Lover — cập nhật theo thời gian thực.
                </small>
              </div>
            </div>
            {activeSection.component}
          </div>
        </main>
      </div>

      <AdminFooter />
    </div>
  );
}
