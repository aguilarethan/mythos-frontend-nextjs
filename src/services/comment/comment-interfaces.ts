export interface CreateCommentRequest {
    chapterId: string;
    accountId: string;
    message: string;
    parentCommentId?: string;
}

export interface ReplyCommentRequest {
    commentId: string;
    message: string;
    accountId: string;
}