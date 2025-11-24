import React from "react";
import { Link } from "react-router-dom";

export default function CcdvListItemIntimateGesture({ list = [] }) {
    return (
        <section className="container my-5">
            <h2 className="text-center fw-bold mb-4 text-danger">
                🔥 Gợi ý thân mật dành riêng cho bạn
            </h2>

            <div className="row g-4">
                {list.map((item) => (
                    <div className="col-md-3 col-sm-6 col-12" key={item.id}>
                        <div className="card border-0 shadow-lg h-100 position-relative overflow-hidden"
                            style={{ borderRadius: "20px" }}
                        >
                            <div className="position-relative">
                                <img
                                    src={item.avatar}
                                    className="card-img-top"
                                    alt={item.fullName}
                                    style={{
                                        height: "260px",
                                        objectFit: "cover",
                                        borderTopLeftRadius: "20px",
                                        borderTopRightRadius: "20px",
                                    }}
                                />

                                {item.vip && (
                                    <span className="position-absolute top-0 start-0 m-3 badge bg-warning text-dark fs-6">
                                        ⭐ VIP
                                    </span>
                                )}

                                <span className="position-absolute top-0 end-0 m-3 badge bg-danger fs-6">
                                    ❤️ {item.hireCount}
                                </span>
                            </div>

                            <div className="card-body text-center">
                                <h5 className="fw-bold text-dark mb-1">{item.fullName}</h5>

                                <p className="text-muted small mb-2">
                                    {item.description || "Đang cập nhật..."}
                                </p>

                                {/* 3 dịch vụ random */}
                                <div className="mb-3">
                                    {item.services?.length > 0 ? (
                                        item.services.map((s) => (
                                            <div key={s.serviceId} className="text-muted small">
                                                • {s.serviceName} –{" "}
                                                <span className="text-danger fw-bold">
                                                    {s.pricePerHour.toLocaleString()}₫/h
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-muted small">Chưa có dịch vụ</div>
                                    )}
                                </div>

                                <Link
                                    to={`/profile/${item.id}`}
                                    className="btn btn-outline-danger px-3 py-2 rounded-pill fw-semibold me-2"
                                >
                                    Xem hồ sơ
                                </Link>

                                <Link
                                    to={`/user/chat?to=${item.id}`}
                                    className="btn btn-danger px-3 py-2 rounded-pill fw-semibold"
                                >
                                    Chat
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}