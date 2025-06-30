import {NovelRecommendationCard} from "@/features/novel/components/novel-recommendation-card";
import { NovelsCarousel } from "@/features/novel/components/novels-carousel";

export default function HomePage() {
    return (
        <div className="max-w-5xl items=center mx-auto py-4">
            
            <div>
                <h2 className="text-xl font-semibold mb-4">Los más nuevo del momento</h2>
                <NovelsCarousel />
            </div>

           
            
        </div>
    );
}