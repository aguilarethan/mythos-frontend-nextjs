"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { ReadingPreferencesForm } from "@/features/settings/components/reading-preferences-form";

export default function ReadingPreferencesPage() {
    const router = useRouter();
    const { isLoggedIn, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && !isLoggedIn) {
            toast.error("Debes iniciar sesión para acceder a esta página.");
            router.replace("/login");
        }
    }, [isLoggedIn, isLoading, router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <p>Cargando datos de preferencias...</p>
            </div>
        );
    }

    return (
        <div className="p-4 space-y-8 max-w-5xl m-auto">
            <div className="flex items-center gap-2 mb-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h2 className="text-2xl font-semibold">Preferencias de lectura</h2>
            </div>

            <Separator className="mb-4" />

            <ReadingPreferencesForm />
        </div>
    );
}