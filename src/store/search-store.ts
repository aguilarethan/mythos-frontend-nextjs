import { create } from "zustand";

type SearchType = "genre" | "title";

interface SearchState {
  query: string;
  type: SearchType;
  setSearch: (query: string, type: SearchType) => void;
  clearSearch: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  query: "",
  type: "title",
  setSearch: (query, type) => set({ query, type }),
  clearSearch: () => set({ query: "", type: "title" }),
}));
