"use client";

import { useSearchStore } from "@/store/search-store";
import { useEffect, useState } from "react";
import { getNovelsByGenre, getNovelsByTitleMatch } from "@/services/novel/novel-service";
import { NovelCard } from "@/features/novel/components/novel-card";

interface NovelPreview {
  id: string;
  title: string;
  genres: string[];
  coverImageUrl: string;
}

export default function SearchPage() {
  const { query, type } = useSearchStore();
  const [novels, setNovels] = useState<NovelPreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!query) return;
      setIsLoading(true);

      try {
        const data =
          type === "genre"
            ? await getNovelsByGenre(query)
            : await getNovelsByTitleMatch(query);
        setNovels(data);
      } catch (err) {
        console.error("Error al obtener novelas:", err);
        setNovels([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [query, type]);

  if (!query) {
    return <p className="text-center mt-10 text-muted-foreground">No hay búsqueda activa.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto py-6">
      <h1 className="text-xl font-semibold mb-0">
        Resultados de búsqueda por {type === "genre" ? "género" : "título"}: <span className="text-primary">"{query}"</span>
      </h1>

      {isLoading ? (
        <p className="text-muted-foreground">Cargando resultados...</p>
      ) : novels.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {novels.map((novel) => (
            <NovelCard
              key={novel.id}
              id={novel.id}
              title={novel.title}
              genres={novel.genres}
              coverImageUrl={novel.coverImageUrl}
            />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No se encontraron resultados para "{query}".</p>
      )}
    </div>
  );
}
