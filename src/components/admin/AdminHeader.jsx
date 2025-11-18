import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function AdminHeader() {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    const adminInfo = localStorage.getItem("adminInfo");
    if (adminInfo) {
      try {
        const parsed = JSON.parse(adminInfo);
        setAdminName(parsed.name || "Admin");
      } catch {
        setAdminName("Admin");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminInfo");
    Swal.fire({
      icon: "success",
      title: "Đã đăng xuất",
      timer: 1500,
      showConfirmButton: false,
    }).then(() => navigate("/"));
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container-fluid px-4">
        <button
          className="navbar-brand btn btn-link text-decoration-none text-danger fw-bold"
          onClick={() => navigate("/admin")}
        >
          🔐 Lover Admin
        </button>

        <div className="ms-auto d-flex align-items-center gap-3 text-white">
          <span className="d-none d-md-inline">
            Xin chào, <strong>{adminName}</strong>
          </span>
          <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>
      </div>
    </nav>
  );
}

