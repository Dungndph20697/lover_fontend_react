import React, { useState } from "react";
import { Modal, Table, Badge, Button, Form, Spinner } from "react-bootstrap";
import { FaTimesCircle, FaRegSmile } from "react-icons/fa";
import { toast } from "react-toastify";
import { updateUserServicePrice } from "../../service/ccdv/serviceApi";
import "../ccdv/css/RegisteredServicesModal.css";

export default function RegisteredServicesModal({ show, onHide, services, refresh }) {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    const [editingPrice, setEditingPrice] = useState({});
    const [loadingId, setLoadingId] = useState(null);

    // ✅ Hàm cập nhật giá
    const handleUpdatePrice = async (serviceId) => {
        const newPrice = editingPrice[serviceId];
        if (!newPrice || isNaN(newPrice)) {
            toast.warn("💡 Vui lòng nhập giá hợp lệ!");
            return;
        }

        try {
            setLoadingId(serviceId);
            await updateUserServicePrice(userId, serviceId, newPrice, token);
            toast.success("✅ Cập nhật giá dịch vụ thành công!");

            // 🔄 Gọi lại API để cập nhật danh sách mới nhất
            if (typeof refresh === "function") {
                await refresh();
            }

            // ✨ Reset input sau khi lưu
            setEditingPrice((prev) => ({ ...prev, [serviceId]: "" }));
        } catch (err) {
            console.error("Chi tiết lỗi backend:", err.response?.data || err.message);
            toast.error("❌ Lỗi khi cập nhật: " + (err.response?.data || err.message));
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

                                    // ✅ Cho phép sửa giá cho BASIC & EXTENDED
                                    const canEditPrice = type === "BASIC" || type === "EXTENDED";

                                    return (
                                        <tr key={item.id} className="row-hover">
                                            <td className="fw-semibold">{item.serviceType?.name}</td>
                                            <td>
                                                {type === "BASIC" && <Badge bg="primary">Cơ bản</Badge>}
                                                {type === "FREE" && <Badge bg="success">Miễn phí</Badge>}
                                                {type === "EXTENDED" && <Badge bg="danger">Mở rộng</Badge>}
                                            </td>
                                            <td className="fw-bold text-primary">
                                                {item.totalPrice?.toLocaleString("vi-VN") || 0}₫
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
