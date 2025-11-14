import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const mockTopFrequent = [
  {
    user: {
      id: 2,
      username: "phuongbui",
      firstName: "Phuong",
      lastName: "Bui",
      nickname: "Phương Bùi",
      email: "hieutdph29698@fpt.edu.vn",
      phone: "0339927991",
    },
    hireCount: 5,
  },
  {
    user: {
      id: 3,
      username: "dung",
      firstName: "Nguyen",
      lastName: "Dung",
      nickname: "Nguyên Dũng",
      email: "dung@gmail.com",
      phone: "0339927992",
    },
    hireCount: 3,
  },
  {
    user: {
      id: 10,
      username: "hoamai",
      firstName: "Hoa",
      lastName: "Mai",
      nickname: "Hoa Mai",
      email: "hoa@example.com",
      phone: "0901234567",
    },
    hireCount: 2,
  },
];

const mockTopRecent = [
  {
    user: {
      id: 3,
      username: "dung",
      firstName: "Nguyen",
      lastName: "Dung",
      nickname: "Nguyên Dũng",
      email: "dung@gmail.com",
      phone: "0339927992",
    },
    lastHireTime: "2025-02-21T09:00:00",
  },
  {
    user: {
      id: 2,
      username: "phuongbui",
      firstName: "Phuong",
      lastName: "Bui",
      nickname: "Phương Bùi",
      email: "hieutdph29698@fpt.edu.vn",
      phone: "0339927991",
    },
    lastHireTime: "2025-02-20T20:00:00",
  },
  {
    user: {
      id: 11,
      username: "anhtuan",
      firstName: "Anh",
      lastName: "Tuan",
      nickname: "Anh Tuấn",
      email: "tuan@example.com",
      phone: "0912345678",
    },
    lastHireTime: "2025-02-18T15:30:00",
  },
];

function formatName(user) {
  if (user.nickname) return user.nickname;
  return `${user.firstName} ${user.lastName}`;
}

function formatDateTime(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getInitials(user) {
  const name = formatName(user);
  return name
    .split(" ")
    .filter(Boolean)
    .slice(-2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

export default function CcdvTopCustomers() {
  const [topFrequent] = useState(mockTopFrequent);
  const [topRecent] = useState(mockTopRecent);

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold">Thống kê khách thuê</h2>

      <div className="row g-4">
        {/* Top thuê nhiều nhất */}
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <span className="fw-semibold">
                Top 3 khách thuê bạn nhiều nhất
              </span>
              <span className="badge bg-light text-primary">
                Theo số lần thuê
              </span>
            </div>
            <div className="card-body">
              {topFrequent.length === 0 ? (
                <p className="text-muted mb-0">
                  Chưa có buổi thuê nào được hoàn thành.
                </p>
              ) : (
                <ul className="list-group list-group-flush">
                  {topFrequent.map((item, index) => (
                    <li
                      key={item.user.id}
                      className="list-group-item d-flex align-items-center"
                    >
                      <div className="me-3">
                        <span
                          className="rounded-circle d-inline-flex justify-content-center align-items-center"
                          style={{
                            width: 44,
                            height: 44,
                            backgroundColor: "#e9ecef",
                            fontWeight: "600",
                          }}
                        >
                          {getInitials(item.user)}
                        </span>
                      </div>

                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between">
                          <div>
                            <div className="fw-semibold">
                              #{index + 1} {formatName(item.user)}
                            </div>
                            <div className="text-muted small">
                              @{item.user.username} · {item.user.phone}
                            </div>
                          </div>
                          <div className="text-end">
                            <div className="fw-bold">{item.hireCount} lần</div>
                            <div className="text-muted small">đã thuê bạn</div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Top thuê gần nhất */}
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
              <span className="fw-semibold">
                Top 3 khách thuê bạn gần đây nhất
              </span>
              <span className="badge bg-light text-success">
                Theo thời gian
              </span>
            </div>
            <div className="card-body">
              {topRecent.length === 0 ? (
                <p className="text-muted mb-0">
                  Chưa có buổi thuê nào gần đây.
                </p>
              ) : (
                <ul className="list-group list-group-flush">
                  {topRecent.map((item, index) => (
                    <li
                      key={item.user.id + "-recent"}
                      className="list-group-item d-flex align-items-center"
                    >
                      <div className="me-3">
                        <span
                          className="rounded-circle d-inline-flex justify-content-center align-items-center"
                          style={{
                            width: 44,
                            height: 44,
                            backgroundColor: "#e9ecef",
                            fontWeight: "600",
                          }}
                        >
                          {getInitials(item.user)}
                        </span>
                      </div>

                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between">
                          <div>
                            <div className="fw-semibold">
                              #{index + 1} {formatName(item.user)}
                            </div>
                            <div className="text-muted small">
                              @{item.user.username} · {item.user.phone}
                            </div>
                          </div>
                          <div className="text-end">
                            <div className="small text-muted">
                              Lần thuê gần nhất
                            </div>
                            <div className="fw-semibold">
                              {formatDateTime(item.lastHireTime)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* chỗ này sau này có thể thêm filter thời gian, nút refresh, v.v. */}
    </div>
  );
}
