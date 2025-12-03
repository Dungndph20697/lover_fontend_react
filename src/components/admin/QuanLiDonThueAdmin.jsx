import React, { useState, useEffect } from 'react';
import hireSessionService from '../../service/admin/hireSessionService';
import AdminReviewReportDetail from './AdminReviewReportDetail';
import { Container, Table, Pagination, Alert, Spinner, Button, Modal } from 'react-bootstrap';

const QuanLiDonThueAdmin = () => {
  const [hireSessions, setHireSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(20);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // === NEW STATES FOR MODALS ===
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [selectedApproveId, setSelectedApproveId] = useState(null);

  useEffect(() => {
    loadHireSessions(currentPage);
  }, [currentPage]);

  const loadHireSessions = async (page) => {
    setLoading(true);
    setError(null);
    try {
      const data = await hireSessionService.fetchHireSessions(page, pageSize);
      setHireSessions(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError('Không thể tải danh sách đơn đặt thuê. Vui lòng thử lại.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // === UPDATED handleApprove: mở modal xác nhận ===
  const handleApprove = async (hireSessionId) => {
    setSelectedApproveId(hireSessionId);
    setShowConfirmModal(true);
  };

  // === THỰC HIỆN DUYỆT SAU KHI XÁC NHẬN TRONG MODAL ===
  const confirmApprove = async () => {
    try {
      await hireSessionService.approveHireSession(selectedApproveId);
      setShowConfirmModal(false);
      setShowSuccessModal(true);
      loadHireSessions(currentPage);
    } catch (err) {
      setShowConfirmModal(false);
      setShowErrorModal(true);
    }
  };

  const handleAction = (action, hireSession) => {
    if (action.type === 'reviewReport') {
      setSelectedSessionId(hireSession.id);
      setShowDetailModal(true);
    } else if (action.type === 'approve') {
      handleApprove(hireSession.id);
    }
  };

  const getStatusBadgeVariant = (statusCode) => {
    const statusMap = {
      'PENDING': 'warning',
      'ACCEPTED': 'info',
      'COMPLETED': 'success',
      'REVIEW_REPORT': 'danger',
    };
    return statusMap[statusCode] || 'secondary';
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(0, currentPage - 2);
    let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(0, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <Container className="py-4">
      <div className="mb-4">
        <h1 className="fw-bold">Quản Lý Đơn Đặt Thuê</h1>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </Spinner>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead className="table-light">
                <tr>
                  <th>STT</th>
                  <th>Tên Người Cung Cấp</th>
                  <th>Tên Người Thuê</th>
                  <th>Ngày</th>
                  <th>Tổng Đơn</th>
                  <th>Trạng Thái</th>
                  <th>Duyệt đánh giá</th>
                </tr>
              </thead>
              <tbody>
                {hireSessions.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center text-muted py-4">
                      Không có dữ liệu
                    </td>
                  </tr>
                ) : (
                  hireSessions.map((session) => {
                    const actions = hireSessionService.getActions(session);
                    return (
                      <tr key={session.id}>
                        <td>{session.stt}</td>
                        <td>{session.providerName}</td>
                        <td>{session.userName}</td>
                        <td>{session.date}</td>
                        <td className="text-success fw-bold">{session.totalPrice}</td>
                        <td className="text-center">
                          <span className={`badge bg-${getStatusBadgeVariant(session.statusCode)}`}>
                            {session.statusDisplay}
                          </span>
                        </td>
                        <td className="text-center">
                          {actions.length > 0 ? (
                            <div className="d-flex gap-2 justify-content-center flex-wrap">
                              {actions.map((action, index) => {
                                let variant =
                                  action.type === 'reviewReport' ? 'danger' : 'success';
                                return (
                                  <Button
                                    key={index}
                                    size="sm"
                                    variant={variant}
                                    onClick={() => handleAction(action, session)}
                                  >
                                    {action.label}
                                  </Button>
                                );
                              })}
                            </div>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </Table>
          </div>

          <div className="d-flex justify-content-center">
            <Pagination>
              <Pagination.First disabled={currentPage === 0} onClick={() => setCurrentPage(0)} />
              <Pagination.Prev disabled={currentPage === 0} onClick={() => setCurrentPage(currentPage - 1)} />

              {getPageNumbers().map((page) => (
                <Pagination.Item key={page} active={currentPage === page} onClick={() => setCurrentPage(page)}>
                  {page + 1}
                </Pagination.Item>
              ))}

              <Pagination.Next
                disabled={currentPage === totalPages - 1}
                onClick={() => setCurrentPage(currentPage + 1)}
              />
              <Pagination.Last
                disabled={currentPage === totalPages - 1}
                onClick={() => setCurrentPage(totalPages - 1)}
              />
            </Pagination>
          </div>
        </>
      )}

      {selectedSessionId && (
        <AdminReviewReportDetail
          hireSessionId={selectedSessionId}
          show={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedSessionId(null);
          }}
          onRefresh={() => loadHireSessions(currentPage)}
        />
      )}

      {/* === MODAL XÁC NHẬN === */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận duyệt đơn</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc chắn muốn duyệt đơn này?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Hủy
          </Button>
          <Button variant="success" onClick={confirmApprove}>
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>

      {/* === MODAL THÀNH CÔNG === */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>Thành công</Modal.Title>
        </Modal.Header>
        <Modal.Body>Duyệt đơn thành công.</Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setShowSuccessModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>

      {/* === MODAL LỖI === */}
      <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)} centered>
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>Lỗi</Modal.Title>
        </Modal.Header>
        <Modal.Body>Đã xảy ra lỗi khi duyệt đơn. Vui lòng thử lại.</Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setShowErrorModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default QuanLiDonThueAdmin;
