import React, { useState, useEffect } from "react";
import revenueService from "../../service/admin/revenueService";
import hireSessionService from "../../service/admin/hireSessionService";
import {
  Container,
  Table,
  Alert,
  Spinner,
  Card,
  Row,
  Col,
} from "react-bootstrap";

const AdminRevenueList = () => {
  const [revenues, setRevenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    loadRevenues();
  }, []);

  const loadRevenues = async () => {
    setLoading(true);
    setError(null);
    try {
      // Lấy danh sách tất cả CCDV từ hire sessions
      const hireSessionsData = await hireSessionService.fetchHireSessions(
        0,
        1000
      );

      // Lấy danh sách CCDV unique
      const ccdvSet = new Set();
      const ccdvList = [];

      hireSessionsData.content.forEach((session) => {
        if (session.ccdv && !ccdvSet.has(session.ccdv.id)) {
          ccdvSet.add(session.ccdv.id);
          ccdvList.push(session.ccdv);
        }
      });

      console.log("CCDV List:", ccdvList);

      // Lấy doanh thu của từng CCDV
      const revenueData = await revenueService.fetchRevenuesByCcdvList(
        ccdvList
      );

      // Map với STT
      const mappedRevenues = revenueData.map((item, index) => ({
        ...item,
        stt: index + 1,
      }));

      setRevenues(mappedRevenues);

      // Tính tổng doanh thu
      const total = revenueService.calculateTotalRevenue(mappedRevenues);
      setTotalRevenue(total);

      console.log("Revenues:", mappedRevenues);
      console.log("Total Revenue:", total);
    } catch (err) {
      setError("Không thể tải doanh thu. Vui lòng thử lại.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <div className="mb-4">
        <h1 className="fw-bold">💰 Doanh Thu Idol</h1>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Thống kê tổng quan */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="shadow-sm border-0">
            <Card.Body className="text-center">
              <h6 className="text-muted mb-2">Tổng Doanh Thu</h6>
              <h2 className="text-success fw-bold">
                {totalRevenue.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm border-0">
            <Card.Body className="text-center">
              <h6 className="text-muted mb-2">Số CCDV</h6>
              <h2 className="text-primary fw-bold">{revenues.length}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </Spinner>
        </div>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead className="table-light">
              <tr>
                <th>STT</th>
                <th>Tên Idol</th>
                <th>Email</th>
                <th>Doanh Thu</th>
              </tr>
            </thead>
            <tbody>
              {revenues.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-muted py-4">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                revenues.map((revenue) => (
                  <tr key={revenue.ccdvId}>
                    <td>{revenue.stt}</td>
                    <td className="fw-bold">{revenue.ccdvName}</td>
                    <td>{revenue.ccdvEmail}</td>
                    <td className="text-success fw-bold">
                      {revenue.formattedAmount}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  );
};

export default AdminRevenueList;
