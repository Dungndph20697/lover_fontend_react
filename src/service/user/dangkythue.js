import { apiFindDichVuByCcdvId, apiDangKyThue } from "../../config/api.js";
import axios from "axios";
const findDichVuByCcdvId = async (ccdvId) => {
  try {
    const response = await axios.get(apiFindDichVuByCcdvId + ccdvId);
    return response.data;
  } catch (error) {
    console.error("failed:", error);
    return null;
  }
};

const dangKyThue = async (data) => {
  try {
    const response = await axios.post(apiDangKyThue, data, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    return response;
  } catch (error) {
    console.error("failed:", error);
    return null;
  }
};

export { dangKyThue, findDichVuByCcdvId };
