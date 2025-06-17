"use client"

import { z } from "zod"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { login } from "@/services/auth/auth-service"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useAuth } from "@/hooks/use-auth";

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

const loginFormSchema = z.object({
  username: z.string().min(1, "El nombre de usuario es requerido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
})

export function LoginForm({ className, ...props }: React.ComponentProps<"form">) {
  const [showPassword, setShowPassword] = useState(false)
  const { setIsLoggedIn } = useAuth();
  const router = useRouter()

  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    mode: "onBlur",
    defaultValues: {
      username: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    try {
      await login(values);
      setIsLoggedIn(true); 
      toast.success("Sesión iniciada exitosamente.");
      router.push("/");  
    } catch (error: any) {
      toast.error(error.message || "Error al iniciar sesión")
    }
  }

  return (
    <Form {...loginForm}>
      <form onSubmit={loginForm.handleSubmit(onSubmit)} className={cn("flex flex-col gap-6", className)} {...props}>

        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Inicia sesión con tu cuenta</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Ingresa tu correo electrónico y contraseña
          </p>
        </div>


        <FormField
          control={loginForm.control}
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
          control={loginForm.control}
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
          Iniciar sesión
        </Button>

        <div className="text-center text-sm">
          ¿Aún no tienes una cuenta?{" "}
          <a href="/register" className="underline underline-offset-4">
            Crea una
          </a>
        </div>


      </form>
    </Form>
  )
}