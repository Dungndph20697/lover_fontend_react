import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { findByCity } from "../../service/find_by_city/find_by_city";

export default function FindCcdvByCity() {
    const [city, setCity] = useState("");
    const [allProfiles, setAllProfiles] = useState([]);
    const [ccdvList, setCcdvList] = useState([]);

    useEffect(() => {
        async function fetchProfiles() {
            try {
                const data = await findByCity(); // lấy tất cả CCDV
                setAllProfiles(data);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu CCDV:", error);
            }
        }
        fetchProfiles();
    }, []);

    useEffect(() => {
        const filtered = allProfiles
            .filter(profile => !city || profile.city === city) // lọc theo city dropdown
            .slice(0, 12);
        setCcdvList(filtered);
    }, [city, allProfiles]);

    return (
        <section className="container my-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold text-danger mb-4">💖 Gợi ý người cung cấp dịch vụ gần bạn</h2>
                <select className="form-select w-auto mb-4" value={city} onChange={e => setCity(e.target.value)}>
                    <option value="">Tất cả</option>
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                    <option value="Đà Nẵng">Đà Nẵng</option>
                    <option value="Hải Phòng">Hải Phòng</option>
                    <option value="Nha Trang">Nha Trang</option>
                    <option value="Quy Nhơn">Quy Nhơn</option>
                    {/* thêm city khác */}
                </select>
            </div>

            <div className="row g-4 justify-content-center">
                {ccdvList.map(ccdv => (
                    <div className="col-md-4 col-sm-6 col-12" key={ccdv.id}>
                        <div className="card border-0 shadow-lg h-100 position-relative overflow-hidden" style={{ borderRadius: "20px" }}>
                            <div className="position-relative">
                                <img
                                    src={ccdv.avatar}
                                    className="card-img-top"
                                    alt={ccdv.fullName}
                                    style={{ height: "320px", objectFit: "cover", borderTopLeftRadius: "20px", borderTopRightRadius: "20px" }}
                                />
                                <span className="position-absolute top-0 end-0 m-3 badge bg-danger fs-6" style={{ borderRadius: "10px" }}>
                                    ❤️ {ccdv.hireCount || 0}
                                </span>
                            </div>
                            <div className="card-body text-center">
                                <h5 className="fw-bold text-dark mb-1">{ccdv.fullName}</h5>
                                <p className="text-muted mb-3">{ccdv.description || "Đang cập nhật"}</p>
                                <p className="text-primary mb-2">
                                    Dịch vụ: {ccdv.services?.map(s => s.name).join(", ") || "Chưa có"}
                                </p>
                                <p className="text-success mb-3">
                                    Giá: {ccdv.services?.map(s => s.pricePerHour).join(" /h, ") || "Liên hệ"} /h
                                </p>
                                <Link to={`/profile/${ccdv.id}`} className="btn btn-outline-danger px-4 py-2 rounded-pill fw-semibold me-2">Xem hồ sơ</Link>
                                <Link to={`/user/chat?to=${ccdv.id}`} className="btn btn-danger px-4 py-2 rounded-pill fw-semibold">Chat ngay</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}