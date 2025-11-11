import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";

export default function Header() {
  const navigate = useNavigate();

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end", // góc trên bên phải
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
  });

  const handleLogout = () => {
    // Xóa token hoặc trạng thái đăng nhập
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Thông báo SweetAlert
    Toast.fire({
      icon: "success",
      title: "Đăng xuất thành công!",
    });

    // Chuyển về trang login
    navigate("/"); 
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container">
        {/* Logo */}
        <a className="navbar-brand text-danger fw-bold fs-4" href="#">
          ❤️ Lover CCDV
        </a>

        {/* Dropdown bên phải */}
        <div className="dropdown ms-auto">
          <button
            className="btn btn-outline-danger dropdown-toggle"
            type="button"
            id="userDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="bi bi-person-circle me-1"></i> Tài khoản
          </button>
          <ul
            className="dropdown-menu dropdown-menu-end"
            aria-labelledby="userDropdown"
          >
            <li>
              <button className="dropdown-item">Thông tin cá nhân</button>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <button
                className="dropdown-item text-danger fw-semibold"
                onClick={handleLogout}
              >
                Đăng xuất
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
