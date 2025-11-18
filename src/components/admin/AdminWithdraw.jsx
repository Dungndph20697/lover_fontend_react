import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import {
  adminApprove,
  adminGetList,
  adminSearchWithdraw,
  adminReject,
} from "../../service/user/withdraw";

const statusMeta = {
  PENDING: { label: "Chờ duyệt", className: "badge text-bg-warning text-dark" },
  OTP_PENDING: { label: "Chờ OTP", className: "badge text-bg-info text-dark" },
  PROCESSING: { label: "Đang xử lý", className: "badge text-bg-primary" },
  APPROVED: { label: "Đã chuyển", className: "badge text-bg-success" },
  REJECTED: { label: "Đã từ chối", className: "badge text-bg-danger" },
};

const typeBadges = {
  FAST: { label: "Chi nhanh 2h", className: "badge text-bg-danger" },
  STANDARD: { label: "Chuẩn 24h", className: "badge text-bg-secondary" },
  SCHEDULED: { label: "Hẹn giờ", className: "badge text-bg-info text-dark" },
};

const statusFilters = [
  { id: "ALL", label: "Tất cả" },
  { id: "PENDING", label: "Chờ duyệt" },
  { id: "OTP_PENDING", label: "Chờ OTP" },
  { id: "PROCESSING", label: "Đang xử lý" },
  { id: "APPROVED", label: "Đã chuyển" },
  { id: "REJECTED", label: "Từ chối" },
];

const toNumber = (value) => {
  if (typeof value === "number") return value;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const formatCurrency = (value) => `${toNumber(value).toLocaleString("vi-VN")}đ`;

const formatDateTime = (value) => {
  if (!value) return "--";
  const date = new Date(value);
  const formatted = date.toLocaleString("vi-VN", { hour12: false });
  return Number.isNaN(date.getTime()) ? value : formatted;
};

const getNetAmount = (request) => {
  if (!request) return 0;
  return toNumber(request.amount) - toNumber(request.fee);
};

const normalizeRequest = (item = {}) => {
  const providerInfo =
    item.provider ||
    item.serviceProvider ||
    item.ccdvProfile ||
    item.providerInfo ||
    item.user ||
    {};

  const providerId =
    item.providerId ??
    providerInfo.providerId ??
    providerInfo.ccdvId ??
    providerInfo.id;

  const providerLabel = providerId ? `CCDV #${providerId}` : "CCDV";

  const derivedProviderName =
    item.providerName ??
    providerInfo.name ??
    providerInfo.fullName ??
    providerInfo.displayName ??
    providerInfo.username ??
    providerInfo.accountName ??
    providerLabel;

  const derivedProviderCode =
    item.providerCode ??
    providerInfo.code ??
    providerInfo.providerCode ??
    providerInfo.username ??
    providerLabel;

  return {
    id: item.id ?? item.requestId ?? item.code ?? `req-${item.providerId ?? Date.now()}`,
    providerCode: derivedProviderCode,
    providerName: derivedProviderName,
    amount: toNumber(item.amount ?? item.requestAmount),
    fee: toNumber(item.fee ?? item.platformFee),
    bank: {
      name: item.bankName ?? item.bank?.name ?? "Chưa cập nhật",
      accountNumber: item.bankAccountNumber ?? item.bank?.accountNumber ?? "--",
      accountName: item.bankAccountName ?? item.bank?.accountName ?? "--",
      branch: item.bankBranch ?? item.bank?.branch ?? "",
    },
    status: item.status ?? "PENDING",
    createdAt: item.createdAt ?? item.createdDate ?? item.created_at,
    updatedAt: item.updatedAt ?? item.updatedDate ?? item.updated_at,
    note: item.note ?? item.providerNote ?? "",
    adminNote: item.adminNote ?? "",
    type: item.type ?? item.processType ?? item.withdrawType ?? "STANDARD",
    timeline: Array.isArray(item.timeline) ? item.timeline : [],
  };
};

const extractRequests = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.content)) return payload.content;
  return [];
};

const parseErrorMessage = (error) =>
  error?.response?.data?.message || error?.message || "Có lỗi xảy ra";

