import { dotnetApi } from "../../lib/api/dotnet-api";

import { RegisterRequest, LoginRequest } from "./auth-interfaces";

export async function register(data: RegisterRequest) {
    try {
        const response = await dotnetApi.post("/auth/register", data);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || "Error al registrar usuario";
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
