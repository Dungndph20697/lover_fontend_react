import React from "react";
import { Link } from "react-router-dom";

export default function CallToAction() {
  return (
    <section className="py-5 bg-danger text-white text-center">
      <div className="container">
        <h3 className="fw-bold">Bạn muốn được người khác thuê?</h3>
        <p className="mb-4">
          Tạo hồ sơ của bạn, đăng tải ảnh và thông tin để mọi người tìm thấy
          bạn.
        </p>
        <Link to="/register" className="btn btn-light btn-lg">
          Đăng hồ sơ ngay
        </Link>
      </div>
    </section>
  );
}
