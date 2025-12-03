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
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultMessage, setResultMessage] = useState(null);
  const [resultType, setResultType] = useState(null); // 'success' or 'error'

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
      setShowApproveModal(false);
      setResultType('success');
      setResultMessage('Duyệt đánh giá thành công');
      setShowResultModal(true);
      setTimeout(() => {
        setShowResultModal(false);
        onRefresh && onRefresh();
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Error approving report:', err);
      setShowApproveModal(false);
      setResultType('error');
      setResultMessage('Lỗi khi duyệt đánh giá: ' + err.message);
      setShowResultModal(true);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectReport = async () => {
    console.log('handleRejectReport called with ID:', hireSessionId);
    setActionLoading(true);
    try {
      await hireSessionApi.rejectReport(hireSessionId);
      setShowRejectModal(false);
      setResultType('success');
      setResultMessage('Từ chối đánh giá thành công');
      setShowResultModal(true);
      setTimeout(() => {
        setShowResultModal(false);
        onRefresh && onRefresh();
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Error rejecting report:', err);
      setShowRejectModal(false);
      setResultType('error');
      setResultMessage('Lỗi khi từ chối đánh giá: ' + err.message);
      setShowResultModal(true);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Chi Tiết Duyệt Đánh Giá</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" className="mb-3" />
            <p>Đang tải...</p>
          </div>
        ) : error ? (
          <Alert variant="danger" className="mb-0">{error}</Alert>
        ) : hireSession ? (
          <>
            <Card className="mb-3">
              <Card.Header className="bg-light">
                <h6 className="mb-0">📋 Thông Tin Đơn Thuê</h6>
              </Card.Header>
              <Card.Body>
                <Row className="mb-2">
                  <Col md={6}>
                    <strong>Mã đơn:</strong> #{hireSession.id}
                  </Col>
                  <Col md={6}>
                    <strong>Trạng thái:</strong> <Badge bg="info">{hireSession.status}</Badge>
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col md={6}>
                    <strong>Người thuê:</strong> {hireSession.user?.username || 'N/A'}
                  </Col>
                  <Col md={6}>
                    <strong>Email:</strong> {hireSession.user?.email || 'N/A'}
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col md={6}>
                    <strong>Người cung cấp:</strong> {hireSession.ccdv?.username || 'N/A'}
                  </Col>
                  <Col md={6}>
                    <strong>Email CCDV:</strong> {hireSession.ccdv?.email || 'N/A'}
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col md={6}>
                    <strong>Thời gian bắt đầu:</strong> {new Date(hireSession.startTime).toLocaleString('vi-VN')}
                  </Col>
                  <Col md={6}>
                    <strong>Thời gian kết thúc:</strong> {new Date(hireSession.endTime).toLocaleString('vi-VN')}
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col md={6}>
                    <strong>Giá:</strong> {hireSession.totalPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                  </Col>
                  <Col md={6}>
                    <strong>Địa chỉ:</strong> {hireSession.address || 'N/A'}
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {hireSession.userReport && (
              <Card className="mb-3 border-warning">
                <Card.Header className="bg-warning bg-opacity-10">
                  <h6 className="mb-0">⚠️ Phản Hồi Từ Người Cung Cấp Dịch Vụ</h6>
                </Card.Header>
                <Card.Body>
                  <p className="mb-0">{hireSession.userReport}</p>
                </Card.Body>
              </Card>
            )}

            <Card className="bg-light">
              <Card.Header>
                <h6 className="mb-0">ℹ️ Thông Tin Bổ Sung</h6>
              </Card.Header>
              <Card.Body>
                <p className="mb-1">
                  <strong>Ngày tạo đơn:</strong> {new Date(hireSession.createdAt).toLocaleString('vi-VN')}
                </p>
                {hireSession.updatedAt && (
                  <p className="mb-0">
                    <strong>Lần cập nhật cuối:</strong> {new Date(hireSession.updatedAt).toLocaleString('vi-VN')}
                  </p>
                )}
              </Card.Body>
            </Card>
          </>
        ) : null}
      </Modal.Body>
      <Modal.Footer>
        {!loading && hireSession && (
          <>
            <Button variant="secondary" onClick={onClose}>
              Đóng
            </Button>
            <Button variant="danger" onClick={() => setShowRejectModal(true)} className="me-2">
              ✕ Từ Chối
            </Button>
            <Button variant="success" onClick={() => setShowApproveModal(true)}>
              ✓ Duyệt Đánh Giá
            </Button>
          </>
        )}
      </Modal.Footer>

      {/* Modal Xác Nhận Duyệt */}
      <Modal show={showApproveModal} onHide={() => setShowApproveModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác Nhận Duyệt Đánh Giá</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-3">Bạn có chắc chắn muốn duyệt đánh giá này?</p>
          <p className="text-muted mb-2"><strong>Khi duyệt:</strong></p>
          <ul className="text-muted">
            <li>Thông tin phản hồi sẽ được hiển thị ở chi tiết đơn của CCDV</li>
            <li>Số đánh giá sẽ được cập nhật trong hồ sơ CCDV</li>
            <li>Đơn sẽ chuyển sang trạng thái "Đã hoàn thành"</li>
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowApproveModal(false)} disabled={actionLoading}>
            Quay lại
          </Button>
          <Button 
            variant="success" 
            onClick={handleApproveReport} 
            disabled={actionLoading}
          >
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

      {/* Modal Xác Nhận Từ Chối */}
      <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác Nhận Từ Chối Đánh Giá</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-3">Bạn có chắc chắn muốn từ chối đánh giá này?</p>
          <p className="text-muted mb-2"><strong>Khi từ chối:</strong></p>
          <ul className="text-muted">
            <li>Đánh giá sẽ bị xóa</li>
            <li>Đơn sẽ chuyển về trạng thái "Đã hoàn thành"</li>
            <li>Không có thông tin đánh giá nào được ghi nhận</li>
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRejectModal(false)} disabled={actionLoading}>
            Quay lại
          </Button>
          <Button 
            variant="danger" 
            onClick={handleRejectReport} 
            disabled={actionLoading}
          >
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

      {/* Modal Kết Quả */}
      <Modal show={showResultModal} centered backdrop="static" keyboard={false}>
        <Modal.Body className="text-center py-4">
          {resultType === 'success' ? (
            <>
              <div className="display-1 mb-3" style={{ color: '#28a745' }}>✓</div>
              <h5 className="mb-2">Thành Công</h5>
              <p className="text-muted mb-0">{resultMessage}</p>
            </>
          ) : (
            <>
              <div className="display-1 mb-3" style={{ color: '#dc3545' }}>✕</div>
              <h5 className="mb-2">Lỗi</h5>
              <p className="text-muted mb-0">{resultMessage}</p>
            </>
          )}
        </Modal.Body>
      </Modal>
    </Modal>
  );
}