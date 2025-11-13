import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PersonalInfoForm from "./PersonalProfile";
import { getProfileByUserId } from "../../service/ccdvProfileService/ccdvProfileService";
import "bootstrap/dist/css/bootstrap.min.css";

export default function UserInfo() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!userData || !token) {
      setLoading(false);
      return;
    }

    const user = JSON.parse(userData);

    getProfileByUserId(user.id, token)
      .then((data) => {
        setProfile(data);
        localStorage.setItem(`ccdvProfile_${user.id}`, JSON.stringify(data));
      })
      .catch((err) => console.error("Lỗi lấy CCDV profile:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleGoToProfile = () => {
    navigate("/ccdv-profile-edit");
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  return (
    <div className="container py-4">
      {profile ? (
        <div className="card shadow-sm p-4">
          <div className="d-flex flex-column flex-md-row align-items-center mb-4">
            {profile.avatar && (
              <img
                src={profile.avatar}
                alt="Avatar"
                className="rounded-circle border border-pink mb-3 mb-md-0"
                style={{ width: "150px", height: "150px", objectFit: "cover", borderColor: "#ff69b4" }}
              />
            )}
            <div className="ms-md-4 text-center text-md-start">
              <h3 className="text-danger fw-bold mb-2">💕 {profile.fullName} 💕</h3>
              <p className="mb-1"><strong>Tuổi:</strong> {profile.yearOfBirth}</p>
              <p className="mb-1"><strong>Giới tính:</strong> {profile.gender}</p>
              <p className="mb-1"><strong>Thành phố:</strong> {profile.city}</p>
              <p className="mb-1"><strong>Quốc tịch:</strong> {profile.nationality}</p>
            </div>
          </div>

          <hr />

          <div className="row mb-3">
            <div className="col-md-6 mb-2">
              <p><strong>Chiều cao:</strong> {profile.height} cm</p>
            </div>
            <div className="col-md-6 mb-2">
              <p><strong>Cân nặng:</strong> {profile.weight} kg</p>
            </div>
            <div className="col-md-6 mb-2">
              <p><strong>Sở thích:</strong> {profile.hobbies || "Chưa cập nhật"}</p>
            </div>
            <div className="col-md-6 mb-2">
              <p><strong>Yêu cầu:</strong> {profile.requirement || "Chưa cập nhật"}</p>
            </div>
          </div>

          <p><strong>Mô tả:</strong> {profile.description || "Chưa cập nhật"}</p>
          <p>
            <strong>Facebook:</strong>{" "}
            {profile.facebookLink ? (
              <a href={profile.facebookLink} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                {profile.facebookLink}
              </a>
            ) : (
              "Chưa cập nhật"
            )}
          </p>

          <div className="text-center mt-4">
            <button className="btn btn-danger btn-lg" onClick={handleGoToProfile}>
              Sửa thông tin
            </button>
          </div>
        </div>
      ) : (
        <PersonalInfoForm setProfile={setProfile} />
      )}
    </div>
  );
}