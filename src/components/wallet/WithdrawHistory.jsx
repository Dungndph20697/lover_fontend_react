import React, { useEffect, useState } from "react";
import { getWithdrawHistory } from "../../service/user/withdraw";

// Việt hóa trạng thái
const statusMap = {
  APPROVED: { label: "Đã chuyển thành công", className: "text-success fw-bold" },
  REJECTED: { label: "Bị từ chối", className: "text-danger fw-bold" },
  PROCESSING: { label: "Đang xử lý", className: "text-primary fw-bold" },
  PENDING: { label: "Chờ duyệt", className: "text-warning fw-bold" },
  OTP_VERIFIED: { label: "Chờ OTP", className: "text-info fw-bold" },
};

// Format tiền VN
const formatMoney = (amount) =>
  amount?.toLocaleString("vi-VN") + "đ";

// Format thời gian chuẩn Việt Nam
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

export default function WithdrawHistory({ token }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await getWithdrawHistory(token);
    const approved = (res.data || [])
      .filter((h) => h.status === "APPROVED")
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setHistory(approved);
  };

  return (
    <div className="card p-4 shadow-sm mt-3">
      <h4 className="mb-3">Lịch sử rút tiền đã duyệt</h4>

      {history.length === 0 ? (
        <p className="text-muted mt-3">
          Bạn chưa có giao dịch rút tiền nào được admin xác nhận.
        </p>
      ) : (
        <table className="table table-bordered mt-3">
          <thead className="table-light">
            <tr>
              <th>Số tiền rút</th>
              <th>Nhận thực tế</th>
              <th>Phí</th>
              <th>Trạng thái</th>
              <th>Thời gian</th>
            </tr>
          </thead>

          <tbody>
            {history.map((h) => {
              const status = statusMap[h.status] || {
                label: h.status,
                className: "text-muted",
              };

              return (
                <tr key={h.id}>
                  <td className="fw-bold">{formatMoney(h.amount)}</td>
                  <td className="text-success fw-bold">{formatMoney(h.amountReceived)}</td>
                  <td className="text-danger">{formatMoney(h.fee)}</td>

                  <td className={status.className}>
                    {status.label}
                  </td>

                  <td className="text-muted">{formatVNDate(h.createdAt)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
