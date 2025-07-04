"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAccount } from "@/hooks/use-account";
import { ReadingPreferencesPreview } from "./reading-preferences-preview";
import { toast } from "sonner";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Text, Type, List, Palette } from "lucide-react";

import { readingPreferencesService } from "@/services/reading-preferences-settings/reading-preferences-settings-service";

const preferencesSchema = z.object({
    fontSize: z
        .number({ invalid_type_error: "Debe ser un número válido" })
        .min(10, "El tamaño mínimo es 10")
        .max(20, "El tamaño máximo es 20"),
    fontFamily: z.enum(["Arial", "Times New Roman", "Verdana", "Georgia"], {
        errorMap: () => ({ message: "Selecciona una fuente válida" }),
    }),
    lineSpacing: z
        .number({ invalid_type_error: "Debe ser un número válido" })
        .min(1, "El espaciado mínimo es 1")
        .max(5, "El espaciado máximo es 5"),
    theme: z.enum(["Claro", "Oscuro"], {
        errorMap: () => ({ message: "Selecciona un tema válido" }),
    }),
});

type PreferencesFormValues = z.infer<typeof preferencesSchema>;

export function ReadingPreferencesForm() {
    const { account } = useAccount();
    const form = useForm<PreferencesFormValues>({
        resolver: zodResolver(preferencesSchema),
        defaultValues: {
            fontSize: undefined,
            fontFamily: undefined,
            lineSpacing: undefined,
            theme: undefined,
        },
        mode: "onChange",
    });

    const [initialValues, setInitialValues] = useState<PreferencesFormValues | null>(null);
    const [validPreviewValues, setValidPreviewValues] = useState<PreferencesFormValues | null>(null);
    const [mounted, setMounted] = useState(false);
    const [showCancel, setShowCancel] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const fetchPreferences = async () => {
            if (!account?.accountId) return;
            try {
                const data = await readingPreferencesService.getPreferences(account.accountId);
                form.reset(data);
                setInitialValues(data);
            } catch (error: any) {
                if (error?.status === 404) {
                    toast.info("Aún no tienes preferencias registradas. Puedes configurarlas ahora.");
                    setInitialValues(null);
                } else {
                    toast.error("Ocurrió un error al cargar tus preferencias. Intenta de nuevo.");
                    console.error("Error al cargar preferencias:", error);
                }
            }
        };
        fetchPreferences();
    }, [account?.accountId, form]);

    const watchedValues = form.watch();

    useEffect(() => {
        if (mounted) {
            const { fontSize, fontFamily, lineSpacing, theme } = watchedValues;
            const result = preferencesSchema.safeParse({
                fontSize,
                fontFamily,
                lineSpacing,
                theme,
            });
            if (result.success) {
                setValidPreviewValues(result.data);
            } else {
                setValidPreviewValues(null);
            }

            if (initialValues) {
                setShowCancel(JSON.stringify(form.getValues()) !== JSON.stringify(initialValues));
            } else {
                const hasAnyValue = Object.values(form.getValues()).some(v => v !== undefined);
                setShowCancel(hasAnyValue);
            }
        }
    }, [
        watchedValues.fontSize,
        watchedValues.fontFamily,
        watchedValues.lineSpacing,
        watchedValues.theme,
        mounted,
        form,
        initialValues,
    ]);

    const onSubmit = async (data: PreferencesFormValues) => {
        if (!account?.accountId) {
            toast.error("No se encontró el ID de la cuenta");
            return;
        }

        try {
            if (initialValues) {
                await readingPreferencesService.updatePreferences(account.accountId, data);
                toast.success("Preferencias actualizadas exitosamente");
            } else {
                await readingPreferencesService.createPreferences({ ...data, accountId: account.accountId });
                toast.success("Preferencias creadas exitosamente");
            }
            form.reset(data);
            setInitialValues(data);
            setShowCancel(false);
        } catch (error: any) {
            toast.error(error?.message || "Error al guardar preferencias");
        }
    };

    const handleCancel = () => {
        if (initialValues) {
            form.reset(initialValues);
        } else {
            form.reset({
                fontSize: undefined,
                fontFamily: undefined,
                lineSpacing: undefined,
                theme: undefined,
            });
        }
        setShowCancel(false);
    };

    const isChanged = initialValues
        ? JSON.stringify(form.getValues()) !== JSON.stringify(initialValues)
        : true;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="fontSize"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tamaño de fuente</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Text className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                        <Input
                                            type="number"
                                            placeholder="10-20"
                                            min="10"
                                            max="20"
                                            value={field.value ?? ""}
                                            onChange={(e) => field.onChange(
                                                e.target.value === "" ? undefined : Number(e.target.value)
                                            )}
                                            onKeyDown={(e) => {
                                                if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
                                            }}
                                            className="pl-8"
                                        />
                                    </div>
                                </FormControl>
                                <div className="min-h-[1.25rem]">
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="fontFamily"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Familia de fuente</FormLabel>
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <Type className="mr-2 h-4 w-4 text-muted-foreground" />
                                            <SelectValue placeholder="Selecciona una fuente..." />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Arial">Arial</SelectItem>
                                        <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                                        <SelectItem value="Verdana">Verdana</SelectItem>
                                        <SelectItem value="Georgia">Georgia</SelectItem>
                                    </SelectContent>
                                </Select>
                                <div className="min-h-[1.25rem]">
                                    <FormMessage />
                                </div>
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
                                    <div className="relative">
                                        <List className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                        <Input
                                            type="number"
                                            placeholder="1-5"
                                            step="0.5"
                                            min="1"
                                            max="5"
                                            value={field.value ?? ""}
                                            onChange={(e) => field.onChange(
                                                e.target.value === "" ? undefined : Number(e.target.value)
                                            )}
                                            onKeyDown={(e) => {
                                                if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
                                            }}
                                            className="pl-8"
                                        />
                                    </div>
                                </FormControl>
                                <div className="min-h-[1.25rem]">
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="theme"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tema</FormLabel>
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <Palette className="mr-2 h-4 w-4 text-muted-foreground" />
                                            <SelectValue placeholder="Selecciona un tema..." />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Claro">Claro</SelectItem>
                                        <SelectItem value="Oscuro">Oscuro</SelectItem>
                                    </SelectContent>
                                </Select>
                                <div className="min-h-[1.25rem]">
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />
                </div>
                <Separator />
                <div className="flex gap-2">
                    <Button type="submit" disabled={!isChanged} className="cursor-pointer">
                        Guardar preferencias
                    </Button>
                    {showCancel && initialValues && (
                        <Button type="button" variant="outline" onClick={handleCancel} className="cursor-pointer">
                            Cancelar
                        </Button>
                    )}
                </div>
                <div>
                    <h3 className="text-lg font-medium">Visualización de ejemplo</h3>
                    {mounted && (
                        <ReadingPreferencesPreview
                            fontSize={validPreviewValues?.fontSize}
                            fontFamily={validPreviewValues?.fontFamily}
                            lineSpacing={validPreviewValues?.lineSpacing}
                            theme={validPreviewValues?.theme}
                            hasError={!validPreviewValues}
                        />
                    )}
                </div>
            </form>
        </Form>
    );
}