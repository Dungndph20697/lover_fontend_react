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

// API Đơn thuê

// Lấy danh sách đơn thuê
export const getSessions = async (ccdvId) => {
    const res = await axios.get(`${apiHireSession}/${ccdvId}`, getAuthHeader());
    return res.data;
};

// Lấy thống kê đơn thuê
export const getStatistics = async (ccdvId) => {
    const res = await axios.get(`${apiHireSession}/statistics/${ccdvId}`, getAuthHeader());
    return res.data;
};

// Xác nhận đơn thuê
export const acceptSession = async (sessionId, ccdvId) => {
    const res = await axios.put(
        `${apiHireSession}/${sessionId}/accept?ccdvId=${ccdvId}`,
        null,
        getAuthHeader()
    );
    return res.data;
};

// Hoàn thành đơn thuê
export const completeSession = async (sessionId, ccdvId) => {
    const res = await axios.put(
        `${apiHireSession}/${sessionId}/complete?ccdvId=${ccdvId}`,
        null,
        getAuthHeader()
    );
    return res.data;
};

// Báo cáo đơn thuê
export const reportSession = async (sessionId, ccdvId, reportText) => {
    const res = await axios.put(
        `${apiHireSession}/${sessionId}/report?ccdvId=${ccdvId}`,
        { report: reportText },
        getAuthHeader()
    );
    return res.data;
};

// Wrapper xử lý lỗi

export const fetchHireSessions = async (ccdvId) => {
    try {
        const data = await getSessions(ccdvId);
        return data.success ? data.data : [];
    } catch (error) {
        console.error("Lỗi khi tải danh sách đơn thuê:", error);
        throw error;
    }
};

export const fetchHireStatistics = async (ccdvId) => {
    try {
        const data = await getStatistics(ccdvId);
        return data.success ? data : null;
    } catch (error) {
        console.error("Lỗi khi tải thống kê:", error);
        throw error;
    }
};

export const handleAccept = async (sessionId, ccdvId) => {
    try {
        const data = await acceptSession(sessionId, ccdvId);
        return data;
    } catch (error) {
        console.error("Lỗi khi xác nhận đơn:", error);
        throw error;
    }
};

export const handleComplete = async (sessionId, ccdvId) => {
    try {
        const data = await completeSession(sessionId, ccdvId);
        return data;
    } catch (error) {
        console.error("Lỗi khi hoàn thành đơn:", error);
        throw error;
    }
};

export const handleReport = async (sessionId, ccdvId, reportText) => {
    try {
        const data = await reportSession(sessionId, ccdvId, reportText);
        return data;
    } catch (error) {
        console.error("Lỗi khi gửi báo cáo:", error);
        throw error;
    }
};
