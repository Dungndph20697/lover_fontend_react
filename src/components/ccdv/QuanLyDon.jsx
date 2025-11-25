import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle,
  DollarSign,
  FileText,
  Eye,
  Package,
  TrendingUp,
} from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { findUserByToken } from "../../service/user/login";
import {
  fetchHireSessions,
  fetchHireStatistics,
  handleAccept,
  handleComplete,
  handleReport,
} from "../../service/quan_li_don_thue/QuanLiDonThue";
import ChiTietDonThue from "./ChiTietDonThue";

const QuanLiDonThue = () => {
  const [ccdvId, setCcdvId] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [reportText, setReportText] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  // Lấy thông tin user từ token
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          showNotification("Vui lòng đăng nhập", "danger");
          return;
        }

        const userData = await findUserByToken(token);
        if (userData && userData.id) {
          setCcdvId(userData.id);
        } else {
          showNotification("Không tìm thấy thông tin người dùng", "danger");
        }
      } catch (error) {
        showNotification("Lỗi khi lấy thông tin người dùng", "danger");
      }
    };

    getUserInfo();
  }, []);

  const loadData = async () => {
    if (!ccdvId) return;
    const onReport = async () => {
        if (!reportText.trim()) return showNotification("Vui lòng nhập nội dung", "danger");
        try {
            const res = await handleReport(selectedSession.id, ccdvId, reportText);
            if (res.success) {
                showNotification("Đã gửi báo cáo!", "success");
                setShowReportModal(false);
                loadData();
            }
        } catch {
            showNotification("Không thể gửi báo cáo", "danger");
        }
    };

    const handleViewDetail = (sessionId) => {
        setSelectedSessionId(sessionId);
        setViewMode("detail");
    };

    const handleBackToList = () => {
        setViewMode("list");
        setSelectedSessionId(null);
        loadData();
    };

    const formatMoney = (a) =>
        new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(a);
    const formatDate = (d) =>
        new Date(d).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

    const getStatusText = (status) => {
        const map = {
            PENDING: "Chờ phản hồi",
            CHO_PHAN_HOI: "Chờ phản hồi",
            DA_NHAN: "Đã nhận",
            ACCEPTED: "Đã nhận",
            COMPLETED: "Đã hoàn thành",
            DUYET_BAO_CAO: "Duyệt báo cáo",
        };
        return map[status] || status;
    };

    const getStatusColor = (status) => {
        const map = {
            PENDING: "warning",
            CHO_PHAN_HOI: "warning",
            ACCEPTED: "primary",
            COMPLETED: "success",
            DUYET_BAO_CAO: "secondary",
        };
        return map[status] || "secondary";
    };

    const renderActionButton = (s) => {
        switch (s.status) {
            case "PENDING":
            case "CHO_PHAN_HOI":
                return (
                    <button 
                        className="btn btn-success btn-sm shadow-sm" 
                        onClick={() => onAccept(s.id)}
                        style={{ fontWeight: '500' }}
                    >
                        <CheckCircle size={16} className="me-1" /> Xác nhận
                    </button>
                );
            case "ACCEPTED":
                return (
                    <button 
                        className="btn btn-primary btn-sm shadow-sm" 
                        onClick={() => onComplete(s.id)}
                        style={{ fontWeight: '500' }}
                    >
                        <DollarSign size={16} className="me-1" /> Nhận tiền
                    </button>
                );
            case "COMPLETED":
                return (
                    <button 
                        className="btn btn-warning btn-sm shadow-sm" 
                        onClick={() => { setSelectedSession(s); setShowReportModal(true); }}
                        style={{ fontWeight: '500' }}
                    >
                        <FileText size={16} className="me-1" /> Đánh giá
                    </button>
                );
            case "DUYET_BAO_CAO":
                return <span className="text-muted fst-italic small">Đã hoàn tất</span>;
            default:
                return null;
        }
    };

    if (loading)
        return (
            <div 
                className="d-flex justify-content-center align-items-center vh-100"
                style={{
                    background: "linear-gradient(to right, #ff9a9e 0%, #ffd1dc 45%, #ffe3e3 100%)"
                }}
            >
                <div className="text-center">
                    <div className="spinner-border text-white mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-white fw-semibold">Đang tải dữ liệu...</p>
                </div>
            </div>
        );

    if (viewMode === "detail" && selectedSessionId) {
        return <ChiTietDonThue sessionId={selectedSessionId} ccdvId={ccdvId} onBack={handleBackToList} />;

    setLoading(true);
    try {
      const [sessionsData, statsData] = await Promise.all([
        fetchHireSessions(ccdvId),
        fetchHireStatistics(ccdvId),
      ]);
      console.log(sessionsData);
      setSessions(sessionsData);
      setStatistics(statsData);
    } catch {
      showNotification("Không thể tải dữ liệu", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ccdvId) {
      loadData();
    }
  }, [ccdvId]);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const onAccept = async (id) => {
    try {
      const res = await handleAccept(id, ccdvId);
      if (res.success) {
        showNotification("Đã xác nhận đơn!", "success");
        loadData();
      }
    } catch {
      showNotification("Không thể xác nhận đơn", "danger");
    }
  };

  const onComplete = async (id) => {
    try {
      const res = await handleComplete(id, ccdvId);
      if (res.success) {
        showNotification("Đã hoàn thành đơn!", "success");
        loadData();
      }
    } catch {
      showNotification("Không thể hoàn thành đơn", "danger");
    }
  };

  const onReport = async () => {
    if (!reportText.trim())
      return showNotification("Vui lòng nhập nội dung", "danger");
    try {
      const res = await handleReport(selectedSession.id, ccdvId, reportText);
      if (res.success) {
        showNotification("Đã gửi báo cáo!", "success");
        setShowReportModal(false);
        loadData();
      }
    } catch {
      showNotification("Không thể gửi báo cáo", "danger");
    }
  };

  const handleViewDetail = (sessionId) => {
    setSelectedSessionId(sessionId);
    setViewMode("detail");
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedSessionId(null);
    loadData();
  };

  const formatMoney = (a) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(a);
  const formatDate = (d) =>
    new Date(d).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const getStatusText = (status) => {
    const map = {
      PENDING: "Chờ phản hồi",
      CHO_PHAN_HOI: "Chờ phản hồi",
      DA_NHAN: "Đã nhận",
      ACCEPTED: "Đã nhận",
      COMPLETED: "Đã hoàn thành",
      DUYET_BAO_CAO: "Duyệt báo cáo",
    };
    return map[status] || status;
  };

  const getStatusColor = (status) => {
    const map = {
      PENDING: "warning",
      CHO_PHAN_HOI: "warning",
      ACCEPTED: "primary",
      COMPLETED: "success",
      DUYET_BAO_CAO: "secondary",
    };
    return map[status] || "secondary";
  };

  const renderActionButton = (s) => {
    switch (s.status) {
      case "PENDING":
      case "CHO_PHAN_HOI":
        return (
          <button
            className="btn btn-success btn-sm shadow-sm"
            onClick={() => onAccept(s.id)}
            style={{ fontWeight: "500" }}
          >
            <CheckCircle size={16} className="me-1" /> Xác nhận
          </button>
        );
      case "ACCEPTED":
        return (
          <button
            className="btn btn-primary btn-sm shadow-sm"
            onClick={() => onComplete(s.id)}
            style={{ fontWeight: "500" }}
          >
            <DollarSign size={16} className="me-1" /> Nhận tiền
          </button>
        );
      case "COMPLETED":
        return (
          <button
            className="btn btn-warning btn-sm shadow-sm"
            onClick={() => {
              setSelectedSession(s);
              setShowReportModal(true);
            }}
            style={{ fontWeight: "500" }}
          >
            <FileText size={16} className="me-1" /> Báo cáo
          </button>
        );
      case "DUYET_BAO_CAO":
        return <span className="text-muted fst-italic small">Đã hoàn tất</span>;
      default:
        return null;
    }
  };
                {/* Header */}
                <div className="text-center mb-4">
                    <h1 className="fw-bold mb-2" style={{ fontSize: '2.5rem', textShadow: '2px 2px 4px rgba(0,0,0,0.1)', color: '#000' }}>
                        Quản Lý Đơn Thuê
                    </h1>
                    <p style={{ color: '#000', opacity: 0.7 }}>Theo dõi và quản lý tất cả đơn thuê của bạn</p>
                </div>

                {/* Statistics Cards */}
                {statistics && (
                    <div className="row mb-4 g-3">
                        <div className="col-md-6">
                            <div className="card border-0 shadow-lg h-100" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                                <div className="card-body p-4">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div>
                                            <p className="text-muted mb-1 small fw-semibold text-uppercase">Tổng đơn</p>
                                            <h2 className="mb-0 fw-bold" style={{ color: '#ff6b9d' }}>{statistics.tongDon}</h2>
                                        </div>
                                        <div className="bg-light rounded-circle p-3" style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Package size={28} style={{ color: '#ff6b9d' }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="card border-0 shadow-lg h-100" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                                <div className="card-body p-4">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div>
                                            <p className="text-muted mb-1 small fw-semibold text-uppercase">Tổng thu nhập</p>
                                            <h2 className="mb-0 fw-bold text-success">{formatMoney(statistics.tongThu)}</h2>
                                        </div>
                                        <div className="bg-light rounded-circle p-3" style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <TrendingUp size={28} className="text-success" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Table Card */}
                <div className="card border-0 shadow-lg" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover mb-0 align-middle">
                                <thead style={{ backgroundColor: '#fff5f7' }}>
                                    <tr>
                                        <th className="border-0 py-3 px-4 fw-semibold text-muted">Người thuê</th>
                                        <th className="border-0 py-3 px-4 fw-semibold text-muted">Địa chỉ</th>
                                        <th className="border-0 py-3 px-4 fw-semibold text-muted">Thời gian</th>
                                        <th className="border-0 py-3 px-4 fw-semibold text-muted">Ngày bắt đầu</th>
                                        <th className="border-0 py-3 px-4 fw-semibold text-muted text-end">Thành tiền</th>
                                        <th className="border-0 py-3 px-4 fw-semibold text-muted text-center">Trạng thái</th>
                                        <th className="border-0 py-3 px-4 fw-semibold text-muted text-center">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sessions.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="text-center py-5">
                                                <div className="text-muted">
                                                    <Package size={48} className="mb-3 opacity-50" />
                                                    <p className="mb-0">Chưa có đơn thuê nào</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        sessions.map((s) => (
                                            <tr 
                                                key={s.id} 
                                                style={{ 
                                                    cursor: "pointer",
                                                    transition: 'background-color 0.2s'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fff5f7'}
                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                onClick={() => handleViewDetail(s.id)}
                                            >
                                                <td className="px-4 py-3">
                                                    <span className="fw-semibold">{s.user.username}</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="text-muted small">{s.address}</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="badge bg-light text-dark border">
                                                        {((new Date(s.endTime) - new Date(s.startTime)) / (1000 * 60 * 60)).toFixed(1)} giờ
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {formatDate(s.startTime)}
                                                </td>
                                                <td className="px-4 py-3 text-end">
                                                    <span className="fw-bold" style={{ color: '#ff6b9d' }}>
                                                        {formatMoney(s.totalPrice)}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className={`badge bg-${getStatusColor(s.status)} shadow-sm`} style={{ padding: '6px 12px', borderRadius: '8px' }}>
                                                        {getStatusText(s.status)}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                                                    {renderActionButton(s)}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Report Modal */}
            {showReportModal && (
                <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                            <div className="modal-header border-0 pb-0" style={{ background: 'linear-gradient(135deg, #ff9a9e 0%, #ffd1dc 100%)' }}>
                                <h5 className="modal-title fw-bold text-white">Đánh giá khách hàng</h5>
                                <button 
                                    type="button" 
                                    className="btn-close btn-close-white" 
                                    onClick={() => setShowReportModal(false)} 
                                />
                            </div>
                            <div className="modal-body p-4">
                                <div className="mb-3">
                                    <label className="form-label fw-semibold small text-muted text-uppercase">Đơn của</label>
                                    <p className="fw-semibold mb-0">{selectedSession?.user.username}</p>
                                </div>
                                <div>
                                    <label className="form-label fw-semibold small text-muted text-uppercase">Nội dung đánh giá</label>
                                    <textarea
                                        className="form-control shadow-sm"
                                        rows="5"
                                        value={reportText}
                                        onChange={(e) => setReportText(e.target.value)}
                                        placeholder="Nhập nội dung đánh giá..."
                                        style={{ borderRadius: '12px', border: '2px solid #f0f0f0' }}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer border-0 pt-0">
                                <button 
                                    className="btn btn-light shadow-sm" 
                                    onClick={() => setShowReportModal(false)}
                                    style={{ borderRadius: '10px', fontWeight: '500' }}
                                >
                                    Hủy
                                </button>
                                <button 
                                    className="btn text-white shadow-sm" 
                                    onClick={onReport}
                                    style={{ 
                                        borderRadius: '10px', 
                                        fontWeight: '500',
                                        background: 'linear-gradient(135deg, #ff9a9e 0%, #ffd1dc 100%)'
                                    }}
                                >
                                    Gửi đánh giá
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
  if (loading)
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
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-white fw-semibold">Đang tải dữ liệu...</p>

        </div>
      </div>
    );

  if (viewMode === "detail" && selectedSessionId) {
    return (
      <ChiTietDonThue
        sessionId={selectedSessionId}
        ccdvId={ccdvId}
        onBack={handleBackToList}
      />
    );
  }

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
        {notification && (
          <div
            className={`alert alert-${notification.type} position-fixed top-0 start-50 translate-middle-x mt-3 shadow-lg`}
            style={{
              zIndex: 9999,
              minWidth: "300px",
              borderRadius: "12px",
              fontWeight: "500",
            }}
          >
            {notification.message}
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-4">
          <h1
            className="fw-bold mb-2"
            style={{
              fontSize: "2.5rem",
              textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
              color: "#000",
            }}
          >
            Quản Lý Đơn Thuê
          </h1>
          <p style={{ color: "#000", opacity: 0.7 }}>
            Theo dõi và quản lý tất cả đơn thuê của bạn
          </p>
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="row mb-4 g-3">
            <div className="col-md-6">
              <div
                className="card border-0 shadow-lg h-100"
                style={{ borderRadius: "16px", overflow: "hidden" }}
              >
                <div className="card-body p-4">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <p className="text-muted mb-1 small fw-semibold text-uppercase">
                        Tổng đơn
                      </p>
                      <h2 className="mb-0 fw-bold" style={{ color: "#ff6b9d" }}>
                        {statistics.tongDon}
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
                      <Package size={28} style={{ color: "#ff6b9d" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div
                className="card border-0 shadow-lg h-100"
                style={{ borderRadius: "16px", overflow: "hidden" }}
              >
                <div className="card-body p-4">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <p className="text-muted mb-1 small fw-semibold text-uppercase">
                        Tổng thu nhập
                      </p>
                      <h2 className="mb-0 fw-bold text-success">
                        {formatMoney(statistics.tongThu)}
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
                      <TrendingUp size={28} className="text-success" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Table Card */}
        <div
          className="card border-0 shadow-lg"
          style={{ borderRadius: "16px", overflow: "hidden" }}
        >
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead style={{ backgroundColor: "#fff5f7" }}>
                  <tr>
                    <th className="border-0 py-3 px-4 fw-semibold text-muted">
                      Người thuê
                    </th>
                    <th className="border-0 py-3 px-4 fw-semibold text-muted">
                      Địa chỉ
                    </th>
                    <th className="border-0 py-3 px-4 fw-semibold text-muted">
                      Thời gian
                    </th>
                    <th className="border-0 py-3 px-4 fw-semibold text-muted">
                      Ngày bắt đầu
                    </th>
                    <th className="border-0 py-3 px-4 fw-semibold text-muted text-end">
                      Thành tiền
                    </th>
                    <th className="border-0 py-3 px-4 fw-semibold text-muted text-end">
                      Chat với người thuê
                    </th>
                    <th className="border-0 py-3 px-4 fw-semibold text-muted text-center">
                      Trạng thái
                    </th>
                    <th className="border-0 py-3 px-4 fw-semibold text-muted text-center">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-5">
                        <div className="text-muted">
                          <Package size={48} className="mb-3 opacity-50" />
                          <p className="mb-0">Chưa có đơn thuê nào</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    sessions.map((s) => (
                      <tr
                        key={s.id}
                        style={{
                          cursor: "pointer",
                          transition: "background-color 0.2s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#fff5f7")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            "transparent")
                        }
                        onClick={() => handleViewDetail(s.id)}
                      >
                        <td className="px-4 py-3">
                          <span className="fw-semibold">{s.user.username}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-muted small">{s.address}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="badge bg-light text-dark border">
                            {(
                              (new Date(s.endTime) - new Date(s.startTime)) /
                              (1000 * 60 * 60)
                            ).toFixed(1)}{" "}
                            giờ
                          </span>
                        </td>
                        <td className="px-4 py-3">{formatDate(s.startTime)}</td>
                        <td className="px-4 py-3 text-end">
                          <span
                            className="fw-bold"
                            style={{ color: "#ff6b9d" }}
                          >
                            {formatMoney(s.totalPrice)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-end">
                          <Link
                            to={`/ccdv/chat?to=${s.user.id}`}
                            className="btn btn-danger px-4 py-2 rounded-pill fw-semibold"
                          >
                            Chat ngay
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`badge bg-${getStatusColor(
                              s.status
                            )} shadow-sm`}
                            style={{
                              padding: "6px 12px",
                              borderRadius: "8px",
                            }}
                          >
                            {getStatusText(s.status)}
                          </span>
                        </td>
                        <td
                          className="px-4 py-3 text-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {renderActionButton(s)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div
              className="modal-content border-0 shadow-lg"
              style={{ borderRadius: "16px", overflow: "hidden" }}
            >
              <div
                className="modal-header border-0 pb-0"
                style={{
                  background:
                    "linear-gradient(135deg, #ff9a9e 0%, #ffd1dc 100%)",
                }}
              >
                <h5 className="modal-title fw-bold text-white">
                  Báo cáo khách hàng
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowReportModal(false)}
                />
              </div>
              <div className="modal-body p-4">
                <div className="mb-3">
                  <label className="form-label fw-semibold small text-muted text-uppercase">
                    Đơn của
                  </label>
                  <p className="fw-semibold mb-0">
                    {selectedSession?.user.username}
                  </p>
                </div>
                <div>
                  <label className="form-label fw-semibold small text-muted text-uppercase">
                    Nội dung báo cáo
                  </label>
                  <textarea
                    className="form-control shadow-sm"
                    rows="5"
                    value={reportText}
                    onChange={(e) => setReportText(e.target.value)}
                    placeholder="Nhập nội dung báo cáo..."
                    style={{
                      borderRadius: "12px",
                      border: "2px solid #f0f0f0",
                    }}
                  />
                </div>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button
                  className="btn btn-light shadow-sm"
                  onClick={() => setShowReportModal(false)}
                  style={{ borderRadius: "10px", fontWeight: "500" }}
                >
                  Hủy
                </button>
                <button
                  className="btn text-white shadow-sm"
                  onClick={onReport}
                  style={{
                    borderRadius: "10px",
                    fontWeight: "500",
                    background:
                      "linear-gradient(135deg, #ff9a9e 0%, #ffd1dc 100%)",
                  }}
                >
                  Gửi báo cáo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuanLiDonThue;
