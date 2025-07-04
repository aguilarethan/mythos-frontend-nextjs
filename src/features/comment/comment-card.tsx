import React, { useState } from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export interface IReply {
  id?: string;
  accountId: string;
  username?: string;
  message: string;
  likes: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IComment {
  id?: string;
  chapterId: string;
  accountId: string;
  username?: string;
  message: string;
  replies: IReply[];
  likes: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CommentCardProps {
  comment: IComment;
  photo?: string;
  username?: string;
  onLike?: (commentId: string) => void;
  onReply?: (commentId: string) => void;
  showReplyForm?: boolean;
  onToggleReplyForm?: (commentId: string) => void;
}

export default function CommentCard({ 
  comment, 
  photo, 
  username,
  onLike,
  onReply,
  showReplyForm = false,
  onToggleReplyForm,
}: CommentCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.(comment.id || '');
  };

  const handleReply = () => {
    onToggleReplyForm?.(comment.id || '');
    onReply?.(comment.id || '');
  };

  const formatTimeAgo = (date?: Date) => {
    if (!date) return 'hace un momento';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (days > 0) {
      return days === 1 ? 'hace 1 día' : `hace ${days} días`;
    }
    if (hours > 0) {
      return hours === 1 ? 'hace 1 hora' : `hace ${hours} horas`;
    }
    if (minutes > 0) {
      return minutes === 1 ? 'hace 1 minuto' : `hace ${minutes} minutos`;
    }
    return 'hace un momento';
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const displayUsername = username || comment.username || 'Usuario';
  const hasReplies = comment.replies && comment.replies.length > 0;

  return (
    <Card className="p-4 border-none bg-transparent shadow-none">
      <div className="space-y-3">
        {/* Comment Header */}
        <div className="flex items-start space-x-3">
          <Avatar className="w-10 h-10 flex-shrink-0">
            <AvatarImage src={photo} alt={displayUsername} />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
              {getInitials(displayUsername)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-semibold text-sm truncate">{displayUsername}</span>
              <span className="text-xs text-muted-foreground flex-shrink-0">
                {formatTimeAgo(comment.createdAt)}
              </span>
            </div>
            
            {/* Comment Message */}
            <p className="text-sm leading-relaxed text-foreground break-words">
              {comment.message}
            </p>
          </div>
        </div>

        {/* Comment Actions */}
        <div className="flex items-center space-x-4 ml-13">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLike}
            className="flex items-center space-x-1 h-8 px-2 text-muted-foreground hover:text-red-500 transition-colors"
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            <span className="text-xs">{comment.likes + (isLiked ? 1 : 0)}</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleReply}
            className={`flex items-center space-x-1 h-8 px-2 text-muted-foreground hover:text-blue-500 transition-colors ${showReplyForm ? 'text-blue-500' : ''}`}
          >
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs">Responder</span>
          </Button>
        </div>

        {/* Replies Section */}
        {hasReplies && (
          <div className="ml-13 space-y-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowReplies(!showReplies)}
              className="text-xs text-muted-foreground hover:text-foreground p-0 h-auto font-medium"
            >
              {showReplies ? 'Ocultar' : 'Ver'} {comment.replies.length} respuesta{comment.replies.length > 1 ? 's' : ''}
            </Button>
            
            {showReplies && (
              <div className="space-y-4 border-l-2 border-muted/50 pl-4">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="space-y-2">
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarFallback className="bg-muted text-xs font-medium">
                          {getInitials(reply.username || 'Usuario')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-sm truncate">
                            {reply.username || 'Usuario'}
                          </span>
                          <span className="text-xs text-muted-foreground flex-shrink-0">
                            {formatTimeAgo(reply.createdAt)}
                          </span>
                        </div>
                        
                        <p className="text-sm leading-relaxed break-words">
                          {reply.message}
                        </p>
                        
                        <div className="flex items-center mt-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="flex items-center space-x-1 h-6 px-1 text-muted-foreground hover:text-red-500 transition-colors"
                          >
                            <Heart className="h-3 w-3" />
                            <span className="text-xs">{reply.likes}</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}