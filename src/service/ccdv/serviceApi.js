
import axios from "axios";
import { apiServices, apiServicesTypeDetail } from "../../config/api.js";

const findAllService = async (token) => {
    try {
        console.log("token", token);
        const response = await axios.get(apiServices + '/find-all', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("loi", error);
        throw error.response?.data?.message;
    }
};

const saveSelectedServices = async (userId, selectedIds, token) => {
    const response = await axios.post(
        `${apiServicesTypeDetail}/save/${userId}`,
        {
            userId: userId,
            serviceIds: selectedIds,
        },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};

const getUserServices = async (userId, token) => {
    const response = await axios.get(`${apiServicesTypeDetail}/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// thêm hàm gọi API sửa giá dịch vụ mở rộng cho ccdv
const updateUserServicePrice = async (userId, serviceId, newPrice, token) => {
    try {
        const response = await axios.put(
            `${apiServicesTypeDetail}/update-price`, // ✅ đúng endpoint controller
            {
                userId,
                serviceId,
                price: newPrice,
            },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Lỗi cập nhật giá dịch vụ:", error);
        throw error.response?.data?.message || "Không thể cập nhật giá dịch vụ";
    }
};



export { findAllService, saveSelectedServices, getUserServices, updateUserServicePrice };
