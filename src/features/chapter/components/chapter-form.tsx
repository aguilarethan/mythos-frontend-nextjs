"use client"

import { z } from "zod"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {  useNovelDetailsStore } from "@/store/novel-details-store"

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
import { createChapter } from "@/services/chapter/chapter-service"

const chapterFormSchema = z.object({
    title: z.string().min(1, "El título es requerido"),
    content: z.string().min(1, "El contenido es requerido"),
    priceMythras: z.number().min(0, "El precio en Mythras debe ser mayor o igual a 0"),
})

export function ChapterForm({ className, ...props }: React.ComponentProps<"form">) {
    const { id } = useNovelDetailsStore();
    const router = useRouter()

    const chapterForm = useForm<z.infer<typeof chapterFormSchema>>({
        resolver: zodResolver(chapterFormSchema),
        mode: "onBlur",
        defaultValues: {
            title: "",
            content: "",
            priceMythras: 0,
        },
    })

    async function onSubmit(values: z.infer<typeof chapterFormSchema>) {
        try {
            await createChapter({...values, novelId: id});
            toast.success("Capítulo creado exitosamente");
        } catch (error: any) {
            toast.error(error.message || "Error al crear el capítulo");
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