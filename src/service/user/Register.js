import axios from "axios";
import { 
    apiUser, 
    apiCheckUsername, 
    apiCheckEmail, 
    apiCheckPhone, 
    apiCheckCccd 
} from "../../config/api";

// Kiểm tra username tồn tại
export const checkUsernameExists = async (username) => {
    try {
        const res = await axios.get(`${apiCheckUsername}/${username}`);
        console.log(`✅ Check username "${username}":`, res.data);
        return res.data; // true nếu username đã tồn tại
    } catch (error) {
        console.error("❌ Lỗi khi kiểm tra username:", error.message);
        console.error("URL:", `${apiCheckUsername}/${username}`);
        console.error("Status:", error.response?.status);
        console.error("Response:", error.response?.data);
        // KHÔNG throw error, return false để form vẫn chạy được
        return false;
    }
};

// Kiểm tra email tồn tại
export const checkEmailExists = async (email) => {
    try {
        const res = await axios.get(`${apiCheckEmail}/${email}`);
        console.log(`✅ Check email "${email}":`, res.data);
        return res.data; // true nếu email đã tồn tại
    } catch (error) {
        console.error("❌ Lỗi khi kiểm tra email:", error.message);
        console.error("URL:", `${apiCheckEmail}/${email}`);
        console.error("Status:", error.response?.status);
        console.error("Response:", error.response?.data);
        return false;
    }
};

// Kiểm tra phone tồn tại
export const checkPhoneExists = async (phone) => {
    try {
        const res = await axios.get(`${apiCheckPhone}/${phone}`);
        console.log(`✅ Check phone "${phone}":`, res.data);
        return res.data; // true nếu phone đã tồn tại
    } catch (error) {
        console.error("❌ Lỗi khi kiểm tra phone:", error.message);
        console.error("URL:", `${apiCheckPhone}/${phone}`);
        console.error("Status:", error.response?.status);
        console.error("Response:", error.response?.data);
        return false;
    }
};

// Kiểm tra CCCD tồn tại
export const checkCccdExists = async (cccd) => {
    try {
        const res = await axios.get(`${apiCheckCccd}/${cccd}`);
        console.log(`✅ Check CCCD "${cccd}":`, res.data);
        return res.data; // true nếu cccd đã tồn tại
    } catch (error) {
        console.error("❌ Lỗi khi kiểm tra cccd:", error.message);
        console.error("URL:", `${apiCheckCccd}/${cccd}`);
        console.error("Status:", error.response?.status);
        console.error("Response:", error.response?.data);
        return false;
    }
};

// Đăng ký người dùng mới
export const registerUser = async (userData) => {
    try {
        const payload = { ...userData, role: { id: userData.roleId } };
        console.log("📤 Gửi request đăng ký:", payload);
        const res = await axios.post(`${apiUser}/register`, payload);
        console.log("✅ Response đăng ký:", res.data);
        return res.data;
    } catch (error) {
        console.error("❌ Lỗi khi đăng ký:", error.message);
        console.error("Status:", error.response?.status);
        console.error("Response:", error.response?.data);
        throw error; // Vẫn throw để handleSubmit bắt được
    }
};