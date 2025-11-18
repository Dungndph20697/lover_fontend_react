import React, { useEffect, useState } from "react";
import { getWithdrawHistory } from "../../service/user/withdraw";

const statusTranslations = {
  PENDING: { label: "Chờ duyệt", className: "text-warning" },
  OTP_PENDING: { label: "Chờ OTP", className: "text-info" },
  PROCESSING: { label: "Đang xử lý", className: "text-primary" },
  APPROVED: { label: "Đã chuyển", className: "text-success" },
  REJECTED: { label: "Bị từ chối", className: "text-danger" },
};

const translateStatus = (status) => {
  if (!status) return { label: "Không xác định", className: "text-muted" };
  const normalized = status.toUpperCase();
  return statusTranslations[normalized] || {
    label: status,
    className: "text-muted",
  };
};

export default function WithdrawStatus() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    const res = await getWithdrawHistory();
    setRequests(res.data || []);
  };

  const sortedRequests = [...requests].sort((a, b) => {
    const timeA = new Date(a.createdAt || a.created_at || 0).getTime();
    const timeB = new Date(b.createdAt || b.created_at || 0).getTime();
    return timeB - timeA;
  });

  const displayRequests = sortedRequests.slice(0, 5);

  return (
    <div className="card p-4 shadow-sm mt-3">
      <h4>📊 Trạng thái rút tiền</h4>

      {requests.length === 0 ? (
        <p className="text-muted mt-3">
          Bạn chưa có yêu cầu rút tiền nào hoặc dữ liệu đang được cập nhật.
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
            {displayRequests.map((req) => {
              const statusInfo = translateStatus(req.status);
              return (
                <tr key={req.id}>
                  <td>{req.amount}</td>
                  <td>{req.amountReceived}</td>
                  <td>{req.fee}</td>
                  <td>
                    <span className={statusInfo.className}>{statusInfo.label}</span>
                  </td>
                  <td>{req.createdAt?.replace("T", " ")}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
