import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  getDanhSachDonThue,
  getThongKeDonThue,
  hoanThanhDonThue,
  huyDonThue,
  formatGiaTien,
  formatNgayGio,
  tinhThoiLuong,
  getStatusClass,
  getStatusText,
  coTheHoanThanh,
  coTheHuy,
} from "../../service/user_quan_li_don/UserQuanLiDon";
import { findUserByToken } from "../../service/user/login";
import Footer from "./layout/Footer";
import Header from "./layout/Header";

export default function UserQuanLiDon() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [statistics, setStatistics] = useState(null);

  // Lấy userId từ token
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      console.log("🔵 Token:", token);
      if (!token) {
        Swal.fire({
          icon: "error",
          title: "Bạn chưa đăng nhập!",
          toast: true,
          position: "top-end",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate("/login");
        return;
      }

      try {
        const user = await findUserByToken(token);
        console.log("🔵 User from token:", user);
        setUserId(user.id);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
        Swal.fire({
          icon: "error",
          title: "Token không hợp lệ, vui lòng đăng nhập lại",
          toast: true,
          position: "top-end",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  // Load sessions + statistics khi có userId (Thống kê)
  useEffect(() => {
    console.log("🔵 useEffect loadStatistics triggered, userId:", userId);
    if (!userId) return;
    loadSessions();
  }, [userId, filter, page]);

  useEffect(() => {
    if (!userId) return;
    loadStatistics();
  }, [userId, filter, page]);

  const loadSessions = async () => {
    setLoading(true);
    setError("");

    const result = await getDanhSachDonThue(userId, filter || null, page, 10);
    if (result.success) {
      setSessions(result.data.content);
      console.log(result.data.content);
      setTotalPages(result.data.totalPages);
    } else {
      setError(result.message || "Không thể tải danh sách đơn thuê");
    }

    setLoading(false);
  };

  const loadStatistics = async () => {
    const result = await getThongKeDonThue(userId);
    console.log("Thống kê API response:", result);
    if (result.success) {
      console.log("Dữ liệu thống kê:", result.data);
      setStatistics(result.data);
    }
  };

  const handleComplete = async (sessionId) => {
    const result = await Swal.fire({
      title: "Xác nhận hoàn thành",
      text: "Bạn có chắc chắn muốn hoàn thành đơn thuê này?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Hoàn thành",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      const response = await hoanThanhDonThue(sessionId, userId);
      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Thành công!",
          text: "Đã hoàn thành đơn thuê",
          timer: 2000,
          showConfirmButton: false,
        });
        loadSessions();
        loadStatistics();
      } else {
        Swal.fire({
          icon: "error",
          title: "Lỗi!",
          text: response.message,
        });
      }
    }
  };

  const handleCancel = async (sessionId) => {
    const result = await Swal.fire({
      title: "Xác nhận hủy đơn",
      text: "Bạn có chắc chắn muốn hủy đơn thuê này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Hủy đơn",
      cancelButtonText: "Quay lại",
    });

    if (result.isConfirmed) {
      const response = await huyDonThue(sessionId, userId);
      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Thành công!",
          text: "Đã hủy đơn thuê",
          timer: 2000,
          showConfirmButton: false,
        });
        loadSessions();
        loadStatistics();
      } else {
        Swal.fire({
          icon: "error",
          title: "Lỗi!",
          text: response.message,
        });
      }
    }
  };

  // Render UI
  if (!userId) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Đang xác thực người dùng...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-danger">
        <i className="bi bi-heart-fill me-2"></i>
        Danh sách đơn đã thuê
      </h2>
      {/* Nút quay lại trang chủ */}
      <div className="mb-4">
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/")}
        >
          <i className="bi bi-house-door me-2"></i>
          Quay lại trang chủ
        </button>
      </div>

      {/* Thống kê */}
      {statistics && (
        <div className="row g-3 mb-4">
          <div className="col-md-2">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <h6 className="text-muted mb-2">Tổng đơn</h6>
                <h3 className="text-primary mb-0">{statistics.total}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <h6 className="text-muted mb-2">Chờ phản hồi</h6>
                <h3 className="text-warning mb-0">{statistics.waiting}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <h6 className="text-muted mb-2">Đã nhận</h6>
                <h3 className="text-info mb-0">{statistics.accepted}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <h6 className="text-muted mb-2">Đã hoàn thành</h6>
                <h3 className="text-success mb-0">{statistics.completed}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <h6 className="text-muted mb-2">Tổng chi tiêu</h6>
                <h3 className="text-danger mb-0">
                  {formatGiaTien(statistics.totalAmount)}
                </h3>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="btn-group mb-4" role="group">
        <button
          type="button"
          className={`btn ${!filter ? "btn-danger" : "btn-outline-danger"}`}
          onClick={() => {
            setFilter("");
            setPage(0);
          }}
        >
          Tất cả
        </button>
        <button
          type="button"
          className={`btn ${filter === "PENDING" ? "btn-warning" : "btn-outline-warning"
            }`}
          onClick={() => {
            setFilter("PENDING");
            setPage(0);
          }}
        >
          Chờ phản hồi
        </button>
        <button
          type="button"
          className={`btn ${filter === "ACCEPTED" ? "btn-info" : "btn-outline-info"
            }`}
          onClick={() => {
            setFilter("ACCEPTED");
            setPage(0);
          }}
        >
          Đã nhận
        </button>
        <button
          type="button"
          className={`btn ${filter === "COMPLETED" ? "btn-success" : "btn-outline-success"
            }`}
          onClick={() => {
            setFilter("COMPLETED");
            setPage(0);
          }}
        >
          Đã hoàn thành
        </button>
      </div>

      {/* Danh sách */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : sessions.length === 0 ? (
        <div className="alert alert-info">Không có đơn thuê nào</div>
      ) : (
        <div className="row g-3">
          {sessions.map((session) => {
            const ccdv = session.ccdv || {};
            const serviceType = session.serviceType || {};

            return (
              <div key={session.id} className="col-12">
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <div className="row align-items-center">
                      {/* Thông tin CCDV */}
                      <div className="col-md-3">
                        <div className="d-flex align-items-center">
                          <div className="me-3">
                            <img
                              src={ccdv.avatar || "/default-avatar.png"}
                              alt={ccdv.fullName || "CCDV"}
                              className="rounded-circle"
                              style={{ width: "60px", height: "60px", objectFit: "cover" }}
                            />
                          </div>
                          <div>
                            <h6 className="mb-1">{ccdv.fullName || "Chưa có tên"}</h6>
                            <span className={`badge ${getStatusClass(session.status)}`}>
                              {getStatusText(session.status)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Thông tin đơn */}
                      <div className="col-md-5">
                        <p className="mb-1">
                          <i className="bi bi-briefcase text-muted me-2"></i>
                          <strong>Dịch vụ:</strong> {serviceType.name || "N/A"}
                        </p>
                        <p className="mb-1">
                          <i className="bi bi-clock text-muted me-2"></i>
                          <strong>Thời gian:</strong> {formatNgayGio(session.startTime)}
                        </p>
                        <p className="mb-1">
                          <i className="bi bi-hourglass text-muted me-2"></i>
                          <strong>Thời lượng:</strong> {tinhThoiLuong(session.startTime, session.endTime)} giờ
                        </p>
                        <p className="mb-0">
                          <i className="bi bi-geo-alt text-muted me-2"></i>
                          <strong>Địa chỉ:</strong> {session.address || "Chưa có địa chỉ"}
                        </p>
                      </div>

                      {/* Giá và hành động */}
                      <div className="col-md-4 text-end">
                        <h4 className="text-danger mb-3">{formatGiaTien(session.totalPrice)}</h4>

                        <div className="d-grid gap-2">
                          {/* Xem chi tiết */}
                          <Link
                            to={`/user/don-thue/chi-tiet/${session.id}`}
                            className="btn btn-outline-primary"
                          >
                            <i className="bi bi-eye me-2"></i>
                            Xem chi tiết
                          </Link>

                          {/* Hoàn thành */}
                          {coTheHoanThanh(session.status) && (
                            <button className="btn btn-success" onClick={() => handleComplete(session.id)}>
                              <i className="bi bi-check-circle me-2"></i>
                              Hoàn thành
                            </button>
                          )}

                          {/* Hủy đơn */}
                          {coTheHuy(session.status) && (
                            <button className="btn btn-danger" onClick={() => handleCancel(session.id)}>
                              <i className="bi bi-x-circle me-2"></i>
                              Hủy đơn
                            </button>
                          )}

                          {/* Thêm báo cáo */}
                          {session.status === "COMPLETED" && !session.userReport && (
                            <Link
                              to={`/user/don-thue/bao-cao/${session.id}`}
                              className="btn btn-info"
                            >
                              <i className="bi bi-chat-left-text me-2"></i>
                              Thêm báo cáo
                            </Link>
                          )}

                          {/* Hiển thị báo cáo nếu có */}
                          {session.userReport && (
                            <div className="alert alert-secondary mb-0 mt-2 small text-start">
                              <i className="bi bi-chat-left-dots me-2"></i>
                              <strong>Báo cáo:</strong> {session.userReport}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      )}

      {/* Phân trang */}
      {totalPages > 1 && (
        <nav className="mt-4">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${page === 0 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setPage(page - 1)}
                disabled={page === 0}
              >
                Trước
              </button>
            </li>
            <li className="page-item disabled">
              <span className="page-link">
                Trang {page + 1} / {totalPages}
              </span>
            </li>
            <li
              className={`page-item ${page === totalPages - 1 ? "disabled" : ""
                }`}
            >
              <button
                className="page-link"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages - 1}
              >
                Sau
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}