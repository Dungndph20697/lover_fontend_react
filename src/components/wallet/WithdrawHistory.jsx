import React, { useEffect, useState } from "react";
import { getWithdrawHistory } from "../../service/user/withdraw";

const statusTranslations = {
  APPROVED: { label: "Đã chuyển", className: "text-success" },
  REJECTED: { label: "Bị từ chối", className: "text-danger" },
  PENDING: { label: "Chờ duyệt", className: "text-warning" },
  OTP_PENDING: { label: "Chờ OTP", className: "text-info" },
  PROCESSING: { label: "Đang xử lý", className: "text-primary" },
};

const translateStatus = (status) => {
  if (!status) return { label: "Không xác định", className: "text-muted" };
  const normalized = status.toUpperCase();
  return statusTranslations[normalized] || { label: status, className: "text-muted" };
};

export default function WithdrawHistory({ token }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch();
  }, []);

  const fetch = async () => {
    const res = await getWithdrawHistory(token);
    const approved = (res.data || []).filter((h) => h.status === "APPROVED");
    setHistory(approved);
  };

  return (
    <div className="card p-4 shadow-sm mt-3">
      <h4>📜 Lịch sử rút tiền đã được duyệt</h4>

      {history.length === 0 ? (
        <p className="text-muted mt-3">
          Bạn chưa có giao dịch rút tiền nào được admin xác nhận.
        </p>
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
            {history.map((h) => {
              const statusInfo = translateStatus(h.status);
              return (
                <tr key={h.id}>
                  <td>{h.amount}</td>
                  <td>{h.amountReceived}</td>
                  <td>{h.fee}</td>
                  <td>
                    <span className={statusInfo.className}>{statusInfo.label}</span>
                  </td>
                  <td>{h.createdAt?.replace("T", " ")}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
