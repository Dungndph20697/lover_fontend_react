import React, { useState } from "react";
import { login, findUserByToken } from "../../service/user/login.js";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, Navigate } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "../user/layout/Header.jsx";
import Footer from "../user/layout/Footer.jsx";
import { FaUser, FaLock } from "react-icons/fa"; // ✨ thêm icon

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  if (token) return <Navigate to="/" />;

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(username, password);

      Toast.fire({
        icon: "success",
        title: "Đăng nhập thành công!",
      });

      const userData = await findUserByToken(data.token);

      // Lưu thông tin user (id, email, username...)
      if (userData) {
        localStorage.setItem("user", JSON.stringify(userData));
      }
      if (userData.role.name === "USER") {
        navigate("/");
      } else if (userData.role.name === "SERVICE_PROVIDER") {
        navigate("/ccdv");
      } else if (userData.role.name === "ADMIN") {
        navigate("/admin");
      }
    } catch (error) {
      console.log("Login error:", error);
      Toast.fire({
        icon: "error",
        title: "Sai tên đăng nhập hoặc mật khẩu!",
      });
    }
  };

  const handleRegister = () => navigate("/register");

  return (
    <>
      <Header />
      <div
        className="d-flex justify-content-center align-items-center vh-100"
        style={{
          background:
            "linear-gradient(to right, #ff9a9e 0%, #ffd1dc 45%, #ffe3e3 100%)",
          minHeight: "100vh",
        }}
      >
        <div
          className="card shadow-lg p-4 text-dark"
          style={{
            width: "400px",
            borderRadius: "20px",
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)",
          }}
        >
          <h3 className="text-center mb-4 fw-bold text-danger">
            ❤️ Đăng Nhập Lover
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label fw-semibold">
                Tên đăng nhập
              </label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <FaUser className="text-danger" />
                </span>
                <input
                  type="text"
                  id="username"
                  className="form-control border-start-0"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nhập tên đăng nhập"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-3">
              <label htmlFor="password" className="form-label fw-semibold">
                Mật khẩu
              </label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <FaLock className="text-danger" />
                </span>
                <input
                  type="password"
                  id="password"
                  className="form-control border-start-0"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  required
                />
              </div>
            </div>

            {/* Nút đăng nhập */}
            <button
              type="submit"
              className="btn btn-danger w-100 mt-3 py-2 fw-semibold rounded-pill"
            >
              Đăng nhập
            </button>

            <div className="text-center mt-3">
              <a href="#" className="text-decoration-none text-danger small">
                Quên mật khẩu?
              </a>
            </div>
          </form>

          <hr />

          <div className="text-center">
            <p className="mb-2 text-muted">Chưa có tài khoản?</p>
            <button
              type="button"
              className="btn btn-outline-danger w-100 rounded-pill fw-semibold"
              onClick={handleRegister}
            >
              Đăng ký ngay
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
