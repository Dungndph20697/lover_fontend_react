import axios from "axios";
import {
  apiTopRequent,
  apiTopRecent,
  apiGetFullInfoUser,
} from "../../config/api.js";

const findTop3Requent = async (token, ccdvId) => {
  try {
    const response = await axios.get(apiTopRequent + ccdvId, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("loi", error);
    throw error.response?.data?.message;
  }
};

const findTop3Recent = async (token, ccdvId) => {
  try {
    const response = await axios.get(apiTopRecent + ccdvId, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("loi", error);
    throw error.response?.data?.message;
  }
};

const getfullinfouser = async (token, ccdvId) => {
  try {
    const response = await axios.get(apiGetFullInfoUser + ccdvId, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("loi", error);
    throw error.response?.data?.message;
  }
};

export { findTop3Requent, findTop3Recent, getfullinfouser };
