"use client"

//libraries
import { z } from "zod"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"

//services
import { uploadCoverImage, createNovel } from "@/services/novel/novel-service";

//hooks
import { useForm } from "react-hook-form"
import { useState } from "react"
import { useAccount } from "@/hooks/use-account"

//next
import { useRouter } from "next/navigation"

//icons
import { X, UploadCloud, Send } from "lucide-react";

//components
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

const AVAILABLE_GENRES = ["Acción", "Aventura", "Romance", "Terror", "Drama"];
const AVAILABLE_TAGS = ["Fuerte a fuerte", "Pareja joven", "Magia", "Comedia"];


const novelFormSchema = z.object({
    title: z.string({ invalid_type_error: `El titulo de la novela debe ser un string` }).trim().nonempty({ message: `El titulo de la novela no puede estar vacío` }),
    description: z.string({ invalid_type_error: `La descripción de la novela debe ser un string` }).trim().nonempty({ message: `La descripción de la novela no puede estar vacío` }),
    coverImage: z.instanceof(File, { message: "Debe subir una imagen válida" }).refine((file) => file.size < 5 * 1024 * 1024, { message: "La imagen debe ser menor a 5MB" })
        .refine((file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type), { message: "Solo se permiten imágenes JPG, PNG o WEBP" }),
})

export function NovelForm({ className, ...props }: React.ComponentProps<"form">) {
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [preview, setPreview] = useState<string | null>(null)
    const { account, isLoading } = useAccount();
    const router = useRouter()


    const addGenre = (genreId: string) => {
        if (!selectedGenres.includes(genreId)) {
            setSelectedGenres([...selectedGenres, genreId]);
        }
    }

    const removeGenre = (genreId: string) => {
        setSelectedGenres(selectedGenres.filter(id => id !== genreId));
    }

    const addTag = (tag: string) => {
        if (!selectedTags.includes(tag)) {
            setSelectedTags([...selectedTags, tag]);
        }
    }

    const removeTag = (tag: string) => {
        setSelectedTags(selectedTags.filter(t => t !== tag));
    }

    const novelForm = useForm<z.infer<typeof novelFormSchema>>({
        resolver: zodResolver(novelFormSchema),
        mode: "onBlur",
        defaultValues: {
            title: "",
            description: "",
            coverImage: null as unknown as File,
        },
    })

    async function onSubmit(values: z.infer<typeof novelFormSchema>) {
        let { title, description, coverImage } = values;
        let coverImageUrl: string;
        if (isLoading) return;
        if (!account) {
            toast.error("Debes iniciar sesión para crear una novela");
            return;
        }

        if (selectedGenres.length === 0) {
            toast.error("Debes seleccionar al menos un género");
            return;
        }

        try {
            coverImageUrl = await uploadCoverImage({
                coverImage: coverImage,
            })
        } catch (error: any) {
            toast.error(error.message || "Error al subir la imagen de portada");
            return;
        }


        try {
            await createNovel({
                
                writerAccountId: account?.accountId,
                title: title,
                description: description,
                coverImageUrl: coverImageUrl,
                genres: selectedGenres,
                tags: selectedTags,
            });
            toast.success("Novela creada exitosamente");
        } catch (error: any) {
            console.error("Error al crear la novela:", error);
            toast.error(error.message || "Error al crear la novela");
        }
    }

    return (
        <Form {...novelForm}>
            <form onSubmit={novelForm.handleSubmit(onSubmit)} className={cn("flex flex-col gap-6", className)} {...props}>

                <div className="grid grid-cols-[15%_35%_35%_15%] gap-6 items-start">

                    <div></div>

                    <FormField
                        control={novelForm.control}
                        name="coverImage"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <label className="relative flex items-center justify-center rounded-md border border-dashed p-6 aspect-[3/4] bg-muted text-muted-foreground cursor-pointer overflow-hidden">
                                        {preview ? (
                                            <img
                                                src={preview}
                                                alt="Vista previa"
                                                className="absolute inset-0 w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center z-10">
                                                <UploadCloud className="w-6 h-6 mb-2" />
                                                <span>Subir imagen</span>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0]
                                                if (file) {
                                                    const objectUrl = URL.createObjectURL(file)
                                                    setPreview(objectUrl)
                                                    field.onChange(file)
                                                }
                                            }}
                                            onBlur={field.onBlur}
                                            name={field.name}
                                            ref={field.ref}
                                        />
                                    </label>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="py-2 flex flex-col justify-between h-full">
                        <FormField
                            control={novelForm.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Título</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Escribe el nombre de tu novela..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="mt-4 self-start">
                            Publicar novela
                            <Send />
                        </Button>
                    </div>

                    <div></div>

                </div>

                <FormField
                    control={novelForm.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Descripción</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Descripción de la novela" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div>
                    <Label>Géneros</Label>
                    <Select onValueChange={addGenre}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona un género" />
                        </SelectTrigger>
                        <SelectContent>
                            {AVAILABLE_GENRES.map((genre) => (
                                <SelectItem key={genre} value={genre}>
                                    {genre}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>


                    <div className="mt-2 flex flex-wrap gap-2">
                        {selectedGenres.map((genre) => (
                            <Badge
                                key={genre}
                                className="flex items-center gap-1 pr-1"
                                variant="secondary"
                            >
                                {genre}
                                <button
                                    type="button"
                                    className="ml-1 text-muted-foreground hover:text-destructive"
                                    onClick={() => removeGenre(genre)}
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                </div>


                <div>
                    <Label>Etiquetas</Label>
                    <Select onValueChange={addTag}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona una etiqueta" />
                        </SelectTrigger>
                        <SelectContent>
                            {AVAILABLE_TAGS.map((tag) => (
                                <SelectItem key={tag} value={tag}>
                                    {tag}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <div className="mt-2 flex flex-wrap gap-2">
                        {selectedTags.map((tag) => (
                            <Badge
                                key={tag}
                                className="flex items-center gap-1 pr-1"
                                variant="outline"
                            >
                                {tag}
                                <button
                                    type="button"
                                    className="ml-1 text-muted-foreground hover:text-destructive"
                                    onClick={() => removeTag(tag)}
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                </div>
            </form>
        </Form>

    )
}