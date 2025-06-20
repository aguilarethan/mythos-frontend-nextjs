"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useNovelStore } from "@/store/novel-store"; 

interface NovelRecommendationCardProps {
    id: string;
    imageUrl: string;
    title: string;
    genres: string[];
    imageAlt?: string;
    className?: string;
}

export function NovelRecommendationCard({
    id,
    imageUrl,
    title,
    genres,
    imageAlt = "Novel cover",
    className = "",
}: NovelRecommendationCardProps) {
    const router = useRouter();
    const setSelectedId = useNovelStore((state) => state.setSelectedId);
    
    const handleClick = () => {
        setSelectedId(id);
        router.push("/novel");
    };

    return (
        <Card
            className={`flex flex-col py-0 bg-transparent shadow-none border-none transform transition-transform duration-300 hover:scale-105 cursor-pointer ${className}`}
            onClick={handleClick}
        >
            <CardContent className="p-0 h-full flex flex-col">
                <div className="flex-[4] relative w-full overflow-hidden rounded-md">
                    <Image src={imageUrl} alt={imageAlt} fill unoptimized className="object-cover"/>
                </div>

                <div className="flex-[1] px-0 py-2 overflow-hidden">
                    <h3 className="text-xs font-semibold leading-tight truncate">
                        {title}
                    </h3>
                    <p className="text-[10px] py-0.5 text-muted-foreground break-words leading-none line-clamp-none">
                        {genres.join(", ")}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}