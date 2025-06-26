import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

export interface IReview {
  id?: string;
  novelId: string;
  accountId: string;
  rating: number;
  comment: string;
  likes: number;
  createdAt?: Date;
  updatedAt?: Date;
  username?: string;
  photo?: string;
}

interface ReviewCardProps {
  review: IReview;
  className?: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, className }) => {
  const { rating, comment, username, photo } = review;

  
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating 
            ? "fill-yellow-400 text-yellow-400" 
            : "fill-muted stroke-muted-foreground"
        }`}
      />
    ));
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className={`shadow-none bg-transparent border-none ${className}`}>
      <CardContent className="px-0">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={photo} />
            <AvatarFallback>
              {username ? getInitials(username) : 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-normal">
                {username || 'Usuario'}
              </h4>
              <div className="flex">
                {renderStars(rating)}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {comment}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;