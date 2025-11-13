import React, { useState, useEffect } from "react";
import { CheckCircle, DollarSign, FileText, Eye } from "lucide-react";
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
    const ccdvId = 2;
    const [sessions, setSessions] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);
    const [showReportModal, setShowReportModal] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);
    const [reportText, setReportText] = useState("");
    const [viewMode, setViewMode] = useState("list");
    const [selectedSessionId, setSelectedSessionId] = useState(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const [sessionsData, statsData] = await Promise.all([
                fetchHireSessions(ccdvId),
                fetchHireStatistics(ccdvId),
            ]);
            setSessions(sessionsData);
            setStatistics(statsData);
        } catch {
            showNotification("Không thể tải dữ liệu", "danger");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

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
        loadData(); // Refresh dữ liệu khi quay lại
    };

    const formatMoney = (a) =>
        new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(a);
    const formatDate = (d) =>
        new Date(d).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

    const getStatusText = (status) => {
        const map = {
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
            CHO_PHAN_HOI: "warning",
            ACCEPTED: "primary",
            COMPLETED: "success",
            DUYET_BAO_CAO: "secondary",
        };
        return map[status] || "secondary";
    };

    const renderActionButton = (s) => {
        switch (s.status) {
            case "CHO_PHAN_HOI":
                return (
                    <button className="btn btn-success btn-sm" onClick={() => onAccept(s.id)}>
                        <CheckCircle className="me-1" /> Xác nhận
                    </button>
                );
            case "ACCEPTED":
                return (
                    <button className="btn btn-primary btn-sm" onClick={() => onComplete(s.id)}>
                        <DollarSign className="me-1" /> Nhận tiền
                    </button>
                );
            case "COMPLETED":
                return (
                    <button className="btn btn-warning btn-sm" onClick={() => { setSelectedSession(s); setShowReportModal(true); }}>
                        <FileText className="me-1" /> Báo cáo
                    </button>
                );
            case "DUYET_BAO_CAO":
                return <span className="text-muted fst-italic">Đã hoàn tất</span>;
            default:
                return null;
        }
    };

    if (loading)
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );

    // Hiển thị chi tiết đơn
    if (viewMode === "detail" && selectedSessionId) {
        return <ChiTietDonThue sessionId={selectedSessionId} ccdvId={ccdvId} onBack={handleBackToList} />;
    }

    // Hiển thị danh sách đơn
    return (
        <div className="container mt-4">
            {notification && (
                <div className={`alert alert-${notification.type} position-fixed top-0 end-0 m-3`}>
                    {notification.message}
                </div>
            )}

            <h1 className="mb-4">Quản Lý Đơn Thuê</h1>

            {statistics && (
                <div className="row mb-4">
                    <div className="col-md-3 mb-3">
                        <div className="card text-center">
                            <div className="card-body">
                                <p className="card-text">Tổng đơn</p>
                                <h4>{statistics.tongDon}</h4>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 mb-3">
                        <div className="card text-center">
                            <div className="card-body">
                                <p className="card-text">Tổng thu nhập</p>
                                <h4 className="text-success">{formatMoney(statistics.tongThu)}</h4>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>Người thuê</th>
                            <th>CCDV</th>
                            <th>Địa chỉ</th>
                            <th>Thời gian</th>
                            <th>Ngày bắt đầu</th>
                            <th className="text-end">Thành tiền</th>
                            <th className="text-center">Trạng thái</th>
                            <th className="text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sessions.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="text-center text-muted">
                                    Chưa có đơn thuê nào
                                </td>
                            </tr>
                        ) : (
                            sessions.map((s) => (
                                <tr key={s.id} style={{ cursor: "pointer" }}>
                                    <td onClick={() => handleViewDetail(s.id)}>{s.user.username}</td>
                                    <td onClick={() => handleViewDetail(s.id)}>{s.ccdv.username}</td>
                                    <td onClick={() => handleViewDetail(s.id)}>{s.address}</td>
                                    <td onClick={() => handleViewDetail(s.id)}>
                                        {((new Date(s.endTime) - new Date(s.startTime)) / (1000 * 60 * 60)).toFixed(1)} giờ
                                    </td>
                                    <td onClick={() => handleViewDetail(s.id)}>{formatDate(s.startTime)}</td>
                                    <td className="text-end" onClick={() => handleViewDetail(s.id)}>
                                        {formatMoney(s.totalPrice)}
                                    </td>
                                    <td className="text-center" onClick={() => handleViewDetail(s.id)}>
                                        <span className={`badge bg-${getStatusColor(s.status)}`}>
                                            {getStatusText(s.status)}
                                        </span>
                                    </td>
                                    <td className="text-center">
                                        <div className="d-flex gap-2 justify-content-center">
                                            <button
                                                className="btn btn-info btn-sm"
                                                onClick={() => handleViewDetail(s.id)}
                                                title="Xem chi tiết"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            {renderActionButton(s)}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showReportModal && (
                <div className="modal show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Báo cáo khách hàng</h5>
                                <button type="button" className="btn-close" onClick={() => setShowReportModal(false)} />
                            </div>
                            <div className="modal-body">
                                <p>Đơn của: {selectedSession?.user.username}</p>
                                <textarea
                                    className="form-control"
                                    rows="4"
                                    value={reportText}
                                    onChange={(e) => setReportText(e.target.value)}
                                    placeholder="Nhập nội dung báo cáo..."
                                />
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowReportModal(false)}>
                                    Hủy
                                </button>
                                <button className="btn btn-primary" onClick={onReport}>
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