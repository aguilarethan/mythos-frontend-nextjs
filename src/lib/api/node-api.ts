import axios from "axios";

export const nodeApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_NODE_API_URL,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
});