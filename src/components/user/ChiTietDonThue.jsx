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

export default function ChiTietDonThue() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [userId, setUserId] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Helper: Lấy tên CCDV
  const getCcdvName = (ccdv) => {
    if (!ccdv) return "Chưa có thông tin";
    return (
      ccdv.username ||
      "Chưa có tên"
    );
  };

  // ✅ Helper: Lấy phone CCDV
  const getCcdvPhone = (ccdv) => {
    if (!ccdv) return "Chưa có số điện thoại";
    return ccdv.phone || ccdv.phoneNumber || "Chưa có số điện thoại";
  };

  // ✅ Helper: Map status sang text và color
  const getStatusInfo = (status) => {
    const statusMap = {
      PENDING: { text: "Chờ phản hồi", class: "badge-warning" },
      ACCEPTED: { text: "Đã nhận", class: "badge-primary" },
      COMPLETED: { text: "Đã hoàn thành", class: "badge-success" },
      REVIEW_REPORT: { text: "⏳ Báo cáo chờ duyệt", class: "badge-secondary" },
      REPORTED: { text: "❌ Đã báo cáo", class: "badge-danger" },
    };
    return statusMap[status] || { text: status, class: "badge-secondary" };
  };

  // ✅ Helper: Kiểm tra có thể hoàn thành không
  const coTheHoanThanh = (status) => {
    return status === "ACCEPTED";
  };

  // ✅ Helper: Kiểm tra có thể hủy không
  const coTheHuy = (status) => {
    return status === "PENDING";
  };

  // ✅ Helper: Kiểm tra có thể báo cáo không
  const coTheBaoCao = (status) => {
    return status === "COMPLETED" && !session?.userReport;
  };

  // ✅ Helper: Kiểm tra báo cáo đang chờ duyệt
  const isReportPending = (status) => {
    return status === "REVIEW_REPORT";
  };

  // ✅ Helper: Kiểm tra báo cáo đã được duyệt
  const isReportApproved = (status) => {
    return status === "REPORTED";
  };

  // Lấy userId từ token
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

  // Load chi tiết đơn khi có userId
  useEffect(() => {
    if (!userId) return;
    loadSessionDetail();
  }, [userId, sessionId]);

  const loadSessionDetail = async () => {
    setLoading(true);
    const result = await getChiTietDonThue(sessionId);

    if (result.success) {
      console.log("Session data:", result.data); // DEBUG
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
      <div className="container py-5 text-center">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          {error}
          <div className="mt-3">
            <Link to="/user/don-thue" className="btn btn-primary">
              Quay lại danh sách
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">Không tìm thấy đơn thuê</div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(session.status);

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-danger mb-0">
          <i className="bi bi-file-text me-2"></i>
          Chi tiết đơn thuê
        </h2>
        <Link to="/user/don-thue" className="btn btn-outline-secondary">
          <i className="bi bi-arrow-left me-2"></i>
          Quay lại
        </Link>
      </div>

      <div className="row">
        {/* Cột trái - Thông tin chi tiết */}
        <div className="col-md-8">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-bottom">
              <h5 className="mb-0">Thông tin đơn thuê</h5>
            </div>
            <div className="card-body">
              {/* ✅ Trạng thái */}
              <div className="mb-3">
                <span className={`badge ${statusInfo.class} fs-6`}>
                  {statusInfo.text}
                </span>
              </div>

              {/* ✅ Thông tin CCDV */}
              {session.ccdv && (
                <div className="mb-4">
                  <h6 className="text-muted mb-3">
                    Thông tin người cung cấp dịch vụ
                  </h6>
                  <div className="d-flex align-items-center">                   
                    <div>
                      <h5 className="mb-1">{getCcdvName(session.ccdv)}</h5>
                      <p className="text-muted mb-0">
                        <i className="bi bi-telephone me-2"></i>
                        {getCcdvPhone(session.ccdv)}
                      </p>
                      <p className="text-muted mb-0">
                        <i className="bi bi-envelope me-2"></i>
                        {session.ccdv.email || "Chưa có email"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <hr />

              {/* Thông tin dịch vụ */}
              {session.serviceType && (
                <div className="mb-4">
                  <h6 className="text-muted mb-3">Thông tin dịch vụ</h6>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <div className="d-flex">
                        <i className="bi bi-briefcase text-primary me-3 fs-5"></i>
                        <div>
                          <small className="text-muted d-block">Dịch vụ</small>
                          <strong>{session.serviceType.name || "N/A"}</strong>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <div className="d-flex">
                        <i className="bi bi-cash-stack text-success me-3 fs-5"></i>
                        <div>
                          <small className="text-muted d-block">Đơn giá</small>
                          <strong>
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
                <h6 className="text-muted mb-3">Thông tin thời gian</h6>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <div className="d-flex">
                      <i className="bi bi-calendar-check text-info me-3 fs-5"></i>
                      <div>
                        <small className="text-muted d-block">Bắt đầu</small>
                        <strong>{formatNgayGio(session.startTime)}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="d-flex">
                      <i className="bi bi-calendar-x text-warning me-3 fs-5"></i>
                      <div>
                        <small className="text-muted d-block">Kết thúc</small>
                        <strong>{formatNgayGio(session.endTime)}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="d-flex">
                      <i className="bi bi-hourglass text-secondary me-3 fs-5"></i>
                      <div>
                        <small className="text-muted d-block">Thời lượng</small>
                        <strong>
                          {tinhThoiLuong(session.startTime, session.endTime)}{" "}
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
                <h6 className="text-muted mb-3">Địa chỉ</h6>
                <div className="d-flex">
                  <i className="bi bi-geo-alt text-danger me-3 fs-5"></i>
                  <div>
                    <strong>{session.address || "Chưa có địa chỉ"}</strong>
                  </div>
                </div>
              </div>

              {/* ✅ Báo cáo - chỉ hiển thị khi REPORTED (đã duyệt) */}
              {session.userReport && isReportApproved(session.status) && (
                <>
                  <hr />
                  <div>
                    <h6 className="text-muted mb-3">❌ Báo cáo từ CCDV</h6>
                    <div className="alert alert-danger border">
                      <i className="bi bi-chat-left-quote me-2"></i>
                      {session.userReport}
                    </div>
                  </div>
                </>
              )}

              {/* ✅ Báo cáo chờ duyệt */}
              {session.userReport && isReportPending(session.status) && (
                <>
                  <hr />
                  <div>
                    <h6 className="text-muted mb-3">⏳ Báo cáo chờ duyệt</h6>
                    <div className="alert alert-info border">
                      <i className="bi bi-info-circle me-2"></i>
                      Báo cáo từ CCDV đang chờ admin xem xét. Bạn sẽ được thông
                      báo kết quả sớm.
                    </div>
                  </div>
                </>
              )}

              {/* ✅ Không có báo cáo */}
              {!session.userReport && !coTheBaoCao(session.status) && (
                <>
                  <hr />
                  <div>
                    <h6 className="text-muted mb-3">📄 Báo cáo</h6>
                    <p className="text-muted mb-0">Chưa có báo cáo nào</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Cột phải - Tổng tiền và hành động */}
        <div className="col-md-4">
          <div
            className="card border-0 shadow-sm sticky-top"
            style={{ top: "20px" }}
          >
            <div className="card-body">
              <h6 className="text-muted mb-3">Tổng thanh toán</h6>
              <h2 className="text-danger mb-4">
                {formatGiaTien(session.totalPrice)}
              </h2>

              <div className="d-grid gap-2">
                {coTheHoanThanh(session.status) && (
                  <button
                    className="btn btn-success btn-lg"
                    onClick={handleComplete}
                  >
                    <i className="bi bi-check-circle me-2"></i>
                    Hoàn thành
                  </button>
                )}

                {coTheHuy(session.status) && (
                  <button
                    className="btn btn-danger btn-lg"
                    onClick={handleCancel}
                  >
                    <i className="bi bi-x-circle me-2"></i>
                    Hủy đơn
                  </button>
                )}

                {coTheBaoCao(session.status) && (
                  <Link
                    to={`/user/don-thue/bao-cao/${session.id}`}
                    className="btn btn-info btn-lg"
                  >
                    <i className="bi bi-chat-left-text me-2"></i>
                    Thêm báo cáo
                  </Link>
                )}

                <Link to="/user/don-thue" className="btn btn-outline-secondary">
                  <i className="bi bi-arrow-left me-2"></i>
                  Quay lại danh sách
                </Link>
              </div>

              {/* Timeline */}
              <hr className="my-4" />
              <h6 className="text-muted mb-3">Lịch sử</h6>
              <div className="timeline">
                <div className="timeline-item">
                  <small className="text-muted">
                    <i className="bi bi-clock-history me-2"></i>
                    Tạo lúc: {formatNgayGio(session.createdAt)}
                  </small>
                </div>
                {session.updatedAt && (
                  <div className="timeline-item mt-2">
                    <small className="text-muted">
                      <i className="bi bi-arrow-repeat me-2"></i>
                      Cập nhật: {formatNgayGio(session.updatedAt)}
                    </small>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
