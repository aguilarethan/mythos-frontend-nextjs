"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

interface ChapterNavigationProps {
  currentChapter: number;
  onPreviousChapter: () => void;
  onNextChapter: () => void;
}

export function ChapterNavigation({
  currentChapter,
  onPreviousChapter,
  onNextChapter,
}: ChapterNavigationProps) {
  const handlePrevious = () => {
    if (currentChapter <= 1) {
      toast("Ya estás en el primer capítulo de la historia.");
      return;
    }
    onPreviousChapter();
  };

  const handleNext = () => {
    // Simulamos que hay un límite de capítulos
    if (currentChapter >= 10) {
      toast("Has llegado al final de los capítulos disponibles.");
      return;
    }
    onNextChapter();
  };

  return (
    <div className="flex justify-between items-center pt-8 border-t">
      <Button
        variant="outline"
        onClick={handlePrevious}
        className="flex items-center gap-2 bg-white text-gray-700 hover:bg-gray-50"
      >
        <ChevronLeft className="h-4 w-4" />
        Capítulo anterior
      </Button>

      <span className="text-sm text-muted-foreground">
        Capítulo {currentChapter}
      </span>

      <Button
        variant="outline"
        onClick={handleNext}
        className="flex items-center gap-2 bg-white text-gray-700 hover:bg-gray-50"
      >
        Siguiente capítulo
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
