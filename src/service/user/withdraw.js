import axiosClient from "../../config/axiosClient";

// Gửi yêu cầu rút tiền
export const requestWithdraw = (amount, bankName, bankAccountNumber, bankAccountName) => {
    return axiosClient.post("/withdraw/request", {
        amount: Number(amount),
        bankName,
        bankAccountNumber,
        bankAccountName,
    });
};

// Xác minh OTP
export const verifyWithdrawOtp = (requestId, otp) => {
    return axiosClient.post("/withdraw/verify-otp", { requestId, otp });
};

// Gửi lại OTP
export const resendWithdrawOtp = (requestId) => {
    return axiosClient.post("/withdraw/resend-otp", { requestId });
};

// CCDV xem lịch sử rút tiền
export const getWithdrawHistory = () => {
    return axiosClient.get("/withdraw/history");
};

// ADMIN lấy danh sách yêu cầu rút
export const adminGetList = () => {
    return axiosClient.get("/admin/withdraw/list");
};

// ADMIN duyệt
export const adminApprove = (id) => {
    return axiosClient.post(`/admin/withdraw/approve/${id}`);
};

// ADMIN từ chối
export const adminReject = (id) => {
    return axiosClient.post(`/admin/withdraw/reject/${id}`);
};

// ADMIN tìm kiếm yêu cầu rút
export const adminSearchWithdraw = (keyword) => {
    return axiosClient.get("/admin/withdraw/search", {
        params: { q: keyword },
    });
}
