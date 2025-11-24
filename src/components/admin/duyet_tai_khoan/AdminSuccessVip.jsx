import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

import {
    getAllUser,
    apiAdminVipUsers,
    apiAdminVipCcdv,
    updateVipStatus,
} from "../../../service/admin/adminApiSuccessAccount";

// Chuyển role sang tiếng Việt
const roleToVietnamese = (roleName) => {
    if (!roleName) return "Không rõ";
    switch (roleName.toUpperCase()) {
        case "USER": return "Người dùng";
        case "SERVICE_PROVIDER": return "Người cung cấp dịch vụ";
        case "ADMIN": return "Quản trị viên";
        default: return roleName;
    }
};

export default function AdminVipManager() {
    const [activeTab, setActiveTab] = useState("all");
    const [data, setData] = useState([]);
    const [pageInfo, setPageInfo] = useState({ page: 0, size: 10, total: 0 });
    const [loading, setLoading] = useState(false);

    // Load VIP data
    const loadVipData = async (page = 0) => {
        setLoading(true);
        try {
            let res;
            if (activeTab === "all") res = await getAllUser({ page, size: 10 });
            else if (activeTab === "users") res = await apiAdminVipUsers({ page, size: 10 });
            else res = await apiAdminVipCcdv({ page, size: 10 });

            setData(res.content || []);
            setPageInfo({ page: res.number, size: res.size, total: res.totalPages });
        } catch (err) {
            Swal.fire("Lỗi", "Không thể tải dữ liệu!", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadVipData(0);
    }, [activeTab]);

    const toggleVip = async (id, currentVip) => {
        try {
            await updateVipStatus(id, !currentVip);
            Swal.fire("Thành công", currentVip ? "Đã gỡ VIP!" : "Đã đặt VIP!", "success");
            loadVipData(pageInfo.page);
        } catch {
            Swal.fire("Lỗi", "Không thể cập nhật VIP!", "error");
        }
    };

    return (
        <div className="card shadow-sm border-0" style={{ borderRadius: "14px" }}>
            <div className="card-body">

                {/* HEADER */}
                <h4 className="fw-bold mb-4 text-danger">
                    ⭐ Quản lý tài khoản VIP
                </h4>

                {/* TABS hiện đại */}
                <div className="btn-group mb-4">
                    <button
                        className={`btn ${activeTab === "all" ? "btn-danger" : "btn-outline-danger"}`}
                        onClick={() => setActiveTab("all")}
                    >
                        Tất cả
                    </button>
                    <button
                        className={`btn ${activeTab === "users" ? "btn-danger" : "btn-outline-danger"}`}
                        onClick={() => setActiveTab("users")}
                    >
                        Người dùng VIP
                    </button>
                    <button
                        className={`btn ${activeTab === "ccdv" ? "btn-danger" : "btn-outline-danger"}`}
                        onClick={() => setActiveTab("ccdv")}
                    >
                        CCDV VIP
                    </button>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="text-center py-5">
                        <div className="spinner-border text-danger" style={{ width: "3rem", height: "3rem" }} />
                        <p className="mt-3 text-muted">Đang tải dữ liệu...</p>
                    </div>
                )}

                {/* TABLE */}
                {!loading && data.length > 0 && (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>ID</th>
                                    <th>Họ tên</th>
                                    <th>Email</th>
                                    <th>SĐT</th>
                                    <th>Vai trò</th>
                                    <th>VIP</th>
                                    <th className="text-center">Hành động</th>
                                </tr>
                            </thead>

                            <tbody>
                                {data.map((u) => (
                                    <tr key={u.id} className={u.isVip ? "table-warning" : ""}>
                                        <td className="fw-bold">{u.id}</td>

                                        <td>
                                            <div className="fw-semibold">
                                                {u.firstName} {u.lastName}
                                            </div>
                                            {/* <small className="text-muted">#{u.id}</small> */}
                                        </td>

                                        <td>{u.email}</td>
                                        <td>{u.phone}</td>

                                        <td>
                                            <span className="badge bg-secondary">{roleToVietnamese(u.role?.name)}</span>
                                        </td>

                                        <td>
                                            {u.isVip ? (
                                                <span className="badge bg-warning text-dark">⭐ VIP</span>
                                            ) : (
                                                <span className="badge bg-light text-muted">Chưa VIP</span>
                                            )}
                                        </td>

                                        <td className="text-center">
                                            <button
                                                className={`btn btn-sm ${u.isVip ? "btn-outline-secondary" : "btn-outline-danger"}`}
                                                onClick={() => toggleVip(u.id, u.isVip)}
                                                style={{ borderRadius: "8px" }}
                                            >
                                                {u.isVip ? "Gỡ VIP" : "Set VIP"}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* EMPTY */}
                {!loading && data.length === 0 && (
                    <div className="alert alert-info text-center py-4">
                        Không có dữ liệu ở tab hiện tại.
                    </div>
                )}

                {/* PAGINATION */}
                {!loading && pageInfo.total > 1 && (
                    <div className="d-flex justify-content-between align-items-center mt-4">
                        <button
                            className="btn btn-outline-danger"
                            disabled={pageInfo.page === 0}
                            onClick={() => loadVipData(pageInfo.page - 1)}
                        >
                            ⏮ Trước
                        </button>

                        <span className="fw-bold">
                            Trang {pageInfo.page + 1}/{pageInfo.total}
                        </span>

                        <button
                            className="btn btn-outline-danger"
                            disabled={pageInfo.page === pageInfo.total - 1}
                            onClick={() => loadVipData(pageInfo.page + 1)}
                        >
                            Sau ⏭
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
