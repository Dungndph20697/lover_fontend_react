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

// 1. Lấy danh sách đơn thuê
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
    return {
      success: false,
      message: error.response?.data || "Không thể tải danh sách đơn thuê",
    };
  }
};

// 2. Thống kê đơn thuê
export const getThongKeDonThue = async (userId) => {
  try {
    const response = await axios.get(apiUserHireStatistics(userId), {
      headers: authHeader(),
    });

    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data || "Không thể tải thống kê đơn thuê",
    };
  }
};

// 3. Chi tiết đơn thuê - ✅ FIX: Bỏ userId khỏi params
export const getChiTietDonThue = async (sessionId) => {
  try {
    const response = await axios.get(apiUserHireDetail(sessionId), {
      headers: authHeader(),
    });

    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data || "Không thể tải chi tiết đơn thuê",
    };
  }
};

// 4. Hoàn thành đơn thuê
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

    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data || "Không thể hoàn thành đơn thuê",
    };
  }
};

// 5. Hủy đơn thuê - ✅ FIX QUAN TRỌNG: Đổi từ PATCH sang DELETE
export const huyDonThue = async (sessionId, userId) => {
  try {
    await axios.delete(apiUserHireCancel(sessionId), {
      params: { userId },
      headers: authHeader(),
    });

    return { success: true, message: "Đã hủy đơn thành công" };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data || "Không thể hủy đơn thuê",
    };
  }
};

// 6. Thêm báo cáo - ✅ FIX: Đổi tên function và body format
export const themBaoCao = async (sessionId, userId, report) => {
  try {
    const response = await axios.post(
      apiUserHireReport(sessionId),
      { report }, // Backend nhận field "report", không phải "reportContent"
      {
        params: { userId },
        headers: authHeader(),
      }
    );

    return { 
      success: true, 
      data: response.data,
      message: "Đã gửi báo cáo thành công"
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data || "Không thể gửi báo cáo",
    };
  }
};

// 7. Cập nhật trạng thái đơn thuê
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

    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data || "Không thể cập nhật trạng thái",
    };
  }
};


// ===== HELPERS =====

// 8. Helper: Format tiền
export const formatGiaTien = (amount) => {
  if (!amount && amount !== 0) return "0₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// 9. Helper: Format ngày giờ
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

// 10. Helper: Tính thời lượng
export const tinhThoiLuong = (start, end) => {
  if (!start || !end) return 0;
  const s = new Date(start);
  const e = new Date(end);
  const diff = (e - s) / 1000 / 60 / 60; // giờ
  return diff.toFixed(1); // Trả về 1 chữ số thập phân
};

// 11. Helper: Status text
export const getStatusText = (status) => {
  switch (status) {
    case "PENDING": return "Chờ phản hồi";
    case "ACCEPTED": return "Đã nhận";
    case "COMPLETED": return "Đã hoàn thành";
    case "REPORTED": return "Đã báo cáo";
    case "CANCELLED": return "Đã hủy";
    default: return "Không xác định";
  }
};

// 12. Helper: Status CSS class
export const getStatusClass = (status) => {
  switch (status) {
    case "PENDING": return "bg-warning text-dark";
    case "ACCEPTED": return "bg-info text-white";
    case "COMPLETED": return "bg-success text-white";
    case "REPORTED": return "bg-secondary text-white";
    case "CANCELLED": return "bg-dark text-white";
    default: return "bg-light text-dark";
  }
};

// 13. Logic check các hành động
export const coTheHoanThanh = (status) => status === "ACCEPTED";

export const coTheHuy = (status) => status === "PENDING";

export const coTheBaoCao = (status) => status === "COMPLETED";