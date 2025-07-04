import axios from "axios";

export const dotnetApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_DOTNET_API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
});