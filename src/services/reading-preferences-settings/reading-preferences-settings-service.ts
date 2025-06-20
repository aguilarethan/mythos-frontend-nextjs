import { AxiosError } from "axios";
import { nodeApi } from "@/lib/api/node-api";
import { ReadingPreferences, CreateReadingPreferences } from "./reading-preferences-settings-interfaces";

async function getPreferences(accountId: string) {
    try {
        const res = await nodeApi.get(`/reading-preferences-settings/${accountId}`);
        return res.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            throw {
                status: error.response?.status,
                message: error.response?.data?.message || "Error al obtener las preferencias",
            };
        } else if (error instanceof Error) {
            throw {
                status: undefined,
                message: error.message || "Error desconocido al obtener las preferencias",
            };
        } else {
            throw {
                status: undefined,
                message: "Error desconocido al obtener las preferencias",
            };
        }
    }
}

async function createPreferences(data: CreateReadingPreferences) {
    try {
        const res = await nodeApi.post("/reading-preferences-settings", data);
        return res.data;
    } catch (error: unknown) {
        let message = "Error al crear las preferencias";
        if (error instanceof AxiosError) {
            message = error.response?.data?.message || message;
        } else if (error instanceof Error) {
            message = error.message;
        }
        throw new Error(message);
    }
}

async function updatePreferences(accountId: string, data: ReadingPreferences) {
    try {
        const res = await nodeApi.put(`/reading-preferences-settings/${accountId}`, data);
        return res.data;
    } catch (error: unknown) {
        let message = "Error al actualizar las preferencias";
        if (error instanceof AxiosError) {
            message = error.response?.data?.message || message;
        } else if (error instanceof Error) {
            message = error.message;
        }
        throw new Error(message);
    }
}

export const readingPreferencesService = {
    getPreferences,
    createPreferences,
    updatePreferences,
};