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
  getStatusClass,
  getStatusText,
  coTheHoanThanh,
  coTheHuy,
} from "../../service/user_quan_li_don/UserQuanLiDon";
import { findUserByToken } from "../../service/user/login";

export default function ChiTietDonThue() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [userId, setUserId] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
              {/* Trạng thái */}
              <div className="mb-3">
                <span className={`badge ${getStatusClass(session.status)} fs-6`}>
                  {getStatusText(session.status)}
                </span>
              </div>
  
              {/* Thông tin CCDV */}
              {session.ccdv && (
                <div className="mb-4">
                  <h6 className="text-muted mb-3">Thông tin người cung cấp dịch vụ</h6>
                  <div className="d-flex align-items-center">
                    <img
                      src={session.ccdv.avatar || "/default-avatar.png"}
                      alt={session.ccdv.fullName || "CCDV"}
                      className="rounded-circle me-3"
                      style={{ width: "80px", height: "80px", objectFit: "cover" }}
                    />
                    <div>
                      <h5 className="mb-1">{session.ccdv.fullName || "Chưa có tên"}</h5>
                      <p className="text-muted mb-0">
                        <i className="bi bi-telephone me-2"></i>
                        {session.ccdv.phone || "Chưa có số điện thoại"}
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
                            {formatGiaTien(session.serviceType.pricePerHour || 0)}/giờ
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
                          {tinhThoiLuong(session.startTime, session.endTime)} giờ
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
  
              {/* Báo cáo nếu có */}
              {session.userReport && (
                <>
                  <hr />
                  <div>
                    <h6 className="text-muted mb-3">Báo cáo của bạn</h6>
                    <div className="alert alert-light border">
                      <i className="bi bi-chat-left-quote me-2"></i>
                      {session.userReport}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
  
        {/* Cột phải - Tổng tiền và hành động */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm sticky-top" style={{ top: "20px" }}>
            <div className="card-body">
              <h6 className="text-muted mb-3">Tổng thanh toán</h6>
              <h2 className="text-danger mb-4">{formatGiaTien(session.totalPrice)}</h2>
  
              <div className="d-grid gap-2">
                {coTheHoanThanh(session.status) && (
                  <button className="btn btn-success btn-lg" onClick={handleComplete}>
                    <i className="bi bi-check-circle me-2"></i>
                    Hoàn thành
                  </button>
                )}
  
                {coTheHuy(session.status) && (
                  <button className="btn btn-danger btn-lg" onClick={handleCancel}>
                    <i className="bi bi-x-circle me-2"></i>
                    Hủy đơn
                  </button>
                )}
  
                {session.status === "COMPLETED" && !session.userReport && (
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