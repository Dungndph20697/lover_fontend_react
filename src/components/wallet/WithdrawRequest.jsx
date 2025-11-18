import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { requestWithdraw } from "../../service/user/withdraw";
import WithdrawOtp from "./WithdrawOtp";
import WithdrawStatus from "./WithdrawStatus";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { getBalance } from "../../service/user/wallet";

const withdrawSchema = Yup.object().shape({
    amount: Yup.number()
        .typeError("Số tiền phải là số")
        .positive("Số tiền phải lớn hơn 0")
        .required("Vui lòng nhập số tiền"),
    bankName: Yup.string().trim().required("Vui lòng nhập tên ngân hàng"),
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
                console.error("Failed to load balance", err);
                setBalanceError(err.response?.data?.message || "Không thể tải số dư ví");
            } finally {
                setBalanceLoading(false);
            }
        };

        fetchBalance();
    }, []);

    // gửi yêu cầu rút tiền
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
                "Số tiền vượt quá số dư khả dụng. Vui lòng nhập lại.",
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
        setStatusRefreshKey(prev => prev + 1);
    };

    return (
        <>
            <div className="card p-4 shadow-sm">
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                    <div>
                        <h4>💸 Rút tiền</h4>
                        <small className="text-muted">Nhập thông tin ngân hàng để nhận tiền.</small>
                    </div>
                    <div className="text-end">
                        <div className="text-uppercase text-muted small">Số dư khả dụng</div>
                        {balanceLoading ? (
                            <div className="spinner-border spinner-border-sm text-danger" role="status" />
                        ) : balanceError ? (
                            <div className="text-danger small">{balanceError}</div>
                        ) : (
                            <div className="fw-bold text-danger">
                                {balance !== null ? balance.toLocaleString("vi-VN") : "--"}đ
                            </div>
                        )}
                    </div>
                </div>

                <input
                    type="number"
                    className={`form-control mt-3 ${errors.amount ? "is-invalid" : ""}`}
                    placeholder="Nhập số tiền muốn rút..."
                    value={amount}
                    onChange={(e) => {
                        setAmount(e.target.value);
                        if (errors.amount) setErrors((prev) => ({ ...prev, amount: "" }));
                    }}
                />
                {errors.amount && <div className="invalid-feedback d-block">{errors.amount}</div>}

                <input
                    type="text"
                    className="form-control mt-3"
                    placeholder="Tên ngân hàng (VD: Vietcombank)"
                    value={bankName}
                    onChange={(e) => {
                        setBankName(e.target.value);
                        if (errors.bankName) setErrors((prev) => ({ ...prev, bankName: "" }));
                    }}
                    style={errors.bankName ? { borderColor: "#dc3545" } : undefined}
                />
                {errors.bankName && (
                    <div className="invalid-feedback d-block">{errors.bankName}</div>
                )}

                <input
                    type="text"
                    className="form-control mt-3"
                    placeholder="Số tài khoản"
                    value={bankAccountNumber}
                    onChange={(e) => {
                        setBankAccountNumber(e.target.value);
                        if (errors.bankAccountNumber)
                            setErrors((prev) => ({ ...prev, bankAccountNumber: "" }));
                    }}
                    style={errors.bankAccountNumber ? { borderColor: "#dc3545" } : undefined}
                />
                {errors.bankAccountNumber && (
                    <div className="invalid-feedback d-block">{errors.bankAccountNumber}</div>
                )}

                <input
                    type="text"
                    className="form-control mt-3"
                    placeholder="Tên chủ tài khoản"
                    value={bankAccountName}
                    onChange={(e) => {
                        setBankAccountName(e.target.value);
                        if (errors.bankAccountName)
                            setErrors((prev) => ({ ...prev, bankAccountName: "" }));
                    }}
                    style={errors.bankAccountName ? { borderColor: "#dc3545" } : undefined}
                />
                {errors.bankAccountName && (
                    <div className="invalid-feedback d-block">{errors.bankAccountName}</div>
                )}

                <button
                    className="btn btn-danger mt-3 d-flex align-items-center justify-content-center gap-2"
                    onClick={handleRequest}
                    disabled={submitting || showOtpModal}
                >
                    {submitting && (
                        <span className="spinner-border spinner-border-sm" role="status" />
                    )}
                    Gửi yêu cầu rút tiền
                </button>
                {showOtpModal && (
                    <div className="text-warning small mt-2">
                        Vui lòng xác nhận OTP trước khi gửi yêu cầu mới.
                    </div>
                )}
            </div>
            <WithdrawStatus key={statusRefreshKey} />
            <WithdrawOtp
                requestId={currentRequestId}
                show={showOtpModal}
                onClose={() => setShowOtpModal(false)}
                onVerified={handleOtpVerified}
            />
        </>
    );
}
