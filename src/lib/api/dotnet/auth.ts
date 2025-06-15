import { dotnetApi } from "../common/axios";

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export async function registerAccount(data: RegisterRequest) {
    try {
        const response = await dotnetApi.post("/auth/register", data);
        return response.data;
    } catch (error: any) {
        const message =
            error.response?.data?.message || "Error al registrar usuario";
        throw new Error(message);
    }
}

export async function login(data: LoginRequest) {
    try {
        const response = await dotnetApi.post("/auth/login", data);
        return response.data;
    } catch (error: any) {
        const message =
            error.response?.data?.message || "Error al iniciar sesión";
        throw new Error(message);
    }

}
