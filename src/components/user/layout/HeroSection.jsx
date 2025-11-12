import React from "react";

export default function HeroSection() {
  return (
    <section
      className="hero-section d-flex align-items-center text-center text-white position-relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1600&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "80vh",
      }}
    >
      {/* Overlay */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          background: "linear-gradient(rgba(0,0,0,0.5), rgba(255,0,80,0.5))",
          zIndex: 0,
        }}
      ></div>

      {/* Content */}
      <div className="container position-relative" style={{ zIndex: 1 }}>
        <h1 className="fw-bold display-4 mb-3">
          Kết nối – Trò chuyện –{" "}
          <span className="text-danger bg-white bg-opacity-75 px-2 rounded">
            Tìm tình yêu
          </span>
        </h1>
        <p className="lead text-light mx-auto w-75 mb-4">
          ❤️ Lover giúp bạn tìm người đồng hành, chia sẻ cảm xúc và trải nghiệm
          những buổi hẹn hò đầy thú vị.
        </p>

        {/* Ô tìm kiếm */}
        <div className="d-flex justify-content-center">
          <div
            className="input-group w-75 w-md-50 shadow-lg"
            style={{ borderRadius: "50px", overflow: "hidden", maxWidth: 600 }}
          >
            <input
              type="text"
              className="form-control border-0 py-3 px-4"
              placeholder="🔍 Tìm người yêu theo tên, thành phố..."
              style={{
                borderTopLeftRadius: "50px",
                borderBottomLeftRadius: "50px",
              }}
            />
            <button
              className="btn btn-danger px-4 fw-semibold"
              style={{
                borderTopRightRadius: "50px",
                borderBottomRightRadius: "50px",
              }}
            >
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
