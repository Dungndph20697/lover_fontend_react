import React from "react";

export default function AdminOverview() {
  const stats = [
    { label: "CCDV đang hoạt động", value: "128", badge: "success" },
    { label: "Yêu cầu rút tiền chờ duyệt", value: "14", badge: "warning" },
    { label: "Người dùng mới trong ngày", value: "36", badge: "info" },
    { label: "Báo cáo cần xử lý", value: "5", badge: "danger" },
  ];

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h4 className="card-title mb-4">📊 Tổng quan hoạt động</h4>
        <div className="row g-3">
          {stats.map((stat) => (
            <div className="col-md-3" key={stat.label}>
              <div className="border rounded p-3 text-center">
                <div className={`badge bg-${stat.badge} mb-2`}>{stat.label}</div>
                <h3 className="fw-bold">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

