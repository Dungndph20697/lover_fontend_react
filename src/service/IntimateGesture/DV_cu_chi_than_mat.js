import axios from "axios";
import { apiListItemsServiceIntimateGesture } from "../../config/api";

export const getListItemsServiceIntimateGesture = async (page = 0, size = 12) => {
    try {
        const response = await axios.get(
            `${apiListItemsServiceIntimateGesture}/list-item?page=${page}&size=${size}`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching Intimate Gesture services:", error);
        throw error;
    }
}