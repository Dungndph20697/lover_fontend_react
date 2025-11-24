import React, { useEffect, useState } from "react";
import "./css/Services.css";
import GuideModal from "./GuideModal";

import {
  Container,
  Card,
  Row,
  Col,
  Button,
  Spinner,
  Badge,
} from "react-bootstrap";
import {
  FaCheckCircle,
  FaRegCircle,
  FaUserFriends,
  FaHeart,
  FaGlobeAsia,
  FaEye,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RegisteredServicesModal from "./RegisteredServicesModal";
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
  const [selected, setSelected] = useState([]);
  const [userServices, setUserServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [activeType, setActiveType] = useState("BASIC");
  const [isNewUser, setIsNewUser] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    document.title = "Dịch vụ của bạn | CCDV";
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const userInfo = await findUserByToken(token);

    try {
      const [allServices, userRegistered] = await Promise.all([
        findAllService(token),
        getUserServices(userInfo.id, token),
      ]);

      setServices(allServices);
      setUserServices(userRegistered);

      if (userRegistered.length === 0) {
        setIsNewUser(true);
        setSelected([]);
      } else {
        const registeredIds = userRegistered.map((item) => item.serviceType?.id);
        setSelected(registeredIds);
        setIsNewUser(false);
      }
    } catch (error) {
      toast.error("Lỗi khi tải dữ liệu, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // 🟩 Lấy giá đã custom của user
  const getCustomPrice = (serviceId) => {
    const item = userServices.find((u) => u.serviceType?.id === serviceId);
    return item?.totalPrice || null;
  };

  // 🟦 Tính phần trăm chênh lệch
  const getPriceDiff = (defaultPrice, customPrice) => {
    if (!customPrice) return 0;
    return (((customPrice - defaultPrice) / defaultPrice) * 100).toFixed(0);
  };

  const handleCheck = (service) => {
    const { id, type } = service;
    if (type === "BASIC") return; // BASIC luôn mặc định
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    const userInfo = await findUserByToken(token);

    setSaving(true);
    try {
      await saveSelectedServices(userInfo.id, selected, token);
      toast.success("✅ Cập nhật dịch vụ thành công!");
      loadData();
    } catch (err) {
      toast.error("❌ " + err);
    } finally {
      setSaving(false);
    }
  };

  const filtered = services.filter((sv) => sv.type === activeType);

  const renderCardList = (list) => {
    if (list.length === 0)
      return <p className="text-muted mt-3">Không có dịch vụ nào.</p>;

    return (
      <Row xs={1} md={2} lg={3} className="g-3 fade-in">
        {list.map((sv) => {
          const checked = selected.includes(sv.id);
          const defaultPrice = sv.pricePerHour;
          const customPrice = getCustomPrice(sv.id);
          const finalPrice = customPrice || defaultPrice;
          const diff = getPriceDiff(defaultPrice, customPrice);

          return (
            <Col key={sv.id}>
              <Card
                className={`service-card shadow-sm ${checked ? "selected" : ""}`}
                onClick={() => handleCheck(sv)}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-3">
                    {checked ? (
                      <FaCheckCircle className="text-success fs-4" />
                    ) : (
                      <FaRegCircle className="text-muted fs-4" />
                    )}

                    <div>
                      <h6 className="fw-bold mb-1 d-flex align-items-center gap-2">
                        {sv.type === "BASIC" && (
                          <FaUserFriends className="text-primary" />
                        )}
                        {sv.type === "FREE" && (
                          <FaHeart className="text-danger" />
                        )}
                        {sv.type === "EXTENDED" && (
                          <FaGlobeAsia className="text-info" />
                        )}
                        {sv.name}
                      </h6>

                      {/*  HIỂN THỊ GIÁ + CHÊNH LỆCH */}
                      {defaultPrice === 0 ? (
                        <small className="text-success fw-bold">Miễn phí</small>
                      ) : (
                        <div>
                          {/* Giá hiện tại */}
                          <div className="fw-bold text-primary">{finalPrice.toLocaleString("vi-VN")}₫ / giờ</div>

                          {/* Giá gốc + chênh lệch */}
                          <div className="text-muted small d-flex align-items-center gap-2">
                            <span>Giá gốc: {defaultPrice.toLocaleString("vi-VN")}₫</span>

                            {/* Nếu có thay đổi giá */}
                            {customPrice && diff != 0 && (
                              <span
                                className={`badge px-2 py-1 ${diff > 0 ? "bg-danger-subtle text-danger" : "bg-success-subtle text-success"
                                  }`}
                                style={{ borderRadius: "6px", fontSize: "0.75rem" }}
                              >
                                {diff > 0 ? "↑ +" : "↓ "}
                                {diff}%
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <Badge
                    bg={
                      sv.type === "BASIC"
                        ? "primary"
                        : sv.type === "FREE"
                          ? "success"
                          : "danger"
                    }
                  >
                    {sv.type === "BASIC"
                      ? "Cơ bản"
                      : sv.type === "FREE"
                        ? "Miễn phí"
                        : "Mở rộng"}
                  </Badge>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
    );
  };

  return (
    <div className="service-page">
      <ToastContainer position="top-right" autoClose={2000} />

      <section className="hero py-5 text-center text-white mb-4">
        <Container>
          <h1 className="fw-bold display-6 mb-2">Dịch vụ của bạn</h1>
          <p className="text-white-50">Quản lý và cập nhật các dịch vụ bạn cung cấp.</p>
          <p className="text-white-50">*Lưu ý: dịch vụ cơ bản là bắt buộc!*</p>
        </Container>
      </section>

      <Container className="pb-5">
        <Card className="border-0 shadow-lg rounded-4 p-4 modern-wrapper">
          <div className="d-flex justify-content-center gap-3 mb-4 flex-wrap">
            {(isNewUser ? ["BASIC"] : ["BASIC", "FREE", "EXTENDED"]).map(
              (type) => (
                <Button
                  key={type}
                  variant={activeType === type ? "primary" : "outline-secondary"}
                  className={`category-btn ${activeType === type ? "active" : ""
                    }`}
                  onClick={() => setActiveType(type)}
                >
                  {type === "BASIC" && " Cơ bản"}
                  {type === "FREE" && " Miễn phí"}
                  {type === "EXTENDED" && " Mở rộng"}
                </Button>
              )
            )}
          </div>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
            </div>
          ) : (
            renderCardList(filtered)
          )}

          <div className="service-actions">
            <Button
              className="modern-btn fw-semibold"
              disabled={saving}
              onClick={handleSave}
            >
              {saving
                ? "Đang xử lý..."
                : isNewUser
                  ? "Cung cấp dịch vụ"
                  : "Lưu thay đổi"}
            </Button>

            {userServices.length > 0 && (
              <button
                className="view-services-btn fw-semibold"
                onClick={() => setShowModal(true)}
              >
                <FaEye className="me-2" />
                sửa giá dịch vụ đã đăng ký
              </button>
            )}
          </div>
        </Card>
      </Container>

      <RegisteredServicesModal
        show={showModal}
        onHide={() => setShowModal(false)}
        services={userServices}
        refresh={loadData}
      />

      <Button
        variant="info"
        className="guide-button"
        onClick={() => setShowGuide(true)}
      >
        💡 Hướng dẫn
      </Button>

      <GuideModal show={showGuide} onHide={() => setShowGuide(false)} />
    </div>
  );
}
