import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface NovelData {
    id?: string;
    writerAccountId: string;
    writerName?: string; 
    title: string;
    description: string;
    genres: string[];
    tags: string[];
    views: number;
    isPublic: boolean;
    coverImageUrl: string;
    status: string;
    createdAt?: Date;
    updatedAt?: Date;
}

interface NovelDetailsStore extends NovelData {
    setNovelDetails: (details: Partial<NovelData>) => void;
}

export const useNovelDetailsStore = create<NovelDetailsStore>()(
  persist(
    (set) => ({
      id: undefined,
      writerAccountId: '',
      title: '',
      description: '',
      genres: [],
      tags: [],
      views: 0,
      isPublic: true,
      coverImageUrl: '',
      status: '',
      createdAt: undefined,
      updatedAt: undefined,

      setNovelDetails: (details) => set(details),
    }),
    {
      name: 'novel-details-store', // nombre clave en localStorage
    }
  )
);
