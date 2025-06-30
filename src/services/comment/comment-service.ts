import { nodeApi } from "@/lib/api/node-api";
import { CreateCommentRequest, ReplyCommentRequest } from "./comment-interfaces";

export async function createComment(data: CreateCommentRequest) {
  try {
    const response = await nodeApi.post("/comments", data);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || "Error al crear el comentario";
    throw new Error(message);
  }
}

export async function replyToComment(data: ReplyCommentRequest) {
  try {
    const { commentId, ...body } = data;
    const response = await nodeApi.post(`/comments/reply/${commentId}`, body);
  return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || "Error al responder al comentario";
    throw new Error(message);
  }
}

export async function getCommentsByChapterId(chapterId: string) {
  try {
    const response = await nodeApi.get(`/comments/${chapterId}`);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || "Error al obtener los comentarios";
    throw new Error(message);
  }
}