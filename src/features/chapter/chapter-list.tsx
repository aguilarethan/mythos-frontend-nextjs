"use client";

import React, { useEffect, useState } from "react";
import { Chapter } from "@/services/chapter/chapter-interfaces";
import { getChaptersByNovelId } from "@/services/chapter/chapter-service";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useChapterStore } from "@/store/chapter-store"; // importa tu store

interface ChapterListProps {
  novelId: string;
}

export default function ChapterList({ novelId }: ChapterListProps) {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const setSelectedId = useChapterStore((state) => state.setSelectedId); // accede a la función del store

  useEffect(() => {
    async function fetchChapters() {
      try {
        const data = await getChaptersByNovelId(novelId);
        setChapters(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchChapters();
  }, [novelId]);

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (chapters.length === 0) {
    return (
      <p className="text-muted-foreground">No hay capítulos disponibles.</p>
    );
  }

  return (
  <div className="space-y-2">
    {chapters.map((chapter) => (
      <Card
        key={chapter.id}
        className="cursor-pointer hover:bg-muted transition-colors p-0"
        onClick={() => {
          setSelectedId(chapter.id);
          router.push("/novel/chapter");
        }}
      >
        <div className="flex items-center justify-between p-4 w-full">
          {/* Lado izquierdo: Número y título */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
              {chapter.chapterNumber}.
            </span>
            <h3 className="text-base font-semibold truncate">
              {chapter.title}
            </h3>
          </div>

          {/* Lado derecho: Precio y fecha */}
          <div className="flex items-center gap-2 flex-shrink-0 whitespace-nowrap">
            {chapter.priceMythras > 0 && (
              <span className="font-medium text-xs">
                {chapter.priceMythras} Mythras
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              {new Date(chapter.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </Card>
    ))}
  </div>
);
}
