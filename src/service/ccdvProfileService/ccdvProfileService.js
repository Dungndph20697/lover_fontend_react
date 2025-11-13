import axios from "axios";
import { apiCcdvProfiles } from "../../config/api";
import { apiCcdvProfileByUserId } from "../../config/api";
import { apiUpdateCcdvProfile } from "../../config/api";

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
            throw new Error(
                err.response.data?.message || err.response.data || "Lỗi máy chủ"
            );
        } else if (err.request) {
            throw new Error("Không nhận được phản hồi từ server");
        } else {
            throw new Error(err.message);
        }
    }
}

/**
 * Lấy thông tin profile CCDV theo userId
 */
export async function getProfileByUserId(userId, token) {
    try {
        const res = await axios.get(`${apiCcdvProfileByUserId}/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (err) {
        if (err.status === 404) {
            throw new Error("Chưa có profile cho user này");
        } else if (err.request) {
            console.error("❌ Lỗi khi lấy CCDV profile:", err);
            throw new Error("Không nhận được phản hồi từ server");
        } else {
            console.error("❌ Lỗi khi lấy CCDV profile:", err);
            throw new Error(err.message);
        }
    }
}

// PUT profile
export async function updateCcdvProfile(profileId, formData, token) {
    try {
        console.log("PUT URL:", `${apiUpdateCcdvProfile}/${profileId}`);
        console.log("FormData entries:", [...formData.entries()]);

        const res = await axios.put(
            `${apiUpdateCcdvProfile}/${profileId}`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    // Không set Content-Type thủ công, để axios tự xử lý multipart/form-data
                },
            }
        );
        console.log("✅ PUT response:", res.data);
        return res.data;
    } catch (err) {
        console.error("❌ Lỗi khi update profile:", err);
        if (err.response) console.error("RESPONSE DATA:", err.response.data);
        throw err;
    }
}
