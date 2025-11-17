import axios from "axios";
import {
  apitLoadCcdvDetail,
  apitLoadDichVuByIdCcdv,
} from "../../config/api.js";

const loadCcdvDetail = async (idCcdv) => {
  try {
    const response = await axios.get(apitLoadCcdvDetail + idCcdv);
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    return null;
  }
};

const loadDichVuByCcdvId = async (idCcdv) => {
  try {
    const response = await axios.get(apitLoadDichVuByIdCcdv + idCcdv);
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    return null;
  }
};

export { loadCcdvDetail, loadDichVuByCcdvId };
