import React from "react";
import { Link } from "react-router-dom";

export default function FeaturedLovers({ lovers, currentUser }) {
  return (
    <section className="container my-5">
      <h2 className="text-center fw-bold mb-5 text-danger">
        💕 Top 12 người được thuê nhiều nhất
      </h2>

      <div className="row g-4 justify-content-center">
        {lovers.map((lover) => (
          <div className="col-md-4 col-sm-6 col-12" key={lover.id}>
            <div
              className="card border-0 shadow-lg h-100 position-relative overflow-hidden"
              style={{
                borderRadius: "20px",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 5px 15px rgba(0,0,0,0.1)";
              }}
            >
              <div className="position-relative">
                <img
                  src={lover.avatar}
                  className="card-img-top"
                  alt={lover.fullName}
                  style={{
                    height: "320px",
                    objectFit: "cover",
                    borderTopLeftRadius: "20px",
                    borderTopRightRadius: "20px",
                  }}
                />
                <span
                  className="position-absolute top-0 end-0 m-3 badge bg-danger fs-6"
                  style={{ borderRadius: "10px" }}
                >
                  ❤️ {lover.hireCount}
                </span>
              </div>

              <div className="card-body text-center">
                <h5 className="fw-bold text-dark mb-1">{lover.fullName}</h5>
                <p className="text-muted mb-3">
                  {lover.description || "Đang cập nhật"} 🌆
                </p>
                <Link
                  to={`/profile/${lover.id}`}
                  className="btn btn-outline-danger px-4 py-2 rounded-pill fw-semibold"
                >
                  Xem hồ sơ
                </Link>
                {(!currentUser || currentUser.id !== lover.userId) && (
                  <Link
                    to={`/user/chat?to=${lover.userId}`}
                    className="btn btn-danger px-4 py-2 rounded-pill fw-semibold"
                  >
                    Chat ngay
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
