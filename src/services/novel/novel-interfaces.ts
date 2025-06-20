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

export interface UpdateNovelRequest {
  writerAccountId: string;
  title: string;
  description: string;
  coverImageUrl: string;
  genres: string[];
  tags: string[];
}