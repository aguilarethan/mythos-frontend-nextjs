"use client";

import { useState } from "react";
import { useAccount } from "@/hooks/use-account";
import { accountService } from "@/services/account/account-service";

import { z } from "zod";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { KeyRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const passwordFormSchema = z.object({
  newPassword: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export function ChangePasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [isEditing, setIsEditing] = useState(false);
  const { account } = useAccount();

  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    mode: "onSubmit",
    defaultValues: {
      newPassword: "",
    },
  });

  const saveChanges = async (values: z.infer<typeof passwordFormSchema>) => {
    if (!account?.accountId) return;

    try {
      await accountService.changePassword(account?.accountId, values);
      toast.success("Contraseña actualizada exitosamente.");
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message ||
              "Lo sentimos, ocurrió un error al intentar actualizar su contraseña"
          : "Error desconocido"
      );
    } finally {
      setIsEditing(false);
      passwordForm.reset();
    }
  };

  const cancelEdit = () => {
    passwordForm.reset();
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const onSubmit = async (values: z.infer<typeof passwordFormSchema>) => {
    if (isEditing) {
      await saveChanges(values);
    }
  };

  return (
    <Form {...passwordForm}>
      <form
        onSubmit={passwordForm.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-start w-full">
          <div className="flex-1 w-full">
            <FormField
              control={passwordForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nueva contraseña</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="*********"
                        type="password"
                        disabled={!isEditing}
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col md:flex-row gap-2 w-full mt-5 md:w-auto">
            {!isEditing ? (
              <Button
                type="button"
                variant="outline"
                onClick={handleEdit}
                className="w-full md:w-auto"
              >
                Editar contraseña
              </Button>
            ) : (
              <>
                <Button type="submit" className="w-full md:w-auto">
                  Guardar
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full md:w-auto"
                  onClick={cancelEdit}
                >
                  Cancelar
                </Button>
              </>
            )}
          </div>
        </div>
      </form>
    </Form>
  );
}
