import { checkUsernameExistsAPI, registerUserAPI } from "../../config/api";


// Kiểm tra username tồn tại
export const checkUsernameExists = async (username) => {
    return await checkUsernameExistsAPI(username);
};


// Xử lý đăng ký người dùng
export const registerUser = async (userData) => {
    const payload = { ...userData, role: { id: userData.roleId } };
    return await registerUserAPI(payload);
};
