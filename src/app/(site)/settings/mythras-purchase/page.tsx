"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

import { MythrasPackageList } from "@/features/settings/components/mythras-package-list";
import { MythrasPurchaseForm } from "@/features/settings/components/mythras-purchase-form";
import { MythrasPackage, PurchaseMythrasResponse } from "@/services/mythras/mythras-purchase-interfaces";

export default function MythrasPurchasePage() {
    const { isLoggedIn, isLoading } = useAuth();
    const router = useRouter();
    const [selectedPackage, setSelectedPackage] = useState<MythrasPackage | null>(null);
    const [purchaseResult, setPurchaseResult] = useState<PurchaseMythrasResponse | null>(null);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <p>Cargando...</p>
            </div>
        );
    }

    if (!isLoggedIn) {
        toast.error("Debes iniciar sesión para acceder a esta página.");
        router.replace("/login");
        return null;
    }

    return (
        <div className="p-4 space-y-8 max-w-5xl m-auto">
            <div className="flex items-center gap-2 mb-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h2 className="text-2xl font-semibold">Adquirir Mythras</h2>
            </div>

            <Separator />

            {!purchaseResult && (
                <>
                    <MythrasPackageList onSelectPackage={setSelectedPackage} />

                    {selectedPackage && (
                        <>
                            <Separator />
                            <MythrasPurchaseForm
                                selectedPackage={selectedPackage}
                                onPurchaseSuccess={(result) => {
                                    setPurchaseResult(result);
                                    setSelectedPackage(null);
                                }}
                                onCancel={() => setSelectedPackage(null)}
                            />
                        </>
                    )}
                </>
            )}

            {purchaseResult && (
                <Card className="mt-6 border-green-500 shadow-xl bg-green-50 animate-pulse">
                    <CardContent className="p-6 text-center space-y-2">
                        <p className="text-green-700 font-bold text-2xl">🎉 {purchaseResult.message}</p>
                        <p className="text-green-800">Tu nuevo saldo:</p>
                        <p className="text-4xl font-extrabold text-green-900">{purchaseResult.mythrasBalance} Mythras</p>
                        <p className="text-green-700">Actualizado el: {new Date(purchaseResult.walletLastUpdated).toLocaleString()}</p>
                        <Button
                            className="mt-4"
                            onClick={() => setPurchaseResult(null)}
                        >
                            Adquirir más Mythras
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}