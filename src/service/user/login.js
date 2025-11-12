import axios from "axios";
import { apiUserLogin, apiFindUserByToken } from "../../config/api.js";

const login = async (username, pass) => {
    try {
        const response = await axios.post(apiUserLogin, {
            username: username,
            password: pass,
        });

        if (response.data) {
            localStorage.setItem("token", response.data.token);
        }
        console.log("Login response data:", response.data);
        return response.data;
    } catch (error) {
        console.error("Login failed:", error);
        return "Tên đăng nhập hoặc mật khẩu không đúng";
    }
};

const findUserByToken = async (token) => {
    try {
        const response = await axios.get(apiFindUserByToken, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Login failed:", error);
        throw error.response?.data?.message;
    }
};

export { login, findUserByToken };
