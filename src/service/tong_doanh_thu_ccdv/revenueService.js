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

// Week-range: trả về { type: "WEEK", data: [...] }
export const getRevenueByWeek = async (start, end) => {
    const startAt = formatLocalDate(new Date(start));
    const endAt = formatLocalDate(new Date(end));

    const res = await axios.post(
        `${apiRevnue}/week-range`,
        { start: startAt, end: endAt },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    return res.data;
};

// Month-range: trả về { type: "MONTH", data: [...] }
export const getRevenueByMonth = async (start, end) => {
    const startAt = formatLocalDate(new Date(start));
    const endAt = formatLocalDate(new Date(end));

    const res = await axios.post(
        `${apiRevnue}/month-range`,
        { start: startAt, end: endAt },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    return res.data;
};

export const getRevenueByDay = async (start, end) => {
    const startAt = formatLocalDate(new Date(start));
    const endAt = formatLocalDate(new Date(end));

    const res = await axios.post(
        `${apiRevnue}/day-range`,
        { start: startAt, end: endAt },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    return res.data;
};

export const formatLocalDate = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};