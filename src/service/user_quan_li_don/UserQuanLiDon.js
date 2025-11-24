import axios from "axios";
import {
  apiUserHireSessions,
  apiUserHireStatistics,
  apiUserHireDetail,
  apiUserHireComplete,
  apiUserHireCancel,
  apiUserHireReport,
  apiUserHireUpdateStatus,
} from "../../config/api";

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// ✅ 1. Lấy danh sách đơn thuê
export const getDanhSachDonThue = async (userId, status = null, page = 0, size = 10) => {
  try {
    const params = { userId, page, size };
    if (status) params.status = status;

    const response = await axios.get(apiUserHireSessions, {
      params,
      headers: authHeader(),
    });

    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error getDanhSachDonThue:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Không thể tải danh sách đơn thuê",
    };
  }
};

// ✅ 2. Thống kê đơn thuê
export const getThongKeDonThue = async (userId) => {
  try {
    const response = await axios.get(apiUserHireStatistics(userId), {
      headers: authHeader(),
    });

    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error getThongKeDonThue:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Không thể tải thống kê đơn thuê",
    };
  }
};

// ✅ 3. Chi tiết đơn thuê
export const getChiTietDonThue = async (sessionId) => {
  try {
    const response = await axios.get(apiUserHireDetail(sessionId), {
      headers: authHeader(),
    });

    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error getChiTietDonThue:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Không thể tải chi tiết đơn thuê",
    };
  }
};

// ✅ 4. Hoàn thành đơn thuê (ACCEPTED -> COMPLETED)
export const hoanThanhDonThue = async (sessionId, userId) => {
  try {
    const response = await axios.patch(
      apiUserHireComplete(sessionId),
      null,
      {
        params: { userId },
        headers: authHeader(),
      }
    );

    return { 
      success: true, 
      data: response.data.data,
      message: response.data.message || "Đã hoàn thành đơn"
    };
  } catch (error) {
    console.error("Error hoanThanhDonThue:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Không thể hoàn thành đơn thuê",
    };
  }
};

// ✅ 5. Hủy đơn thuê (DELETE)
export const huyDonThue = async (sessionId, userId) => {
  try {
    const response = await axios.delete(apiUserHireCancel(sessionId), {
      params: { userId },
      headers: authHeader(),
    });

    return { 
      success: true, 
      message: response.data.message || "Đã hủy đơn thành công"
    };
  } catch (error) {
    console.error("Error huyDonThue:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Không thể hủy đơn thuê",
    };
  }
};

// ✅ 6. Thêm báo cáo (COMPLETED -> REVIEW_REPORT)
export const themBaoCao = async (sessionId, userId, report) => {
  try {
    const response = await axios.post(
      apiUserHireReport(sessionId),
      { report },
      {
        params: { userId },
        headers: authHeader(),
      }
    );

    return { 
      success: true, 
      data: response.data.data,
      message: response.data.message || "Đã gửi báo cáo thành công"
    };
  } catch (error) {
    console.error("Error themBaoCao:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Không thể gửi báo cáo",
    };
  }
};

// ✅ 7. Cập nhật trạng thái đơn thuê
export const capNhatTrangThaiDonThue = async (sessionId, userId, status) => {
  try {
    const response = await axios.patch(
      apiUserHireUpdateStatus(sessionId),
      null,
      {
        params: { userId, status },
        headers: authHeader(),
      }
    );

    return { 
      success: true, 
      data: response.data.data,
      message: response.data.message || "Đã cập nhật trạng thái"
    };
  } catch (error) {
    console.error("Error capNhatTrangThaiDonThue:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Không thể cập nhật trạng thái",
    };
  }
};


// =====================
// ===== HELPERS =====
// =====================

// ✅ 8. Helper: Format tiền
export const formatGiaTien = (amount) => {
  if (!amount && amount !== 0) return "0₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// ✅ 9. Helper: Format ngày giờ
export const formatNgayGio = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ✅ 10. Helper: Tính thời lượng (giờ)
export const tinhThoiLuong = (start, end) => {
  if (!start || !end) return 0;
  const s = new Date(start);
  const e = new Date(end);
  const diff = (e - s) / 1000 / 60 / 60;
  return diff.toFixed(1);
};

// ✅ 11. Helper: Status text - UPDATE với REVIEW_REPORT
export const getStatusText = (status) => {
  const statusMap = {
    PENDING: "Chờ phản hồi",
    ACCEPTED: "Đã nhận",
    COMPLETED: "Đã hoàn thành",
    REVIEW_REPORT: "⏳ Báo cáo chờ duyệt",
    REPORTED: "❌ Đã báo cáo",
    CANCELLED: "Đã hủy",
  };
  return statusMap[status] || "Không xác định";
};

// ✅ 12. Helper: Status CSS class - UPDATE với REVIEW_REPORT
export const getStatusClass = (status) => {
  const classMap = {
    PENDING: "bg-warning text-dark",
    ACCEPTED: "bg-info text-white",
    COMPLETED: "bg-success text-white",
    REVIEW_REPORT: "bg-secondary text-white",
    REPORTED: "bg-danger text-white",
    CANCELLED: "bg-dark text-white",
  };
  return classMap[status] || "bg-light text-dark";
};

// ✅ 13. Logic check các hành động

/**
 * Kiểm tra có thể hoàn thành đơn không
 * Chỉ khi status là ACCEPTED
 */
export const coTheHoanThanh = (status) => {
  return status === "ACCEPTED";
};

/**
 * Kiểm tra có thể hủy đơn không
 * Chỉ khi status là PENDING (Chờ phản hồi)
 */
export const coTheHuy = (status) => {
  return status === "PENDING";
};

/**
 * Kiểm tra có thể gửi báo cáo không
 * Chỉ khi status là COMPLETED (Đã hoàn thành) và chưa có báo cáo
 */
export const coTheBaoCao = (status, hasReport) => {
  return status === "COMPLETED" && !hasReport;
};

/**
 * Kiểm tra báo cáo đang chờ duyệt
 * Status là REVIEW_REPORT
 */
export const isReportPending = (status) => {
  return status === "REVIEW_REPORT";
};

/**
 * Kiểm tra báo cáo đã được duyệt
 * Status là REPORTED
 */
export const isReportApproved = (status) => {
  return status === "REPORTED";
};