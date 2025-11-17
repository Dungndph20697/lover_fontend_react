import axios from "axios";

const apiURL = "http://localhost:8080/api";

const apiUser = `${apiURL}/users`;
const apiCcdv = `${apiURL}/ccdv`;

const apiUserLogin = `${apiURL}/users/login`;

const apiFindUserByToken = `${apiURL}/users/me`;

const apiCcdvProfiles = `${apiURL}/ccdv-profiles/create`;

const apiHireSession = `${apiURL}/ccdv/hire-sessions`;

const apiCcdvProfileByUserId = `${apiURL}/ccdv-profiles/user`;

const apiUpdateCcdvProfile = `${apiURL}/ccdv-profiles/update`;

const apiServices = `${apiURL}/ccdv/service-types`;

const apiServicesTypeDetail = `${apiCcdv}/ccdv-service-details`;

//top 3 user đã thuê
const apiTopRequent = `${apiCcdv}/top-frequent/`;
const apiTopRecent = `${apiCcdv}/top-recent/`;
const apiGetFullInfoUser = `${apiCcdv}/getfullinfouser/`;

// các endpoint check unique
const apiCheckUsername = `${apiUser}/exists`;
const apiCheckEmail = `${apiUser}/check-email`;
const apiCheckPhone = `${apiUser}/check-phone`;
const apiCheckCccd = `${apiUser}/check-cccd`;

//(màn user)api load ccdv detail
const apitLoadCcdvDetail = `${apiUser}/profiles/`;
const apitLoadDichVuByIdCcdv = `${apiUser}/service/`;

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
  apiGetFullInfoUser,
  apitLoadCcdvDetail,
  apitLoadDichVuByIdCcdv,
};
