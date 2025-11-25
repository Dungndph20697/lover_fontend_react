import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { filterGenderRequest } from "../../service/filter_request/filter_gender_request";

export default function GenderSuggestionLovers() {
    const [gender, setGender] = useState(""); // "" | "Nam" | "Nữ"
    const [allProfiles, setAllProfiles] = useState([]);
    const [lovers, setLovers] = useState([]);


    useEffect(() => {
        async function fetchAllProfiles() {
            try {
                // gọi API gợi ý 12 người theo gender
                const data = await filterGenderRequest(gender);
                setAllProfiles(data);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu gợi ý:", error);
            }
        }

        fetchAllProfiles();
    }, [gender]);

    useEffect(() => {
        const filtered = allProfiles
            .filter(profile => !gender || profile.gender === gender)
            .slice(0, 12);
        setLovers(filtered);
    }, [gender, allProfiles]);

    return (
        <section className="container my-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold text-danger">💖 Gợi ý người cung cấp dịch vụ</h2>
                <select
                    className="form-select w-auto"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                >
                    <option value="">Tất cả</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                </select>
            </div>

            <div className="row g-4 justify-content-center">
                {lovers.map((lover) => (
                    <div className="col-md-4 col-sm-6 col-12" key={lover.userId}>
                        <div className="card border-0 shadow-lg h-100 position-relative overflow-hidden" style={{ borderRadius: "20px" }}>
                            <div className="position-relative">
                                <img
                                    src={lover.avatar}
                                    className="card-img-top"
                                    alt={lover.fullName}
                                    style={{ height: "540px", objectFit: "cover", borderTopLeftRadius: "20px", borderTopRightRadius: "20px" }}
                                />
                                <span className="position-absolute top-0 end-0 m-3 badge bg-danger fs-6" style={{ borderRadius: "10px" }}>
                                    ❤️ {lover.hireCount || 0}
                                </span>
                            </div>
                            <div className="card-body text-center">
                                <h5 className="fw-bold text-dark mb-1">{lover.name}</h5>
                                <p className="text-muted mb-3">{lover.description || "Đang cập nhật"}</p>
                                <p className="text-primary mb-2">
                                    {lover.services?.length > 0 ? (
                                        lover.services.map((s, idx) => (
                                            <span
                                                key={idx}
                                                className="badge bg-primary me-1 mb-1"
                                            >
                                                {s.name} ({s.pricePerHour || "Đang cập nhật"}đ / giờ)
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-muted">Không có dịch vụ</span>
                                    )}</p>
                                <p className="fw-bold fs-6 text-danger mt-1">
                                    Tổng giá dịch vụ: {lover.totalPrice || "0"} đ
                                </p>
                                <Link to={`/profile/${lover.userId}`} className="btn btn-outline-primary px-4 py-2 rounded-pill fw-semibold me-2">Xem hồ sơ</Link>
                                <Link to={`/user/chat?to=${lover.userId}`} className="btn btn-danger px-4 py-2 rounded-pill fw-semibold">Chat ngay</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}