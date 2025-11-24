import axios from "axios";
import { apiFindByCity } from "../../config/api";

export const findByCity = async () => {
    try {
        const response = await axios.get(`${apiFindByCity}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error finding by city:", error);
        throw error;
    }
};
