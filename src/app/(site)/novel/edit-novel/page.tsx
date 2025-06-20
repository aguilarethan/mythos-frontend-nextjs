"use client";

import { NovelForm } from "@/features/novel/components/novel-form";
import { useNovelDetailsStore } from "@/store/novel-details-store";

export default function EditNovelPage() {
    const {
        id,
        writerAccountId,
        title,
        description,
        genres,
        tags,
        views,
        isPublic,
        coverImageUrl,
        status,
        createdAt,
        updatedAt
    } = useNovelDetailsStore();

    const novelToEdit = {
    id: id,
    writerAccountId,
    title,
    description,
    genres,
    tags,
    views,
    isPublic,
    coverImageUrl,
    status,
    
  }


    return (
        <div className="max-w-5xl items=center mx-auto py-4">
            <NovelForm novelToEdit={novelToEdit} />
        </div>
    );
}