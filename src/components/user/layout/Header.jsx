import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Swal from "sweetalert2";
import { findUserByToken } from "../../../service/user/login.js";

export default function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    Swal.fire({
      icon: "success",
      title: "Đăng xuất thành công!",
      showConfirmButton: false,
      timer: 500,
      toast: true,
      position: "top-end",
    });

    navigate("/");
  };

  return (
    <header className="navbar navbar-expand-lg bg-white shadow-sm">
      <div className="container">
        <Link className="navbar-brand text-danger fw-bold fs-4" to="/">
          ❤️ Lover
        </Link>

        {/* Menu bên phải */}
        <ul className="navbar-nav ms-auto align-items-center">
          <li className="nav-item">
            <Link className="nav-link" to="/">
              Trang chủ
            </Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/explore">
              Khám phá
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/user/chat">
              Tin nhắn
            </Link>
          </li>

          {/* Nếu chưa đăng nhập → chỉ hiện nút đăng nhập */}
          {!token ? (
            <li className="nav-item">
              <Link className="btn btn-danger ms-2" to="/login">
                Đăng nhập
              </Link>
            </li>
          ) : (
            // Nếu đã đăng nhập → hiện dropdown tài khoản
            <li className="nav-item dropdown">
              <button
                className="btn btn-outline-danger dropdown-toggle ms-2"
                id="accountDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {/* {user.username || "Người dùng"} */}
                {displayName}
              </button>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="accountDropdown"
              >
                <li>
                  {/* Nếu là người cung cấp dịch vụ */}
                  {user && user.role?.name === "SERVICE_PROVIDER" && (
                    <li>
                      <Link className="dropdown-item" to="/ccdv">
                        Quản lí cung cấp dịch vụ
                      </Link>
                    </li>
                  )}
                </li>

                {/* Chỉ user thường mới thấy mục "Đơn đã thuê" */}
                {user && user.role?.name === "USER" && (
                  <li>
                    <Link className="dropdown-item" to="/user/don-thue">
                      <i className="bi bi-list-check me-2"></i>
                      Đơn đã thuê
                    </Link>
                  </li>
                )}

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
            </li>
          )}
        </ul>
      </div>
    </header>
  );
}
