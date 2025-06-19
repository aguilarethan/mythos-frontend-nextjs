import axios from "axios";

export const nodeApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_NODE_API_URL,
    withCredentials: true,
    headers: {
        "Accept": "application/json",
    }
});