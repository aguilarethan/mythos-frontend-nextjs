import { create } from 'zustand';

interface NovelStore {
    selectedId: string | null;
    setSelectedId: (id: string | null) => void;
}

export const useNovelStore = create<NovelStore>((set) => ({
    selectedId: null,
    setSelectedId: (id) => set({ selectedId: id }),
}));