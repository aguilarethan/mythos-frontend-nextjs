export interface UploadCoverImageRequest {
    coverImage: File;
}

export interface CreateNovelRequest {
    writerAccountId: string;
    title: string;
    description: string;
    genres: string[];
    tags: string[];
    coverImageUrl: string;
}