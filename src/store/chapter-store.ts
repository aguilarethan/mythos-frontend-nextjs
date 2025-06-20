import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ChapterStore {
    selectedId: string | null;
    setSelectedId: (id: string | null) => void;
}

export const useChapterStore = create<ChapterStore>()(
  persist(
    (set) => ({
      selectedId: null,
      setSelectedId: (id) => set({ selectedId: id }),
    }),
    {
      name: 'chapter-store', // nombre de la clave en localStorage
    }
  )
);