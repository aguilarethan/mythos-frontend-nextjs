"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { mythrasPurchaseService } from "@/services/mythras/mythras-purchase-service";
import { MythrasPackage, PurchaseMythrasResponse } from "@/services/mythras/mythras-purchase-interfaces";
import { toast } from "sonner";
import { CreditCard, User, Calendar, Shield, MapPin, Mail } from "lucide-react";

const billingSchema = z.object({
    street: z.string().min(1, "Calle requerida"),
    postalCode: z.string().min(4, "El código postal debe tener al menos 4 caracteres"),
    city: z.string().min(1, "Ciudad requerida"),
    country: z.string().min(1, "País requerido"),
});

const formSchema = z.object({
    cardNumber: z.string().regex(/^\d{16}$/, "El número de tarjeta debe tener 16 dígitos"),
    cardHolder: z.string()
        .min(4, "El nombre del titular debe ser mínimo de 4 letras")
        .regex(/^[a-zA-Z\s]+$/, "El nombre solo debe contener letras y espacios"),
    expiryDate: z.string()
        .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "La fecha de expiración debe estar en formato MM/YY")
        .refine((val) => {
            const [mm, yy] = val.split("/");
            const month = parseInt(mm, 10);
            const year = parseInt(yy, 10) + 2000;
            const expiry = new Date(year, month - 1, 1);
            const now = new Date();
            expiry.setMonth(expiry.getMonth() + 1);
            return expiry >= new Date(now.getFullYear(), now.getMonth(), 1);
        }, "La tarjeta está vencida"),
    cvc: z.string().regex(/^\d{3}$/, "El CVC debe tener 3 dígitos"),
    cardType: z.enum(["Visa", "Mastercard"]),
    billingAddress: billingSchema,
}).refine((data) => {
    if (data.cardType === "Visa") return data.cardNumber.startsWith("4");
    if (data.cardType === "Mastercard") return data.cardNumber.startsWith("5");
    return true;
}, {
    message: "El tipo de tarjeta no coincide con el número proporcionado (Visa inicia con 4, Mastercard con 5)",
    path: ["cardNumber"]
});

type FormValues = z.infer<typeof formSchema>;

interface MythrasPurchaseFormProps {
    selectedPackage: MythrasPackage;
    onPurchaseSuccess: (result: PurchaseMythrasResponse) => void;
    onCancel: () => void;
}

export function MythrasPurchaseForm({ selectedPackage, onPurchaseSuccess, onCancel }: MythrasPurchaseFormProps) {
    const [purchaseResult, setPurchaseResult] = useState<PurchaseMythrasResponse | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            cardNumber: "",
            cardHolder: "",
            expiryDate: "",
            cvc: "",
            cardType: "Visa",
            billingAddress: {
                street: "",
                postalCode: "",
                city: "",
                country: "",
            },
        },
    });

    const onSubmit = async (values: FormValues) => {
        try {
            const result = await mythrasPurchaseService.purchaseMythras({
                ...values,
                mythrasPackageId: selectedPackage.mythrasPackageId,
            });
            toast.success(result.message || "¡Compra realizada exitosamente!");
            setPurchaseResult(result);
            onPurchaseSuccess(result);
        } catch (err: any) {
            toast.error(err.message || "Error al procesar la compra");
        }
    };

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <p className="font-medium text-lg">💳 Pagando paquete: <span className="font-semibold">{selectedPackage.name}</span> (${selectedPackage.price.toFixed(2)})</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="cardNumber" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Número de tarjeta</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                        <Input
                                            placeholder="16 dígitos"
                                            className="pl-8"
                                            {...field}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, "");
                                                field.onChange(val.slice(0, 16));
                                            }}
                                        />
                                    </div>
                                </FormControl>
                                <div className="min-h-[20px]"><FormMessage /></div>
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="cardHolder" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre del titular</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                        <Input
                                            placeholder="Nombre completo"
                                            className="pl-8"
                                            {...field}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                                                field.onChange(val);
                                            }}
                                        />
                                    </div>
                                </FormControl>
                                <div className="min-h-[20px]"><FormMessage /></div>
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="expiryDate" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Fecha expiración (MM/YY)</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                        <Input
                                            placeholder="MM/YY"
                                            className="pl-8"
                                            {...field}
                                            maxLength={5}
                                            onChange={(e) => {
                                                let val = e.target.value.replace(/[^\d]/g, "");
                                                if (val.length >= 3) {
                                                    val = val.slice(0, 2) + "/" + val.slice(2, 4);
                                                }
                                                field.onChange(val);
                                            }}
                                        />
                                    </div>
                                </FormControl>
                                <div className="min-h-[20px]"><FormMessage /></div>
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="cvc" render={({ field }) => (
                            <FormItem>
                                <FormLabel>CVC</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                        <Input
                                            placeholder="3 dígitos"
                                            className="pl-8"
                                            {...field}
                                            maxLength={3}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, "");
                                                field.onChange(val.slice(0, 3));
                                            }}
                                        />
                                    </div>
                                </FormControl>
                                <div className="min-h-[20px]"><FormMessage /></div>
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="cardType" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tipo de tarjeta</FormLabel>
                                <FormControl>
                                    <select {...field} className="border rounded p-2 w-full">
                                        <option value="Visa">Visa</option>
                                        <option value="Mastercard">Mastercard</option>
                                    </select>
                                </FormControl>
                                <div className="min-h-[20px]"><FormMessage /></div>
                            </FormItem>
                        )} />
                    </div>

                    <Separator />

                    <p className="font-medium">📍 Dirección de facturación</p>

                    <FormField control={form.control} name="billingAddress.street" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Calle</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input placeholder="Calle" className="pl-8" {...field} />
                                </div>
                            </FormControl>
                            <div className="min-h-[20px]"><FormMessage /></div>
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="billingAddress.postalCode" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Código postal</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input
                                        placeholder="Código postal"
                                        className="pl-8"
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e.target.value.replace(/\s/g, ""));
                                        }}
                                    />
                                </div>
                            </FormControl>
                            <div className="min-h-[20px]"><FormMessage /></div>
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="billingAddress.city" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ciudad</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input placeholder="Ciudad" className="pl-8" {...field} />
                                </div>
                            </FormControl>
                            <div className="min-h-[20px]"><FormMessage /></div>
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="billingAddress.country" render={({ field }) => (
                        <FormItem>
                            <FormLabel>País</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input placeholder="País" className="pl-8" {...field} />
                                </div>
                            </FormControl>
                            <div className="min-h-[20px]"><FormMessage /></div>
                        </FormItem>
                    )} />

                    <div className="flex gap-2">
                        <Button type="submit" disabled={!form.formState.isValid}>
                            Confirmar compra
                        </Button>
                        <Button type="button" variant="outline" onClick={onCancel}>
                            Cancelar
                        </Button>
                    </div>
                </form>
            </Form>

            {purchaseResult && (
                <Card className="mt-6 border-green-500 shadow-xl bg-green-50 animate-pulse">
                    <CardContent className="p-6 text-center space-y-2">
                        <p className="text-green-700 font-bold text-2xl">🎉 {purchaseResult.message}</p>
                        <p className="text-green-800">Tu nuevo saldo:</p>
                        <p className="text-4xl font-extrabold text-green-900">{purchaseResult.mythrasBalance} Mythras</p>
                        <p className="text-green-600">Actualizado el: {new Date(purchaseResult.walletLastUpdated).toLocaleString()}</p>
                    </CardContent>
                </Card>
            )}
        </>
    );
}