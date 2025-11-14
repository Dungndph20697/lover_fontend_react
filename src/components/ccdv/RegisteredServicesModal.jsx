import React, { useEffect, useState } from "react";
import { Modal, Table, Badge, Button, Form, Spinner } from "react-bootstrap";
import { FaTimesCircle, FaRegSmile } from "react-icons/fa";
import { toast } from "react-toastify";
import { updateUserServicePrice } from "../../service/ccdv/serviceApi";
import { findUserByToken } from "../../service/user/login";
import * as Yup from "yup";
import "../ccdv/css/RegisteredServicesModal.css";

export default function RegisteredServicesModal({ show, onHide, services, refresh }) {
    const token = localStorage.getItem("token");
    const [userId, setUserId] = useState(null);
    const [editingPrice, setEditingPrice] = useState({});
    const [loadingId, setLoadingId] = useState(null);


    const priceSchema = Yup.number()
        .typeError("Giá phải là số")
        .required("Vui lòng nhập giá")
        .min(10000, "Giá phải lớn hơn hoặc bằng 10.000₫")
        .max(10000000, "Giá không được vượt quá 10.000.000₫");

    // ✅ Lấy userId từ token khi mở modal
    useEffect(() => {
        const fetchUserId = async () => {
            if (!token) return;
            try {
                const res = await findUserByToken(token);
                setUserId(res.id);
            } catch (err) {
                console.error("Lỗi khi lấy thông tin user:", err);
            }
        };
        fetchUserId();
    }, [token]);

    // ✅ Hàm cập nhật giá
    const handleUpdatePrice = async (serviceId) => {
        const newPrice = editingPrice[serviceId];

        if (!userId) {
            toast.error("Không xác định được người dùng. Vui lòng đăng nhập lại!");
            return;
        }

        try {
            // ✅ Kiểm tra dữ liệu bằng Yup
            await priceSchema.validate(newPrice);

            setLoadingId(serviceId);
            await updateUserServicePrice(userId, serviceId, newPrice, token);
            toast.success("Cập nhật giá dịch vụ thành công!");

            if (typeof refresh === "function") await refresh();

            setEditingPrice((prev) => ({ ...prev, [serviceId]: "" }));
        } catch (err) {
            if (err.name === "ValidationError") {
                toast.warn("⚠️ " + err.message);
            } else {
                console.error("Chi tiết lỗi backend:", err.response?.data || err.message);
                toast.error("❌ Lỗi khi cập nhật: " + (err.response?.data || err.message));
            }
        } finally {
            setLoadingId(null);
        }
    };
    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            size="lg"
            className="registered-modal fade-in"
            backdropClassName="modal-blur"
        >
            <Modal.Header closeButton className="border-0 gradient-header text-white">
                <Modal.Title className="fw-bold d-flex align-items-center gap-2">
                    <FaRegSmile /> Dịch vụ bạn đã đăng ký
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className="p-0">
                {services && services.length > 0 ? (
                    <div className="table-wrapper">
                        <Table hover responsive className="modern-table mb-0 align-middle">
                            <thead>
                                <tr>
                                    <th>Tên dịch vụ</th>
                                    <th>Loại</th>
                                    <th>Giá hiện tại</th>
                                    <th className="text-center">Cập nhật giá</th>
                                </tr>
                            </thead>
                            <tbody>
                                {services.map((item) => {
                                    const type = item.serviceType?.type;
                                    const serviceId = item.serviceType?.id;

                                    const canEditPrice = type === "BASIC" || type === "EXTENDED";

                                    // 💡 Tính chênh lệch (chỉ áp dụng nếu không phải FREE)
                                    const defaultPrice = item.serviceType?.pricePerHour || 0;
                                    const currentPrice = item.totalPrice || 0;
                                    const diffPercent =
                                        defaultPrice > 0
                                            ? (((currentPrice - defaultPrice) / defaultPrice) * 100).toFixed(0)
                                            : 0;

                                    return (
                                        <tr key={item.id} className="row-hover">
                                            <td className="fw-semibold">{item.serviceType?.name}</td>
                                            <td>
                                                {type === "BASIC" && <Badge bg="primary">Cơ bản</Badge>}
                                                {type === "FREE" && <Badge bg="success">Miễn phí</Badge>}
                                                {type === "EXTENDED" && <Badge bg="danger">Mở rộng</Badge>}
                                            </td>

                                            {/* ✅ Nếu là FREE → chỉ hiển thị Miễn phí, không so sánh giá */}
                                            <td>
                                                {type === "FREE" ? (
                                                    <div className="fw-bold text-success">Miễn phí</div>
                                                ) : (
                                                    <>
                                                        <div className="fw-bold text-primary">
                                                            {currentPrice.toLocaleString("vi-VN")}₫
                                                        </div>
                                                        <div className="text-muted small">
                                                            Giá gốc: {defaultPrice.toLocaleString("vi-VN")}₫{" "}
                                                            {diffPercent > 0 && (
                                                                <span className="text-danger">(+{diffPercent}%)</span>
                                                            )}
                                                            {diffPercent < 0 && (
                                                                <span className="text-success">({diffPercent}%)</span>
                                                            )}
                                                            {diffPercent === 0 && (
                                                                <span className="text-secondary">(=)</span>
                                                            )}
                                                        </div>
                                                    </>
                                                )}
                                            </td>

                                            <td className="text-center">
                                                {canEditPrice ? (
                                                    <div className="d-flex justify-content-center align-items-center gap-2">
                                                        <Form.Control
                                                            type="number"
                                                            placeholder="Giá mới"
                                                            className="price-input"
                                                            value={editingPrice[serviceId] || ""}
                                                            onChange={(e) =>
                                                                setEditingPrice({
                                                                    ...editingPrice,
                                                                    [serviceId]: e.target.value,
                                                                })
                                                            }
                                                        />
                                                        <Button
                                                            size="sm"
                                                            variant="outline-success"
                                                            disabled={loadingId === serviceId}
                                                            onClick={() => handleUpdatePrice(serviceId)}
                                                        >
                                                            {loadingId === serviceId ? (
                                                                <Spinner size="sm" animation="border" />
                                                            ) : (
                                                                "Lưu"
                                                            )}
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted small">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>

                        </Table>
                    </div>
                ) : (
                    <div className="text-center py-5 text-muted">
                        <FaTimesCircle size={40} className="mb-3 text-secondary" />
                        <p className="fs-5 mb-0">Bạn chưa đăng ký dịch vụ nào.</p>
                    </div>
                )}
            </Modal.Body>
        </Modal>
    );
}
