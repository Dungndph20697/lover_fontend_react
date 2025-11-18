import axiosClient from "../config/axiosClient";
import { apiHomePage } from "../config/api";

export const getLatestProviders = async () => {
  const res = await axiosClient.get(apiHomePage);
  return res.data;
};
