import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NovelStore {
    selectedId: string | null;
    setSelectedId: (id: string | null) => void;
}

export const useNovelStore = create<NovelStore>()(
  persist(
    (set) => ({
      selectedId: null,
      setSelectedId: (id) => set({ selectedId: id }),
    }),
    {
      name: 'novel-store', // nombre de la clave en localStorage
    }
  )
);
