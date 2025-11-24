import React, { useState, useEffect } from 'react';
import { Modal, Button, Spinner, Alert, Badge, Card, Row, Col } from 'react-bootstrap';
import hireSessionApi from '../../config/hireSessionApi';

export default function AdminReviewReportDetail({ hireSessionId, show, onClose, onRefresh }) {
    const [hireSession, setHireSession] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        if (hireSessionId && show) {
            loadHireSessionDetail();
        }
    }, [hireSessionId, show]);

    const loadHireSessionDetail = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('Loading hire session detail for ID:', hireSessionId);
            const response = await hireSessionApi.getHireSessionDetail(hireSessionId);
            console.log('Response:', response.data);
            setHireSession(response.data);
        } catch (err) {
            console.error('Error loading hire session:', err);
            setError('Không thể tải chi tiết đơn. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleApproveReport = async () => {
        console.log('handleApproveReport called with ID:', hireSessionId);
        setActionLoading(true);
        try {
            await hireSessionApi.approveReport(hireSessionId);
            alert('Duyệt báo cáo thành công');
            setShowApproveModal(false);
            onRefresh && onRefresh();
            onClose();
        } catch (err) {
            console.error('Error approving report:', err);
            alert('Lỗi khi duyệt báo cáo: ' + err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleRejectReport = async () => {
        console.log('handleRejectReport called with ID:', hireSessionId);
        setActionLoading(true);
        try {
            await hireSessionApi.rejectReport(hireSessionId);
            alert('Từ chối báo cáo thành công');
            setShowRejectModal(false);
            onRefresh && onRefresh();
            onClose();
        } catch (err) {
            console.error('Error rejecting report:', err);
            alert('Lỗi khi từ chối báo cáo: ' + err.message);
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title className="fw-bold">Chi Tiết Duyệt Báo Cáo</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Đang tải...</span>
                        </Spinner>
                    </div>
                ) : error ? (
                    <Alert variant="danger">{error}</Alert>
                ) : hireSession ? (
                    <>
                        <Card className="mb-4">
                            <Card.Header className="bg-light">
                                <h5 className="mb-0 fw-bold">📋 Thông Tin Đơn Thuê</h5>
                            </Card.Header>
                            <Card.Body>
                                <Row className="mb-3">
                                    <Col md={6}>
                                        <p className="mb-2">
                                            <strong>Mã đơn:</strong>
                                            <Badge bg="primary" className="ms-2">#{hireSession.id}</Badge>
                                        </p>
                                        <p className="mb-2">
                                            <strong>Người thuê:</strong> {hireSession.user?.username || 'N/A'}
                                        </p>
                                        <p className="mb-2">
                                            <strong>Email:</strong> {hireSession.user?.email || 'N/A'}
                                        </p>
                                    </Col>
                                    <Col md={6}>
                                        <p className="mb-2">
                                            <strong>Người cung cấp:</strong> {hireSession.ccdv?.username || 'N/A'}
                                        </p>
                                        <p className="mb-2">
                                            <strong>Email CCDV:</strong> {hireSession.ccdv?.email || 'N/A'}
                                        </p>
                                        <p className="mb-2">
                                            <strong>Trạng thái:</strong>
                                            <Badge bg="warning" text="dark" className="ms-2">
                                                {hireSession.status}
                                            </Badge>
                                        </p>
                                    </Col>
                                </Row>
                                <hr />
                                <Row>
                                    <Col md={6}>
                                        <p className="mb-2">
                                            <strong>Thời gian bắt đầu:</strong><br />
                                            {new Date(hireSession.startTime).toLocaleString('vi-VN')}
                                        </p>
                                    </Col>
                                    <Col md={6}>
                                        <p className="mb-2">
                                            <strong>Thời gian kết thúc:</strong><br />
                                            {new Date(hireSession.endTime).toLocaleString('vi-VN')}
                                        </p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <p className="mb-2">
                                            <strong>Giá:</strong>
                                            <span className="text-success fw-bold ms-2">
                                                {hireSession.totalPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                            </span>
                                        </p>
                                    </Col>
                                    <Col md={6}>
                                        <p className="mb-2">
                                            <strong>Địa chỉ:</strong> {hireSession.address || 'N/A'}
                                        </p>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        {hireSession.userReport && (
                            <Card className="mb-4 border-warning">
                                <Card.Header className="bg-warning text-dark fw-bold">
                                    ⚠️ Phản Hồi Từ Người Cung Cấp Dịch Vụ
                                </Card.Header>
                                <Card.Body>
                                    <div className="alert alert-light border border-warning">
                                        <p className="mb-0">{hireSession.userReport}</p>
                                    </div>
                                </Card.Body>
                            </Card>
                        )}

                        <Card className="mb-4">
                            <Card.Header className="bg-light">
                                <h5 className="mb-0 fw-bold">ℹ️ Thông Tin Bổ Sung</h5>
                            </Card.Header>
                            <Card.Body>
                                <p className="mb-2">
                                    <strong>Ngày tạo đơn:</strong><br />
                                    {new Date(hireSession.createdAt).toLocaleString('vi-VN')}
                                </p>
                                {hireSession.updatedAt && (
                                    <p className="mb-0">
                                        <strong>Lần cập nhật cuối:</strong><br />
                                        {new Date(hireSession.updatedAt).toLocaleString('vi-VN')}
                                    </p>
                                )}
                            </Card.Body>
                        </Card>
                    </>
                ) : null}
            </Modal.Body>

            {!loading && hireSession && (
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>Đóng</Button>
                    <Button variant="danger" onClick={() => setShowRejectModal(true)} className="me-2">
                        ✕ Từ Chối
                    </Button>
                    <Button variant="success" onClick={() => setShowApproveModal(true)}>
                        ✓ Duyệt Báo Cáo
                    </Button>
                </Modal.Footer>
            )}

            <Modal show={showApproveModal} onHide={() => setShowApproveModal(false)} centered>
                <Modal.Header closeButton className="bg-success text-white">
                    <Modal.Title>Xác Nhận Duyệt Báo Cáo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="mb-3">Bạn có chắc chắn muốn <strong>duyệt</strong> báo cáo này?</p>
                    <div className="alert alert-info small mb-0">
                        <strong>Khi duyệt:</strong>
                        <ul className="mb-0 mt-2">
                            <li>Thông tin phản hồi sẽ được hiển thị ở chi tiết đơn của CCDV</li>
                            <li>Số báo cáo sẽ được cập nhật trong hồ sơ CCDV</li>
                            <li>Đơn sẽ chuyển sang trạng thái "Đã hoàn thành"</li>
                        </ul>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowApproveModal(false)}>Quay lại</Button>
                    <Button variant="success" onClick={handleApproveReport} disabled={actionLoading}>
                        {actionLoading ? (
                            <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Đang xử lý...
                            </>
                        ) : (
                            'Đồng ý'
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)} centered>
                <Modal.Header closeButton className="bg-danger text-white">
                    <Modal.Title>Xác Nhận Từ Chối Báo Cáo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="mb-3">Bạn có chắc chắn muốn <strong>từ chối</strong> báo cáo này?</p>
                    <div className="alert alert-warning small mb-0">
                        <strong>Khi từ chối:</strong>
                        <ul className="mb-0 mt-2">
                            <li>Báo cáo sẽ bị xóa</li>
                            <li>Đơn sẽ chuyển về trạng thái "Đã hoàn thành"</li>
                            <li>Không có thông tin báo cáo nào được ghi nhận</li>
                        </ul>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowRejectModal(false)}>Quay lại</Button>
                    <Button variant="danger" onClick={handleRejectReport} disabled={actionLoading}>
                        {actionLoading ? (
                            <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Đang xử lý...
                            </>
                        ) : (
                            'Từ chối'
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal Thành Công */}
            <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
                <Modal.Header className="bg-success text-white">
                    <Modal.Title>✓ Thành Công</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center py-4">
                    <div className="mb-3">
                        <i className="bi bi-check-circle text-success" style={{ fontSize: '3rem' }}></i>
                    </div>
                    <p className="fw-bold fs-5">{successMessage}</p>
                </Modal.Body>
            </Modal>
        </Modal>
    );
}