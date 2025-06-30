import React, { useState } from 'react';
import { Send, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useChapterStore } from "@/store/chapter-store";
import { useAccount } from '@/hooks/use-account';

interface CommentFormProps {
    placeholder?: string;
    userName?: string;
    userAvatar?: string;
    isReply?: boolean;
    parentCommentId?: string;
    onSubmit?: (message: string, parentCommentId?: string) => void;
    onCancel?: () => void;
    autoFocus?: boolean;
}

export default function CommentForm({
    placeholder = "Escribe tu comentario...",
    userName = "Usuario",
    userAvatar,
    isReply = false,
    parentCommentId,
    onSubmit,
    onCancel,
    autoFocus = false
}: CommentFormProps) {
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const chapterId = useChapterStore((state) => state.selectedId);
    const { account } = useAccount();

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const handleSubmit = async () => {
        if (!message.trim()) return;

        setIsSubmitting(true);

        try {
            await onSubmit?.(message.trim(), parentCommentId);
            setMessage('');
            if (isReply) {
                onCancel?.();
            }
        } catch (error) {
            console.error('Error submitting comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setMessage('');
        onCancel?.();
    };

    return (
        <Card className="p-4 border-none bg-transparent">
            <div className="space-y-3">
                <div className="flex items-start space-x-3">
                    <Avatar className="w-10 h-10 flex-shrink-0">
                        <AvatarImage src={userAvatar} alt={userName} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                            {getInitials(userName)}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-3">
                        <Textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder={placeholder}
                            className="min-h-[80px] resize-none"
                            autoFocus={autoFocus}
                        />

                        <div className="flex items-center justify-between">
                            <div className="text-xs text-muted-foreground">
                                {isReply ? 'Respondiendo al comentario' : 'Nuevo comentario'}
                            </div>

                            <div className="flex items-center space-x-2">
                                {isReply && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleCancel}
                                        disabled={isSubmitting}
                                    >
                                        <X className="w-4 h-4 mr-1" />
                                        Cancelar
                                    </Button>
                                )}

                                <Button
                                    type="button"
                                    size="sm"
                                    disabled={!message.trim() || isSubmitting}
                                    onClick={handleSubmit}
                                >
                                    <Send className="w-4 h-4 mr-1" />
                                    {isSubmitting ? 'Enviando...' : (isReply ? 'Responder' : 'Comentar')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}