import React from "react";

export default function HeroSection() {
  return (
    <section className="text-center py-5 bg-light">
      <div className="container">
        <h1 className="fw-bold display-5">
          Kết nối – Trò chuyện –{" "}
          <span className="text-danger">Tìm tình yêu</span>
        </h1>
        <p className="text-muted mt-3 mx-auto w-75">
          Lover giúp bạn tìm người yêu tạm thời, người trò chuyện tâm sự, hoặc
          đối tác cho những buổi hẹn hò nhẹ nhàng.
        </p>

        <div className="input-group mt-4 w-75 mx-auto shadow-sm">
          <input
            type="text"
            className="form-control"
            placeholder="Tìm người yêu theo tên, thành phố..."
          />
          <button className="btn btn-danger">Tìm kiếm</button>
        </div>
      </div>
    </section>
  );
}
