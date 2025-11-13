import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Home from "./components/user/Home";

import PersonalProfile from "./components/ccdv/PersonalProfile";
import "bootstrap/dist/css/bootstrap.min.css";

import CCDVHome from "./components/ccdv/CCDVHome";
import { findUserByToken } from "./service/user/login";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Explore from "./components/user/Explore";

import PersonalProfileEdit from "./components/ccdv/PersonalProfileEdit";

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
    if (loading) return <div className="text-center mt-5">Đang tải...</div>;

    if (!token || !user) return <Navigate to="/login" />;

    // Xử lý trường hợp chưa có role hoặc mismatch
    const roleName = user?.role?.name?.toLowerCase() || "";
    const normalizedAllowed = allowedRoles.map((r) => r.toLowerCase());

    if (!normalizedAllowed.includes(roleName)) {
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
        <Route path="/ccdv-profile" element={<PersonalProfile />}/>
        <Route path="/ccdv-profile-edit" element={<PersonalProfileEdit />} />

        {/* Route /ccdv chỉ cho phép role CCDV */}
        <Route
          path="/ccdv"
          element={
            <ProtectedRoute allowedRoles={["SERVICE_PROVIDER"]}>
              <CCDVHome />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
