import React from "react";
import { Modal, Table, Badge } from "react-bootstrap";
import { FaTimesCircle, FaRegSmile } from "react-icons/fa";
import "./css/RegisteredServicesModal.css";

export default function RegisteredServicesModal({ show, onHide, services }) {
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
                        <Table hover responsive className="modern-table mb-0">
                            <thead>
                                <tr>
                                    {/* <th>#</th> */}
                                    <th>Tên dịch vụ</th>
                                    <th>Loại</th>
                                    <th>Giá</th>
                                </tr>
                            </thead>
                            <tbody>
                                {services.map((item, idx) => (
                                    <tr
                                        key={item.id}
                                        className="row-hover"
                                    >
                                        {/* <td>{idx + 1}</td> */}
                                        <td className="fw-semibold">{item.serviceType?.name}</td>
                                        <td>
                                            {item.serviceType?.type === "FREE" && (
                                                <Badge bg="success">Miễn phí</Badge>
                                            )}
                                            {item.serviceType?.type === "EXTENDED" && (
                                                <Badge bg="danger">Mở rộng</Badge>
                                            )}
                                            {item.serviceType?.type === "BASIC" && (
                                                <Badge bg="primary">Cơ bản</Badge>
                                            )}
                                        </td>
                                        <td className="fw-bold text-primary">
                                            {item.totalPrice?.toLocaleString("vi-VN") || 0}₫
                                        </td>
                                    </tr>
                                ))}
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
