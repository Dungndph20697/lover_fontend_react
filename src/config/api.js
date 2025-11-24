import axios from "axios";

const apiURL = "http://localhost:8080/api";

const apiUser = `${apiURL}/users`;
const apiCcdv = `${apiURL}/ccdv`;

const apiUserLogin = `${apiURL}/users/login`;

const apiFindUserByToken = `${apiURL}/users/me`;

const apiCcdvProfiles = `${apiURL}/ccdv-profiles/create`;

const apiRevnue = `${apiURL}/revenue`;

const apiHireSession = `${apiURL}/ccdv/hire-sessions`;

const apiCcdvProfileByUserId = `${apiURL}/ccdv-profiles/user`;

const apiUpdateCcdvProfile = `${apiURL}/ccdv-profiles/update`;

const apiServices = `${apiURL}/ccdv/service-types`;

const apiServicesTypeDetail = `${apiCcdv}/ccdv-service-details`;

const apiHomeUserLovers = `${apiURL}/home`;

const apiTopViewedLovers = `${apiURL}/toplover`;

//top 3 user đã thuê
const apiTopRequent = `${apiCcdv}/top-frequent/`;
const apiTopRecent = `${apiCcdv}/top-recent/`;
const apiGetFullInfoUser = `${apiCcdv}/getfullinfouser/`;
const apiToggleStatus = `${apiURL}/ccdv-profiles/toggle-status`;

// lấy số dư ví
const apiWalletBalance = `${apiURL}/wallet/balance`;

// các endpoint check unique
const apiCheckUsername = `${apiUser}/exists`;
const apiCheckEmail = `${apiUser}/check-email`;
const apiCheckPhone = `${apiUser}/check-phone`;
const apiCheckCccd = `${apiUser}/check-cccd`;

const apitLoadCcdvDetail = `${apiUser}/profiles/`;
const apitLoadDichVuByIdCcdv = `${apiUser}/service/`;
//  WITHDRAW API (api rut tien)
const apiWithdrawRequest = `${apiURL}/withdraw/request`;
const apiWithdrawVerifyOtp = `${apiURL}/withdraw/verify-otp`;
const apiWithdrawHistory = `${apiURL}/withdraw/history`;

// ADMIN WITHDRAW
const apiAdminWithdrawList = `${apiURL}/admin/withdraw/list`;
const apiAdminApproveWithdraw = (id) =>
  `${apiURL}/admin/withdraw/approve/${id}`;
const apiAdminRejectWithdraw = (id) => `${apiURL}/admin/withdraw/reject/${id}`;

// ADMIN USER MANAGEMENT
const apiAdminUsers = `${apiURL}/admin/users`;
const apiAdminApproveUser = (id) => `${apiURL}/admin/users/approve/${id}`;

// THÊM MỚI: API cho User Hire Sessions
const apiUserHireSessions = `${apiURL}/user/hire-sessions`;
const apiUserHireStatistics = (userId) =>
  `${apiUserHireSessions}/statistics/${userId}`;
const apiUserHireComplete = (sessionId) =>
  `${apiUserHireSessions}/${sessionId}/complete`;
const apiUserHireCancel = (sessionId) => `${apiUserHireSessions}/${sessionId}`;
const apiUserHireReport = (sessionId) =>
  `${apiUserHireSessions}/${sessionId}/report`;
const apiUserHireDetail = (sessionId) => `${apiUserHireSessions}/${sessionId}`;
const apiUserHireUpdateStatus = (sessionId) =>
  `${apiUserHireSessions}/${sessionId}/status`;

// const apiURL = "http://localhost:8080/api";
//chat
// GET /api/messages/{u1}/{u2}
const apiGetConversation = `${apiURL}/messages/chat-users/`;

// GET /api/messages/chat-users/{id}
const apiGetChatUsers = `${apiURL}/messages/chat-users/`;
// Admin vip users
const apiAdminVipUsers = `${apiURL}/admin/users/vip-users`;
const apiAdminVipCcdv = `${apiURL}/admin/users/vip-ccdv`;
const apiAdminSetVip = `${apiURL}/admin/users/set-vip`;


const apiSearchUsers = `${apiCcdv}/search`;

const apiSearchUsersDetails = `${apiCcdv}`;

const apiCities = `${apiCcdv}/cities`;

const apiVipSuggestions = `${apiCcdv}`;

const apiListItemsServiceIntimateGesture = `${apiCcdv}`;

const apiFilterGenderRequest = `${apiURL}/recommendation`;


export {
  apiRevnue,
  apiHomeUserLovers,
  apiTopViewedLovers,
  apiURL,
  apiUser,
  apiUserLogin,
  apiFindUserByToken,
  apiCcdvProfiles,
  apiServices,
  apiServicesTypeDetail,
  apiHireSession,
  apiCheckUsername,
  apiCheckEmail,
  apiCheckPhone,
  apiCheckCccd,
  apiCcdvProfileByUserId,
  apiUpdateCcdvProfile,
  apiTopRequent,
  apiTopRecent,
  apiUserHireSessions,
  apiSearchUsers,
  apiSearchUsersDetails,
  apiCities,
  apiVipSuggestions,
  apiListItemsServiceIntimateGesture,
  apiFilterGenderRequest,
  apiUserHireStatistics,
  apiUserHireComplete,
  apiUserHireCancel,
  apiUserHireReport,
  apiUserHireDetail,
  apiUserHireUpdateStatus,
  apiGetFullInfoUser,
  apitLoadCcdvDetail,
  apitLoadDichVuByIdCcdv,
  apiGetConversation,
  apiGetChatUsers,
  apiToggleStatus,
  apiWalletBalance,
  apiWithdrawRequest,
  apiWithdrawVerifyOtp,
  apiWithdrawHistory,
  apiAdminWithdrawList,
  apiAdminApproveWithdraw,
  apiAdminRejectWithdraw,
  apiAdminUsers,
  apiAdminApproveUser,
  apiAdminVipUsers,
  apiAdminVipCcdv,
  apiAdminSetVip,
};
