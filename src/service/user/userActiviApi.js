import axiosClient from "../../config/axiosClient";
import {
    apiUserStatus,
    apiOnlineUsers,
    apiActivitySummary,
} from "../../config/api";

// Lấy trạng thái 1 user
export const getUserStatus = async (userId) => {
    try {
        const res = await axiosClient.get(apiUserStatus(userId));
        console.log("📌 User status:", res.data);
        return res.data;
    } catch (error) {
        console.error("❌ Lỗi lấy trạng thái user:", error);
        return null;
    }
};

// Lấy danh sách user đang online
export const getOnlineUsers = async () => {
    try {
        const res = await axiosClient.get(apiOnlineUsers);
        console.log("📌 Online users:", res.data);
        return res.data;
    } catch (error) {
        console.error("❌ Lỗi lấy danh sách online:", error);
        return [];
    }
};

// Lấy summary cho admin
export const getActivitySummary = async () => {
    try {
        const res = await axiosClient.get(apiActivitySummary);
        console.log("📌 Activity summary:", res.data);
        return res.data;
    } catch (error) {
        console.error("❌ Lỗi lấy tổng hợp hoạt động:", error);
        return null;
    }
};
