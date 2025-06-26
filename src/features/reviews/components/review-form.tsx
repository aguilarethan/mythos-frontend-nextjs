// ReviewForm.tsx
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { createReview } from '@/services/review/review-service';
import { toast } from "sonner"
import { IReview } from './review-card';

interface Account {
    accountId: string;
    username: string;
}

interface ReviewFormProps {
    account: Account;
    novelId: string;
    onReviewSubmitted: (newReview: IReview) => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ account, novelId, onReviewSubmitted }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [hoveredRating, setHoveredRating] = useState(0);

    const handleSubmit = async () => {
        if (rating > 0 && comment.trim()) {
            const reviewData = {
                novelId,
                accountId: account.accountId,
                rating,
                comment,
            };

            try {
                const created = await createReview(reviewData);
                toast.success('Reseña publicada exitosamente');

                // Llamar callback
                onReviewSubmitted({
                    ...created,
                });

                // Limpiar campos
                setRating(0);
                setComment('');
            } catch (error) {
                toast.error('Error al publicar la reseña');
            }
            setRating(0);
            setComment('');
        }
    };

    const handleStarClick = (index: number) => setRating(index + 1);
    const handleStarHover = (index: number) => setHoveredRating(index + 1);
    const handleStarLeave = () => setHoveredRating(0);

    const getInitials = (name: string) =>
        name.split(' ').map(w => w.charAt(0)).join('').toUpperCase().slice(0, 2);

    const renderStars = () => (
        Array.from({ length: 5 }, (_, index) => {
            const isActive = index < (hoveredRating || rating);
            return (
                <Star
                    key={index}
                    className={`w-5 h-5 cursor-pointer transition-colors ${isActive
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'fill-muted stroke-muted-foreground hover:fill-yellow-200 hover:text-yellow-200'
                        }`}
                    onClick={() => handleStarClick(index)}
                    onMouseEnter={() => handleStarHover(index)}
                    onMouseLeave={handleStarLeave}
                />
            );
        })
    );

    return (
        <Card className="shadow-none bg-transparent border-none">
            <CardContent className="px-0">
                <div className="flex gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={undefined} />
                        <AvatarFallback>{getInitials(account.username)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                            <h4 className="text-sm font-normal">{account.username}</h4>
                            <div className="flex">{renderStars()}</div>
                        </div>
                        <Textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Escribe tu reseña..."
                            className="min-h-[100px] resize-none bg-transparent text-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                        <div className="flex justify-end">
                            <Button
                                onClick={handleSubmit}
                                disabled={rating === 0 || !comment.trim()}
                                className="cursor-pointer"
                            >
                                Publicar
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ReviewForm;