import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./css/profileDetail.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import HireModal from "./HireModal";
import { getUserStatus } from "../../service/user/userActiviApi";
import {
  loadCcdvDetail,
  loadDichVuByCcdvId,
} from "../../service/user/LoadCcdvDetail";
import { Link } from "react-router-dom";

export default function ProfileDetail() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [services, setServices] = useState([]);
  const [showHireModal, setShowHireModal] = useState(false);
  const [activity, setActivity] = useState(null);

  // Load trạng thái hoạt động
  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return "Không xác định";

    const diffMs = new Date() - new Date(timestamp);
    const diffMin = Math.floor(diffMs / 60000);

    if (diffMin < 1) return "Vừa xong";
    if (diffMin < 60) return `${diffMin} phút trước`;

    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour} giờ trước`;

    return new Date(timestamp).toLocaleString("vi-VN");
  };

  // load trạng thái hoạt động
  useEffect(() => {
    if (!profile) return;

    const loadActivity = async () => {
      try {
        console.log("📌 Gọi API getUserStatus với userId =", profile.user.id);

        const data = await getUserStatus(profile.user.id);

        console.log("📌 Kết quả trả về:", data);
        setActivity(data);
      } catch (err) {
        console.error("❌ Lỗi khi gọi API trạng thái hoạt động:", err);
      }
    };

    loadActivity();
  }, [profile]);

  // Load profile
  useEffect(() => {
    const fetchProfile = async () => {
      const data = await loadCcdvDetail(id);
      setProfile(data);
    };
    fetchProfile();
  }, [id]);

  // Load dịch vụ CCDV
  useEffect(() => {
    const fetchServices = async () => {
      const data = await loadDichVuByCcdvId(id);
      setServices(data);
    };
    fetchServices();
  }, [id]);

  if (!profile) return <div className="text-center mt-5">Đang tải...</div>;

  return (
    <>
      <Header />

      <div className="container py-5">
        {/* Ảnh đại diện */}
        <div className="text-center">
          <img
            src={profile.avatar}
            alt="avatar"
            className="avatar-main shadow-lg"
          />
          <h2 className="mt-3">{profile.fullName}</h2>
          <p className="text-muted">
            {profile.city} • {profile.nationality}
          </p>
        </div>

        {/* Thông tin cá nhân */}
        <div className="row mt-5">
          <div className="col-md-6">
            <div className="card shadow-sm p-4">
              <h4>Thông tin cá nhân</h4>
              <hr />
              <p>
                <strong>Năm sinh:</strong> {profile.yearOfBirth}
              </p>
              <p>
                <strong>Giới tính:</strong> {profile.gender}
              </p>
              <p>
                <strong>Chiều cao:</strong> {profile.height} cm
              </p>
              <p>
                <strong>Cân nặng:</strong> {profile.weight} kg
              </p>
              <p>
                <strong>Sở thích:</strong> {profile.hobbies}
              </p>
            </div>
          </div>

          {/* Thông tin liên hệ */}
          <div className="col-md-6">
            <div className="card shadow-sm p-4">
              <h4>Liên hệ</h4>
              <hr />
              <p>
                <strong>Email:</strong> {profile.user.email}
              </p>
              <p>
                <strong>Số điện thoại:</strong> {profile.user.phone}
              </p>
              <p>
                <strong>Facebook:</strong>{" "}
                <a href={profile.facebookLink} target="_blank" rel="noreferrer">
                  {profile.facebookLink}
                </a>
              </p>
              <p>
                <strong>Số lần được thuê:</strong> {profile.hireCount}
              </p>
              <p>
                <strong>Trạng thái hoạt động: </strong>

                {!activity && <span>Đang tải...</span>}

                {activity && (
                  <> // sửa lại
                    {activity.status === "Đang hoạt động" ? (
                      <span className="text-success fw-bold">🟢 Đang hoạt động</span>
                    ) : (
                      <span className="text-muted">
                        🔴 Không hoạt động — {formatTimeAgo(activity.lastActivity)}
                      </span>
                    )}
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Ảnh chân dung */}
        <h3 className="mt-5 text-center">Ảnh chân dung</h3>
        <div className="row mt-3 g-3">
          {[profile.portrait1, profile.portrait2, profile.portrait3].map(
            (img, index) =>
              img && (
                <div className="col-md-4" key={index}>
                  <img src={img} className="portrait-img shadow-sm" alt="" />
                </div>
              )
          )}
        </div>

        {/* ===================== */}
        {/*      DỊCH VỤ CCDV     */}
        {/* ===================== */}

        <h3 className="mt-5 text-center">Dịch vụ đang cung cấp</h3>

        <div className="row mt-4">
          {services.length > 0 ? (
            services.map((s) => (
              <div className="col-md-4 mb-4" key={s.id}>
                <div className="card p-3 shadow-sm service-card">
                  <h5 className="fw-bold">{s.serviceType.name}</h5>

                  <p className="text-secondary mb-1">
                    <strong>Loại dịch vụ:</strong> {s.serviceType.type}
                  </p>

                  <p className="text-danger fw-bold mt-2">
                    {Number(s.totalPrice).toLocaleString("vi-VN")} ₫
                  </p>

                  {s.serviceType.pricePerHour && (
                    <p className="text-muted">
                      <small>
                        Giá theo giờ:{" "}
                        {Number(s.serviceType.pricePerHour).toLocaleString(
                          "vi-VN"
                        )}{" "}
                        ₫/giờ
                      </small>
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted">
              Người này chưa đăng ký dịch vụ nào.
            </p>
          )}
        </div>

        {/* Mô tả */}
        <div className="card shadow-sm p-4 mt-5">
          <h4>Mô tả</h4>
          <hr />
          <p>{profile.description}</p>
        </div>

        {/* Yêu cầu */}
        <div className="card shadow-sm p-4 mt-4">
          <h4>Yêu cầu dành cho khách hàng</h4>
          <hr />
          <p>{profile.requirement}</p>
        </div>

        {/* Nút thuê */}
        <div className="text-center mt-5">
          <button
            className="btn btn-danger px-4 py-2"
            onClick={() => setShowHireModal(true)}
          >
            Thuê ngay ❤️
          </button>
          <Link
            to={`/user/chat?to=${id}`}
            className="btn btn-danger px-4 py-2 rounded-pill fw-semibold"
          >
            Chat ngay
          </Link>
        </div>
      </div >
      <HireModal
        show={showHireModal}
        onClose={() => setShowHireModal(false)}
        ccdvId={profile.user.id}
      />
      <Footer />
    </>
  );
}
