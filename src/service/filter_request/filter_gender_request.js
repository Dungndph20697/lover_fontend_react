import axios from "axios";
import { apiFilterGenderRequest } from "../../config/api";

export const filterGenderRequest = async (gender = "") => {
    try {
        const response = await axios.get(
            `${apiFilterGenderRequest}/providers`, {
                params: { gender }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error filtering gender request:", error);
        throw error;
    }
};