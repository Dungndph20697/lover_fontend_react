import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import AdminFooter from "./AdminFooter";

export default function AdminDashboard() {
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
    if (token) localStorage.setItem("adminToken", token);
    return () => localStorage.removeItem("adminToken");
  }, []);

  return (
    <div className="bg-light d-flex flex-column min-vh-100">
      <AdminHeader />

      <div className="flex-grow-1 d-flex">
        <AdminSidebar />

        <main className="flex-grow-1 p-4 bg-light">
          <Outlet />
        </main>
      </div>

      <AdminFooter />
    </div>
  );
}
