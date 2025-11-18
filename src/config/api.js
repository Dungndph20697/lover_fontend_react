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
const apiAdminApproveWithdraw = (id) => `${apiURL}/admin/withdraw/approve/${id}`;
const apiAdminRejectWithdraw = (id) => `${apiURL}/admin/withdraw/reject/${id}`;


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

export {


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
  apiUserHireStatistics,
  apiUserHireComplete,
  apiUserHireCancel,
  apiUserHireReport,
  apiUserHireDetail,
  apiUserHireUpdateStatus,
  apiRevnue,
  apiGetFullInfoUser,
  apitLoadCcdvDetail,
  apitLoadDichVuByIdCcdv,
apiRevnue,
    apiHomeUserLovers
 apiToggleStatus,
    apiWalletBalance,
    apiWithdrawRequest,
    apiWithdrawVerifyOtp,
    apiWithdrawHistory,
    apiAdminWithdrawList,
    apiAdminApproveWithdraw,
    apiAdminRejectWithdraw,
};
