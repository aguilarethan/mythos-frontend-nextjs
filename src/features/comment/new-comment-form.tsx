import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Send, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormMessage 
} from '@/components/ui/form';
import { toast } from 'sonner';
import { useAccount } from '@/hooks/use-account';
import { useChapterStore } from '@/store/chapter-store';
import { createComment } from '@/services/comment/comment-service';

const commentSchema = z.object({
  message: z
    .string()
    .min(1, 'El mensaje es requerido')
    .min(3, 'El mensaje debe tener al menos 3 caracteres')
    .max(1000, 'El mensaje no puede exceder 1000 caracteres')
    .trim(),
});

type CommentFormData = z.infer<typeof commentSchema>;

interface NewCommentFormProps {
  onSuccess: (comment: any) => void;
  onCancel: () => void;
  autoFocus?: boolean;
}

export default function NewCommentForm({ onSuccess, onCancel, autoFocus = false }: NewCommentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { account } = useAccount();
  const chapterId = useChapterStore((state) => state.selectedId);

  const form = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      message: '',
    },
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const onSubmit = async (data: CommentFormData) => {
    if (!account?.accountId) {
      toast.error('Error: No se pudo obtener la información del usuario');
      return;
    }

    if (!account?.username) {
      toast.error('Error: El nombre de usuario es requerido');
      return;
    }

    if (!chapterId) {
      toast.error('Error: No se pudo obtener el ID del capítulo');
      return;
    }

    setIsSubmitting(true);

    try {
      const commentData = {
        accountId: account.accountId,
        username: account.username,
        chapterId: chapterId,
        message: data.message,
      };

      const createdComment = await createComment(commentData);

      const newComment = {
        id: createdComment.id,
        chapterId: createdComment.chapterId,
        username: createdComment.username,
        accountId: createdComment.accountId,
        message: createdComment.message,
        replies: [],
        likes: 0,
        createdAt: new Date(createdComment.createdAt),
        updatedAt: new Date(createdComment.updatedAt),
      };

      onSuccess(newComment);
      form.reset();
      toast.success('Comentario enviado exitosamente');
    } catch (error: any) {
      console.error('Error al enviar comentario:', error);
      toast.error('Error al enviar el comentario. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    onCancel();
  };

  const displayUsername = account?.username || 'Usuario';

  return (
    <Card className="p-4 border-none bg-transparent">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <div className="flex items-start space-x-3">
            <Avatar className="w-10 h-10 flex-shrink-0">
              <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                {getInitials(displayUsername)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-3">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Escribe tu comentario sobre este capítulo..."
                        className="min-h-[80px] resize-none"
                        autoFocus={autoFocus}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  Nuevo comentario
                </div>

                <div className="flex items-center space-x-2">
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

                  <Button
                    type="submit"
                    size="sm"
                    disabled={isSubmitting || !form.formState.isValid}
                  >
                    <Send className="w-4 h-4 mr-1" />
                    {isSubmitting ? 'Enviando...' : 'Comentar'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </Card>
  );
}