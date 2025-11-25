import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
  getChiTietDonThue,
  hoanThanhDonThue,
  huyDonThue,
  formatGiaTien,
  formatNgayGio,
  tinhThoiLuong,
} from "../../service/user_quan_li_don/UserQuanLiDon";
import { findUserByToken } from "../../service/user/login";
import Header from "./layout/Header";
import Footer from "./layout/Footer";

export default function ChiTietDonThue() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [userId, setUserId] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getCcdvName = (ccdv) => {
    if (!ccdv) return "Chưa có thông tin";
    return ccdv.username || "Chưa có tên";
  };

  const getCcdvPhone = (ccdv) => {
    if (!ccdv) return "Chưa có số điện thoại";
    return ccdv.phone || ccdv.phoneNumber || "Chưa có số điện thoại";
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      PENDING: { text: "Chờ phản hồi", class: "warning" },
      ACCEPTED: { text: "Đã nhận", class: "primary" },
      COMPLETED: { text: "Đã hoàn thành", class: "success" },
      REVIEW_REPORT: { text: "⏳ Đánh giá chờ duyệt", class: "secondary" },
      REPORTED: { text: "Đã đánh giá", class: "danger" },
    };
    return statusMap[status] || { text: status, class: "secondary" };
  };

  const coTheHoanThanh = (status) => status === "ACCEPTED";
  const coTheHuy = (status) => status === "PENDING";
  const coTheBaoCao = (status) =>
    status === "COMPLETED" && !session?.userReport;
  const isReportPending = (status) => status === "REVIEW_REPORT";
  const isReportApproved = (status) => status === "REPORTED";

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
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  useEffect(() => {
    if (!userId) return;
    loadSessionDetail();
  }, [userId, sessionId]);

  const loadSessionDetail = async () => {
    setLoading(true);
    const result = await getChiTietDonThue(sessionId);

    if (result.success) {
      setSession(result.data);
      setError("");
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  const handleComplete = async () => {
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
        loadSessionDetail();
      } else {
        Swal.fire({
          icon: "error",
          title: "Lỗi!",
          text: response.message,
        });
      }
    }
  };

  const handleCancel = async () => {
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
        navigate("/user/don-thue");
      } else {
        Swal.fire({
          icon: "error",
          title: "Lỗi!",
          text: response.message,
        });
      }
    }
  };

  if (loading) {
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
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <p className="text-white fw-semibold">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          background:
            "linear-gradient(to right, #ff9a9e 0%, #ffd1dc 45%, #ffe3e3 100%)",
          minHeight: "100vh",
          paddingTop: "2rem",
          paddingBottom: "2rem",
        }}
      >
        <div className="container">
          <div
            className="alert alert-danger shadow-lg"
            style={{ borderRadius: "12px" }}
          >
            {error}
            <div className="mt-3">
              <Link to="/user/don-thue" className="btn btn-primary">
                Quay lại danh sách
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div
        style={{
          background:
            "linear-gradient(to right, #ff9a9e 0%, #ffd1dc 45%, #ffe3e3 100%)",
          minHeight: "100vh",
          paddingTop: "2rem",
          paddingBottom: "2rem",
        }}
      >
        <div className="container">
          <div
            className="alert alert-warning shadow-lg"
            style={{ borderRadius: "12px" }}
          >
            Không tìm thấy đơn thuê
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(session.status);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {/* HEADER */}
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
          color: "#000",
        }}
      >
        <div className="container py-4">
          {/* Header */}
          <h1
            className="fw-bold mb-4"
            style={{
              fontSize: "2.5rem",
              textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
              color: "#000",
            }}
          >
            <i className="bi bi-file-text me-2"></i>
            Chi tiết đơn thuê
          </h1>

          <div className="row g-3">
            {/* Cột trái */}
            <div className="col-lg-8">
              <div
                className="card border-0 shadow-lg"
                style={{
                  borderRadius: "16px",
                  overflow: "hidden",
                  backgroundColor: "#fff",
                }}
              >
                <div
                  className="card-header"
                  style={{
                    backgroundColor: "#fff",
                    borderBottom: "2px solid #f0f0f0",
                  }}
                >
                  <h5 className="mb-0 fw-bold text-dark">
                    <i
                      className="bi bi-info-circle me-2"
                      style={{ color: "#ff6b9d" }}
                    ></i>
                    Thông tin đơn thuê
                  </h5>
                </div>
                <div
                  className="card-body p-4"
                  style={{ backgroundColor: "#fff" }}
                >
                  {/* Thông tin CCDV */}
                  {session.ccdv && (
                    <div className="mb-4">
                      <h6 className="mb-3 fw-bold text-dark">
                        <i
                          className="bi bi-person-check me-2"
                          style={{ color: "#ff6b9d" }}
                        ></i>
                        Thông tin IDOL
                      </h6>
                      <div className="ps-3">
                        <h5 className="mb-2 text-dark fw-semibold">
                          {getCcdvName(session.ccdv)}
                        </h5>
                        <p className="text-dark mb-2">
                          <i
                            className="bi bi-telephone me-2"
                            style={{ color: "#ff6b9d" }}
                          ></i>
                          {getCcdvPhone(session.ccdv)}
                        </p>
                        <p className="text-dark mb-0">
                          <i
                            className="bi bi-envelope me-2"
                            style={{ color: "#ff6b9d" }}
                          ></i>
                          {session.ccdv.email || "Chưa có email"}
                        </p>
                      </div>
                    </div>
                  )}

                  <hr />

                  {/* Thông tin dịch vụ */}
                  {session.serviceType && (
                    <div className="mb-4">
                      <h6 className="mb-3 fw-bold text-dark">
                        <i
                          className="bi bi-briefcase me-2"
                          style={{ color: "#ff6b9d" }}
                        ></i>
                        Thông tin dịch vụ
                      </h6>
                      <div className="row ps-3">
                        <div className="col-md-6 mb-3">
                          <div className="d-flex">
                            <i className="bi bi-briefcase text-primary me-3 fs-5"></i>
                            <div>
                              <small className="text-dark d-block fw-semibold">
                                Dịch vụ
                              </small>
                              <strong className="text-dark">
                                {session.serviceType.name || "N/A"}
                              </strong>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <div className="d-flex">
                            <i className="bi bi-cash-stack text-success me-3 fs-5"></i>
                            <div>
                              <small className="text-dark d-block fw-semibold">
                                Đơn giá
                              </small>
                              <strong className="text-dark">
                                {formatGiaTien(
                                  session.serviceType.pricePerHour || 0
                                )}
                                /giờ
                              </strong>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <hr />

                  {/* Thông tin thời gian */}
                  <div className="mb-4">
                    <h6 className="mb-3 fw-bold text-dark">
                      <i
                        className="bi bi-calendar me-2"
                        style={{ color: "#ff6b9d" }}
                      ></i>
                      Thông tin thời gian
                    </h6>
                    <div className="row ps-3">
                      <div className="col-md-6 mb-3">
                        <div className="d-flex">
                          <i className="bi bi-calendar-check text-info me-3 fs-5"></i>
                          <div>
                            <small className="text-dark d-block fw-semibold">
                              Bắt đầu
                            </small>
                            <strong className="text-dark">
                              {formatNgayGio(session.startTime)}
                            </strong>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <div className="d-flex">
                          <i className="bi bi-calendar-x text-warning me-3 fs-5"></i>
                          <div>
                            <small className="text-dark d-block fw-semibold">
                              Kết thúc
                            </small>
                            <strong className="text-dark">
                              {formatNgayGio(session.endTime)}
                            </strong>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex">
                          <i className="bi bi-hourglass text-secondary me-3 fs-5"></i>
                          <div>
                            <small className="text-dark d-block fw-semibold">
                              Thời lượng
                            </small>
                            <strong className="text-dark">
                              {tinhThoiLuong(
                                session.startTime,
                                session.endTime
                              )}{" "}
                              giờ
                            </strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <hr />

                  {/* Địa chỉ */}
                  <div className="mb-3">
                    <h6 className="mb-3 fw-bold text-dark">
                      <i
                        className="bi bi-geo-alt me-2"
                        style={{ color: "#ff6b9d" }}
                      ></i>
                      Địa chỉ
                    </h6>
                    <div className="ps-3">
                      <strong className="text-dark">
                        {session.address || "Chưa có địa chỉ"}
                      </strong>
                    </div>
                  </div>

                  {/* Báo cáo đã duyệt */}
                  {session.userReport && isReportApproved(session.status) && (
                    <>
                      <hr />
                      <div>
                        <h6 className="mb-3 fw-bold text-dark">
                          <i
                            className="bi bi-chat-left-quote me-2"
                            style={{ color: "#ff6b9d" }}
                          ></i>
                          Đánh giá từ IDOL
                        </h6>
                        <div
                          className="alert alert-danger border ps-3"
                          style={{
                            borderRadius: "12px",
                            backgroundColor: "rgba(255, 107, 157, 0.1)",
                          }}
                        >
                          <span className="text-dark">
                            {session.userReport}
                          </span>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Báo cáo chờ duyệt */}
                  {session.userReport && isReportPending(session.status) && (
                    <>
                      <hr />
                      <div>
                        <h6 className="mb-3 fw-bold text-dark">
                          <i
                            className="bi bi-clock-history me-2"
                            style={{ color: "#ff6b9d" }}
                          ></i>
                          ⏳ Báo cáo chờ duyệt
                        </h6>
                        <div
                          className="alert alert-info border ps-3"
                          style={{
                            borderRadius: "12px",
                            backgroundColor: "rgba(13, 202, 240, 0.1)",
                          }}
                        >
                          <span className="text-dark">
                            Báo cáo từ CCDV đang chờ admin xem xét. Bạn sẽ được
                            thông báo kết quả sớm.
                          </span>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Không có báo cáo */}
                  {!session.userReport && !coTheBaoCao(session.status) && (
                    <>
                      <hr />
                      <div>
                        <h6 className="mb-3 fw-bold text-dark">
                          <i
                            className="bi bi-file-text me-2"
                            style={{ color: "#ff6b9d" }}
                          ></i>
                          📄 Báo cáo
                        </h6>
                        <p className="text-dark mb-0">Chưa có báo cáo nào</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Cột phải */}
            <div className="col-lg-4">
              <div
                className="card border-0 shadow-lg"
                style={{
                  borderRadius: "16px",
                  overflow: "hidden",
                  position: "sticky",
                  top: "20px",
                }}
              >
                <div className="card-body p-4">
                  <h6 className="mb-3 fw-bold text-dark">
                    <i
                      className="bi bi-cash-coin me-2"
                      style={{ color: "#ff6b9d" }}
                    ></i>
                    Tổng thanh toán
                  </h6>
                  <h2 className="mb-4 fw-bold" style={{ color: "#ff6b9d" }}>
                    {formatGiaTien(session.totalPrice)}
                  </h2>

                  {/* Trạng thái */}
                  <div className="mb-4">
                    <small className="text-dark d-block fw-semibold mb-2">
                      Trạng thái
                    </small>
                    <span
                      className={`badge bg-${statusInfo.class} shadow-sm`}
                      style={{
                        padding: "8px 16px",
                        borderRadius: "8px",
                        fontSize: "0.95rem",
                      }}
                    >
                      {statusInfo.text}
                    </span>
                  </div>

                  <hr />

                  <div className="d-grid gap-2">
                    {coTheHoanThanh(session.status) && (
                      <button
                        className="btn btn-success btn-lg"
                        onClick={handleComplete}
                        style={{ borderRadius: "10px", fontWeight: "500" }}
                      >
                        <i className="bi bi-check-circle me-2"></i>
                        Hoàn thành
                      </button>
                    )}

                    {coTheHuy(session.status) && (
                      <button
                        className="btn btn-danger btn-lg"
                        onClick={handleCancel}
                        style={{ borderRadius: "10px", fontWeight: "500" }}
                      >
                        <i className="bi bi-x-circle me-2"></i>
                        Hủy đơn
                      </button>
                    )}

                    {coTheBaoCao(session.status) && (
                      <Link
                        to={`/user/don-thue/bao-cao/${session.id}`}
                        className="btn btn-info btn-lg"
                        style={{
                          borderRadius: "10px",
                          fontWeight: "500",
                          color: "#fff",
                        }}
                      >
                        <i className="bi bi-chat-left-text me-2"></i>
                        Thêm báo cáo
                      </Link>
                    )}

                    <Link
                      to="/user/don-thue"
                      className="btn btn-outline-dark"
                      style={{ borderRadius: "10px", fontWeight: "500" }}
                    >
                      <i className="bi bi-arrow-left me-2"></i>
                      Quay lại danh sách
                    </Link>
                  </div>

                  {/* Timeline */}
                  <hr className="my-4" />
                  <h6 className="mb-3 fw-bold text-dark">
                    <i
                      className="bi bi-clock-history me-2"
                      style={{ color: "#ff6b9d" }}
                    ></i>
                    Lịch sử
                  </h6>
                  <div className="timeline">
                    <div className="timeline-item mb-2">
                      <small className="text-dark">
                        <i
                          className="bi bi-clock-history me-2"
                          style={{ color: "#ff6b9d" }}
                        ></i>
                        <strong>Tạo:</strong> {formatNgayGio(session.createdAt)}
                      </small>
                    </div>
                    {session.updatedAt && (
                      <div className="timeline-item">
                        <small className="text-dark">
                          <i
                            className="bi bi-arrow-repeat me-2"
                            style={{ color: "#ff6b9d" }}
                          ></i>
                          <strong>Cập nhật:</strong>{" "}
                          {formatNgayGio(session.updatedAt)}
                        </small>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
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
