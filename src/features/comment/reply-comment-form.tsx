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
import { replyToComment } from '@/services/comment/comment-service';

const replySchema = z.object({
  message: z
    .string()
    .min(1, 'La respuesta es requerida')
    .min(3, 'La respuesta debe tener al menos 3 caracteres')
    .max(1000, 'La respuesta no puede exceder 1000 caracteres')
    .trim(),
});

type ReplyFormData = z.infer<typeof replySchema>;

interface ReplyCommentFormProps {
  parentCommentId: string;
  onSuccess: (reply: any) => void;
  onCancel: () => void;
  autoFocus?: boolean;
}

export default function ReplyCommentForm({ 
  parentCommentId, 
  onSuccess, 
  onCancel, 
  autoFocus = false 
}: ReplyCommentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { account } = useAccount();

  const form = useForm<ReplyFormData>({
    resolver: zodResolver(replySchema),
    defaultValues: {
      message: '',
    },
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const onSubmit = async (data: ReplyFormData) => {
    if (!account?.accountId) {
      toast.error('Para responder a un comentario, debes iniciar sesión');
      return;
    }

    if (!account?.username) {
      toast.error('Error: El nombre de usuario es requerido');
      return;
    }

    setIsSubmitting(true);

    try {
      const replyData = {
        accountId: account.accountId,
        username: account.username,
        message: data.message,
        commentId: parentCommentId,
      };

      const createdReply = await replyToComment(replyData);

      const newReply = {
        id: createdReply.id,
        accountId: createdReply.accountId,
        username: createdReply.username,
        message: createdReply.message,
        likes: 0,
        createdAt: new Date(createdReply.createdAt),
      };

      onSuccess(newReply);
      form.reset();
      onCancel();
      toast.success('Respuesta enviada exitosamente');
    } catch (error: any) {
      console.error('Error al enviar respuesta:', error);
      toast.error('Error al enviar la respuesta. Por favor, inténtalo de nuevo.');
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
    <Card className="p-4 border-l-2 border-muted bg-muted/20">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <div className="flex items-start space-x-3">
            <Avatar className="w-8 h-8 flex-shrink-0">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
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
                        placeholder="Escribe tu respuesta..."
                        className="min-h-[60px] resize-none text-sm"
                        autoFocus={autoFocus}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  Respondiendo al comentario
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
                    {isSubmitting ? 'Enviando...' : 'Responder'}
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