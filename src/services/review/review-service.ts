import { nodeApi } from "@/lib/api/node-api";
import { CreateReviewRequest } from "./review-interface";

export async function getReviewsByNovelId(novelId: string) {
    try {
        const response = await nodeApi.get(`/reviews/search/novel-id/${novelId}`);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || "Error al obtener las reseñas";
        console.error("Error loading reviews:", error);
        throw new Error(message);
    }
}

export async function createReview(reviewData: CreateReviewRequest) {
    try {
        const response = await nodeApi.post("/reviews", reviewData);
        return response.data;
    } catch (error: any) {
        const message = error.response?.data?.message || "Error al crear la reseña";
        console.error("Error creating review:", error);
        throw new Error(message);
    }
}