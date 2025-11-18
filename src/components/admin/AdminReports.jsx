import React from "react";

const reportData = [
  { title: "Doanh thu tuần", value: "78.500.000đ", trend: "+12%" },
  { title: "Tỷ lệ hoàn thành dịch vụ", value: "93%", trend: "+3%" },
  { title: "Khiếu nại mở", value: "7", trend: "-2" },
];

export default function AdminReports() {
  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h4 className="card-title mb-3">📈 Báo cáo & thống kê</h4>
        <div className="row g-3">
          {reportData.map((item) => (
            <div className="col-md-4" key={item.title}>
              <div className="border rounded p-3 h-100">
                <p className="text-muted mb-1">{item.title}</p>
                <h3 className="fw-bold">{item.value}</h3>
                <span className="badge bg-success-subtle text-success">
                  {item.trend} so với tuần trước
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

