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
    <div className="space-y-4">
      {chapters.map((chapter) => (
        <Card
          key={chapter.id}
          className="flex justify-between items-center p-4 cursor-pointer hover:bg-muted transition-colors"
          onClick={() => {
            setSelectedId(chapter.id); // Guardar el ID en el store
            router.push("/novel/chapter"); // Redirigir a la página del lector
          }}
        >
          <div>
            <h3 className="text-lg font-semibold">{chapter.title}</h3>
            <p className="text-sm text-muted-foreground">
              {new Date(chapter.createdAt).toLocaleDateString()}{" "}
              {chapter.priceMythras > 0 && "• Requiere pago"}
            </p>
          </div>
          <Button variant="outline" size="sm">
            Leer
          </Button>
        </Card>
      ))}
    </div>
  );
}
