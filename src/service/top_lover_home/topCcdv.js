import axios from "axios";
import { apiHomeUserLovers } from "../../config/api";

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