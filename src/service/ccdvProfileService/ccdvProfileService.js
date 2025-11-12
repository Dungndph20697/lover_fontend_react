import { apiCcdvProfiles } from "../../config/api";

/**
 * Gửi thông tin profile CCDV lên server
 * @param {FormData} formData - dữ liệu form bao gồm text + file
 * @param {string} token - token xác thực người dùng
 * @returns {Promise<object>} - dữ liệu phản hồi từ server
 **/
export async function createCcdvProfile(formData, token) {
    try {
        const res = await fetch(apiCcdvProfiles, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(text);
        }

        return await res.json();
    } catch (err) {
        console.error("❌ Lỗi khi gửi form:", err);
        throw err;
    }
}