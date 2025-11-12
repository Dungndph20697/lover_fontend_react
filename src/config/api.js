import axios from "axios";

const apiURL = "http://localhost:8080/api";

const apiUser = `${apiURL}/users`;

const apiUserLogin = `${apiURL}/users/login`;

const apiFindUserByToken = `${apiURL}/users/me`;

const apiCcdvProfiles = `${apiURL}/ccdv-profiles/create`;

const apiHireSession = `${apiURL}/ccdv/hire-sessions`;


export { apiURL, apiUser, apiUserLogin, apiFindUserByToken, apiHireSession ,apiHireSession};


