import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import { findUserByToken } from "../../../service/user/login.js";
import { Link } from "react-router-dom";


export default function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);

  const handleGoToProfile = () => {
    navigate("/user-info"); // đường dẫn tới trang user-info
  };

  // Lấy thông tin người dùng khi có token
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await findUserByToken(token);
          setUser(res);
        } catch (error) {
          localStorage.removeItem("token");
          setUser(null);
        }
      }
    };
    fetchUser();
  }, [token]);

  const displayName = user
    ? user.nickname && user.nickname.trim() !== ""
      ? user.nickname
      : `${user.firstName} ${user.lastName}`
    : "Người dùng";

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
        <Link to="/" className="navbar-brand text-danger fw-bold fs-4">
          ❤️ Lover
        </Link>

        {/* Dropdown bên phải */}
        <div className="dropdown ms-auto">
          <button
            className="btn btn-outline-danger dropdown-toggle"
            type="button"
            id="userDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="bi bi-person-circle me-1"></i> {displayName}
          </button>
          <ul
            className="dropdown-menu dropdown-menu-end"
            aria-labelledby="userDropdown"
          >
            <li>
              <button className="dropdown-item" onClick={handleGoToProfile}>Thông tin cá nhân</button>
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
