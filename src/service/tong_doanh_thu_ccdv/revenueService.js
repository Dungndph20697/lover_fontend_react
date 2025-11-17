import axios from "axios";
import { apiRevnue } from "../../config/api";


export const verifyPassword = async (password) => {
    const res = await axios.post(`${apiRevnue}/verify-password`, { password }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return res.data.valid;
};

export const getRevenueToday = async () => {
    const res = await axios.get(`${apiRevnue}/today`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return res.data;
};

export const getRevenueMonth = async () => {
    const res = await axios.get(`${apiRevnue}/month`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return res.data;
};

export const getRevenueRange = async (start, end) => {
    const startAt = `${start}`;
    const endAt   = `${end}`;
    const res = await axios.post(
        `${apiRevnue}/range`,
        {  start: startAt, end: endAt },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    return res.data;
};