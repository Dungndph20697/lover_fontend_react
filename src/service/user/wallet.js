import axios from "axios";
import { apiWalletBalance } from "../../config/api";

export const getBalance = async (token) => {
    const res = await axios.get(apiWalletBalance, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.balance;
};
