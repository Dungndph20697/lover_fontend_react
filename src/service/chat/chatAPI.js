import axios from "axios";
import { apiGetConversation, apiGetChatUsers } from "../../config/api.js";

// Lấy danh sách người đã chat
export const fetchChatUsers = (userId) =>
  axios.get(`${apiGetChatUsers}${userId}`);

// Lấy lịch sử giữa hai người
export const fetchConversation = (u1, u2) =>
  axios.get(`${apiGetConversation}${u1}/${u2}`);
