export interface CreateReviewRequest {
    novelId: string;
    accountId: string;
    rating: number;
    comment: string;
}