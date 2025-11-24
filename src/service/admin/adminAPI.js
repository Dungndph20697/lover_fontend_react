// code hàm call api ở dây, chỉ trả ra dữ liệu
import axios from "axios";
import { apiURL } from "../../config/api.js";

const ADMIN_API = `${apiURL}/admin`;

// Lấy danh sách user (trừ admin)
export const apiAdminGetUsers = async (token) => {
  const res = await axios.get(`${ADMIN_API}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Lọc theo role (USER hoặc SERVICE_PROVIDER)
export const apiAdminFilterUsers = async (token, role) => {
  const res = await axios.get(`${ADMIN_API}/users/filter?role=${role}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Lấy thông tin chi tiết 1 CCDV
export const apiAdminGetCcdvDetail = async (token, id) => {
  const res = await axios.get(`${ADMIN_API}/ccdv/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const apiLockUser = (token, id) => {
  return axios.put(
    `${ADMIN_API}/user/lock/${id}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const apiUnlockUser = (token, id) => {
  return axios.put(
    `${ADMIN_API}/user/unlock/${id}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export default {
  apiAdminGetUsers,
  apiAdminFilterUsers,
  apiAdminGetCcdvDetail,
  apiUnlockUser,
  apiLockUser,
};
