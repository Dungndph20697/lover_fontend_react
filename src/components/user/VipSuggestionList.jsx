import React, { useEffect, useState } from "react";
import { getVipSuggestions } from "../../service/vip-suggestion/vipSuggestion";
import { Link } from "react-router-dom";

export default function VipSuggestionList() {
    const [vipList, setVipList] = useState([]);

    useEffect(() => {
        getVipSuggestions().then((data) => {
            console.log(data);
            setVipList(data);
        });
    }, []);

    return (
        <div className="container my-5">
            <h2 className="text-center fw-bold mb-5 text-primary">
                🌟 Gợi ý người cung cấp VIP
            </h2>

            <div className="row g-4 justify-content-center">
                {vipList.map((vip) => (
                    <div className="col-md-4 col-sm-6 col-12" key={vip.profileId}>
                        <div
                            className="card border-0 shadow-lg h-100 position-relative overflow-hidden"
                            style={{
                                borderRadius: "20px",
                                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-8px)";
                                e.currentTarget.style.boxShadow =
                                    "0 10px 25px rgba(0,0,0,0.2)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow =
                                    "0 5px 15px rgba(0,0,0,0.1)";
                            }}
                        >
                            {/* Ảnh */}
                            <div className="position-relative">
                                <img
                                    src={
                                        vip.avatar ||
                                        "https://via.placeholder.com/300x200?text=No+Image"
                                    }
                                    className="card-img-top"
                                    alt={vip.name}
                                    style={{
                                        height: "540px",
                                        objectFit: "cover",
                                        borderTopLeftRadius: "20px",
                                        borderTopRightRadius: "20px",
                                    }}
                                />
                            </div>

                            {/* Body */}
                            <div className="card-body text-center">
                                {/* Tên */}
                                <h5 className="fw-bold text-dark mb-2">{vip.name}</h5>

                                {/* Mô tả */}
                                <p className="text-muted mb-3">
                                    {vip.description || "Đang cập nhật"} 🌟
                                </p>

                                {/* Dịch vụ */}
                                <p>
                                    {vip.services?.length > 0 ? (
                                        vip.services.map((s, idx) => (
                                            <span
                                                key={idx}
                                                className="badge bg-primary me-1 mb-1"
                                            >
                                                {s.name} 
                                                {/* ({s.pricePerHour || "Đang cập nhật"}đ / giờ) */}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-muted">Không có dịch vụ</span>
                                    )}
                                </p>

                                {/* Giá */}
                                {/* <p className="fw-bold fs-5 text-danger mt-2">
                                    {vip.startingPricePerHour
                                        ? `${vip.startingPricePerHour}đ / giờ`
                                        : "Giá đang cập nhật"}
                                </p> */}
                                <p className="fw-bold fs-6 text-danger mt-1">
                                    Tổng giá dịch vụ: {vip.totalPrice || "Đang cập nhật"} đ
                                </p>

                                {/* Button */}
                                <div className="mt-3">
                                    <Link
                                        to={`/profile/${vip.userId}`}
                                        className="btn btn-outline-primary px-4 py-2 rounded-pill fw-semibold me-2"
                                    >
                                        Xem hồ sơ
                                    </Link>
                                    <Link
                                        to={`/user/chat?to=${vip.userId}`}
                                        className="btn btn-danger px-4 py-2 rounded-pill fw-semibold"
                                    >
                                        Chat ngay
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}