import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProviderDetail } from "../../service/user/home";

export default function ProviderDetail() {
  const { id } = useParams();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]); // 👈 Quan trọng: khi id trên URL đổi → API gọi lại

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getProviderDetail(id);
      setProvider(res);
    } catch (err) {
      console.error("❌ Lỗi tải chi tiết:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-5">⏳ Đang tải thông tin...</div>;
  }

  if (!provider) {
    return <div className="text-center text-danger mt-5">
      ❌ Không tìm thấy thông tin dịch vụ!
    </div>;
  }

  return (
    <div className="container my-5">

      {/* Ảnh chính */}
      <div className="text-center mb-4">
        <img
          src={provider.avatar}
          className="shadow-lg"
          style={{
            width: "70%",
            maxHeight: "420px",
            objectFit: "cover",
            borderRadius: "20px",
          }}
          alt="avatar"
        />
      </div>

      {/* Tên + tuổi */}
      <h1 className="fw-bold text-center mb-1">
        {provider.fullName}
        {provider.yearOfBirth && (
          <span className="text-danger ms-3 fs-4">
            ❤️ {2025 - provider.yearOfBirth} tuổi
          </span>
        )}
      </h1>

      <p className="text-center text-muted mb-4">
        {provider.city} • {provider.nationality}
      </p>

      {/* --- THÔNG TIN CHI TIẾT --- */}
      <div className="card shadow-lg border-0 p-4" style={{ borderRadius: "20px" }}>
        <h3 className="fw-bold mb-3 text-danger">📌 Thông tin cá nhân</h3>

        <div className="row mb-3">
          <div className="col-md-6 mb-2">
            <strong>Giới tính:</strong> {provider.gender}
          </div>
          <div className="col-md-6 mb-2">
            <strong>Năm sinh:</strong> {provider.yearOfBirth}
          </div>
          <div className="col-md-6 mb-2">
            <strong>Chiều cao:</strong> {provider.height} cm
          </div>
          <div className="col-md-6 mb-2">
            <strong>Cân nặng:</strong> {provider.weight} kg
          </div>
        </div>

        <h4 className="fw-bold mt-4">✨ Sở thích</h4>
        <p>{provider.hobbies}</p>

        <h4 className="fw-bold mt-4">📝 Mô tả bản thân</h4>
        <p>{provider.description}</p>

        <h4 className="fw-bold mt-4">⚠ Yêu cầu dành cho người thuê</h4>
        <p>{provider.requirement}</p>

        <h4 className="fw-bold mt-4">📅 Tham gia từ</h4>
        <p>{provider.joinDate?.substring(0, 10)}</p>

        <h4 className="fw-bold mt-4">🔥 Số lượt thuê</h4>
        <p>{provider.hireCount} lần</p>

        {provider.facebookLink && (
          <a
            href={provider.facebookLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary mt-3 w-100 fw-bold"
            style={{ borderRadius: "15px", fontSize: "18px" }}
          >
            ⭐ Xem Facebook
          </a>
        )}
      </div>

      {/* --- 3 ẢNH CHÂN DUNG --- */}
      <h3 className="fw-bold text-danger mt-5">📷 Ảnh chân dung</h3>

      <div className="row mt-3 g-4">
        {[provider.portrait1, provider.portrait2, provider.portrait3].map(
          (img, index) =>
            img && (
              <div className="col-md-4 col-sm-6 col-12" key={index}>
                <img
                  src={img}
                  className="w-100 shadow"
                  style={{
                    height: "300px",
                    objectFit: "cover",
                    borderRadius: "15px",
                  }}
                  alt={`portrait-${index}`}
                />
              </div>
            )
        )}
      </div>

      {/* --- NÚT THUÊ --- */}
      <div className="text-center mt-5">
        <button
          className="btn btn-danger px-5 py-3 fw-bold"
          style={{ borderRadius: "30px", fontSize: "20px" }}
        >
          💌 Thuê ngay
        </button>
      </div>
    </div>
  );
}
