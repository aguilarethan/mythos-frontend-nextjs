"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { mythrasPurchaseService } from "@/services/mythras/mythras-purchase-service";
import { MythrasPackage } from "@/services/mythras/mythras-purchase-interfaces";
import { toast } from "sonner";
import { Gem, Gift, Star } from "lucide-react";

interface MythrasPackageListProps {
    onSelectPackage: (pkg: MythrasPackage) => void;
}

export function MythrasPackageList({ onSelectPackage }: MythrasPackageListProps) {
    const [packages, setPackages] = useState<MythrasPackage[]>([]);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const data = await mythrasPurchaseService.getPackages();
                setPackages(data);
            } catch (err: any) {
                toast.error(err.message || "Error al cargar paquetes.");
            }
        };

        fetchPackages();
    }, []);

    if (packages.length === 0) {
        return <p>No hay paquetes disponibles.</p>;
    }

    const getIcon = (index: number) => {
        if (index === 0) return <Gem className="w-8 h-8 text-indigo-500" />;
        if (index === 1) return <Star className="w-8 h-8 text-yellow-500" />;
        return <Gift className="w-8 h-8 text-pink-500" />;
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Elige un paquete de Mythras</h3>
                <p className="text-muted-foreground">Selecciona el paquete que mejor se adapte a tus necesidades y obtén Mythras con bonificación.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((pkg, index) => (
                    <Card
                        key={pkg.mythrasPackageId}
                        className="p-6 flex flex-col justify-between shadow-lg border-2 border-transparent hover:border-indigo-500 transition duration-300"
                    >
                        <div className="flex flex-col items-center space-y-2">
                            {getIcon(index)}
                            <h3 className="text-lg font-bold">{pkg.name}</h3>
                            <p className="text-sm text-muted-foreground">Mythras: {pkg.mythrasAmount} (+{pkg.bonusMythras} bonus)</p>
                            <p className="text-xl font-semibold">${pkg.price.toFixed(2)}</p>
                        </div>

                        <Separator className="my-4" />

                        <Button className="w-full" onClick={() => onSelectPackage(pkg)}>
                            Seleccionar
                        </Button>
                    </Card>
                ))}
            </div>
        </div>
    );
}