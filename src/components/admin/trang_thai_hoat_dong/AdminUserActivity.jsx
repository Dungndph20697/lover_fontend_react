import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
    getUserStatus,
    getOnlineUsers,
    getActivitySummary,
} from "../../../service/user/userActiviApi";

// Format thời gian: “2 phút trước”, “1 giờ trước”
const formatTimeAgo = (timestamp) => {
    if (!timestamp) return "Không xác định";

    const diffMs = new Date() - new Date(timestamp);
    const diffMin = Math.floor(diffMs / 60000);

    if (diffMin < 1) return "Vừa xong";
    if (diffMin < 60) return `${diffMin} phút trước`;

    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours} giờ trước`;

    return new Date(timestamp).toLocaleString("vi-VN");
};

export default function AdminUserActivity() {
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [summary, setSummary] = useState(null);
    const [searchId, setSearchId] = useState("");
    const [userStatus, setUserStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    const loadData = async () => {
        setLoading(true);
        try {
            const [online, sum] = await Promise.all([
                getOnlineUsers(),
                getActivitySummary(),
            ]);

            setOnlineUsers(online);
            setSummary(sum);
        } catch (err) {
            Swal.fire("Lỗi", "Không thể tải dữ liệu!", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSearch = async () => {
        if (!searchId) {
            Swal.fire("Thông báo", "Vui lòng nhập ID người dùng!", "info");
            return;
        }

        try {
            const res = await getUserStatus(searchId);
            setUserStatus(res);
        } catch {
            Swal.fire("Lỗi", "Không tìm thấy người dùng!", "error");
        }
    };

    return (
        <div className="card shadow-sm">
            <div className="card-body">
                <h3 className="fw-bold text-danger">🔥 Trạng thái hoạt động người dùng</h3>
                <p className="text-muted">
                    Theo dõi trạng thái online và thời gian truy cập gần nhất.
                </p>

                {/* SUMMARY */}
                {summary && (
                    <div className="row g-3 mb-4">
                        <div className="col-md-4">
                            <div className="p-3 rounded shadow-sm bg-danger text-white">
                                <h6>Tổng người dùng</h6>
                                <h3>{summary.totalUsers}</h3>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="p-3 rounded shadow-sm bg-success text-white">
                                <h6>Đang online</h6>
                                <h3>{summary.onlineNow}</h3>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="p-3 rounded shadow-sm bg-secondary text-white">
                                <h6>Hoạt động hôm nay</h6>
                                <h3>{summary.activeToday}</h3>
                            </div>
                        </div>
                    </div>
                )}

                {/* SEARCH */}
                <div className="card p-3 shadow-sm mb-4">
                    <h5 className="fw-bold">🔍 Tra cứu trạng thái người dùng</h5>

                    <div className="d-flex gap-2">
                        <input
                            type="number"
                            placeholder="Nhập ID user..."
                            className="form-control"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                        />
                        <button className="btn btn-danger" onClick={handleSearch}>
                            Tìm
                        </button>
                    </div>

                    {userStatus && (
                        <div className="alert alert-light border mt-3">
                            <h6 className="fw-bold">{userStatus.fullName}</h6>
                            <p>
                                <strong>Trạng thái:</strong>{" "}
                                <span className={userStatus.status === "Đang hoạt động"
                                    ? "text-success fw-bold"
                                    : "text-muted"}>
                                    {userStatus.status}
                                </span>
                            </p>
                            <p>
                                <strong>Hoạt động gần nhất:</strong>{" "}
                                {formatTimeAgo(userStatus.lastActivity)}
                            </p>
                        </div>
                    )}
                </div>

                {/* ONLINE USERS */}
                <h5 className="fw-bold mb-3">🟢 Người đang online</h5>

                {loading ? (
                    <div className="text-center">
                        <div className="spinner-border text-danger" />
                    </div>
                ) : onlineUsers.length === 0 ? (
                    <div className="alert alert-info text-center">
                        Chưa có ai online.
                    </div>
                ) : (
                    <ul className="list-group shadow-sm">
                        {onlineUsers.map((u) => (
                            <li
                                key={u.userId}
                                className="list-group-item d-flex justify-content-between align-items-center"
                            >
                                <div>
                                    <strong>{u.fullName}</strong>
                                    <br />
                                    <small className="text-muted">
                                        {formatTimeAgo(u.lastActivity)}
                                    </small>
                                </div>
                                <span className="badge bg-success">🟢 Online</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
