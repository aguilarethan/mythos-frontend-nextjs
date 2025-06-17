"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    getPreferences,
    updatePreferences,
    createPreferences
} from "@/lib/api/node/reading-preferences"

const mockAccountId = "684e8f99afae4ccd5d64f92b"

const preferencesSchema = z.object({
    fontSize: z
        .number({ invalid_type_error: "Debe ser un número" })
        .min(10, "Mínimo permitido: 10")
        .max(20, "Máximo permitido: 20"),
    fontFamily: z.enum(
        ["Arial", "Times New Roman", "Verdana", "Georgia"],
        { required_error: "Selecciona una fuente" }
    ),
    lineSpacing: z
        .number({ invalid_type_error: "Debe ser un número" })
        .min(1, "Mínimo permitido: 1")
        .max(5, "Máximo permitido: 5"),
    theme: z.enum(["Claro", "Oscuro"], {
        required_error: "Selecciona un tema"
    })
})

type PreferencesFormValues = z.infer<typeof preferencesSchema>

export function ReadingPreferencesForm() {
    const form = useForm<PreferencesFormValues>({
        resolver: zodResolver(preferencesSchema),
        defaultValues: {
            fontSize: undefined,
            fontFamily: undefined,
            lineSpacing: undefined,
            theme: undefined
        },
        mode: "onChange"
    })

    const [hasPreferences, setHasPreferences] = useState(false)
    const [preview, setPreview] = useState<PreferencesFormValues | null>(null)
    const [initialValues, setInitialValues] = useState<PreferencesFormValues | null>(null)

    useEffect(() => {
        getPreferences(mockAccountId)
            .then((data) => {
                form.reset({
                    fontSize: data.fontSize,
                    fontFamily: data.fontFamily,
                    lineSpacing: data.lineSpacing,
                    theme: data.theme
                })
                setHasPreferences(true)
                setInitialValues({
                    fontSize: data.fontSize,
                    fontFamily: data.fontFamily,
                    lineSpacing: data.lineSpacing,
                    theme: data.theme
                })
            })
            .catch(() => setHasPreferences(false))
    }, [form])

    const isChanged = initialValues
        ? JSON.stringify(form.watch()) !== JSON.stringify(initialValues)
        : true

    const onSubmit = async (data: PreferencesFormValues) => {
        try {
            if (hasPreferences) {
                await updatePreferences(mockAccountId, data)
                alert("Preferencias actualizadas con éxito")
                setInitialValues(data)
            } else {
                await createPreferences({ ...data, accountId: mockAccountId })
                alert("Preferencias creadas con éxito")
                setHasPreferences(true)
                setInitialValues(data)
            }
        } catch {
            alert("Error al guardar preferencias")
        }
    }

    const onPreview = async () => {
        const isValid = await form.trigger()
        if (!isValid) {
            alert("Corrige los errores antes de visualizar el ejemplo")
            setPreview(null)
            return
        }

        const values = form.getValues()
        setPreview(values)
    }

    return (
        <Form {...form}>
            <div className="space-y-4">
                <div className="mb-4">
                    <h2 className="text-lg font-semibold">Preferencias de lectura</h2>
                    <div className="border-b border-gray-300 mt-1"></div>
                </div>

                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                    noValidate>
                    <FormField
                        control={form.control}
                        name="fontSize"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tamaño de fuente</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Ingresa el tamaño de fuente (10-20)"
                                        min={10}
                                        max={20}
                                        {...field}
                                        value={field.value ?? ""}
                                        onChange={(e) =>
                                            field.onChange(
                                                e.target.value === "" ? undefined : Number(e.target.value)
                                            )
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="fontFamily"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Familia de fuente</FormLabel>
                                <FormControl>
                                    <select
                                        {...field}
                                        className="border rounded p-2"
                                        value={field.value ?? ""}
                                        onChange={(e) =>
                                            field.onChange(
                                                e.target.value === "" ? undefined : e.target.value
                                            )
                                        }
                                    >
                                        <option value="">Selecciona una fuente...</option>
                                        <option value="Arial">Arial</option>
                                        <option value="Times New Roman">Times New Roman</option>
                                        <option value="Verdana">Verdana</option>
                                        <option value="Georgia">Georgia</option>
                                    </select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="lineSpacing"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Espaciado de línea</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        step="0.1"
                                        placeholder="Ingresa el espaciado (1-5)"
                                        min={1}
                                        max={5}
                                        {...field}
                                        value={field.value ?? ""}
                                        onChange={(e) =>
                                            field.onChange(
                                                e.target.value === "" ? undefined : Number(e.target.value)
                                            )
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="theme"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tema</FormLabel>
                                <FormControl>
                                    <select
                                        {...field}
                                        className="border rounded p-2"
                                        value={field.value ?? ""}
                                        onChange={(e) =>
                                            field.onChange(
                                                e.target.value === "" ? undefined : e.target.value
                                            )
                                        }>
                                        <option value="">Selecciona un tema...</option>
                                        <option value="Claro">Claro</option>
                                        <option value="Oscuro">Oscuro</option>
                                    </select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex gap-2">
                        <Button type="submit" disabled={!isChanged} className="cursor-pointer">
                            Guardar preferencias
                        </Button>
                        <Button type="button" variant="outline" onClick={onPreview}>
                            Visualizar ejemplo
                        </Button>
                    </div>
                </form>

                {preview && (
                    <div
                        className="mt-4 p-4 border rounded"
                        style={{
                            fontSize: `${preview.fontSize}px`,
                            fontFamily: preview.fontFamily,
                            lineHeight: preview.lineSpacing,
                            backgroundColor: preview.theme === "Oscuro" ? "#1a202c" : "#f7fafc",
                            color: preview.theme === "Oscuro" ? "#f7fafc" : "#1a202c"
                        }}>
                        “Las personas grandes aman las cifras. Cuando les habláis de un nuevo amigo, no os interrogan jamás sobre lo esencial. Jamás os dicen: ‘¿Cómo es el timbre de su voz? ¿Cuáles son los juegos que prefiere? ¿Colecciona mariposas?’. En cambio, os preguntan: ‘¿Qué edad tiene? ¿Cuántos hermanos tiene? ¿Cuánto pesa? ¿Cuánto gana su padre?’. Sólo entonces creen conocerle”.
                    </div>
                )}
            </div>
        </Form>
    )
}