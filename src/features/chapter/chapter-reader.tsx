"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChapterNavigation } from "./chapter-navigation";
import { LockedChapterPreview } from "@/features/chapter/locked-chapter-preview";
import { Chapter, PurchaseStatus } from "@/services/chapter/chapter-interfaces";
import {
  getChapterById,
  getChaptersByNovelId,
  checkPurchaseStatus,
  purchaseChapter,
} from "@/services/chapter/chapter-service";
import { toast } from "sonner";
import { CommentsBox } from "../comment/comments-box";
import { Download } from "lucide-react";
import { generateChapterPDF } from "@/services/chapter/chapter-service";
import { Button } from "@/components/ui/button";

interface ChapterReaderProps {
  initialChapterId: string;
}

export function ChapterReader({ initialChapterId }: ChapterReaderProps) {
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchaseStatus, setPurchaseStatus] = useState<PurchaseStatus | null>(
    null
  );
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [chapters, setChapters] = useState<Chapter[]>([]);

  useEffect(() => {
    async function fetchChapters() {
      if (!chapter?.novelId) return; // Evita llamar con undefined

      try {
        const data = await getChaptersByNovelId(chapter.novelId);
        setChapters(data);
      } catch (err) {
        toast("Error al obtener la lista de capítulos");
      }
    }

    fetchChapters();
  }, [chapter?.novelId]);

  const loadChapter = async (chapterId: string) => {
    setLoading(true);
    setError(null);
    setPurchaseStatus(null);

    try {
      const chapterData = await getChapterById(chapterId);
      setChapter(chapterData);

      if (chapterData.priceMythras && chapterData.priceMythras > 0) {
        // Aquí se verifica si el usuario ya compró el capítulo
        const status = await checkPurchaseStatus(chapterId);
        console.log("Purchase status:", status);
        setPurchaseStatus(status);
      }
    } catch {
      setError("Error al cargar el capítulo");
      toast("No se pudo cargar el capítulo. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!chapter) {
      toast("No se puede generar el PDF porque el capítulo no está cargado.");
      return;
    }

    const chapterData = {
      chapterNumber: chapter.chapterNumber,
      title: chapter.title,
      content: chapter.content
    };

    generateChapterPDF(chapterData);
  };

  const handlePurchaseChapter = async () => {
    if (!chapter) return;

    setIsPurchasing(true);

    try {
      // Aquí se simula la compra del capítulo
      const result = await purchaseChapter(chapter.id, chapter.priceMythras);

      if (result.success) {
        toast.success("¡Compra exitosa!");

        // Actualizar el estado de compra
        setPurchaseStatus({ isPurchased: true });

        // Mostrar el nuevo balance si está disponible
        if (result.newBalance) {
          toast(`Tu nuevo balance es ${result.newBalance} Mythras`);
        }
      } else {
        toast("Error en la compra" + result.message);
      }
    } catch (err) {
      toast("Ocurrió un error inesperado. Inténtalo de nuevo.");
    } finally {
      setIsPurchasing(false);
    }
  };

  useEffect(() => {
    loadChapter(initialChapterId);
  }, [initialChapterId]);

  const handlePreviousChapter = () => {
    // Simulamos la navegación al capítulo anterior
    toast("Cargando capítulo anterior");
    if (!chapter) return;

    const currentIndex = chapters.findIndex((c) => c.id === chapter.id);
    if (currentIndex > 0) {
      const prevChapterId = chapters[currentIndex - 1].id;
      loadChapter(prevChapterId);
    } else {
      toast("Este es el primer capítulo.");
    }
  };

  const handleNextChapter = () => {
    // Simulamos la navegación al siguiente capítulo
    if (!chapter) return;

    const currentIndex = chapters.findIndex((c) => c.id === chapter.id);
    if (currentIndex < chapters.length - 1) {
      const nextChapterId = chapters[currentIndex + 1].id;
      loadChapter(nextChapterId);
    } else {
      toast("Este es el último capítulo.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="shadow-sm">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <Skeleton className="h-8 w-3/4 mx-auto mb-2" />
                <Skeleton className="h-4 w-1/2 mx-auto" />
              </div>

              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>

              <div className="text-center mt-6">
                <p className="text-muted-foreground">Cargando capítulo...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !chapter) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="shadow-sm">
            <CardContent className="p-8 text-center">
              <p className="text-destructive mb-4">
                Error al cargar el capítulo
              </p>
              <button
                onClick={() => loadChapter(initialChapterId)}
                className="text-primary hover:underline"
              >
                Intentar de nuevo
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Determinar si se debe mostrar el contenido completo
  const shouldShowFullContent =
    !(chapter?.priceMythras > 0) ||
    (chapter?.priceMythras > 0 && purchaseStatus?.isPurchased);

  return (
    <Card className="mx-auto border-none shadow-none bg-transparent max-w-5xl">
      <CardContent>
        {/* Header del capítulo */}
        <header className="text-start mb-8 pb-6 border-b">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {chapter.title}
          </h1>
          <p className="text-muted-foreground">
            {chapter.bookTitle} Capítulo {chapter.chapterNumber}
          </p>
        </header>

        {/* Contenido del capítulo */}
        {shouldShowFullContent ? (
          <article className="prose prose-lg max-w-none">
            <div className="leading-relaxed space-y-6">
              {chapter.content.split("\n\n").map((paragraph, index) => (
                <p key={index} className="text-base md:text-lg leading-8">
                  {paragraph}
                </p>
              ))}
            </div>
          </article>
        ) : (
          <LockedChapterPreview
            chapter={chapter}
            onPurchase={handlePurchaseChapter}
            isPurchasing={isPurchasing}
          />
        )}

        <Button onClick={handleDownloadPDF} variant="secondary" size="icon" className="size-8 cursor-pointer mt-3">
          <Download />
        </Button>

        {/* Navegación entre capítulos */}
        <ChapterNavigation
          currentChapter={chapter.chapterNumber}
          onPreviousChapter={handlePreviousChapter}
          onNextChapter={handleNextChapter}
        />

        <CommentsBox />
      </CardContent>
    </Card>
  );
}
