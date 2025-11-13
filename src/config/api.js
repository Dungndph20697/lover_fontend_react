import axios from "axios";

const apiURL = "http://localhost:8080/api";

const apiUser = `${apiURL}/users`;

const apiUserLogin = `${apiURL}/users/login`;

const apiFindUserByToken = `${apiURL}/users/me`;

const apiCcdvProfiles = `${apiURL}/ccdv-profiles/create`;

const apiCcdvProfileByUserId = `${apiURL}/ccdv-profiles/user`;

const apiUpdateCcdvProfile = `${apiURL}/ccdv-profiles/update`;

const apiServices = `${apiURL}/ccdv/service-types`;

const apiServicesTypeDetail = `${apiURL}/ccdv/ccdv-service-details`;

export { apiURL, apiUser, apiUserLogin, apiFindUserByToken, apiCcdvProfiles, apiServices, apiServicesTypeDetail,apiCcdvProfileByUserId, apiUpdateCcdvProfile };