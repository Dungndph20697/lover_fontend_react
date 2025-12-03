import axios from "axios";
import { apiUserLogin, apiFindUserByToken } from "../../config/api.js";


// bổ sung thêm check nếu tài khoản chưa được duyệt thì hiển thị thông báo
const login = async (username, pass) => {
  try {
    const response = await axios.post(apiUserLogin, {
      username,
      password: pass,
    });

    // Nếu backend trả success = false → ném lỗi về FE
    if (response.data?.success === false) {
      const err = new Error(response.data.message);
      err.type = "NOT_APPROVED";
      throw err;
    }

    // Nếu login OK → Lưu token
    if (response.data?.token) {
      localStorage.setItem("token", response.data.token);
    }
    if (response.data?.user) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error) {
    // Nếu là lỗi HTTP 403 (backend chưa duyệt)
    if (error.response?.status === 403) {
      const err = new Error(error.response.data.message);
      err.type = "NOT_APPROVED";
      throw err;
    }

    // Lỗi mật khẩu sai
    const err = new Error("INVALID_CREDENTIALS");
    err.type = "INVALID_CREDENTIALS";
    throw err;
  }
};

//truyền header token để phân quyền
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
