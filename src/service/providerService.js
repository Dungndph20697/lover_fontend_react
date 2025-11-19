import axiosClient from "../config/axiosClient";
import axios from "axios"; // nếu bạn dùng axios trực tiếp
import { apiHomePage, apiProviderDetail } from "../config/api";

export const getLatestProviders = async () => {
  const res = await axiosClient.get(apiHomePage);
  return res.data;
};

export const getProviderDetail = async (id) => {
  const response = await axios.get(apiProviderDetail(id));
  return response.data;
};
