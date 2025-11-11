import axios from "axios";
import { apiUser } from "../../config/api";

// Kiểm tra username tồn tại

export const checkUsernameExists = async (username) => {
    try {
        const res = await axios.get(`${apiUser}/exists/${username}`);
        return res.data; // true nếu username đã tồn tại
    } catch (error) {
        console.error("Lỗi khi kiểm tra username:", error);
        throw error;
    }
};

//  Đăng ký người dùng mới
export const registerUser = async (userData) => {
    try {
        const payload = { ...userData, role: { id: userData.roleId } };
        const res = await axios.post(`${apiUser}/register`, payload);
        return res.data;
    } catch (error) {
        console.error("Lỗi khi đăng ký:", error);
        throw error;
    }
};
