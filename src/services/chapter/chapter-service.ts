import { nodeApi } from "@/lib/api/node-api";

import { CreateChapterRequest } from "./chapter-interfaces";

export async function createChapter(data: CreateChapterRequest) {
  try {
    const response = await nodeApi.post("/chapters", data);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || "Error al crear el capítulo";
    throw new Error(message);
  }
}

