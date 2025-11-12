import React from "react";
import PersonalInfoForm from "./PersonalProfile";

export default function UserInfo() {
  return (
    <div>
      <h3 className="text-danger mb-3">Thông tin cá nhân</h3>
      <p>Hiển thị form chỉnh sửa thông tin người dùng ở đây...</p>
      <PersonalInfoForm />
    </div>
  );
}