export default function AdminWithdraw() {
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortOption, setSortOption] = useState("NEWEST");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showActionModal, setShowActionModal] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);
  const [actionNote, setActionNote] = useState("");
  const [actionSubmitting, setActionSubmitting] = useState(false);

  const loadRequests = useCallback(
    async ({ showLoading = true, search = "" } = {}) => {
      if (showLoading) setLoading(true);
      try {
        const keyword = search?.trim();
        const res = keyword
          ? await adminSearchWithdraw(keyword)
          : await adminGetList();
        const payload = res?.data ?? [];
        const list = extractRequests(payload).map((item) => normalizeRequest(item));
        setRequests(list);
      } catch (error) {
        console.error("Failed to load withdraw requests", error);
        Swal.fire("Lỗi", parseErrorMessage(error), "error");
      } finally {
        if (showLoading) setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const searchInitialized = useRef(false);

  useEffect(() => {
    if (!searchInitialized.current) {
      searchInitialized.current = true;
      return;
    }
    const keyword = searchTerm.trim();
    if (!keyword) {
      loadRequests({ search: "" });
      return;
    }

    const handler = setTimeout(() => {
      loadRequests({ search: keyword });
    }, 400);

    return () => clearTimeout(handler);
  }, [searchTerm, loadRequests]);

  const safeLower = (value) =>
    typeof value === "string"
      ? value.toLowerCase()
      : value !== undefined && value !== null
      ? String(value).toLowerCase()
      : "";

  const processedRequests = useMemo(() => {
    let data = [...requests];

    if (statusFilter !== "ALL") {
      data = data.filter((item) => item.status === statusFilter);
    }

    if (searchTerm.trim()) {
      const keyword = searchTerm.trim().toLowerCase();
      data = data.filter((item) => {
        const bank = item.bank || {};
        return (
          safeLower(item.id).includes(keyword) ||
          safeLower(item.providerName).includes(keyword) ||
          safeLower(item.providerCode).includes(keyword) ||
          safeLower(bank.accountNumber).includes(keyword) ||
          safeLower(bank.accountName).includes(keyword)
        );
      });
    }

    data.sort((a, b) => {
      if (sortOption === "AMOUNT_DESC") return b.amount - a.amount;
      if (sortOption === "AMOUNT_ASC") return a.amount - b.amount;
      if (sortOption === "OLDEST") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return data;
  }, [requests, statusFilter, sortOption, searchTerm]);

  useEffect(() => {
    if (processedRequests.length === 0) {
      if (selectedRequestId !== null) {
        setSelectedRequestId(null);
      }
      return;
    }
    const currentExists = processedRequests.some(
      (item) => item.id === selectedRequestId
    );
    if (!currentExists) {
      setSelectedRequestId(processedRequests[0].id);
    }
  }, [processedRequests, selectedRequestId]);

  const activeRequest = useMemo(
    () => requests.find((item) => item.id === selectedRequestId) || null,
    [requests, selectedRequestId]
  );

  const aggregates = useMemo(() => {
    return requests.reduce(
      (acc, req) => {
        acc.total += 1;
        acc.totalAmount += toNumber(req.amount);
        acc[req.status] = (acc[req.status] || 0) + 1;
        if (req.status === "APPROVED") {
          acc.approvedAmount += getNetAmount(req);
        }
        return acc;
      },
      { total: 0, totalAmount: 0, approvedAmount: 0 }
    );
  }, [requests]);

  const startAction = (type, request) => {
    setCurrentAction({ type, request });
    setSelectedRequestId(request.id);
    setActionNote("");
    setShowActionModal(true);
  };

  const closeActionModal = () => {
    setShowActionModal(false);
    setCurrentAction(null);
    setActionNote("");
  };

  const handleConfirmAction = async () => {
    if (!currentAction) return;
    const isApprove = currentAction.type === "APPROVE";
    setActionSubmitting(true);
    try {
      if (isApprove) {
        await adminApprove(currentAction.request.id);
      } else {
        await adminReject(currentAction.request.id);
      }
      Swal.fire({
        toast: true,
        position: "top-end",
        timer: 1800,
        showConfirmButton: false,
        icon: isApprove ? "success" : "info",
        title: isApprove ? "Đã duyệt yêu cầu" : "Đã từ chối yêu cầu",
      });
      await loadRequests();
      closeActionModal();
    } catch (error) {
      console.error("Action failed", error);
      Swal.fire("Lỗi", parseErrorMessage(error), "error");
    } finally {
      setActionSubmitting(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadRequests({ showLoading: false, search: searchTerm.trim() });
    } finally {
      setRefreshing(false);
    }
  };

  const canReject = !!(activeRequest && activeRequest.status !== "REJECTED");

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
          <div>
            <h4 className="card-title mb-1">💸 Duyệt yêu cầu rút tiền</h4>
            <p className="text-muted mb-0">
              Theo dõi trạng thái, soát ngân hàng và xác nhận chuyển cho CCDV.
            </p>
          </div>
          <button
            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing && (
              <span
                className="spinner-border spinner-border-sm text-secondary"
                role="status"
              />
            )}
            Làm mới
          </button>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <div className="border rounded-3 p-3 bg-light">
              <div className="text-muted text-uppercase small">Chờ duyệt</div>
              <div className="fs-3 fw-bold text-warning">{aggregates.PENDING || 0}</div>
              <small>OTP đã xác thực</small>
            </div>
          </div>
          <div className="col-md-3">
            <div className="border rounded-3 p-3 bg-light">
              <div className="text-muted text-uppercase small">Đang xử lý</div>
              <div className="fs-3 fw-bold text-primary">{aggregates.PROCESSING || 0}</div>
              <small>Cần kế toán xác nhận</small>
            </div>
          </div>
          <div className="col-md-3">
            <div className="border rounded-3 p-3 bg-light">
              <div className="text-muted text-uppercase small">Đã chi trả</div>
              <div className="fs-3 fw-bold text-success">{aggregates.APPROVED || 0}</div>
              <small>
                ≈ {formatCurrency(aggregates.approvedAmount || 0)} chuyển khoản
              </small>
            </div>
          </div>
          <div className="col-md-3">
            <div className="border rounded-3 p-3 bg-light">
              <div className="text-muted text-uppercase small">Tổng yêu cầu</div>
              <div className="fs-3 fw-bold text-danger">{aggregates.total}</div>
              <small>Tổng số tiền {formatCurrency(aggregates.totalAmount)}</small>
            </div>
          </div>
        </div>

        <div className="border rounded-3 p-3 bg-white mb-4 shadow-sm">
          <div className="row g-3 align-items-end">
            <div className="col-md-4">
              <label className="form-label text-muted small">🔎 Tìm kiếm</label>
              <input
                type="text"
                className="form-control"
                placeholder="ID, CCDV, Số tài khoản..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-5">
              <label className="form-label text-muted small">Trạng thái</label>
              <div className="d-flex flex-wrap gap-2">
                {statusFilters.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={`btn btn-sm ${
                      statusFilter === option.id ? "btn-danger" : "btn-outline-secondary"
                    }`}
                    onClick={() => setStatusFilter(option.id)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="col-md-3">
              <label className="form-label text-muted small">Sắp xếp</label>
              <select
                className="form-select"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="NEWEST">Mới nhất</option>
                <option value="OLDEST">Cũ nhất</option>
                <option value="AMOUNT_DESC">Số tiền cao → thấp</option>
                <option value="AMOUNT_ASC">Số tiền thấp → cao</option>
              </select>
            </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-8">
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>CCDV</th>
                    <th>Số tiền</th>
                    <th>Ngân hàng</th>
                    <th>Thời gian</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="text-center text-muted py-5">
                        <div className="d-flex flex-column align-items-center gap-2">
                          <div className="spinner-border text-danger" role="status" />
                          <div>Đang tải dữ liệu rút tiền...</div>
                        </div>
                      </td>
                    </tr>
                  ) : processedRequests.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center text-muted py-5">
                        Không có yêu cầu phù hợp bộ lọc hiện tại.
                      </td>
                    </tr>
                  ) : (
                    processedRequests.map((request) => {
                      const status = statusMeta[request.status] || null;
                      const typeBadge = request.type && typeBadges[request.type];
                      return (
                        <tr
                          key={request.id}
                          className={`align-middle ${
                            selectedRequestId === request.id ? "table-active" : ""
                          }`}
                          style={{ cursor: "pointer" }}
                          onClick={() => setSelectedRequestId(request.id)}
                        >
                          <td>
                            <div className="fw-semibold">{request.providerName}</div>
                            <div className="text-muted small">{request.providerCode}</div>
                            <div className="d-flex gap-2 mt-1">
                              {status && <span className={status.className}>{status.label}</span>}
                              {typeBadge && <span className={typeBadge.className}>{typeBadge.label}</span>}
                            </div>
                          </td>
                          <td>
                            <div className="fw-bold text-danger">
                              {formatCurrency(request.amount)}
                            </div>
                            <div className="text-muted small">
                              Nhận thực tế {formatCurrency(getNetAmount(request))}
                            </div>
                          </td>
                          <td>
                            <div className="fw-semibold">{request.bank?.name}</div>
                            <div className="text-muted small">
                              {request.bank?.accountNumber} · {request.bank?.accountName}
                            </div>
                          </td>
                          <td>
                            <div className="small text-muted">
                              Tạo: {formatDateTime(request.createdAt)}
                            </div>
                            <div className="small text-muted">
                              Cập nhật: {formatDateTime(request.updatedAt)}
                            </div>
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button
                                type="button"
                                className="btn btn-success"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  startAction("APPROVE", request);
                                }}
                              >
                                Duyệt
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-danger"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  startAction("REJECT", request);
                                }}
                                disabled={request.status === "REJECTED"}
                              >
                                Từ chối
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="col-lg-4">
            {loading ? (
              <div className="border rounded-3 p-4 text-center text-muted">
                <div className="spinner-border text-danger" role="status" />
                <div className="mt-2">Đang tải chi tiết yêu cầu...</div>
              </div>
            ) : activeRequest ? (
              <div className="border rounded-3 shadow-sm p-3 sticky-top" style={{ top: "90px" }}>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h5 className="mb-1">Yêu cầu {activeRequest.id}</h5>
                    <div className="text-muted small">
                      {activeRequest.providerName} · {activeRequest.providerCode}
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="fs-5 fw-bold text-danger">
                      {formatCurrency(activeRequest.amount)}
                    </div>
                    <div className="text-muted small">
                      Nhận thực tế {formatCurrency(getNetAmount(activeRequest))}
                    </div>
                  </div>
                </div>

                <div className="bg-light rounded-3 p-3 mb-3">
                  <div className="text-uppercase text-muted small">Ngân hàng thụ hưởng</div>
                  <div className="fw-semibold">{activeRequest.bank?.name}</div>
                  <div className="small">
                    STK {activeRequest.bank?.accountNumber} · {activeRequest.bank?.accountName}
                  </div>
                  <div className="small text-muted">{activeRequest.bank?.branch}</div>
                </div>

                <div className="mb-3">
                  <div className="text-uppercase text-muted small">Ghi chú CCDV</div>
                  <div>{activeRequest.note || "Không có ghi chú."}</div>
                </div>

                {activeRequest.adminNote && (
                  <div className="mb-3">
                    <div className="text-uppercase text-muted small">Ghi chú admin</div>
                    <div className="fw-semibold text-danger">{activeRequest.adminNote}</div>
                  </div>
                )}

                <div className="mb-4">
                  <div className="text-uppercase text-muted small">Nhật ký xử lý</div>
                  {(activeRequest.timeline || []).length === 0 ? (
                    <div className="text-muted small mt-2">Chưa có dữ liệu lịch sử.</div>
                  ) : (
                    <ul className="list-unstyled mb-0 mt-2">
                      {(activeRequest.timeline || []).map((item, index) => (
                        <li
                          key={`${item.label}-${index}`}
                          className="d-flex justify-content-between border-bottom py-1 small"
                        >
                          <span>{item.label}</span>
                          <span className="text-muted">{formatDateTime(item.time)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="d-flex flex-column gap-2">
                  <button
                    className="btn btn-success"
                    onClick={() => startAction("APPROVE", activeRequest)}
                  >
                    Xác nhận chuyển khoản
                  </button>
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => startAction("REJECT", activeRequest)}
                    disabled={!canReject}
                  >
                    Từ chối yêu cầu
                  </button>
                </div>
              </div>
            ) : (
              <div className="border rounded-3 p-4 text-center text-muted">
                Chọn một yêu cầu ở bảng để xem chi tiết.
              </div>
            )}
          </div>
        </div>
      </div>

      {showActionModal && currentAction && (
        <>
          <div className="modal-backdrop fade show" />
          <div className="modal d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {currentAction.type === "APPROVE" ? "Xác nhận duyệt" : "Từ chối yêu cầu"}
                  </h5>
                  <button type="button" className="btn-close" onClick={closeActionModal} />
                </div>
                <div className="modal-body">
                  <p className="mb-2">
                    Bạn đang thao tác với yêu cầu{" "}
                    <strong>{currentAction.request.id}</strong> của{" "}
                    <strong>{currentAction.request.providerName}</strong>.
                  </p>
                  <p className="text-muted small">
                    Vui lòng lưu ý nhập ghi chú để CCDV nắm được quyết định của admin.
                  </p>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Ghi chú hiển thị cho CCDV..."
                    value={actionNote}
                    onChange={(e) => setActionNote(e.target.value)}
                  />
                </div>
                <div className="modal-footer">
                  <button className="btn btn-outline-secondary" onClick={closeActionModal}>
                    Huỷ
                  </button>
                  <button
                    className={`btn ${
                      currentAction.type === "APPROVE" ? "btn-success" : "btn-danger"
                    }`}
                    onClick={handleConfirmAction}
                    disabled={actionSubmitting}
                  >
                    {actionSubmitting && (
                      <span className="spinner-border spinner-border-sm me-2" role="status" />
                    )}
                    Xác nhận
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
