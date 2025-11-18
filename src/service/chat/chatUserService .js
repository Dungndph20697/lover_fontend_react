import { fetchChatUsers, fetchConversation } from "./chatAPI";
import axios from "axios";

export const chatUserService = {
  getChatUsers: async (userId) => {
    const res = await fetchChatUsers(userId);
    return res.data;
  },

  getConversation: async (userId, targetId) => {
    const res = await fetchConversation(userId, targetId);
    return res.data;
  },
  getUserInfoById: async (id) => {
    const res = await axios.get(
      `http://localhost:8080/api/users/profiles/${id}`
    );
    return res.data;
  },
};
