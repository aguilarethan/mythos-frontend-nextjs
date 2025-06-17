import { nodeApi } from "../../lib/api/node-api";

export interface ReadingPreferences {
    fontSize: number;
    fontFamily: string;
    lineSpacing: number;
    theme: string;
}

export interface CreateReadingPreferences extends ReadingPreferences {
    accountId: string;
}

export async function getPreferences(accountId: string) {
    const res = await nodeApi.get(`/reading-preferences-settings/${accountId}`);
    return res.data;
}

export async function createPreferences(data: CreateReadingPreferences) {
    const res = await nodeApi.post("/reading-preferences-settings", data);
    return res.data;
}

export async function updatePreferences(accountId: string, data: ReadingPreferences) {
    const res = await nodeApi.put(`/reading-preferences-settings/${accountId}`, data);
    return res.data;
}