import axios from "axios";
import { apiHomeUserLovers, apiTopViewedLovers } from "../../config/api";

export const getTopLoverHome = async () => {
    try {
        const response = await axios.get(`${apiHomeUserLovers}/top-ccdv`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching top lovers:", error);
        throw error;
    }
};

export const getTopViewedLoverHome = async () => {
    try {
        const response = await axios.get(`${apiTopViewedLovers}/top-ccdv-view`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching top viewed lovers:", error);
        throw error;
    }
}

export const increaseView = async (id) => {
    try {
        const response = await axios.post(`${apiTopViewedLovers}/${id}/view`, null, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error increasing view:", error);
        throw error;
    }
};