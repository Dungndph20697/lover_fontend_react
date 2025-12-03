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
import Header from "./layout/Header";
import Footer from "./layout/Footer";

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

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
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

  useEffect(() => {
    if (!userId) return;
    loadSessions();
    loadStatistics();
  }, [userId, filter, page]);

  const loadSessions = async () => {
    setLoading(true);
    setError("");

    const result = await getDanhSachDonThue(userId, filter || null, page, 10);
    if (result.success) {
      setSessions(result.data.content || []);
      setTotalPages(result.data.totalPages || 0);
    } else {
      setError(result.message || "Không thể tải danh sách đơn thuê");
    }

    setLoading(false);
  };

  const loadStatistics = async () => {
    const result = await getThongKeDonThue(userId);
    if (result.success) {
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

  if (!userId) {
    return (
      <div
        className="d-flex justify-content-center align-items-center vh-100"
        style={{
          background:
            "linear-gradient(to right, #ff9a9e 0%, #ffd1dc 45%, #ffe3e3 100%)",
        }}
      >
        <div className="text-center">
          <div
            className="spinner-border text-white mb-3"
            role="status"
            style={{ width: "3rem", height: "3rem" }}
          >
            <span className="visually-hidden">Đang xác thực người dùng...</span>
          </div>
          <p className="text-white fw-semibold">Đang xác thực...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {/* HEADER - FULL WIDTH */}
      <div
        style={{
          width: "100%",
          background: "linear-gradient(135deg, #ff9a9e 0%, #ffd1dc 100%)",
          boxShadow: "0 4px 12px rgba(255, 107, 157, 0.2)",
        }}
      >
        <Header />
      </div>

      {/* CONTENT */}
      <div
        style={{
          flex: 1,
          background:
            "linear-gradient(to right, #ff9a9e 0%, #ffd1dc 45%, #ffe3e3 100%)",
          paddingTop: "2rem",
          paddingBottom: "2rem",
        }}
      >
        <div className="container py-4">
          {/* Title */}
          <div className="text-center mb-4">
            <h1
              className="fw-bold mb-2"
              style={{
                fontSize: "2.5rem",
                textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
                color: "#000",
              }}
            >
              Danh Sách Đơn Thuê
            </h1>
            <p style={{ color: "#000", opacity: 0.7 }}>
              Quản lý tất cả đơn thuê của bạn
            </p>
          </div>

          {/* THỐNG KÊ */}
          {statistics && (
            <div className="row g-3 mb-4">
              {/* Tổng đơn */}
              <div className="col-md-6">
                <div
                  className="card border-0 shadow-lg h-100"
                  style={{ borderRadius: "16px", overflow: "hidden" }}
                >
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <p className="text-muted mb-1 small fw-semibold text-uppercase">
                          Tổng số đơn
                        </p>
                        <h2
                          className="mb-0 fw-bold"
                          style={{ color: "#ff6b9d" }}
                        >
                          {statistics.total || 0}
                        </h2>
                      </div>
                      <div
                        className="bg-light rounded-circle p-3"
                        style={{
                          width: "60px",
                          height: "60px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <i
                          className="bi bi-bag-check"
                          style={{ fontSize: "28px", color: "#ff6b9d" }}
                        ></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tổng chi tiêu */}
              <div className="col-md-6">
                <div
                  className="card border-0 shadow-lg h-100"
                  style={{ borderRadius: "16px", overflow: "hidden" }}
                >
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <p className="text-muted mb-1 small fw-semibold text-uppercase">
                          Tổng chi tiêu
                        </p>
                        <h2 className="mb-0 fw-bold text-success">
                          {formatGiaTien(statistics.totalAmount || 0)}
                        </h2>
                      </div>
                      <div
                        className="bg-light rounded-circle p-3"
                        style={{
                          width: "60px",
                          height: "60px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <i
                          className="bi bi-graph-up"
                          style={{ fontSize: "28px", color: "#28a745" }}
                        ></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Danh sách */}
          {loading ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ minHeight: "300px" }}
            >
              <div className="text-center">
                <div
                  className="spinner-border text-white mb-3"
                  role="status"
                  style={{ width: "3rem", height: "3rem" }}
                >
                  <span className="visually-hidden">Đang tải...</span>
                </div>
                <p className="text-white fw-semibold">Đang tải dữ liệu...</p>
              </div>
            </div>
          ) : error ? (
            <div
              className="alert alert-danger shadow-sm"
              style={{ borderRadius: "12px" }}
            >
              {error}
            </div>
          ) : sessions.length === 0 ? (
            <div
              className="card border-0 shadow-lg"
              style={{ borderRadius: "16px", overflow: "hidden" }}
            >
              <div className="card-body p-5 text-center">
                <i
                  className="bi bi-inbox"
                  style={{ fontSize: "48px", color: "#999", opacity: 0.5 }}
                ></i>
                <p className="text-muted mt-3">Chưa có đơn thuê nào</p>
              </div>
            </div>
          ) : (
            <div className="row g-3">
              {sessions.map((session) => {
                const ccdv = session.ccdv || {};
                const statusColors = {
                  PENDING: "warning",
                  COMPLETED: "success",
                  CANCELLED: "danger",
                  REVIEW_REPORT: "secondary",
                  REPORTED: "success",
                };

                return (
                  <div key={session.id} className="col-12">
                    <div
                      className="card border-0 shadow-lg"
                      style={{
                        borderRadius: "16px",
                        overflow: "hidden",
                        transition: "transform 0.2s, box-shadow 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.boxShadow =
                          "0 12px 24px rgba(255, 107, 157, 0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 12px rgba(0, 0, 0, 0.1)";
                      }}
                    >
                      <div className="card-body p-4">
                        <div className="row align-items-center g-3">
                          {/* Thông tin CCDV */}
                          <div className="col-md-3">
                            <div>
                              <h6 className="mb-2 fw-semibold">
                                {ccdv.fullName ||
                                  ccdv.username ||
                                  "Chưa có tên"}
                              </h6>
                              <span
                                className={`badge bg-${
                                  statusColors[session.status] || "secondary"
                                } shadow-sm`}
                                style={{
                                  padding: "6px 12px",
                                  borderRadius: "8px",
                                }}
                              >
                                {getStatusText(session.status)}
                              </span>
                            </div>
                          </div>

                          {/* Thông tin đơn */}
                          <div className="col-md-5">
                            <p className="mb-2">
                              <i className="bi bi-calendar-event text-muted me-2"></i>
                              <strong className="small">Thời gian:</strong>
                              <span className="ms-2 small">
                                {formatNgayGio(session.startTime)}
                              </span>
                            </p>
                            <p className="mb-2">
                              <i className="bi bi-hourglass-split text-muted me-2"></i>
                              <strong className="small">Thời lượng:</strong>
                              <span className="ms-2 small">
                                {tinhThoiLuong(
                                  session.startTime,
                                  session.endTime
                                )}{" "}
                                giờ
                              </span>
                            </p>
                            <p className="mb-0">
                              <i className="bi bi-geo-alt text-muted me-2"></i>
                              <strong className="small">Địa chỉ:</strong>
                              <span className="ms-2 small">
                                {session.address || "Chưa có địa chỉ"}
                              </span>
                            </p>
                          </div>

                          {/* Giá và hành động */}
                          <div className="col-md-4 text-end">
                            <h4 className="mb-3" style={{ color: "#ff6b9d" }}>
                              {formatGiaTien(session.totalPrice)}
                            </h4>

                            <div className="d-grid gap-2">
                              {/* Xem chi tiết */}
                              <Link
                                to={`/user/don-thue/chi-tiet/${session.id}`}
                                className="btn btn-outline-primary btn-sm"
                                style={{
                                  borderRadius: "10px",
                                  fontWeight: "500",
                                }}
                              >
                                <i className="bi bi-eye me-1"></i>
                                Xem chi tiết
                              </Link>

                              {/* Hoàn thành */}
                              {coTheHoanThanh(session.status) && (
                                <button
                                  className="btn btn-success btn-sm"
                                  onClick={() => handleComplete(session.id)}
                                  style={{
                                    borderRadius: "10px",
                                    fontWeight: "500",
                                  }}
                                >
                                  <i className="bi bi-check-circle me-1"></i>
                                  Hoàn thành
                                </button>
                              )}

                              {/* Hủy đơn */}
                              {coTheHuy(session.status) && (
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => handleCancel(session.id)}
                                  style={{
                                    borderRadius: "10px",
                                    fontWeight: "500",
                                  }}
                                >
                                  <i className="bi bi-x-circle me-1"></i>
                                  Hủy đơn
                                </button>
                              )}

                              {/* Thêm đánh giá */}
                              {session.status === "COMPLETED" &&
                                !session.userReport && (
                                  <Link
                                    to={`/user/don-thue/bao-cao/${session.id}`}
                                    className="btn btn-info btn-sm"
                                    style={{
                                      borderRadius: "10px",
                                      fontWeight: "500",
                                      color: "#fff",
                                    }}
                                  >
                                    <i className="bi bi-chat-left-text me-1"></i>
                                    Thêm đánh giá
                                  </Link>
                                )}

                              {/* Đánh giá chờ duyệt */}
                              {session.status === "REVIEW_REPORT" && (
                                <div
                                  className="alert mb-0 mt-2 small"
                                  style={{
                                    borderRadius: "10px",
                                    backgroundColor: "#e8f4f8",
                                    borderLeft: "4px solid #0dcaf0",
                                    color: "#000",
                                  }}
                                >
                                  <i
                                    className="bi bi-clock-history me-2"
                                    style={{ color: "#0dcaf0" }}
                                  ></i>
                                  <strong>Đánh giá đang chờ duyệt...</strong>
                                </div>
                              )}

                              {/* Đã đánh giá */}
                              {session.status === "REPORTED" &&
                                session.userReport && (
                                  <div
                                    className="alert mb-0 mt-2 small text-start"
                                    style={{
                                      borderRadius: "10px",
                                      backgroundColor: "#f0e6f0",
                                      borderLeft: "4px solid #d59fd8",
                                      color: "#000",
                                    }}
                                  >
                                    <i
                                      className="bi bi-check-circle me-2"
                                      style={{ color: "#d59fd8" }}
                                    ></i>
                                    <strong>Đã đánh giá:</strong>{" "}
                                    {session.userReport}
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
                    style={{ borderRadius: "10px 0 0 10px" }}
                  >
                    Trước
                  </button>
                </li>
                <li className="page-item disabled">
                  <span
                    className="page-link"
                    style={{ backgroundColor: "#fff" }}
                  >
                    Trang {page + 1} / {totalPages}
                  </span>
                </li>
                <li
                  className={`page-item ${
                    page === totalPages - 1 ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages - 1}
                    style={{ borderRadius: "0 10px 10px 0" }}
                  >
                    Sau
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>

      {/* FOOTER - FULL WIDTH */}
      <div
        style={{
          width: "100%",
          background: "#f5f6f7",
          boxShadow: "0 -4px 12px rgba(0, 0, 0, 0.05)",
          marginTop: "auto",
        }}
      >
        <Footer />
      </div>
    </div>
  );
}
