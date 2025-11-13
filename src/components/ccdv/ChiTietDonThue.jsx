import React, { useState, useEffect } from "react";
import { ArrowLeft, Calendar, Clock, MapPin, DollarSign, User, CheckCircle, Edit2, Save, X } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import { fetchSessionDetail, handleUpdateFeedback } from "../../service/quan_li_don_thue/QuanLiDonThue";

const ChiTietDonThue = ({ sessionId, ccdvId, onBack }) => {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);
    const [isEditingFeedback, setIsEditingFeedback] = useState(false);
    const [feedbackText, setFeedbackText] = useState("");

    useEffect(() => {
        loadSessionDetail();
    }, [sessionId]);

    const loadSessionDetail = async () => {
        setLoading(true);
        try {
            const data = await fetchSessionDetail(sessionId);
            setSession(data);
            setFeedbackText(data.userReport || "");
        } catch {
            showNotification("Không thể tải chi tiết đơn", "danger");
        } finally {
            setLoading(false);
        }
    };

    const showNotification = (message, type = "success") => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleSaveFeedback = async () => {
        if (!feedbackText.trim()) {
            showNotification("Vui lòng nhập nội dung phản hồi", "warning");
            return;
        }
        try {
            const res = await handleUpdateFeedback(sessionId, ccdvId, feedbackText);
            if (res.success) {
                showNotification("Đã cập nhật phản hồi!", "success");
                setIsEditingFeedback(false);
                loadSessionDetail();
            }
        } catch {
            showNotification("Không thể cập nhật phản hồi", "danger");
        }
    };

    const formatMoney = (amount) =>
        new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

    const formatDateTime = (dateTime) =>
        new Date(dateTime).toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

    const formatDate = (date) =>
        new Date(date).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });

    const getStatusText = (status) => {
        const map = {
            PENDING: "Chờ phản hồi",
            ACCEPTED: "Đã nhận",
            COMPLETED: "Đã hoàn thành",
            REPORTED: "Đã báo cáo",
        };
        return map[status] || status;
    };

    const getStatusColor = (status) => {
        const map = {
            PENDING: "warning",
            ACCEPTED: "primary",
            COMPLETED: "success",
            REPORTED: "secondary",
        };
        return map[status] || "secondary";
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="alert alert-danger">
                Không tìm thấy thông tin đơn thuê
            </div>
        );
    }

    const duration = ((new Date(session.endTime) - new Date(session.startTime)) / (1000 * 60 * 60)).toFixed(1);

    return (
        <div className="container mt-4">
            {notification && (
                <div className={`alert alert-${notification.type} position-fixed top-0 end-0 m-3 shadow`} style={{ zIndex: 9999 }}>
                    {notification.message}
                </div>
            )}

            {/* Header */}
            <div className="d-flex align-items-center mb-4">
                <button className="btn btn-outline-secondary me-3" onClick={onBack}>
                    <ArrowLeft size={20} /> Quay lại
                </button>
                <h2 className="mb-0">Chi tiết đơn thuê #{session.id}</h2>
            </div>

            <div className="row">
                {/* Cột trái - Thông tin chính */}
                <div className="col-lg-8 mb-4">
                    <div className="card shadow-sm">
                        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Thông tin đơn thuê</h5>
                            <span className={`badge bg-${getStatusColor(session.status)}`}>
                                {getStatusText(session.status)}
                            </span>
                        </div>
                        <div className="card-body">
                            {/* Người thuê */}
                            <div className="mb-3 p-3 bg-light rounded">
                                <div className="d-flex align-items-center mb-2">
                                    <User className="text-primary me-2" size={20} />
                                    <strong>Người thuê</strong>
                                </div>
                                <div className="ms-4">
                                    <p className="mb-1"><strong>Tên:</strong> {session.user.username}</p>
                                    <p className="mb-0"><strong>Email:</strong> {session.user.email}</p>
                                </div>
                            </div>

                            {/* Địa chỉ */}
                            <div className="mb-3 p-3 bg-light rounded">
                                <div className="d-flex align-items-start">
                                    <MapPin className="text-danger me-2 mt-1" size={20} />
                                    <div>
                                        <strong className="d-block mb-1">Địa chỉ</strong>
                                        <span>{session.address}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Thời gian */}
                            <div className="mb-3 p-3 bg-light rounded">
                                <div className="d-flex align-items-start mb-3">
                                    <Calendar className="text-success me-2 mt-1" size={20} />
                                    <div>
                                        <strong className="d-block mb-1">Ngày thuê</strong>
                                        <span>{formatDate(session.startTime)}</span>
                                    </div>
                                </div>
                                <div className="d-flex align-items-start mb-3">
                                    <Clock className="text-info me-2 mt-1" size={20} />
                                    <div>
                                        <strong className="d-block mb-1">Thời gian</strong>
                                        <span>
                                            {formatDateTime(session.startTime)} - {formatDateTime(session.endTime)}
                                        </span>
                                    </div>
                                </div>
                                <div className="d-flex align-items-start">
                                    <Clock className="text-warning me-2 mt-1" size={20} />
                                    <div>
                                        <strong className="d-block mb-1">Thời lượng</strong>
                                        <span className="badge bg-warning text-dark">{duration} giờ</span>
                                    </div>
                                </div>
                            </div>

                            {/* Dịch vụ */}
                            {session.services && session.services.length > 0 && (
                                <div className="mb-3 p-3 bg-light rounded">
                                    <strong className="d-block mb-2">Dịch vụ được thuê</strong>
                                    <div className="d-flex flex-wrap gap-2">
                                        {session.services.map((service, index) => (
                                            <span key={index} className="badge bg-info">
                                                {service}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Cột phải - Thanh toán & Phản hồi */}
                <div className="col-lg-4">
                    {/* Thành tiền */}
                    <div className="card shadow-sm mb-4">
                        <div className="card-header bg-success text-white">
                            <h5 className="mb-0">
                                <DollarSign size={20} className="me-2" />
                                Thanh toán
                            </h5>
                        </div>
                        <div className="card-body text-center">
                            <p className="text-muted mb-2">Tổng tiền</p>
                            <h3 className="text-success mb-0">{formatMoney(session.totalPrice)}</h3>
                            <small className="text-muted">
                                ({duration} giờ × {formatMoney(session.totalPrice / duration)}/giờ)
                            </small>
                        </div>
                    </div>

                    {/* Phản hồi về người thuê */}
                    <div className="card shadow-sm">
                        <div className="card-header bg-secondary text-white d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Phản hồi về người thuê</h5>
                            {session.status === "COMPLETED" && !isEditingFeedback && (
                                <button
                                    className="btn btn-sm btn-light"
                                    onClick={() => setIsEditingFeedback(true)}
                                >
                                    <Edit2 size={16} />
                                </button>
                            )}
                        </div>
                        <div className="card-body">
                            {session.status === "COMPLETED" && isEditingFeedback ? (
                                <>
                                    <textarea
                                        className="form-control mb-3"
                                        rows="4"
                                        value={feedbackText}
                                        onChange={(e) => setFeedbackText(e.target.value)}
                                        placeholder="Nhập phản hồi về người thuê..."
                                    />
                                    <div className="d-flex gap-2">
                                        <button
                                            className="btn btn-success btn-sm flex-grow-1"
                                            onClick={handleSaveFeedback}
                                        >
                                            <Save size={16} className="me-1" /> Lưu
                                        </button>
                                        <button
                                            className="btn btn-secondary btn-sm"
                                            onClick={() => {
                                                setIsEditingFeedback(false);
                                                setFeedbackText(session.userReport || "");
                                            }}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div>
                                    {session.userReport ? (
                                        <p className="mb-0">{session.userReport}</p>
                                    ) : (
                                        <p className="text-muted fst-italic mb-0">
                                            {session.status === "COMPLETED"
                                                ? "Chưa có phản hồi. Nhấn nút chỉnh sửa để thêm."
                                                : "Chỉ có thể thêm phản hồi khi đơn đã hoàn thành"}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChiTietDonThue;