"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useNovelStore } from "@/store/novel-store";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface NovelPreviewProps {
    id: string;
    title: string;
    genres: string[];
    coverImageUrl: string;
}

export function NovelCard({ id, title, genres, coverImageUrl }: NovelPreviewProps) {
    const router = useRouter();
    const setSelectedId = useNovelStore((state) => state.setSelectedId);

    const handleClick = () => {
        setSelectedId(id);
        router.push("/novel");
    };

    return (
        <Card
            className="flex flex-col bg-transparent shadow-none border-none transform transition-transform duration-300 hover:scale-105 cursor-pointer"
            onClick={handleClick}
        >
            <CardContent className="p-0 flex flex-col">
                {/* Contenedor de imagen con aspect ratio optimizado para grid */}
                <div className="aspect-[3/4] relative w-full overflow-hidden rounded-md mb-2">
                    <Image
                        src={coverImageUrl}
                        alt={title}
                        fill
                        unoptimized
                        className="object-cover"
                    />
                </div>

                {/* Contenedor de texto */}
                <div className="flex-shrink-0">
                    <h3 className="text-xs font-semibold leading-tight truncate mb-1">
                        {title}
                    </h3>
                    <p className="text-[10px] text-muted-foreground leading-tight line-clamp-2">
                        {genres.join(", ")}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}