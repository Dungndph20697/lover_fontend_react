import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { requestWithdraw } from "../../service/user/withdraw";
import WithdrawOtp from "./WithdrawOtp";
import WithdrawStatus from "./WithdrawStatus";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { getBalance } from "../../service/user/wallet";

// Fake danh sách ngân hàng — có thể replace bằng API từ backend
const bankList = [
    { code: "VCB", name: "Vietcombank" },
    { code: "TCB", name: "Techcombank" },
    { code: "ACB", name: "ACB" },
    { code: "MB", name: "MB Bank" },
    { code: "VTB", name: "VietinBank" },
];

const withdrawSchema = Yup.object().shape({
    amount: Yup.number()
        .typeError("Số tiền phải là số")
        .positive("Số tiền phải lớn hơn 0")
        .required("Vui lòng nhập số tiền"),
    bankName: Yup.string().required("Vui lòng chọn ngân hàng"),
    bankAccountNumber: Yup.string()
        .trim()
        .matches(/^[0-9]{6,20}$/, "Số tài khoản không hợp lệ")
        .required("Vui lòng nhập số tài khoản"),
    bankAccountName: Yup.string()
        .trim()
        .min(3, "Tên chủ tài khoản quá ngắn")
        .required("Vui lòng nhập tên chủ tài khoản"),
});

export default function WithdrawRequest() {
    const [amount, setAmount] = useState("");
    const [bankName, setBankName] = useState("");
    const [bankAccountNumber, setBankAccountNumber] = useState("");
    const [bankAccountName, setBankAccountName] = useState("");
    const [currentRequestId, setCurrentRequestId] = useState(null);
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [statusRefreshKey, setStatusRefreshKey] = useState(0);
    const [balance, setBalance] = useState(null);
    const [balanceLoading, setBalanceLoading] = useState(false);
    const [balanceError, setBalanceError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    // Tính phí rút tiền 5%
    const fee = amount ? Math.floor(amount * 0.05) : 0;
    const received = amount ? amount - fee : 0;

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const fetchBalance = async () => {
            setBalanceLoading(true);
            try {
                const amount = await getBalance(token);
                setBalance(amount);
                setBalanceError("");
            } catch (err) {
                setBalanceError(
                    err.response?.data?.message || "Không thể tải số dư ví"
                );
            } finally {
                setBalanceLoading(false);
            }
        };

        fetchBalance();
    }, []);

    const handleRequest = async () => {
        const numericAmount = Number(amount);

        try {
            await withdrawSchema.validate(
                {
                    amount: numericAmount,
                    bankName,
                    bankAccountNumber,
                    bankAccountName,
                },
                { abortEarly: false }
            );

            setErrors({});
        } catch (validationError) {
            const nextErrors = {};
            validationError.inner?.forEach((err) => {
                if (err.path) nextErrors[err.path] = err.message;
            });
            setErrors(nextErrors);
            return;
        }

        if (balance !== null && numericAmount > balance) {
            return Swal.fire(
                "Lỗi",
                "Số tiền vượt quá số dư khả dụng.",
                "warning"
            );
        }

        try {
            setSubmitting(true);
            const res = await requestWithdraw(
                numericAmount,
                bankName,
                bankAccountNumber,
                bankAccountName
            );

            Swal.fire("Thành công", res.data.message, "success");

            localStorage.setItem("withdrawRequestId", res.data.requestId);
            setCurrentRequestId(res.data.requestId);
            setShowOtpModal(true);
        } catch (err) {
            Swal.fire("Lỗi", err.response?.data?.message || "Có lỗi xảy ra", "error");
        } finally {
            setSubmitting(false);
        }
    };

    const handleOtpVerified = () => {
        setShowOtpModal(false);
        localStorage.removeItem("withdrawRequestId");
        setStatusRefreshKey((prev) => prev + 1);
    };

    return (
        <>
            <div className="card p-4 shadow-sm">
                <div className="d-flex justify-content-between align-items-start">
                    <div>
                        <h4>💸 Rút tiền</h4>
                        <small className="text-muted">
                            Nhập thông tin ngân hàng để nhận tiền nhanh chóng.
                        </small>
                    </div>

                    <div className="text-end">
                        <div className="text-uppercase text-muted small">Số dư khả dụng</div>
                        {balanceLoading ? (
                            <div className="spinner-border spinner-border-sm text-danger" />
                        ) : balanceError ? (
                            <div className="text-danger small">{balanceError}</div>
                        ) : (
                            <div className="fw-bold text-danger">
                                {balance?.toLocaleString("vi-VN")}đ
                            </div>
                        )}
                    </div>
                </div>

                {/* Số tiền */}
                <input
                    type="text"
                    className={`form-control mt-3 ${errors.amount ? "is-invalid" : ""}`}
                    placeholder="Nhập số tiền muốn rút"
                    value={amount.toLocaleString("vi-VN")}
                    onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, "");
                        setAmount(raw);
                    }}
                />
                {errors.amount && <div className="invalid-feedback d-block">{errors.amount}</div>}

                {/* Hiển thị phí + nhận thực tế */}
                {amount && (
                    <div className="mt-2 small text-muted">
                        Phí rút tiền (5%): {fee.toLocaleString("vi-VN")}đ
                        <br />
                        <span className="fw-bold text-success">
                            Nhận thực tế: {received.toLocaleString("vi-VN")}đ
                        </span>
                    </div>
                )}

                {/* Chọn ngân hàng */}
                <select
                    className={`form-select mt-3 ${errors.bankName ? "is-invalid" : ""}`}
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                >
                    <option value="">-- Chọn ngân hàng --</option>
                    {bankList.map((b) => (
                        <option key={b.code} value={b.name}>
                            {b.name}
                        </option>
                    ))}
                </select>
                {errors.bankName && (
                    <div className="invalid-feedback d-block">{errors.bankName}</div>
                )}

                {/* Số tài khoản */}
                <input
                    type="text"
                    className={`form-control mt-3 ${errors.bankAccountNumber ? "is-invalid" : ""}`}
                    placeholder="Số tài khoản"
                    value={bankAccountNumber}
                    onChange={(e) => {
                        setBankAccountNumber(e.target.value);
                    }}
                />
                {errors.bankAccountNumber && (
                    <div className="invalid-feedback d-block">{errors.bankAccountNumber}</div>
                )}

                {/* Chủ tài khoản */}
                <input
                    type="text"
                    className={`form-control mt-3 ${errors.bankAccountName ? "is-invalid" : ""}`}
                    placeholder="Tên chủ tài khoản"
                    value={bankAccountName}
                    onChange={(e) => {
                        setBankAccountName(e.target.value);
                    }}
                />
                {errors.bankAccountName && (
                    <div className="invalid-feedback d-block">{errors.bankAccountName}</div>
                )}

                {/* Nút gửi */}
                <button
                    className="btn btn-danger mt-3 d-flex align-items-center justify-content-center gap-2"
                    onClick={handleRequest}
                    disabled={submitting || showOtpModal}
                >
                    {submitting && (
                        <span className="spinner-border spinner-border-sm" />
                    )}
                    Gửi yêu cầu rút tiền
                </button>
            </div>

            {/* Lịch sử */}
            <WithdrawStatus key={statusRefreshKey} />

            {/* OTP */}
            <WithdrawOtp
                requestId={currentRequestId}
                show={showOtpModal}
                onClose={() => setShowOtpModal(false)}
                onVerified={handleOtpVerified}
            />
        </>
    );
}
