import axios from "axios";

const apiURL = "http://localhost:8080/api";

const apiUser = `${apiURL}/users`;

const apiUserLogin = `${apiURL}/users/login`;

const apiFindUserByToken = `${apiURL}/users/me`;

const apiCcdvProfiles = `${apiURL}/ccdv-profiles/create`;


const apiHireSession = `${apiURL}/ccdv/hire-sessions`;
const apiCcdvProfileByUserId = `${apiURL}/ccdv-profiles/user`;

const apiUpdateCcdvProfile = `${apiURL}/ccdv-profiles/update`;


const apiServices = `${apiURL}/ccdv/service-types`;

const apiServicesTypeDetail = `${apiURL}/ccdv/ccdv-service-details`;

// các endpoint check unique
const apiCheckUsername = `${apiUser}/exists`;
const apiCheckEmail = `${apiUser}/check-email`;
const apiCheckPhone = `${apiUser}/check-phone`;
const apiCheckCccd = `${apiUser}/check-cccd`;

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
    apiCcdvProfileByUserId, apiUpdateCcdvProfile,
    apiCheckCccd
};
