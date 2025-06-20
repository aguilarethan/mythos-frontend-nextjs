"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Flag } from "lucide-react"
import { useAccount } from "@/hooks/use-account"
import { createNovelReport } from "@/services/novel-report/novel-report-service"

const formSchema = z.object({
    reason: z.string().min(1, { message: "La razón no puede estar vacía." }),
    description: z
        .string()
        .min(1, { message: "La descripción no puede estar vacía." }),
})

type FormValues = z.infer<typeof formSchema>

interface ReportNovelDialogProps {
    novelId: string
}

export function NovelReportForm({ novelId }: ReportNovelDialogProps) {
    const { account } = useAccount()
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            reason: "",
            description: "",
        },
    })

    const onSubmit = async (values: FormValues) => {
        if (!account) {
            toast.error("Debes iniciar sesión para reportar una novela")
            return
        }

        try {
            await createNovelReport({
                novelId,
                reporterAccountId: account.accountId,
                reason: values.reason,
                description: values.description,
            })
        } catch (error) {
            toast.error("Error al enviar el reporte. Inténtalo de nuevo más tarde.")
            console.error("Error creating novel report:", error)
            return
        }

        toast.success("Reporte enviado correctamente")
        form.reset()
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                    <Flag className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Reportar novela</DialogTitle>
                    <DialogDescription>
                        Si encuentras contenido inapropiado o que infringe derechos de autor,
                        por favor repórtalo.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="reason"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Razón</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Plagio o contenido inapropiado" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Breve título del problema.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descripción</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Describe por qué estás reportando esta novela"
                                            className="h-40 resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Explica con más detalle el motivo del reporte.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Cancelar
                                </Button>
                            </DialogClose>
                            <Button type="submit">Enviar reporte</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
