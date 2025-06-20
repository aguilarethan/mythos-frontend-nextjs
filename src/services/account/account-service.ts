import { AxiosError } from "axios";
import { dotnetApi } from "../../lib/api/dotnet-api";

import { Account, ChangePasswordRequest, UpdateProfileRequest, WriterProfileRequest, BecomeWriterResponse } from "./account-interfaces";

export async function getAccount() {
    try {
        const response = await dotnetApi.get<Account>("/account");
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || "Error al obtener detalles de la cuenta";
        throw new Error(message);
    }
}

async function updateProfile(id: string, data: UpdateProfileRequest){
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

async function changePassword(id: string, data: ChangePasswordRequest){
    try {
        const response = await dotnetApi.put(`/account/${id}/password`, data);
        return response.data; 
    } catch (error : unknown) {
        let message = "Ocurrió un error al intentar cambiar la contraseña";

        if (error instanceof AxiosError) {
            message = error.response?.data?.message || message;
        } else if (error instanceof Error) {
            message = error.message;
        }
            
        throw new Error(message);
    }
}

async function becomeWriter(data: WriterProfileRequest): Promise<BecomeWriterResponse> {
  try {
    const response = await dotnetApi.post("/account/become-writer", data);
    return response.data;
  } catch (error: unknown) {
    let message = "Ocurrió un error al convertirte en escritor.";

    if (error instanceof AxiosError) {
      message = error.response?.data?.message || message;
    } else if (error instanceof Error) {
      message = error.message;
    }

    throw new Error(message);
  }
}

export const accountService = {
    changePassword,
    updateProfile,
    becomeWriter,
}