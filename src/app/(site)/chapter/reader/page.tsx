"use client";

import { ChapterReader } from "@/features/chapter/chapter-reader";
import { useChapterStore } from "@/store/chapter-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ReaderPage() {
  const chapterId = useChapterStore((state) => state.selectedId);
  const router = useRouter();

  // Redirige si no hay un capítulo seleccionado
  useEffect(() => {
    if (!chapterId) {
      router.push("/"); // o muestra un mensaje de error
    }
  }, [chapterId]);

  if (!chapterId) return null; // Evitar renderizar hasta que haya ID

  return <ChapterReader initialChapterId={chapterId} />;
}
