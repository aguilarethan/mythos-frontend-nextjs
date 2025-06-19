import { nodeApi } from "@/lib/api/node-api";

import { UploadCoverImageRequest, CreateNovelRequest } from "./novel-interfaces";

export async function uploadCoverImage(data: UploadCoverImageRequest) {
    try { 
        const formData = new FormData();
        formData.append("coverImage", data.coverImage);
        const response = await nodeApi.post("/novels/upload/cover-image", formData);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || "Error al subir la imagen de portada";
        throw new Error(message);
    }
}

export async function createNovel(data: CreateNovelRequest) {
    try {
        const response = await nodeApi.post("/novels", data);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || "Error al crear la novela";
        throw new Error(message);
    }
}