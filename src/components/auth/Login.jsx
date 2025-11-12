import React, { useState } from "react";
import { login, findUserByToken } from "../../service/user/login.js";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end", // góc trên bên phải
    showConfirmButton: false,
    timer: 2500,
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
      }
    } catch (error) {
      console.log("Login error:", error);
      Toast.fire({
        icon: "error",
        title: "Sai tên đăng nhập hoặc mật khẩu!",
      });
    }
  };

  const handleRegister = () => {
    navigate("/register"); // chuyển sang trang đăng ký
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div
        className="card shadow p-4"
        style={{ width: "400px", borderRadius: "15px" }}
      >
        <h3 className="text-center mb-4 text-primary fw-bold">Đăng Nhập</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label fw-semibold">
              Tên đăng nhập
            </label>
            <input
              type="text"
              id="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tên đăng nhập"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label fw-semibold">
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 mt-2">
            Đăng nhập
          </button>

          <div className="text-center mt-3">
            <a href="#" className="text-decoration-none">
              Quên mật khẩu?
            </a>
          </div>
        </form>

        <hr />

        <div className="text-center">
          <p className="mb-2">Chưa có tài khoản?</p>
          <button
            type="button"
            className="btn btn-outline-success w-100"
            onClick={handleRegister}
          >
            Đăng ký ngay
          </button>
        </div>
      </div>
    </div>
  );
}
