import {NovelRecommendationCard} from "@/features/novel/components/novel-recommendation-card";
import { NovelsCarousel } from "@/features/novel/components/novels-carousel";

export default function HomePage() {
    return (
        <div className="max-w-5xl items=center mx-auto py-4">
            
            <div>
                <h2 className="text-xl font-semibold mb-4">Los mejores de la semana</h2>
                <NovelsCarousel />
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Recomendaciones para ti</h2>
                <NovelRecommendationCard
                    id="1"
                    imageUrl="https://res.cloudinary.com/dsgftpzux/image/upload/v1750296825/novels-covers/ufbhcesyg90ex0boetsf.png"
                    title="Sangre maldita"
                    genres={["Futurista", "Fantasía oscura", "Acción"]}
                    imageAlt="El Viaje del Héroe"
                    className="w-[130px] h-[240px] mx-auto"
                />
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-4">Mejores clasificados</h2>
                
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-4">Etiquetas populares</h2>
                
            </div>
            
        </div>
    );
}