import React, { useState, useEffect } from 'react';
import { MessageSquarePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CommentCard from './comment-card';
import NewCommentForm from './new-comment-form';
import ReplyCommentForm from './reply-comment-form';
import { useChapterStore } from '@/store/chapter-store';
import { getCommentsByChapterId } from '@/services/comment/comment-service';

interface IReply {
  id?: string;
  accountId: string;
  username?: string;
  message: string;
  likes: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IComment {
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

export function CommentsBox() {
  const [showNewCommentForm, setShowNewCommentForm] = useState(false);
  const [activeReplyForm, setActiveReplyForm] = useState<string | null>(null);
  const [comments, setComments] = useState<IComment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const chapterId = useChapterStore((state) => state.selectedId);

  useEffect(() => {
    const fetchComments = async () => {
      if (!chapterId) return;

      setIsLoading(true);
      try {
        const data = await getCommentsByChapterId(chapterId);
        setComments(Array.isArray(data?.comments) ? data.comments : []);
      } catch (err: any) {
        console.error('Error fetching comments:', err);
        setComments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [chapterId]);

  const handleNewCommentSuccess = (newComment: IComment) => {
    setComments(prev => [newComment, ...prev]);
    setShowNewCommentForm(false);
  };

  const handleReplySuccess = (reply: IReply, parentCommentId: string) => {
    setComments(prev =>
      prev.map(comment =>
        comment.id === parentCommentId
          ? {
              ...comment,
              replies: [...(comment.replies ?? []), reply]
            }
          : comment
      )
    );
    setActiveReplyForm(null);
  };

  const handleLike = (commentId: string) => {
    setComments(prev =>
      prev.map(comment =>
        comment.id === commentId
          ? { ...comment, likes: comment.likes + 1 }
          : comment
      )
    );
  };

  const handleToggleReplyForm = (commentId: string) => {
    setActiveReplyForm(activeReplyForm === commentId ? null : commentId);
  };

  const handleCancelNewComment = () => {
    setShowNewCommentForm(false);
  };

  const handleCancelReply = () => {
    setActiveReplyForm(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 mt-8">
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">Cargando comentarios...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Comentarios ({comments?.length || 0})
        </h2>
        <Button
          onClick={() => setShowNewCommentForm(!showNewCommentForm)}
          variant={showNewCommentForm ? "secondary" : "default"}
          size="sm"
          className="cursor-pointer"
        >
          <MessageSquarePlus className="w-4 h-4 mr-2" />
          {showNewCommentForm ? 'Cancelar' : 'Nuevo comentario'}
        </Button>
      </div>

      {/* New Comment Form */}
      {showNewCommentForm && (
        <NewCommentForm
          onSuccess={handleNewCommentSuccess}
          onCancel={handleCancelNewComment}
          autoFocus={true}
        />
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {comments && comments.length > 0 ? (
          comments.map(comment => (
            <div key={comment.id} className="space-y-4">
              <CommentCard
                comment={comment}
                username={comment.username || "Usuario"}
                photo="https://example.com/avatar.jpg"
                onLike={handleLike}
                onReply={() => handleToggleReplyForm(comment.id || '')}
                showReplyForm={activeReplyForm === comment.id}
                onToggleReplyForm={handleToggleReplyForm}
              />
              
              {/* Reply Form */}
              {activeReplyForm === comment.id && (
                <div className="ml-8">
                  <ReplyCommentForm
                    parentCommentId={comment.id || ''}
                    onSuccess={(reply) => handleReplySuccess(reply, comment.id || '')}
                    onCancel={handleCancelReply}
                    autoFocus={true}
                  />
                </div>
              )}
            </div>
          ))
        ) : (
          !showNewCommentForm && (
            <div className="text-center py-12 text-muted-foreground">
              <MessageSquarePlus className="w-16 h-16 mx-auto mb-4 opacity-40" />
              <h3 className="text-lg font-medium mb-2">Aún no hay comentarios</h3>
              <p className="text-sm">Sé el primero en comentar este capítulo</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}