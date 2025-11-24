import axios from "axios";

const apiURL = "http://localhost:8080/api";

const apiAdminRevenues = `${apiURL}/admin/revenues`;
const apiAdminRevenueTotal = (ccdvId) =>
  `${apiURL}/admin/revenues/total/${ccdvId}`;

const getAuthHeader = () => {
  const token =
    localStorage.getItem("adminToken") || localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const revenueApi = {
  getAllRevenues: (page = 0, size = 20) => {
    console.log("Fetching revenues - page:", page, "size:", size);
    return axios.get(apiAdminRevenues, {
      params: { page, size },
      ...getAuthHeader(),
    });
  },

  getTotalRevenueByCcdv: (ccdvId) => {
    console.log("Fetching total revenue for CCDV:", ccdvId);
    return axios
      .get(apiAdminRevenueTotal(ccdvId), getAuthHeader())
      .then((res) => res.data);
  },
};

export { apiAdminRevenues, apiAdminRevenueTotal };

export default revenueApi;
