"use client";

import { useEffect } from "react";
import { useAccount } from "@/hooks/use-account";

import { z } from "zod";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";
import { User, Mail } from "lucide-react";

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
import { accountService } from "@/services/account/account-service";

const profileFormSchema = z.object({
  username: z.string().min(1, "El nombre de usuario es requerido"),
  email: z.string().email("Email inválido").min(1, "El email es requerido"),
});

export function EditProfileForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [isEditing, setIsEditing] = useState(false);
  const [originalValues, setOriginalValues] = useState({
    username: "",
    email: "",
  });

  const { account, isLoading } = useAccount();

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    mode: "onBlur",
    defaultValues: originalValues,
  });

  const { reset, getValues } = profileForm;

  useEffect(() => {
    if (account) {
      reset({
        username: account.username,
        email: account.email,
      });
      setOriginalValues({
        username: account.username,
        email: account.email,
      });
    }
  }, [account, reset]);

  const saveChanges = async (values: z.infer<typeof profileFormSchema>) => {
    if (!account?.accountId) return;

    try {
      await accountService.updateProfile(account?.accountId, values);
      toast.success("Cuenta actualizada exitosamente.");
      setOriginalValues(getValues());
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "Error al registrar usuario");
      } else {
        toast.error("Error desconocido");
      }
    } finally {
      setIsEditing(false);
    }
  };

  const cancelEdit = () => {
    reset(originalValues);
    setIsEditing(false);
  };

  async function onSubmit(values: z.infer<typeof profileFormSchema>) {
    if (isEditing) {
      saveChanges(values);
    } else {
      setOriginalValues(getValues());
      setIsEditing(true);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Cargando datos del perfil...</p>
      </div>
    );
  }

  return (
    <Form {...profileForm}>
      <form
        onSubmit={profileForm.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <FormField
            control={profileForm.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre de usuario</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <Input
                      placeholder="Nombre de usuario"
                      className="pl-10"
                      disabled={!isEditing}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={profileForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo electrónico</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="mythos@ejemplo.com"
                      type="email"
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

        <div className="flex gap-2">
          <Button type="submit">
            {isEditing ? "Guardar" : "Editar perfil"}
          </Button>
          {isEditing && (
            <Button variant="outline" onClick={cancelEdit}>
              Cancelar
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
