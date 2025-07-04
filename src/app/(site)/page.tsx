import { EightMostViewedRecommendations } from "@/features/novel/components/eight-most-viewed-recommendations";
import {NovelRecommendationCard} from "@/features/novel/components/novel-recommendation-card";
import { NovelsCarousel } from "@/features/novel/components/novels-carousel";
import { Button } from "@/components/ui/button";
import Footer from "@/components/shared/footer";

export default function HomePage() {
    const AVAILABLE_GENRES = ["Acción", "Aventura", "Romance", "Terror", "Drama", "Fantasía", "Fantasía oscura", "Ciencia ficción", "Comedia", "Misterio", "Misterio sobrenatural", "Cultivo", "Superheroes"]
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
                        >
                            {genre}
                        </Button>
                    ))}
                </div>
            </div>

            
           
            
        </div>
    );
}