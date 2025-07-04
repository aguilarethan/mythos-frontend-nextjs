import { nodeApi } from "@/lib/api/node-api";

import { UploadCoverImageRequest, CreateNovelRequest, UpdateNovelRequest } from "./novel-interfaces";

export async function getLastThreeNovelsPreview() {
  try {
    const response = await nodeApi.get("/novels/search/last-three-preview");
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || "Error al obtener las últimas tres novelas";
    console.error("Error loading last three novels:", error);
    throw new Error(message);
  }
}

export async function getEightMostViewedNovelsPreview() {
  try {
    const response = await nodeApi.get("/novels/search/eight-most-viewed-preview");
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || "Error al obtener las ocho novelas más vistas";
    console.error("Error loading eight most viewed novels:", error);
    throw new Error(message);
  }
}

export async function getNovelById(id: string) {
  try {
    const response = await nodeApi.get(`/novels/${id}`);
    console.log("Novel data:", response.data);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || "Error al obtener la novela";
    console.error("Error loading novel:", error);
    throw new Error(message);
  }
}

export async function uploadCoverImage(data: UploadCoverImageRequest) {
  try {
    const formData = new FormData();
    formData.append("coverImage", data.coverImage);
    const response = await nodeApi.post("/novels/upload/cover-image", formData);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || "Error al subir la imagen de portada";
    console.error("Error uploading cover image:", error);
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

export async function updateNovel(id: string, data: UpdateNovelRequest) {
  try {
    const response = await nodeApi.put(`/novels/${id}`, data);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || "Error al actualizar la novela";
    throw new Error(message);
  }
}