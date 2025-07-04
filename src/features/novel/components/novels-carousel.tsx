"use client"

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import { useRouter } from "next/navigation";
import { useNovelStore } from "@/store/novel-store";
import { getLastThreeNovelsPreview } from "@/services/novel/novel-service";

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel"
import { toast } from "sonner"

interface Novel {
    id: number | string;
    title: string;
    description: string;
    coverImageUrl: string;
    writerAccountId: string;
    writerName?: string;
}

export function NovelsCarousel() {
    const [novels, setNovels] = React.useState<Novel[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    const plugin = React.useRef(
        Autoplay({ delay: 10000, stopOnInteraction: true })
    )

    const router = useRouter();
    const setSelectedId = useNovelStore((state) => state.setSelectedId);

    // Cargar las novelas al montar el componente
    React.useEffect(() => {
        const loadNovels = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getLastThreeNovelsPreview();
                setNovels(data);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "Error al cargar las novelas";
                setError(errorMessage);
                toast.error("Error al cargar novelas", {
                    description: errorMessage,
                });
            } finally {
                setLoading(false);
            }
        };

        loadNovels();
    }, []);

    const handleClick = (id: string) => {
        setSelectedId(id);
        router.push("/novel");
    };

    if (loading) {
        return (
            <div className="w-full">
                <Card className="border-0 bg-foreground py-0">
                    <CardContent className="p-0">
                        <div className="flex p-6 gap-6">
                            <div className="w-1/3">
                                <Skeleton className="w-full h-96 rounded-md" />
                            </div>
                            <div className="w-2/3 p-4 space-y-4">
                                <Skeleton className="h-8 w-3/4" />
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-2/3" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-96 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-muted-foreground">Error al cargar las novelas</p>
                    <p className="text-sm text-muted-foreground mt-1">Intenta recargar la página</p>
                </div>
            </div>
        );
    }

    if (novels.length === 0) {
        return (
            <div className="w-full h-96 flex items-center justify-center">
                <p className="text-muted-foreground">No hay novelas disponibles</p>
            </div>
        );
    }

    return (
        <Carousel
            plugins={[plugin.current]}
            className="w-full"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
        >
            <CarouselContent>
                {novels.map((novel) => (
                    <CarouselItem key={novel.id}>
                        <Card className="border-0 bg-foreground py-0 cursor-pointer" onClick={() => handleClick(novel.id.toString())}>
                            <CardContent className="p-0">
                                <div className="flex p-6 gap-6">
                                    <div className="w-1/3 flex-shrink-0">
                                        <img
                                            src={novel.coverImageUrl}
                                            alt={`Portada de ${novel.title}`}
                                            className="w-full h-96 object-cover rounded-md"
                                            onError={(e) => {
                                                
                                                e.currentTarget.src = "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop";
                                            }}
                                        />
                                    </div>

                                    <div className="w-2/3 p-4 text-background flex flex-col min-h-0">
                                        <h2 className="text-3xl font-semibold mb-4 text-background line-clamp-2">
                                            {novel.title}
                                        </h2>

                                        <div className="flex items-center mb-6 flex-shrink-0">
                                            <Avatar className="mr-2 h-8 w-8">
                                                <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                                                    {novel.writerName?.charAt(0)?.toUpperCase() || "U"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="font-normal truncate">
                                                {novel.writerName}
                                            </span>
                                        </div>

                                        <div className="flex-1 min-h-0 h-full">
                                            <p className="leading-relaxed font-normal line-clamp-6 text-sm">
                                                {novel.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    )
}