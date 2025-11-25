import axios from "axios";
import { apiFindByCity } from "../../config/api";

export const findByCity = async (city = "") => {
    try {
        const response = await axios.get(`${apiFindByCity}`, {
                params: { city }
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error finding by city:", error);
        throw error;
    }
};
