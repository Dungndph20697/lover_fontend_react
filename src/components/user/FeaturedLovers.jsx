import React from "react";
import { Link } from "react-router-dom";

export default function FeaturedLovers({ lovers }) {
  return (
    <section className="container my-5">
      <h3 className="text-center mb-4 fw-semibold">💕 Gợi ý nổi bật</h3>
      <div className="row g-4">
        {lovers.map((lover) => (
          <div className="col-md-4" key={lover.id}>
            <div className="card border-0 shadow h-100 text-center">
              <img
                src={lover.image}
                className="card-img-top"
                alt={lover.name}
                style={{ height: "300px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h5 className="card-title fw-bold">{lover.name}</h5>
                <p className="card-text text-muted">
                  {lover.age} tuổi – {lover.city}
                </p>
                <Link to={`/lover/${lover.id}`} className="btn btn-danger">
                  Xem hồ sơ
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
