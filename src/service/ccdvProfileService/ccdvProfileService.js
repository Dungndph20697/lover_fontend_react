import axios from "axios";
import { apiCcdvProfiles } from "../../config/api";

/**
 * Gửi thông tin profile CCDV lên server
 * @param {FormData} formData - dữ liệu form bao gồm text + file
 * @param {string} token - token xác thực người dùng
 * @returns {Promise<object>} - dữ liệu phản hồi từ server
 */
export async function createCcdvProfile(formData, token) {
    try {
        const res = await axios.post(apiCcdvProfiles, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        });

        return res.data;
    } catch (err) {
        console.error("❌ Lỗi khi gửi form:", err);

        // Xử lý lỗi gọn gàng
        if (err.response) {
            throw new Error(err.response.data?.message || err.response.data || "Lỗi máy chủ");
        } else if (err.request) {
            throw new Error("Không nhận được phản hồi từ server");
        } else {
            throw new Error(err.message);
        }
    }
}