import { dotnetApi } from "../../lib/api/dotnet-api";

import { Account } from "./account-interfaces";

export async function getAccount() {
    try {
        const response = await dotnetApi.get<Account>("/account");
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || "Error al obtener detalles de la cuenta";
        throw new Error(message);
    }
}