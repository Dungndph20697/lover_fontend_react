import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getAllUser, approveUser } from "../../../service/admin/adminApiSuccessAccount";

export default function AdminSuccessAccount() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [refreshing, setRefreshing] = useState(false);

    const loadUsers = async ({ page: pageParam = page, size = pageSize } = {}) => {
        try {
            setLoading(true);
            const data = await getAllUser({ page: pageParam, size });

            const list = data?.content || [];
            setUsers(list);
            setTotalPages(data?.totalPages || 1);
            setTotalRecords(data?.totalElements || list.length);
            setPage(data?.number ?? pageParam);
            setPageSize(data?.size ?? size);
        } catch (error) {
            console.error("Error loading users:", error);
            Swal.fire("Lỗi", "Không thể tải danh sách người dùng", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers({ page, size: pageSize });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, pageSize]);

    // ham duyệt tài khoản
    const handleApprove = async (id) => {

        const confirm = await Swal.fire({
            icon: "warning",
            title: "Duyệt tài khoản?",
            text: "Tài khoản sẽ có thể đăng nhập hệ thống.",
            showCancelButton: true,
            confirmButtonText: "Duyệt ngay",
            cancelButtonText: "Hủy"
        });

        if (!confirm.isConfirmed) return;

        try {
            await approveUser(id);
            Swal.fire("Thành công!", "Đã duyệt tài khoản", "success");
            loadUsers({ page });
        } catch (err) {
            console.error("[AdminSuccessAccount] approve failed", {
                status: err?.response?.status,
                data: err?.response?.data,
                headers: err?.response?.headers,
                message: err?.message,
            });
            const message =
                err?.response?.data?.message ||
                err?.message ||
                "Không thể duyệt tài khoản";
            Swal.fire("Lỗi", message, "error");
        }
    };

    if (loading) {
        return (
            <div className="p-4 text-lg font-bold d-flex align-items-center gap-2">
                <span className="spinner-border text-danger" role="status" />
                Đang tải danh sách người dùng...
            </div>
        );
    }

    const startItem = totalRecords === 0 ? 0 : page * pageSize + 1;
    const endItem = totalRecords === 0 ? 0 : page * pageSize + users.length;

    return (
        <div className="p-6 bg-light rounded-3 shadow-sm">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
                <button
                    className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
                    onClick={() => {
                        setRefreshing(true);
                        loadUsers({ page, size: pageSize }).finally(() => setRefreshing(false));
                    }}
                    disabled={refreshing}
                >
                    {refreshing && <span className="spinner-border spinner-border-sm" role="status" />}
                    Làm mới
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            <th className="text-center">ID</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th className="text-center">Trạng thái</th>
                            <th className="text-center">Hành động</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center text-muted py-4">
                                    Không có người dùng nào.
                                </td>
                            </tr>
                        ) : (
                            users.map((u) => (
                                <tr key={u.id}>
                                    <td className="text-center fw-semibold">{u.id}</td>
                                    <td className="fw-semibold">{u.username}</td>
                                    <td>{u.email}</td>
                                    <td>{u.role?.name}</td>
                                    <td className="text-center">
                                        {u.isActive ? (
                                            <span className="badge text-bg-success">Đã duyệt</span>
                                        ) : (
                                            <span className="badge text-bg-warning text-dark">Chưa duyệt</span>
                                        )}
                                    </td>
                                    <td className="text-center">
                                        {!u.isActive && (
                                            <button
                                                onClick={() => handleApprove(u.id)}
                                                className="btn btn-sm btn-success"
                                            >
                                                Duyệt
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="d-flex flex-wrap justify-content-between align-items-center mt-3 gap-2">
                <div className="text-muted small">
                    Hiển thị {startItem}-{endItem} / {totalRecords}
                </div>
                <div className="d-flex align-items-center gap-2">
                    <select
                        className="form-select form-select-sm"
                        style={{ width: "120px" }}
                        value={pageSize}
                        onChange={(e) => {
                            setPage(0);
                            setPageSize(Number(e.target.value));
                        }}
                    >
                        {[5, 10, 20, 50].map((sizeOption) => (
                            <option key={sizeOption} value={sizeOption}>
                                {sizeOption} / trang
                            </option>
                        ))}
                    </select>
                    <div className="btn-group btn-group-sm">
                        <button
                            className="btn btn-outline-secondary"
                            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                            disabled={page === 0}
                        >
                            Trước
                        </button>
                        <span className="btn btn-outline-secondary disabled">
                            Trang {totalPages ? page + 1 : 0}/{Math.max(totalPages, 1)}
                        </span>
                        <button
                            className="btn btn-outline-secondary"
                            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
                            disabled={page + 1 >= totalPages}
                        >
                            Sau
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
