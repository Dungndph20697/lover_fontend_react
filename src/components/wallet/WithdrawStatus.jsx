import React, { useEffect, useState } from "react";
import { getWithdrawHistory } from "../../service/user/withdraw";

const statusTranslations = {
  PENDING: { label: "Chờ duyệt", className: "text-warning fw-bold" },
  OTP_VERIFIED: { label: "Chờ OTP", className: "text-info fw-bold" },
  PROCESSING: { label: "Đang xử lý", className: "text-primary fw-bold" },
  APPROVED: { label: "Đã chuyển", className: "text-success fw-bold" },
  REJECTED: { label: "Bị từ chối", className: "text-danger fw-bold" },
};
const formatVNDate = (isoString) => {
  if (!isoString) return "--";
  const date = new Date(isoString);
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
};

const translateStatus = (status) => {
  if (!status) return { label: "Không xác định", className: "text-muted" };
  return statusTranslations[status] || { label: status, className: "text-muted" };
};

export default function WithdrawStatus() {
  const [requests, setRequests] = useState([]);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterDays, setFilterDays] = useState(7);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    const res = await getWithdrawHistory();
    setRequests(res.data || []);
  };

  const sorted = [...requests].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Apply filters
  const filtered = sorted.filter((req) => {
    const okStatus = filterStatus === "ALL" || req.status === filterStatus;

    const days =
      filterDays === 9999
        ? true
        : (Date.now() - new Date(req.createdAt).getTime()) / (1000 * 60 * 60 * 24) <= filterDays;

    return okStatus && days;
  });

  return (
    <div className="card p-4 shadow-sm mt-3">
      <h4>📊 Trạng thái rút tiền</h4>

      {/* Bộ lọc */}
      <div className="d-flex gap-3 mt-3 flex-wrap">
        <select
          className="form-select w-auto"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="ALL">Tất cả trạng thái</option>
          <option value="PENDING">Chờ duyệt</option>
          <option value="OTP_VERIFIED">Chờ OTP</option>
          <option value="PROCESSING">Đang xử lý</option>
          <option value="APPROVED">Đã chuyển</option>
          <option value="REJECTED">Bị từ chối</option>
        </select>

        <select
          className="form-select w-auto"
          value={filterDays}
          onChange={(e) => setFilterDays(e.target.value)}
        >
          <option value={7}>Trong 7 ngày</option>
          <option value={30}>Trong 30 ngày</option>
          <option value={90}>Trong 90 ngày</option>
          <option value={9999}>Tất cả</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted mt-3">Không có dữ liệu phù hợp.</p>
      ) : (
        <table className="table table-bordered mt-3">
          <thead>
            <tr>
              <th>Số tiền</th>
              <th>Nhận thực tế</th>
              <th>Phí</th>
              <th>Trạng thái</th>
              <th>Thời gian</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((req) => {
              const s = translateStatus(req.status);
              return (
                <tr key={req.id}>
                  <td>{req.amount.toLocaleString("vi-VN")}đ</td>
                  <td>{req.amountReceived.toLocaleString("vi-VN")}đ</td>
                  <td>{req.fee.toLocaleString("vi-VN")}đ</td>
                  <td className={s.className}>{s.label}</td>
                  <td>{formatVNDate(req.createdAt)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
