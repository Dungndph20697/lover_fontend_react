import React, { useEffect, useState } from "react";
import {
  apiAdminGetUsers,
  apiAdminFilterUsers,
  apiAdminGetCcdvDetail,
  apiLockUser,
  apiUnlockUser,
} from "../../service/admin/adminAPI";
import CcdvDetailModal from "./CcdvDetailModal";
import Swal from "sweetalert2";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // 🚀 Pagination FE
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const data = await apiAdminGetUsers(token);
      setUsers(data);
      setCurrentPage(1); // reset page
    } catch (err) {
      Swal.fire("Lỗi", "Không thể tải danh sách user", "error");
    }
    setLoading(false);
  };

  const handleFilter = async (role) => {
    setRoleFilter(role);

    if (role === "ALL") {
      loadUsers();
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const data = await apiAdminFilterUsers(token, role);
      setUsers(data);
      setCurrentPage(1); // reset trang khi lọc
    } catch (err) {
      Swal.fire("Lỗi", "Không thể lọc dữ liệu", "error");
    }
  };

  const handleView = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const data = await apiAdminGetCcdvDetail(token, id);

      setSelectedUser(data);
      setShowModal(true);
    } catch (err) {
      Swal.fire("Lỗi", "Không thể tải thông tin CCDV", "error");
    }
  };

  const handleLock = async (id) => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn?",
      text: "Tài khoản sẽ bị khoá và không thể đăng nhập!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Có, khoá ngay!",
      cancelButtonText: "Hủy",
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      await apiLockUser(token, id);
      Swal.fire("Thành công", "Đã khoá tài khoản!", "success");
      loadUsers();
    } catch (err) {
      Swal.fire("Lỗi", "Không thể khoá tài khoản!", "error");
    }
  };

  const handleUnlock = async (id) => {
    const result = await Swal.fire({
      title: "Mở khoá tài khoản?",
      text: "Người dùng sẽ có thể đăng nhập lại.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Mở khoá",
      cancelButtonText: "Hủy",
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      await apiUnlockUser(token, id);
      Swal.fire("Thành công", "Đã mở khoá tài khoản!", "success");
      loadUsers();
    } catch (err) {
      Swal.fire("Lỗi", "Không thể mở khoá tài khoản!", "error");
    }
  };

  // 🚀 Tính toán phân trang FE
  const indexLast = currentPage * itemsPerPage;
  const indexFirst = indexLast - itemsPerPage;
  const currentUsers = users.slice(indexFirst, indexLast);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  return (
    <>
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="card-title mb-0">👥 Quản lý người dùng</h4>
          </div>

          {/* FILTER */}
          <div className="mb-3">
            <select
              className="form-select w-auto"
              value={roleFilter}
              onChange={(e) => handleFilter(e.target.value)}
            >
              <option value="ALL">Tất cả</option>
              <option value="USER">Khách hàng (USER)</option>
              <option value="SERVICE_PROVIDER">CCDV</option>
            </select>
          </div>

          {/* TABLE */}
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Họ tên</th>
                  <th>Nickname</th>
                  <th>Vai trò</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center">
                      Đang tải...
                    </td>
                  </tr>
                ) : currentUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">
                      Không có dữ liệu
                    </td>
                  </tr>
                ) : (
                  currentUsers.map((u) => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.fullName}</td>
                      <td>{u.nickname || "—"}</td>
                      <td>
                        {u.roleName === "SERVICE_PROVIDER"
                          ? "CCDV"
                          : u.roleName}
                      </td>
                      <td>{u.status}</td>
                      <td>
                        {u.roleName === "SERVICE_PROVIDER" && (
                          <button
                            className="btn btn-outline-primary btn-sm me-2"
                            onClick={() => handleView(u.id)}
                          >
                            Xem
                          </button>
                        )}

                        {u.status === "ACTIVE" ? (
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleLock(u.id)}
                          >
                            Khoá
                          </button>
                        ) : (
                          <button
                            className="btn btn-outline-success btn-sm"
                            onClick={() => handleUnlock(u.id)}
                          >
                            Mở khoá
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {totalPages >= 1 && (
            <nav>
              <ul className="pagination justify-content-center mt-3">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    «
                  </button>
                </li>

                {[...Array(totalPages).keys()].map((num) => (
                  <li
                    key={num}
                    className={`page-item ${
                      currentPage === num + 1 ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(num + 1)}
                    >
                      {num + 1}
                    </button>
                  </li>
                ))}

                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    »
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>

      <CcdvDetailModal
        show={showModal}
        onClose={() => setShowModal(false)}
        data={selectedUser}
      />
    </>
  );
}
