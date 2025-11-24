import { apiSearchUsers, apiSearchUsersDetails } from "../../config/api";
import axios from "axios";
import { apiCities } from "../../config/api";

export const searchUser = async (searchRequest) => {
    try {
        const response = await axios.post(`${apiSearchUsers}`, searchRequest);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gọi API tìm kiếm người dùng:", error);
        throw error;
    }
}

export const searchUserDetails = async (id) => {
    const token = localStorage.getItem("accessToken");
    try {
        const response = await axios.get(`${apiSearchUsersDetails}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gọi API lấy chi tiết người dùng:", error);
        throw error;
    }
}

export const searchUserWithCity = async () => {
    try {
        const response = await axios.get(apiCities);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gọi API lấy danh sách thành phố:", error);
        throw error;
    }
}