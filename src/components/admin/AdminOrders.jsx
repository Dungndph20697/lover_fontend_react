import React from "react";

const orders = [
  { id: "DH001", customer: "Minh Anh", provider: "CCDV #23", status: "IN_PROGRESS" },
  { id: "DH002", customer: "Tuấn Kiệt", provider: "CCDV #02", status: "COMPLETED" },
  { id: "DH003", customer: "Hoài Nam", provider: "CCDV #15", status: "DISPUTE" },
];

export default function AdminOrders() {
  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h4 className="card-title mb-3">📋 Quản lý đơn dịch vụ</h4>
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Người cung cấp</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.provider}</td>
                  <td>
                    <span
                      className={
                        order.status === "COMPLETED"
                          ? "badge bg-success"
                          : order.status === "IN_PROGRESS"
                          ? "badge bg-primary"
                          : "badge bg-danger"
                      }
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-outline-danger btn-sm">
                      Chi tiết
                    </button>
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

