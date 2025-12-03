import axios from "axios";
import { apiURL } from "../config/api";

const axiosClient = axios.create({
  baseURL: apiURL,
});

const isAdminUrl = (url = "") => {
  if (!url) return false;
  // Hỗ trợ cả đường dẫn tương đối và absolute URL
  try {
    const parsed = url.startsWith("http") ? new URL(url) : null;
    const path = parsed ? parsed.pathname : url;
    return path.startsWith("/admin") || path.includes("/admin/");
  } catch {
    return url.includes("/admin/");
  }
};

// interceptor tự gắn token vào mọi request
axiosClient.interceptors.request.use((config) => {
  const useAdminToken = isAdminUrl(config.url);
  const token =
    (useAdminToken && localStorage.getItem("adminToken")) ||
    localStorage.getItem("token") ||
    localStorage.getItem("adminToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
