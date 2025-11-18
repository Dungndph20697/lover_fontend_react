import axios from "axios";
import { apiHireSession } from "../../config/api";

// Hàm helper lấy token từ localStorage
const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

// API CALLS

// Lấy danh sách đơn thuê
const getSessions = async (ccdvId) => {
    const res = await axios.get(`${apiHireSession}/${ccdvId}`, getAuthHeader());
    return res.data;
};

// Lấy thống kê đơn thuê
const getStatistics = async (ccdvId) => {
    const res = await axios.get(`${apiHireSession}/statistics/${ccdvId}`, getAuthHeader());
    return res.data;
};

// Xác nhận đơn thuê
const acceptSession = async (sessionId, ccdvId) => {
    const res = await axios.put(
        `${apiHireSession}/${sessionId}/accept?ccdvId=${ccdvId}`,
        null,
        getAuthHeader()
    );
    return res.data;
};

// Hoàn thành đơn thuê
const completeSession = async (sessionId, ccdvId) => {
    const res = await axios.put(
        `${apiHireSession}/${sessionId}/complete?ccdvId=${ccdvId}`,
        null,
        getAuthHeader()
    );
    return res.data;
};

// Báo cáo đơn thuê
const reportSession = async (sessionId, ccdvId, reportText) => {
    const res = await axios.put(
        `${apiHireSession}/${sessionId}/report`,
        {
            ccdvId: ccdvId,
            report: reportText
        },
        getAuthHeader()
    );
    return res.data;
};


// Lấy chi tiết đơn thuê
const getSessionDetail = async (sessionId) => {
    const res = await axios.get(`${apiHireSession}/detail/${sessionId}`, getAuthHeader());
    return res.data;
};

// Cập nhật phản hồi về người thuê
const updateFeedback = async (sessionId, ccdvId, feedback) => {
    const res = await axios.put(
        `${apiHireSession}/${sessionId}/feedback`,
        {
            ccdvId: ccdvId,
            feedback: feedback
        },
        getAuthHeader()
    );
    return res.data;
};


// PUBLIC SERVICE FUNCTIONS (Export)

// Lấy danh sách đơn thuê
export const fetchHireSessions = async (ccdvId) => {
    try {
        const res = await axios.get(`${apiHireSession}/${ccdvId}`, getAuthHeader());
        console.log("API hire-sessions response:", res.data);
        // Nếu backend trả về { success: true, data: [...] } thì dùng:
        return res.data.success ? res.data.data : [];
        // Nếu backend trả về trực tiếp mảng thì dùng:
        // return res.data || [];
    } catch (err) {
        console.error(err);
        return [];
    }
};

// Lấy thống kê đơn thuê
export const fetchHireStatistics = async (ccdvId) => {
    try {
        const res = await getStatistics(ccdvId);
        return res.success ? res.data : null;
    } catch (error) {
        console.error("Lỗi khi tải thống kê:", error);
        throw error;
    }
};

// Xác nhận đơn thuê
export const handleAccept = async (sessionId, ccdvId) => {
    try {
        const data = await acceptSession(sessionId, ccdvId);
        return data;
    } catch (error) {
        console.error("Lỗi khi xác nhận đơn:", error);
        throw error;
    }
};

// Hoàn thành đơn thuê
export const handleComplete = async (sessionId, ccdvId) => {
    try {
        const data = await completeSession(sessionId, ccdvId);
        return data;
    } catch (error) {
        console.error("Lỗi khi hoàn thành đơn:", error);
        throw error;
    }
};

// Gửi báo cáo
export const handleReport = async (sessionId, ccdvId, reportText) => {
    try {
        const data = await reportSession(sessionId, ccdvId, reportText);
        return data;
    } catch (error) {
        console.error("Lỗi khi gửi báo cáo:", error);
        throw error;
    }
};

// Lấy chi tiết đơn thuê
export const fetchSessionDetail = async (sessionId) => {
    try {
        const data = await getSessionDetail(sessionId);
        return data.success ? data.data : null;
    } catch (error) {
        console.error("Lỗi khi tải chi tiết đơn:", error);
        throw error;
    }
};

// Cập nhật phản hồi
export const handleUpdateFeedback = async (sessionId, ccdvId, feedback) => {
    try {
        const data = await updateFeedback(sessionId, ccdvId, feedback);
        return data;
    } catch (error) {
        console.error("Lỗi khi cập nhật phản hồi:", error);
        throw error;
    }
};