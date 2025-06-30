import React, { useState } from 'react';
import { MessageSquarePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CommentCard from './comment-card';
import CommentForm from './comment-form';
import { useAccount } from '@/hooks/use-account';
import { useChapterStore } from '@/store/chapter-store';
import { createComment, getCommentsByChapterId, replyToComment } from '@/services/comment/comment-service';
import { useEffect } from 'react';

interface IReply {
    id?: string;
    accountId: string;
    message: string;
    likes: number;
    createdAt?: Date;
    updatedAt?: Date;
}

interface IComment {
    id?: string;
    chapterId: string;
    accountId: string;
    message: string;
    replies: IReply[];
    likes: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export function CommentsBox() {
    const [showMainCommentForm, setShowMainCommentForm] = useState(false);
    const [activeReplyForm, setActiveReplyForm] = useState<string | null>(null);
    const { account } = useAccount();
    const chapterId = useChapterStore((state) => state.selectedId);
    const [comments, setComments] = useState<IComment[]>([]);

    useEffect(() => {
        const fetchComments = async () => {
            if (!chapterId) return;

            try {
                const data = await getCommentsByChapterId(chapterId);
                setComments(data.comments);
            } catch (err: any) {
                console.error(err);
            } finally {
            }
        };

        fetchComments();
    }, [chapterId]);

    const handleLike = (commentId: string) => {
        console.log('Liked comment:', commentId);
        // Actualizar el estado local
        setComments(prev =>
            prev.map(comment =>
                comment.id === commentId
                    ? { ...comment, likes: comment.likes + 1 }
                    : comment
            )
        );
    };

    const handleReply = (commentId: string) => {
        console.log('Reply to comment:', commentId);
    };

    const handleToggleReplyForm = (commentId: string) => {
        setActiveReplyForm(activeReplyForm === commentId ? null : commentId);
    };

    const handleSubmitComment = async (message: string, parentCommentId?: string) => {
        try {
            // 1. Llama al backend
            const createdComment = await replyToComment({
                accountId: account?.accountId ?? "", // si tu hook devuelve account.id
                message,
                commentId: parentCommentId!,
            });

            if (parentCommentId) {
                const newReply: IReply = {
                    id: createdComment.id,
                    accountId: createdComment.accountId,
                    message: createdComment.message,
                    likes: 0,
                    createdAt: new Date(createdComment.createdAt),
                };

                setComments(prev =>
                    prev.map(comment =>
                        comment.id === parentCommentId
                            ? {
                                ...comment,
                                replies: [...(comment.replies ?? []), newReply]
                            }
                            : comment
                    )
                );

                setActiveReplyForm(null);

            } else {
                const newComment: IComment = {
                    id: createdComment.id,
                    chapterId: createdComment.chapterId,
                    accountId: createdComment.accountId,
                    message: createdComment.message,
                    replies: [],
                    likes: 0,
                    createdAt: new Date(createdComment.createdAt),
                    updatedAt: new Date(createdComment.updatedAt),
                };

                setComments(prev => [newComment, ...prev]);
                setShowMainCommentForm(false);
            }
        } catch (error: any) {
            console.error(error);
            alert(error.message || "Error al crear el comentario");
        }
    };

    const handleCancelReply = () => {
        setActiveReplyForm(null);
    };

    const handleCancelMainComment = () => {
        setShowMainCommentForm(false);
    };

    return (
        <div className="space-y-6 mt-8">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Comentarios ({comments.length})</h2>
                <Button
                    onClick={() => setShowMainCommentForm(!showMainCommentForm)}
                    variant={showMainCommentForm ? "secondary" : "default"}
                    size="sm"
                >
                    <MessageSquarePlus className="w-4 h-4 mr-2" />
                    {showMainCommentForm ? 'Cancelar' : 'Nuevo comentario'}
                </Button>
            </div>

            {/* Formulario para nuevo comentario */}
            {showMainCommentForm && (
                <CommentForm
                    placeholder="Escribe tu comentario sobre este capítulo..."
                    userName="Usuario Actual"
                    onSubmit={handleSubmitComment}
                    onCancel={handleCancelMainComment}
                    autoFocus={true}
                />
            )}

            {/* Lista de comentarios */}
            <div className="space-y-4">
                {comments.map(comment => (
                    <CommentCard
                        key={comment.id}
                        comment={comment}
                        username="Usuario"
                        photo="https://example.com/avatar.jpg"
                        onLike={handleLike}
                        onReply={handleReply}
                        showReplyForm={activeReplyForm === comment.id}
                        onToggleReplyForm={handleToggleReplyForm}
                        replyForm={
                            activeReplyForm === comment.id ? (
                                <CommentForm
                                    placeholder="Escribe tu respuesta..."
                                    userName="Usuario Actual"
                                    isReply={true}
                                    parentCommentId={comment.id}
                                    onSubmit={handleSubmitComment}
                                    onCancel={handleCancelReply}
                                    autoFocus={true}
                                />
                            ) : null
                        }
                    />
                ))}
            </div>

            {comments.length === 0 && !showMainCommentForm && (
                <div className="text-center py-8 text-muted-foreground">
                    <MessageSquarePlus className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Aún no hay comentarios</p>
                    <p className="text-sm">Sé el primero en comentar este capítulo</p>
                </div>
            )}
        </div>
    );
}