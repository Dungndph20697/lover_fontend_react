import React, { useEffect, useState } from "react";
import {
  Container,
  Tabs,
  Tab,
  Table,
  Spinner,
  Badge,
  Card,
  Button,
} from "react-bootstrap";
import {
  findAllService,
  saveSelectedServices,
  getUserServices,
} from "../../service/ccdv/serviceApi";
import { findUserByToken } from "../../service/user/login.js";

export default function ServiceTypeList() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState([]); // lưu id của checkbox đang chọn
  const [userServices, setUserServices] = useState([]);
  const [key, setKey] = useState("BASIC");

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    document.title = "Danh sách dịch vụ | CCDV";
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const userInfo = await findUserByToken(token);
    console.log("User info:", userInfo);
    try {
      const [allServices, userRegistered] = await Promise.all([
        findAllService(token),
        getUserServices(userInfo.id, token),
      ]);
      setServices(allServices);
      setUserServices(userRegistered);

      // ✅ Tự động tích checkbox với những dịch vụ user đã có
      const registeredIds = userRegistered.map((item) => item.serviceType?.id);
      setSelected(registeredIds);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheck = (service) => {
    const { id, type } = service;
    if (type === "BASIC") return;

    setSelected((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((s) => s !== id)
        : [...prev, id];

      // ✅ Cập nhật bảng bên dưới ngay khi người dùng thay đổi checkbox
      const updatedServices = services.filter(
        (sv) => updated.includes(sv.id) || sv.type === "BASIC" // BASIC luôn được coi là mặc định
      );
      const mapped = updatedServices.map((sv) => ({
        id: sv.id,
        serviceType: sv,
        totalPrice: sv.pricePerHour,
      }));
      setUserServices(mapped);
      return updated;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const userInfo = await findUserByToken(token);
      console.log("User info:", userInfo);
      await saveSelectedServices(userInfo.id, selected, token);
      alert("✅ Lưu dịch vụ thành công!");
      loadData(); // reload lại danh sách từ DB
    } catch (err) {
      alert("❌ " + err);
    } finally {
      setSaving(false);
    }
  };

  const renderPrice = (price) =>
    price === 0 ? (
      <Badge bg="success">FREE</Badge>
    ) : (
      price.toLocaleString("vi-VN") + "₫/giờ"
    );

  const renderTable = (type) => {
    const filtered = services.filter((sv) => sv.type === type);
    if (filtered.length === 0)
      return <p className="text-muted mt-3">Không có dịch vụ nào.</p>;

    return (
      <Table hover responsive className="modern-table align-middle mt-3">
        <thead>
          <tr>
            <th>#</th>
            <th>Tên dịch vụ</th>
            <th>Loại</th>
            <th>Giá / giờ</th>
            <th className="text-center">Chọn</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((sv, idx) => (
            <tr key={sv.id}>
              <td>{idx + 1}</td>
              <td className="fw-semibold">{sv.name}</td>
              <td>
                {sv.type === "BASIC" && <Badge bg="primary">Cơ bản</Badge>}
                {sv.type === "FREE" && <Badge bg="success">Miễn phí</Badge>}
                {sv.type === "EXTENDED" && <Badge bg="danger">Mở rộng</Badge>}
              </td>
              <td>{renderPrice(Number(sv.pricePerHour))}</td>
              <td className="text-center">
                <input
                  type="checkbox"
                  disabled={sv.type === "BASIC"}
                  checked={selected.includes(sv.id)}
                  onChange={() => handleCheck(sv)}
                  style={{ width: 20, height: 20, cursor: "pointer" }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  return (
    <div className="service-type-page">
      <section className="hero py-5 text-center text-white mb-4">
        <Container>
          <h1 className="fw-bold display-6 mb-2">Danh sách dịch vụ CCDV</h1>
          <p className="text-white-50">
            Chọn các dịch vụ bạn muốn thêm hoặc bỏ tích để hủy.
          </p>
        </Container>
      </section>

      <Container className="pb-5">
        <Card className="border-0 shadow-lg rounded-4 p-3">
          <Tabs
            id="service-tabs"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="modern-tabs"
          >
            <Tab eventKey="BASIC" title="🌿 Dịch vụ cơ bản">
              {loading ? <Spinner animation="border" /> : renderTable("BASIC")}
            </Tab>
            <Tab eventKey="FREE" title="💎 Dịch vụ miễn phí">
              {loading ? <Spinner animation="border" /> : renderTable("FREE")}
            </Tab>
            <Tab eventKey="EXTENDED" title="🔥 Dịch vụ mở rộng">
              {loading ? (
                <Spinner animation="border" />
              ) : (
                renderTable("EXTENDED")
              )}
            </Tab>
          </Tabs>

          <div className="text-center mt-4">
            <Button
              className="px-4 py-2 fw-semibold modern-btn"
              disabled={saving}
              onClick={handleSave}
            >
              {saving ? "Đang lưu..." : "💾 Xác nhận lưu dịch vụ"}
            </Button>
          </div>

          {userServices.length > 0 && (
            <div className="mt-5">
              <h5 className="fw-bold text-primary mb-3">
                📋 Dịch vụ bạn đã đăng ký
              </h5>
              <Table bordered hover responsive className="modern-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Tên dịch vụ</th>
                    <th>Loại</th>
                    <th>Giá</th>
                  </tr>
                </thead>
                <tbody>
                  {userServices.map((item, idx) => (
                    <tr key={item.id}>
                      <td>{idx + 1}</td>
                      <td>{item.serviceType?.name}</td>
                      <td>
                        {item.serviceType?.type === "BASIC" && (
                          <Badge bg="primary">Cơ bản</Badge>
                        )}
                        {item.serviceType?.type === "FREE" && (
                          <Badge bg="success">Miễn phí</Badge>
                        )}
                        {item.serviceType?.type === "EXTENDED" && (
                          <Badge bg="danger">Mở rộng</Badge>
                        )}
                      </td>
                      <td>{item.totalPrice?.toLocaleString("vi-VN") || 0}₫</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card>
      </Container>

      <style>{`
        .hero {
          background: radial-gradient(circle at 10% 10%, #6a82fb 0%, #fc5c7d 60%, #ffb27f 100%);
          border-radius: 1.5rem;
          box-shadow: 0 30px 80px rgba(252, 92, 125, 0.25);
        }
        .modern-btn {
          background: linear-gradient(90deg, #6a82fb 0%, #fc5c7d 100%);
          border: none;
          border-radius: 1rem;
          box-shadow: 0 3px 15px rgba(252, 92, 125, 0.4);
          transition: 0.3s ease;
        }
        .modern-btn:hover {
          opacity: 0.9;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
