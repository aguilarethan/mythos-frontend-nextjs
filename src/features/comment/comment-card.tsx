import React, { useState } from 'react';
import { Heart, MessageCircle, MoreHorizontal } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export interface IReply {
  id?: string;
  accountId: string;
  message: string;
  likes: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IComment {
  id?: string;
  chapterId: string;
  accountId: string;
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
  replyForm?: React.ReactNode;
}

export default function CommentCard({ 
  comment, 
  photo, 
  username = "Usuario",
  onLike,
  onReply,
  showReplyForm = false,
  onToggleReplyForm,
  replyForm
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
    
    if (days === 0) return 'hace un momento';
    if (days === 1) return 'hace 1 día';
    return `hace ${days} días`;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card className="p-0 space-y-0 border-none bg-transparent shadow-none">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={photo} alt={username} />
            <AvatarFallback className="text-white text-sm font-medium">
              {getInitials(username)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">{username}</span>
            <span className="text-xs text-muted-foreground">
              {formatTimeAgo(comment.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Message */}
      <div className="text-sm leading-relaxed pl-13">
        {comment.message}
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-4 pl-13">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleLike}
          className="flex items-center space-x-1 h-8 px-2 text-muted-foreground hover:text-foreground"
        >
          <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
          <span className="text-xs">{comment.likes + (isLiked ? 1 : 0)}</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleReply}
          className="flex items-center space-x-1 h-8 px-2 text-muted-foreground hover:text-foreground"
        >
          <MessageCircle className="h-4 w-4" />
          <span className="text-xs">Responder</span>
        </Button>
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="pl-13 space-y-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowReplies(!showReplies)}
            className="text-xs text-muted-foreground hover:text-foreground p-0 h-auto"
          >
            {showReplies ? 'Ocultar' : 'Ver'} {comment.replies.length} respuesta{comment.replies.length > 1 ? 's' : ''}
          </Button>
          
          {showReplies && (
            <div className="space-y-3 border-l-2 border-muted pl-4">
              {comment.replies.map((reply) => (
                <div key={reply.id} className="space-y-2">
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-muted text-xs">
                        {getInitials('Usuario')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">Usuario</span>
                        <span className="text-xs text-muted-foreground">
                          {formatTimeAgo(reply.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm">{reply.message}</p>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="flex items-center space-x-1 h-6 px-1 text-muted-foreground hover:text-foreground"
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

      {/* Reply Form */}
      {showReplyForm && replyForm && (
        <div className="pl-13 mt-3">
          {replyForm}
        </div>
      )}
    </Card>
  );
}