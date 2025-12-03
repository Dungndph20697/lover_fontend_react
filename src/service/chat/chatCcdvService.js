import { fetchChatUsers, fetchConversation } from "./chatAPI";

export const chatCcdvService = {
  getChatUsers: async (ccdvId) => {
    const res = await fetchChatUsers(ccdvId);
    return res.data;
  },

  getConversation: async (ccdvId, targetId) => {
    const res = await fetchConversation(ccdvId, targetId);
    return res.data;
  },
};
