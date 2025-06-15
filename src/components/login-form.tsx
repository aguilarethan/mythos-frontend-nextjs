"use client"

import { z } from "zod"
import { Eye, EyeOff } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { email } from "zod/v4-mini"
import { login } from "@/lib/api/dotnet/auth"


const loginFormSchema = z.object({
  email: z.string().email("Email inválido").min(1, "El email es requerido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
})

export function LoginForm() {
  const [formError, setFormError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    setFormError(null)
    setSuccessMessage(null)
    try {
      const data = await login(values)
      setSuccessMessage("Se inició sesión correctamente 🎉")
      console.log("Usuario registrado:", data)
    } catch (error: any) {
      setFormError(error.message)
    }
  }
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Crea tu cuenta</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Ingresa tus datos para registrarte
        </p>
      </div>

      <Form {...loginForm}>
        <form onSubmit={loginForm.handleSubmit(onSubmit)} className="grid gap-6">

          <FormField
            control={loginForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo electrónico</FormLabel>
                <FormControl>
                  <Input placeholder="a@ejemplo.com" type="email" {...field} />
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
                <FormDescription>Aquí llena tu contraseña</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {formError && <p className="text-sm text-red-500">{formError}</p>}
          {successMessage && <p className="text-sm text-green-600">{successMessage}</p>}

          <Button type="submit" className="w-full">
            Registrarse
          </Button>

          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">
              O continúa con
            </span>
          </div>

          <Button variant="outline" className="w-full">
            {/* GitHub icon SVG igual que en login */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
              <path
                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 
                0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 
                3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 
                1.205.084 1.838 1.236 1.838 1.236 
                1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605 
                -2.665-.3-5.466-1.332-5.466-5.93 
                0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 
                0 0 1.005-.322 3.3 1.23.96-.267 
                1.98-.399 3-.405 1.02.006 2.04.138 3 .405 
                2.28-1.552 3.285-1.23 3.285-1.23 
                .645 1.653.24 2.873.12 3.176.765.84 
                1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92 
                .42.36.81 1.096.81 2.22 
                0 1.606-.015 2.896-.015 3.286 
                0 .315.21.69.825.57C20.565 22.092 
                24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                fill="currentColor"
              />
            </svg>
            Registrarse con GitHub
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm">
        ¿Ya tienes una cuenta?{" "}
        <a href="#" className="underline underline-offset-4">
          Inicia sesión
        </a>
      </div>
    </div>
  )

}