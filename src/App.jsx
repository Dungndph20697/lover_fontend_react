import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Home from "./components/user/Home";
import CCDVHome from "./components/ccdv/CCDVHome";
import { findUserByToken } from "./service/user/login";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Explore from "./components/user/Explore";

// import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await findUserByToken(token);
        setUser(res);
      } catch (err) {
        console.error("Lỗi xác thực:", err);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  // Component bảo vệ route
  const ProtectedRoute = ({ children, allowedRoles }) => {
    console.log("Checking access for roles:", allowedRoles);
    console.log("Current user:", user);
    if (loading) return <div>Đang tải...</div>;

    // if (!token || !user) return <Navigate to="/login" />;

    if (!allowedRoles.includes(user.role.name)) {
      Swal.fire({
        icon: "error",
        title: "Bạn không có quyền truy cập!",
        toast: true,
        position: "top-end",
        timer: 2000,
        showConfirmButton: false,
      });
      return <Navigate to="/" />;
    }

    return children;
  };
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/explore" element={<Explore />} />

        {/* Route /ccdv chỉ cho phép role CCDV */}
        <Route
          path="/ccdv"
          element={
            <ProtectedRoute allowedRoles={["Service_provider"]}>
              <CCDVHome />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
