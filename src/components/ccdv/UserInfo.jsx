import React, { useState, useEffect } from "react";
import PersonalInfoForm from "./PersonalProfile";
import { getProfileByUserId } from "../../service/ccdvProfileService/ccdvProfileService";

export default function UserInfo() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

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
        localStorage.setItem(`ccdvProfile_${user.id}`, JSON.stringify(data)); // optional cache
      })
      .catch((err) => {
        console.error("Lỗi lấy CCDV profile:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Đang tải...</p>;

  return (
    <div className="w-100 h-auto">
      {profile ? (
        <div className="card p-4 shadow-sm">
          <h4 className="text-danger fw-bold mb-3">
            💕 Thông tin cá nhân của bạn 💕
          </h4>
          <p><strong>Họ tên:</strong> {profile.fullName}</p>
          <p><strong>Năm sinh:</strong> {profile.yearOfBirth}</p>
          <p><strong>Giới tính:</strong> {profile.gender}</p>
          <p><strong>Thành phố:</strong> {profile.city}</p>
          <p><strong>Quốc tịch:</strong> {profile.nationality}</p>
          <p><strong>Chiều cao:</strong> {profile.height} cm</p>
          <p><strong>Cân nặng:</strong> {profile.weight} kg</p>
          <p><strong>Sở thích:</strong> {profile.hobbies}</p>
          <p><strong>Mô tả:</strong> {profile.description}</p>
          <p><strong>Yêu cầu:</strong> {profile.requirement}</p>
          <p><strong>Facebook:</strong> <a href={profile.facebookLink}>{profile.facebookLink}</a></p>

          {profile.avatar && (
            <div className="text-center mt-3">
              <img
                src={profile.avatar}
                alt="Avatar"
                style={{
                  width: "150px",
                  borderRadius: "50%",
                  border: "3px solid pink",
                }}
              />
            </div>
          )}
        </div>
      ) : (
        <PersonalInfoForm setProfile={setProfile} />
      )}
    </div>
  );
}