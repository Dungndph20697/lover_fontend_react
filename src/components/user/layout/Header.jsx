import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="navbar navbar-expand-lg bg-white shadow-sm">
      <div className="container">
        <Link className="navbar-brand text-danger fw-bold fs-4" to="/">
          ❤️ Lover
        </Link>
        <ul className="navbar-nav ms-auto">
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
          <li>
            <Link className="nav-link" to="/personalInfo">
              Đăng thông tin cá nhân
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/login">
              Đăng nhập
            </Link>
          </li>
          <li className="nav-item">
            <Link className="btn btn-danger ms-2" to="/register">
              Đăng ký
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
