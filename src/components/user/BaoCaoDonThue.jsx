import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
  getChiTietDonThue,
  themBaoCao,
  formatGiaTien,
  formatNgayGio,
} from "../../service/user_quan_li_don/UserQuanLiDon";
import { findUserByToken } from "../../service/user/login";

export default function BaoCaoDonThue() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [userId, setUserId] = useState(null);
  const [session, setSession] = useState(null);
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);
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

  // Load chi tiết đơn khi có userId
  useEffect(() => {
    if (!userId) return;
    loadSessionDetail();
  }, [userId, sessionId]);

  const loadSessionDetail = async () => {
    const result = await getChiTietDonThue(sessionId);
    if (result.success) {
      setSession(result.data);
      setError("");
    } else {
      setError(result.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!report.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Cảnh báo",
        text: "Vui lòng nhập nội dung báo cáo",
      });
      return;
    }

    setLoading(true);
    const result = await themBaoCao(sessionId, userId, report);
    setLoading(false);

    if (result.success) {
      Swal.fire({
        icon: "success",
        title: "Thành công!",
        text: result.message || "Đã gửi báo cáo thành công",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        navigate("/user/don-thue");
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: result.message,
      });
    }
  };

  // Loading state
  if (!userId || !session) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          {error}
          <div className="mt-3">
            <Link to="/user/don-thue" className="btn btn-primary">
              <i className="bi bi-arrow-left me-2"></i>
              Quay lại danh sách
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card border-0 shadow">
            <div className="card-header bg-danger text-white">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">
                  <i className="bi bi-chat-left-text me-2"></i>
                  Thêm báo cáo
                </h4>
                <Link
                  to="/user/don-thue"
                  className="btn btn-light btn-sm"
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Quay lại
                </Link>
              </div>
            </div>

            <div className="card-body">
              {/* Thông tin đơn */}
              <div className="alert alert-light border mb-4">
                <h5 className="mb-3">
                  <i className="bi bi-file-text me-2"></i>
                  Thông tin đơn thuê
                </h5>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <small className="text-muted d-block">
                        Người cung cấp dịch vụ
                      </small>
                      <div className="d-flex align-items-center mt-1">
                        <img
                          src={session.ccdv.avatar || "/default-avatar.png"}
                          alt={session.ccdv.fullName}
                          className="rounded-circle me-2"
                          style={{
                            width: "40px",
                            height: "40px",
                            objectFit: "cover",
                          }}
                        />
                        <strong>{session.ccdv.fullName}</strong>
                      </div>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted d-block">Dịch vụ</small>
                      <strong>{session.serviceType.name}</strong>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-2">
                      <small className="text-muted d-block">Thời gian</small>
                      <strong>{formatNgayGio(session.startTime)}</strong>
                    </div>
                    <div className="mb-2">
                      <small className="text-muted d-block">Tổng tiền</small>
                      <h5 className="text-danger mb-0">
                        {formatGiaTien(session.totalPrice)}
                      </h5>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form báo cáo */}
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label fw-bold">
                    Nội dung báo cáo{" "}
                    <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className="form-control"
                    value={report}
                    onChange={(e) => setReport(e.target.value)}
                    placeholder="Nhập đánh giá, nhận xét về dịch vụ...
Ví dụ: 
- Dịch vụ rất tốt, CCDV nhiệt tình
- Đúng giờ hẹn, chuyên nghiệp
- Giá cả hợp lý, đáng để trải nghiệm"
                    rows={8}
                    required
                  />
                  <div className="form-text">
                    <i className="bi bi-info-circle me-1"></i>
                    Vui lòng chia sẻ trải nghiệm của bạn về dịch vụ để giúp người khác có thêm thông tin tham khảo
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-danger px-4"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-send me-2"></i>
                        Gửi báo cáo
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary px-4"
                    onClick={() => navigate("/user/don-thue")}
                    disabled={loading}
                  >
                    <i className="bi bi-x-circle me-2"></i>
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}