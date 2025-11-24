import axios from "axios";
import { apiVipSuggestions } from "../../config/api";

export const getVipSuggestions = async (limit = 6) => {
    try {
        const response = await axios.get(`${apiVipSuggestions}/suggestion-vip?limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching VIP suggestions:", error);
        throw error;
    }
}