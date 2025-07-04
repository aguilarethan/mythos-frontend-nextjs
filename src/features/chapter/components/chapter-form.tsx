"use client"

import { z } from "zod"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useNovelDetailsStore } from "@/store/novel-details-store"

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
import { Textarea } from "@/components/ui/textarea"

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

        if (!id) {
            toast.error("No se encontró el ID de la novela.");
            return;
        }
        try {
            await createChapter({ ...values, novelId: id });
            toast.success("Capítulo creado exitosamente");
            router.push(`/novel`);
        } catch (error: any) {
            toast.error(error.message || "Error al crear el capítulo");
        }
    }

    return (
        <Form {...chapterForm}>
            <form onSubmit={chapterForm.handleSubmit(onSubmit)} className={cn("flex flex-col gap-6", className)} {...props}>


                <div className="flex gap-4">
                    <div className="w-4/5">
                        <FormField
                            control={chapterForm.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Título</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Escribe el título de tu capítulo..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="w-1/5">
                        <FormField
                            control={chapterForm.control}
                            name="priceMythras"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mythras</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <FormField
                    control={chapterForm.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Contenido</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Escribe el contenido de tu capítulo aquí..." {...field} className="h-150">

                                </Textarea>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full cursor-pointer">
                    Publicar capítulo
                </Button>

            </form>
        </Form>
    )
}