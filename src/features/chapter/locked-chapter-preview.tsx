"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Lock, Coins, Sparkles, Clock } from "lucide-react";
import type { Chapter } from "@/services/chapter/chapter-interfaces";

interface LockedChapterPreviewProps {
  chapter: Chapter;
  onPurchase: () => void;
  isPurchasing: boolean;
}

export function LockedChapterPreview({
  chapter,
  onPurchase,
  isPurchasing,
}: LockedChapterPreviewProps) {
  // Crear un fragmento del contenido (primeros 200 caracteres)
  const previewContent = chapter.content.substring(0, 200) + "...";

  return (
    <div className="space-y-6">
      {/* Vista previa del contenido */}
      <div className="relative">
        <div className="prose prose-lg max-w-none">
          <div className="text-gray-800 leading-relaxed">
            <p className="text-base md:text-lg leading-8 text-gray-600">
              {previewContent}
            </p>
          </div>
        </div>

        {/* Overlay de desvanecimiento */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white pointer-events-none" />
      </div>

      <Separator />

      {/* Sección de compra */}
      <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <Lock className="h-6 w-6 text-amber-600" />
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant="secondary"
                    className="bg-amber-100 text-amber-800 border-amber-200"
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    Contenido Premium
                  </Badge>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Desbloquea este capítulo
                </h3>
                <p className="text-gray-600 text-sm">
                  Accede al contenido completo y continúa la aventura en el
                  mundo de Mythos.
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-amber-600" />
                  <span className="text-xl font-bold text-gray-900">
                    {chapter.priceMythras}
                  </span>
                  <span className="text-sm text-gray-600">Mythras</span>
                </div>

                <Button
                  onClick={onPurchase}
                  disabled={isPurchasing}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-6"
                >
                  {isPurchasing ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <Coins className="h-4 w-4 mr-2" />
                      Comprar capítulo
                    </>
                  )}
                </Button>
              </div>

              <div className="text-xs text-gray-500 space-y-1">
                <p>• Acceso inmediato al contenido completo</p>
                <p>
                  • El capítulo quedará disponible para siempre en tu biblioteca
                </p>
                <p>• Soporte para el autor y la plataforma</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
