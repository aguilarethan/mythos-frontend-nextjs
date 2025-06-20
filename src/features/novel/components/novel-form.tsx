"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

// Servicios y hooks
import { createNovel, updateNovel, uploadCoverImage } from "@/services/novel/novel-service"
import { useAccount } from "@/hooks/use-account"

// UI components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select"
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"

// Icons
import { UploadCloud, X, Send } from "lucide-react"

// Tipos
export interface NovelFormData {
  id?: string;
  writerAccountId: string;
  title: string;
  description: string;
  genres: string[];
  tags: string[];
  views: number;
  isPublic: boolean;
  coverImageUrl: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

interface NovelFormProps extends React.ComponentProps<"form"> {
  novelToEdit?: NovelFormData;
}

const AVAILABLE_GENRES = ["Acción", "Aventura", "Romance", "Terror", "Drama", "Fantasía", "Fantasía oscura", "Ciencia ficción", "Comedia", "Misterio", "Misterio sobrenatural", "Cultivo", "Superheroes", ]
const AVAILABLE_TAGS = [
  "Horror cósmico",
  "Ocultismo",
  "Sistema de pociones",
  "Protagonista inteligente",
  "Sociedades secretas",
  "Mundo detallado",
  "Conspiraciones",
  "Locura",
  "Terror psicológico",
  "Progresión de poder",
  "Dimensiones",
  "Sistema genético",
  "Cultivo moderno",
  "Torneos",
  "Tecnología avanzada",
  "Batallas épicas",
  "Mundo cruel",
  "Ascenso imparable",
  "Bucle temporal",
  "Anti héroe",
  "Superpoderes",
  "Optimización",
  "Distopía",
  "Narrativa tipo juego",
  "Humor negro",
  "Protagonista sarcastico",
  "Megacorporaciones"
]

const novelFormSchema = z.object({
  title: z.string().trim().nonempty("El título no puede estar vacío"),
  description: z.string().trim().nonempty("La descripción no puede estar vacía"),
  coverImage: z
    .instanceof(File)
    .refine((file) => file.size < 20 * 1024 * 1024, { message: "Máximo 20MB" })
    .refine((file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type), {
      message: "Formato no válido (JPG, PNG, WEBP)",
    })
    .optional(),
})

export function NovelForm({ className, novelToEdit, ...props }: NovelFormProps) {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [preview, setPreview] = useState<string | null>(null)

  const { account, isLoading } = useAccount()
  const router = useRouter()

  const novelForm = useForm<z.infer<typeof novelFormSchema>>({
    resolver: zodResolver(novelFormSchema),
    mode: "onBlur",
    defaultValues: {
      title: novelToEdit?.title || "",
      description: novelToEdit?.description || "",
      coverImage: undefined,
    },
  })

  useEffect(() => {
    if (novelToEdit) {
      setSelectedGenres(novelToEdit.genres)
      setSelectedTags(novelToEdit.tags)
      setPreview(novelToEdit.coverImageUrl)
    }
  }, [novelToEdit])

  const addGenre = (genre: string) => {
    if (!selectedGenres.includes(genre)) {
      setSelectedGenres([...selectedGenres, genre])
    }
  }

  const removeGenre = (genre: string) => {
    setSelectedGenres(selectedGenres.filter((g) => g !== genre))
  }

  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag))
  }

  async function onSubmit(values: z.infer<typeof novelFormSchema>) {
    if (!account) return toast.error("Debes iniciar sesión")
    if (selectedGenres.length === 0) return toast.error("Selecciona al menos un género")

    try {
      let coverImageUrl = novelToEdit?.coverImageUrl || ""

      if (values.coverImage) {
        coverImageUrl = await uploadCoverImage({ coverImage: values.coverImage })
      }

      const payload = {
        writerAccountId: account.accountId,
        title: values.title,
        description: values.description,
        coverImageUrl,
        genres: selectedGenres,
        tags: selectedTags,
      }

      if (novelToEdit) {
        await updateNovel(novelToEdit.id!, payload)
        toast.success("Novela actualizada")
      } else {
        await createNovel(payload)
        toast.success("Novela creada")
      }

      router.push("/novelas") 
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || "Ocurrió un error")
    }
  }

  return (
    <Form {...novelForm}>
      <form onSubmit={novelForm.handleSubmit(onSubmit)} className={cn("flex flex-col gap-6", className)} {...props}>
        <div className="grid grid-cols-[10%_30%_50%_10%] gap-6 items-start">

          <div></div>

          <FormField
            control={novelForm.control}
            name="coverImage"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <label className="relative flex items-center justify-center rounded-md border border-dashed p-6 aspect-[3/4] bg-muted text-muted-foreground cursor-pointer overflow-hidden">
                    {preview ? (
                      <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
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
                          const url = URL.createObjectURL(file)
                          setPreview(url)
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
                    <Input placeholder="Título de la novela..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <Label>Géneros</Label>
              <Select onValueChange={addGenre}>
                <SelectTrigger><SelectValue placeholder="Selecciona un género" /></SelectTrigger>
                <SelectContent>
                  {AVAILABLE_GENRES.map((genre) => (
                    <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedGenres.map((genre) => (
                  <Badge key={genre} className="flex items-center gap-1 pr-1" variant="secondary">
                    {genre}
                    <button type="button" onClick={() => removeGenre(genre)}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label>Etiquetas</Label>
              <Select onValueChange={addTag}>
                <SelectTrigger><SelectValue placeholder="Selecciona una etiqueta" /></SelectTrigger>
                <SelectContent>
                  {AVAILABLE_TAGS.map((tag) => (
                    <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <Badge key={tag} className="flex items-center gap-1 pr-1" variant="outline">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <Button type="submit" className="mt-4 self-start">
              {novelToEdit ? "Actualizar novela" : "Publicar novela"}
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
      </form>
    </Form>
  )
}
