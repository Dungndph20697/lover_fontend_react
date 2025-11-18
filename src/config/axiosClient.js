import axios from "axios";
import { apiURL } from "../config/api";

const axiosClient = axios.create({
    baseURL: apiURL,
});

// interceptor tự gắn token vào mọi request
axiosClient.interceptors.request.use((config) => {
    const tokenKey = config.url?.startsWith("/admin") ? "adminToken" : "token";
    const token = localStorage.getItem(tokenKey) || localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosClient;
