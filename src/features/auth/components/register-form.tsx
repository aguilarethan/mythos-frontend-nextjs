"use client"

import { z } from "zod"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { register } from "@/services/auth/auth-service"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const registerFormSchema = z.object({
  username: z.string().min(1, "El nombre de usuario es requerido"),
  email: z.string().email("Email inválido").min(1, "El email es requerido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
})

export function RegisterForm({ className, ...props }: React.ComponentProps<"form">) {
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const registerForm = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    mode: "onBlur",
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof registerFormSchema>) {
    try {
      await register(values);
      toast.success("Cuenta creada exitosamente. Por favor, inicia sesión.");
      router.push("/login");  
    } catch (error: any) {
      console.error("Error al registrar usuario:", error);
      toast.error(error.message || "Error al registrar usuario")
    }
  }

  return (
    <Form {...registerForm}>
      <form onSubmit={registerForm.handleSubmit(onSubmit)} className={cn("flex flex-col gap-6", className)} {...props}>

        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Crea una cuenta en mythos</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Completa los campos siguientes
          </p>
        </div>

        <FormField
          control={registerForm.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de usuario</FormLabel>
              <FormControl>
                <Input placeholder="mythos" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={registerForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo electrónico</FormLabel>
              <FormControl>
                <Input placeholder="mythos@ejemplo.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={registerForm.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input type={showPassword ? "text" : "password"} {...field} />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Registrarse
        </Button>

        <div className="text-center text-sm">
          ¿Ya tienes una cuenta?{" "}
          <a href="/login" className="underline underline-offset-4">
            Inicia sesión
          </a>
        </div>


      </form>
    </Form>
  )
}