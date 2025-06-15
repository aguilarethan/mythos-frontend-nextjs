import { dotnetApi } from "../lib/api/dotnet-api";

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

export async function register(data: RegisterRequest) {
    try {
        const response = await dotnetApi.post("/auth/register", data);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || "Error al registrar usuario";
        throw new Error(message);
    }
}