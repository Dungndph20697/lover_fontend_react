import axiosClient from "../../config/axiosClient";

// Lấy danh sách user (có phân trang)
export const getAllUser = async ({ page = 0, size = 10 } = {}) => {
  const res = await axiosClient.get("/admin/users", { params: { page, size } });
  return res.data;
};

// Duyệt tài khoản
export const approveUser = async (id) => {
  const url = `/admin/users/approve/${id}`;
  const adminToken = localStorage.getItem("adminToken");
  const userToken = localStorage.getItem("token");

  console.log("[approveUser] start", {
    url,
    adminToken: adminToken ? "present" : "missing",
    userToken: userToken ? "present" : "missing",
  });

  try {
    const res = await axiosClient.post(url, {});
    console.log("[approveUser] success", res.status);
    return res.data;
  } catch (error) {
    console.error("[approveUser] failed", {
      status: error?.response?.status,
      data: error?.response?.data,
      headers: error?.response?.headers,
      message: error?.message,
    });
    throw error;
  }
};
