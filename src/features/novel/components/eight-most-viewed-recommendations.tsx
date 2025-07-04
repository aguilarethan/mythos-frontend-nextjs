"use client";

import { useEffect, useState } from "react";
import { getEightMostViewedNovelsPreview } from "@/services/novel/novel-service";
import { NovelRecommendationCard } from "@/features/novel/components/novel-recommendation-card";
import { Skeleton } from "@/components/ui/skeleton";
import { NovelCard } from "./novel-card";

interface NovelPreview {
  id: string;
  title: string;
  genres: string[];
  coverImageUrl: string;
}

export function EightMostViewedRecommendations() {
  const [novels, setNovels] = useState<NovelPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNovels = async () => {
      try {
        const data = await getEightMostViewedNovelsPreview();
        setNovels(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNovels();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, idx) => (
          <Skeleton key={idx} className="aspect-[2/3] w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-sm">Error: {error}</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {novels.map((novel) => (
        <NovelCard
          key={novel.id}
          id={novel.id}
          coverImageUrl={novel.coverImageUrl}
          title={novel.title}
          genres={novel.genres}
        />
      ))}
    </div>
  );
}
