"use client";

import { EightMostViewedRecommendations } from "@/features/novel/components/eight-most-viewed-recommendations";
import { NovelsCarousel } from "@/features/novel/components/novels-carousel";
import { useSearchStore } from "@/store/search-store";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export default function HomePage() {
    const AVAILABLE_GENRES = ["Acción", "Aventura", "Romance", "Terror", "Drama", "Fantasía", "Fantasía oscura", "Ciencia ficción", "Comedia", "Misterio", "Misterio sobrenatural", "Cultivo", "Superheroes"]
    const { setSearch } = useSearchStore();
    const router = useRouter();

    function handleGenreClick(genre: string) {
        setSearch(genre, "genre");
        router.push("/search");
    }

    return (
        <div className="max-w-5xl items=center mx-auto py-4">

            <div>
                <h2 className="text-xl font-semibold mb-4">Los más nuevo del momento</h2>
                <NovelsCarousel />
            </div>

            <div className="mt-6">
                <h2 className="text-xl font-semibold">Lo más visto</h2>
                <EightMostViewedRecommendations />
            </div>

            <div className="mt-4">
                <h2 className="text-xl font-semibold mb-6">Explorar por géneros</h2>
                <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
                    {AVAILABLE_GENRES.map((genre) => (
                        <Button
                            key={genre}
                            variant="outline"
                            className="text-sm px-4 py-2 cursor-pointer"
                            onClick={() => handleGenreClick(genre)}
                        >
                            {genre}
                        </Button>
                    ))}
                </div>
            </div>




        </div>
    );
}