"use client";

import React from "react";
import { NovelData } from "@/store/novel-details-store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, FileText, Star, Flag, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAccount } from "@/hooks/use-account";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ChapterList from "@/features/chapter/chapter-list";

interface NovelInformationProps extends NovelData {
  isLoading?: boolean;
}

export default function NovelInformation({
  id,
  writerAccountId,
  title,
  description,
  genres,
  tags,
  views,
  isPublic,
  coverImageUrl,
  status,
  createdAt,
  updatedAt,
  isLoading = false,
}: NovelInformationProps) {
  const router = useRouter();
  const { account, isLoading: accountLoading } = useAccount();

  const isOwner = account?.accountId === writerAccountId;

  const handleEditNovelClick = () => {
    router.push(`/novel/edit-novel`);
  };

  const handleCreateChapterClick = () => {
    router.push(`/novel/create-chapter`);
  };

  if (isLoading) {
    return <NovelInformationSkeleton />;
  }

  return (
    <div className="min-h-screen">
      <div className="grid grid-cols-[10%_30%_50%_10%] gap-6 items-start p-6">
        <div></div>

        <Card className="overflow-hidden py-0">
          <div className="relative aspect-[3/4] w-full">
            <Image
              src={coverImageUrl}
              alt="cover-image"
              unoptimized
              fill
              className="object-cover"
            />
          </div>
        </Card>

        <div className="h-full flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h1 className="text-4xl font-semibold mb-2">{title}</h1>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {views}
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  {status}
                </div>
              </div>
            </div>

            <p className="text-muted-foreground flex items-center gap-2">
              <span className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs">
                H
              </span>
              {writerAccountId}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Géneros: {genres?.join(", ")}
              </p>
            </div>

            <div className="flex justify-between items-center">
              {isOwner ? (
                <Button
                  onClick={handleCreateChapterClick}
                  className="cursor-pointer"
                >
                  Agregar capítulo
                </Button>
              ) : (
                <Button className="cursor-pointer">Leer historia</Button>
              )}

              <div className="flex gap-2">
                {!isOwner && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="cursor-pointer"
                  >
                    <Flag className="w-4 h-4" />
                  </Button>
                )}
                {isOwner && (
                  <Button
                    onClick={handleEditNovelClick}
                    variant="outline"
                    size="icon"
                    className="cursor-pointer"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div></div>
      </div>

      <Tabs defaultValue="Información" className="h-full flex flex-col">
        <TabsList className="w-fit">
          <TabsTrigger value="Información" className="cursor-pointer">
            Información
          </TabsTrigger>
          <TabsTrigger value="Capítulos" className="cursor-pointer">
            Capítulos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="Capítulos" className="flex-1 space-y-5">
          <ChapterList novelId={"6854ff5d0b9a2bfe04a3895b"} />
        </TabsContent>

        <TabsContent value="Información" className="flex-1 space-y-5">
          <div>
            <h2 className="text-2xl font-semibold mb-3">Descripción</h2>
            <p>{description}</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">Etiquetas</h2>
            <div className="flex flex-wrap gap-2">
              {tags?.map((tag, index) => (
                <Button key={index} variant="outline">
                  {tag}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">Reseñas</h2>
            <p>{description}</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">Novelas similares</h2>
            <p>{description}</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Componente Skeleton
function NovelInformationSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="grid grid-cols-[10%_30%_50%_10%] gap-6 items-start p-6">
        <div></div>

        {/* Skeleton para la imagen de portada */}
        <Card className="overflow-hidden py-0">
          <div className="relative aspect-[3/4] w-full">
            <Skeleton className="w-full h-full" />
          </div>
        </Card>

        {/* Skeleton para la información principal */}
        <div className="h-full flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              {/* Skeleton para el título */}
              <Skeleton className="h-10 w-3/4 mb-2" />

              {/* Skeleton para las estadísticas */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Skeleton className="w-4 h-4 rounded" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <div className="flex items-center gap-1">
                  <Skeleton className="w-4 h-4 rounded" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </div>

            {/* Skeleton para el autor */}
            <div className="flex items-center gap-2">
              <Skeleton className="w-6 h-6 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>

          <div className="space-y-4">
            {/* Skeleton para los géneros */}
            <div>
              <Skeleton className="h-4 w-48" />
            </div>

            {/* Skeleton para los botones */}
            <div className="flex justify-between items-center">
              <Skeleton className="h-10 w-32" />

              <div className="flex gap-2">
                <Skeleton className="h-10 w-10" />
              </div>
            </div>
          </div>
        </div>

        <div></div>
      </div>

      {/* Skeleton para las tabs */}
      <div className="h-full flex flex-col">
        {/* Skeleton para TabsList */}
        <div className="w-fit flex gap-1 p-1 bg-muted rounded-md mb-4">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-20" />
        </div>

        {/* Skeleton para el contenido de las tabs */}
        <div className="flex-1 space-y-5">
          {/* Skeleton para Descripción */}
          <div>
            <Skeleton className="h-8 w-32 mb-3" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>

          {/* Skeleton para Etiquetas */}
          <div>
            <Skeleton className="h-8 w-24 mb-3" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-9 w-16" />
              ))}
            </div>
          </div>

          {/* Skeleton para Reseñas */}
          <div>
            <Skeleton className="h-8 w-20 mb-3" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>

          {/* Skeleton para Novelas similares */}
          <div>
            <Skeleton className="h-8 w-40 mb-3" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
