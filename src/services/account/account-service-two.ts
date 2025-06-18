import { dotnetApi } from "@/lib/api/dotnet-api";

import { updateProfileRequest } from "./account-interfaces-two";
import { AxiosError } from "axios";

async function updateProfile(id: string, data: updateProfileRequest){
    try {
        const response = await dotnetApi.put(`/account/${id}`, data);
        return response.data; 
    } catch (error : unknown) {
        let message = "Error al actualizar el perfil";

        if (error instanceof AxiosError) {
            message = error.response?.data?.message || message;
        } else if (error instanceof Error) {
            message = error.message;
        }
            
        throw new Error(message);
    }
}

export const accountService = {
    updateProfile
}