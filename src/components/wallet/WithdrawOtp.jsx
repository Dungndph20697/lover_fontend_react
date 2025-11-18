import React, { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { resendWithdrawOtp, verifyWithdrawOtp } from "../../service/user/withdraw";

export default function WithdrawOtp({ requestId, show, onClose, onVerified }) {
    const [otp, setOtp] = useState("");
    const [countdown, setCountdown] = useState(180);
    const [resending, setResending] = useState(false);
    const timerRef = useRef(null);

    const stopTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    const startTimer = () => {
        stopTimer();
        setCountdown(180);
        timerRef.current = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    stopTimer();
                    Swal.fire("Hết hạn", "OTP đã hết hạn, vui lòng gửi yêu cầu mới", "error");
                    handleClose();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleClose = () => {
        stopTimer();
        onClose?.();
    };

    const formatTime = (sec) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${s < 10 ? "0" + s : s}`;
    };

    useEffect(() => {
        if (!show) {
            stopTimer();
            setOtp("");
            return;
        }

        setOtp("");
        startTimer();

        return () => stopTimer();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show]);

    const handleVerify = async () => {
        if (!requestId) {
            Swal.fire("Lỗi", "Không tìm thấy yêu cầu rút tiền", "error");
            return;
        }

        if (!otp) {
            Swal.fire("Lỗi", "Vui lòng nhập OTP", "error");
            return;
        }

        try {
            await verifyWithdrawOtp(requestId, otp);
            Swal.fire("Thành công", "Xác minh OTP thành công!", "success");
            stopTimer();
            onVerified?.();
        } catch (err) {
            Swal.fire("Lỗi", err.response?.data?.message || "OTP sai", "error");
        }
    };

    const handleResend = async () => {
        if (!requestId) {
            Swal.fire("Lỗi", "Không tìm thấy yêu cầu rút tiền", "error");
            return;
        }

        setResending(true);
        try {
            await resendWithdrawOtp(requestId);
            Swal.fire("Thành công", "Đã gửi lại OTP. Vui lòng kiểm tra email.", "success");
            setOtp("");
            startTimer();
        } catch (err) {
            Swal.fire("Lỗi", err.response?.data?.message || "Không gửi lại được OTP", "error");
        } finally {
            setResending(false);
        }
    };

    return (
        <>
            <div
                className={`modal fade ${show ? "show d-block" : ""}`}
                style={{ display: show ? "block" : "none" }}
                tabIndex="-1"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">🔐 Nhập mã OTP</h5>
                            <button className="btn-close" onClick={handleClose}></button>
                        </div>

                        <div className="modal-body">
                            <p>Mã OTP đã gửi về email của bạn và có hiệu lực 3 phút.</p>
                            <p className="text-muted small mb-2">
                                Nếu OTP hết hạn, vui lòng chọn “Gửi lại OTP”.
                            </p>

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nhập OTP..."
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />

                            <div className="d-flex flex-column align-items-center gap-2 mt-3">
                                <div className="text-danger fw-bold">
                                    OTP hết hạn sau: {formatTime(countdown)}
                                </div>
                                <button
                                    className="btn btn-link text-decoration-none"
                                    onClick={handleResend}
                                    disabled={resending}
                                >
                                    {resending ? (
                                        <>
                                            <span
                                                className="spinner-border spinner-border-sm me-2"
                                                role="status"
                                            />
                                            Đang gửi lại...
                                        </>
                                    ) : (
                                        "Gửi lại OTP"
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={handleClose}>
                                Đóng
                            </button>
                            <button className="btn btn-success" onClick={handleVerify}>
                                Xác nhận OTP
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {show && <div className="modal-backdrop fade show"></div>}
        </>
    );
}
