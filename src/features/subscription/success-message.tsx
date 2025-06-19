"use client";

import { CheckCircle, Crown, Gift, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Plan } from "@/app/(site)/subscription/page";

interface SuccessMessageProps {
  plan: Plan;
  onContinue: () => void;
}

export function SuccessMessage({ plan, onContinue }: SuccessMessageProps) {
  return (
    <div className="max-w-2xl mx-auto text-center">
      {/* Success Animation */}
      <div className="mb-8">
        <div className="relative inline-block">
          <div className="animate-bounce">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto" />
          </div>
          <div className="absolute -top-2 -right-2 animate-pulse">
            <Sparkles className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Success Message */}
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex items-center justify-center gap-2">
            <Crown className="h-8 w-8 text-amber-600" />
            ¡Suscripción realizada con éxito!
          </CardTitle>
          <CardDescription className="text-lg opacity-70">
            Bienvenido al mundo premium de Mythos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-amber-500/10 p-6 rounded-lg shadow-sm">
            <h3 className="font-bold text-lg mb-4">Tu plan activo:</h3>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-medium">{plan.name}</span>
              <span className="text-2xl font-bold">${plan.price}</span>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Gift className="h-4 w-4 text-amber-500" />
                <span>+{plan.mythrasBonus.toLocaleString()} Mythras</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Acceso inmediato</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 text-left">
            <h4 className="font-medium text-center">¿Qué sigue?</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Tus Mythras han sido agregadas a tu cuenta</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Ya puedes acceder a todo el contenido premium</span>
              </li>
            </ul>
          </div>

          <Button onClick={onContinue} className="w-full " size="lg">
            Comenzar a leer
          </Button>
        </CardContent>
      </Card>

      {/* Additional Info */}
      <p className="text-sm text-gray-500 mt-6">
        Puedes gestionar tu suscripción desde tu perfil en cualquier momento
      </p>
    </div>
  );
}
