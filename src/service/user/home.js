import axios from "axios";
import { apiHomePage } from "../../config/api.js";
import axiosClient from "../../config/axiosClient";




const findUser = async () => {
    try {
        const response = await axios.get(apiHomePage);

        if (response.data) {
            localStorage.setItem("token", response.data.token);
        }
        return response.data;
    } catch (error) {
        console.error("Login failed:", error);
        return "loi";
    }
};
export const getLatestProviders = async () => {
  const res = await axiosClient.get(apiHomePage);
  return res.data;
};
export { findUser };