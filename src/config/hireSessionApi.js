import axios from 'axios';

const apiURL = 'http://localhost:8080/api';

// Admin Hire Sessions API
const apiAdminHireSessions = `${apiURL}/admin/hire-sessions`;
const apiAdminGetHireSessionDetail = (id) => `${apiURL}/admin/hire-sessions/${id}`;
const apiAdminApproveReport = (id) => `${apiURL}/admin/hire-sessions/${id}/approve-report`;
const apiAdminRejectReport = (id) => `${apiURL}/admin/hire-sessions/${id}/reject-report`;
const apiAdminApproveHireSession = (id) => `${apiURL}/admin/hire-sessions/${id}/approve`;
const apiAdminBlockUser = (userId) => `${apiURL}/admin/users/${userId}/block`;
const apiAdminUnblockUser = (userId) => `${apiURL}/admin/users/${userId}/unblock`;

const getAuthHeader = () => {
  const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
  console.log('Token:', token);
  console.log('Auth Header:', { Authorization: `Bearer ${token}` });
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const hireSessionApi = {
  getAllHireSessions: (page = 0, size = 20) => {
    return axios.get(apiAdminHireSessions, {
      params: { page, size },
      ...getAuthHeader(),
    });
  },

  getHireSessionDetail: (hireSessionId) => {
    return axios.get(apiAdminGetHireSessionDetail(hireSessionId), getAuthHeader());
  },

  approveReport: (hireSessionId) => {
    console.log('Calling approveReport with ID:', hireSessionId);
    const header = getAuthHeader();
    console.log('Full request config:', { url: apiAdminApproveReport(hireSessionId), headers: header.headers });
    return axios.post(apiAdminApproveReport(hireSessionId), {}, header);
  },

  rejectReport: (hireSessionId) => {
    console.log('Calling rejectReport with ID:', hireSessionId);
    const header = getAuthHeader();
    console.log('Full request config:', { url: apiAdminRejectReport(hireSessionId), headers: header.headers });
    return axios.post(apiAdminRejectReport(hireSessionId), {}, header);
  },

  approveHireSession: (hireSessionId) => {
    return axios.put(apiAdminApproveHireSession(hireSessionId), {}, getAuthHeader());
  },

  blockUser: (userId) => {
    return axios.put(apiAdminBlockUser(userId), {}, getAuthHeader());
  },

  unblockUser: (userId) => {
    return axios.put(apiAdminUnblockUser(userId), {}, getAuthHeader());
  },
};

export {
  apiAdminHireSessions,
  apiAdminGetHireSessionDetail,
  apiAdminApproveReport,
  apiAdminRejectReport,
  apiAdminApproveHireSession,
  apiAdminBlockUser,
  apiAdminUnblockUser,
};

export default hireSessionApi;