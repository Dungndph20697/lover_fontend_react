import React from "react";

const mockUsers = [
  { id: 1, name: "Nguyễn Văn A", role: "SERVICE_PROVIDER", status: "ACTIVE" },
  { id: 2, name: "Trần Thị B", role: "CUSTOMER", status: "BANNED" },
  { id: 3, name: "Lê Văn C", role: "SERVICE_PROVIDER", status: "PENDING" },
];

export default function AdminUsers() {
  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="card-title mb-0">👥 Quản lý người dùng</h4>
          <button className="btn btn-outline-danger btn-sm">+ Thêm quản trị</button>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>#</th>
                <th>Họ tên</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {mockUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.role}</td>
                  <td>
                    <span
                      className={
                        user.status === "ACTIVE"
                          ? "badge bg-success"
                          : user.status === "PENDING"
                          ? "badge bg-warning text-dark"
                          : "badge bg-danger"
                      }
                    >
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <button className="btn btn-outline-secondary">Xem</button>
                      <button className="btn btn-outline-danger">Khoá</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

