'use client';
import React, { useState, useEffect } from 'react';
import ReviewCard from './review-card';
import ReviewForm from './review-form';
import { Button } from '@/components/ui/button';
import { useAccount } from '@/hooks/use-account';
import { useNovelDetailsStore } from '@/store/novel-details-store';
import { getReviewsByNovelId } from '@/services/review/review-service';
import { IReview } from './review-card';

const ReviewsBox = () => {
    const [showForm, setShowForm] = useState(false);
    const { account, isLoading } = useAccount();
    const { id: novelId } = useNovelDetailsStore();
    const [reviews, setReviews] = useState<IReview[]>([]);
    const [loadingReviews, setLoadingReviews] = useState(true);

    useEffect(() => {
        const loadReviews = async () => {
            if (!novelId) return;
            try {
                const data = await getReviewsByNovelId(novelId);
                setReviews(data);
            } catch (error) {
                console.error("No se pudieron cargar las reseñas:", error);
            } finally {
                setLoadingReviews(false);
            }
        };

        loadReviews();
    }, [novelId]);

    return (
        <div className="space-y-1">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-2xl font-semibold ">Reseñas</h2>
                {account && !isLoading && (
                    <Button
                        onClick={() => setShowForm(!showForm)}
                        variant="secondary"
                        className="cursor-pointer"
                    >
                        {showForm ? 'Cancelar' : 'Escribir reseña'}
                    </Button>
                )}
            </div>

            {showForm && account && novelId && (
                <ReviewForm account={account} novelId={novelId} onReviewSubmitted={(newReview) => {
                    setReviews([newReview, ...reviews]);
                    setShowForm(false);
                }} />
            )}

            <div className="space-y-0 mt-0">
                {loadingReviews ? (
                    <p className="text-muted-foreground text-sm">Cargando reseñas...</p>
                ) : reviews.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No hay reseñas todavía.</p>
                ) : (
                    reviews.map((review) => (
                        <ReviewCard key={review.id || review.accountId} review={review} />
                    ))
                )}
            </div>


        </div>
    );
};

export default ReviewsBox;