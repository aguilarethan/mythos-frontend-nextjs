"use client";

import { Check, Crown, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Plan } from "@/app/(site)/subscription/page";

interface PlanSelectionProps {
  onPlanSelect: (plan: Plan) => void;
}

const plans: Plan[] = [
  {
    planId: 1,
    id: "monthly",
    name: "Plan Mensual",
    price: 9.99,
    duration: "mes",
    mythrasBonus: 1000,
    benefits: [
      "Acceso ilimitado a novelas premium",
      "Sin anuncios",
      "Descarga para lectura offline",
      "Soporte prioritario",
    ],
  },
  {
    planId: 2,
    id: "quarterly",
    name: "Plan Trimestral",
    price: 24.99,
    duration: "3 meses",
    mythrasBonus: 3500,
    benefits: [
      "Todo lo del plan mensual",
      "Soporte prioritario",
      "Acceso anticipado a nuevos lanzamientos",
      "500 Mythras extra de bonus",
    ],
    popular: true,
  },
  {
    planId: 3,
    id: "annual",
    name: "Plan Anual",
    price: 89.99,
    duration: "año",
    mythrasBonus: 15000,
    benefits: [
      "Todo lo del plan trimestral",
      "Contenido exclusivo de autores",
      "Insignia de miembro VIP",
      "3000 Mythras extra de bonus",
    ],
  },
];

export function PlanSelection({ onPlanSelect }: PlanSelectionProps) {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Crown className="h-8 w-8 text-amber-600" />
          <h1 className="text-3xl font-bold">Elige tu plan premium</h1>
        </div>
        <p className="text-md opacity-70 max-w-3xl mx-auto">
          Desbloquea todo el potencial de Mythos con acceso ilimitado a miles de
          novelas premium, contenido exclusivo y una experiencia de lectura sin
          interrupciones.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-8">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
              plan.popular
                ? "border-amber-500 shadow-lg scale-105"
                : "border-gray-200"
            }`}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-400 to-amber-600">
                <Sparkles className="h-3 w-3 mr-1" />
                Más Popular
              </Badge>
            )}

            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
              <CardDescription className="text-sm opacity-70">
                Perfecto para lectores{" "}
                {plan.id === "monthly"
                  ? "ocasionales"
                  : plan.id === "quarterly"
                  ? "regulares"
                  : "ávidos"}
              </CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-gray-500">/{plan.duration}</span>
              </div>
              {plan.id === "monthly" && (
                <p className="text-sm text-green-500 font-medium opacity-0">
                  Ahorra $0.00
                </p>
              )}
              {plan.id === "quarterly" && (
                <p className="text-sm text-green-500 font-medium">
                  Ahorra $5.98
                </p>
              )}
              {plan.id === "annual" && (
                <p className="text-sm text-green-500 font-medium">
                  Ahorra $29.89
                </p>
              )}
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-amber-100 rounded-lg">
                <Zap className="h-5 w-5 text-amber-600" />
                <span className="font-medium text-amber-800">
                  +{plan.mythrasBonus.toLocaleString()} Mythras mensuales
                </span>
              </div>

              <ul className="space-y-3">
                {plan.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm opacity-70">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter>
              <Button
                className={`w-full ${
                  plan.popular
                    ? "bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                    : ""
                }`}
                onClick={() => onPlanSelect(plan)}
              >
                Suscribirse ahora
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Additional Info */}
      <div className="text-center text-sm opacity-70">
        <p>Cancela en cualquier momento sin penalizaciones</p>
      </div>
    </div>
  );
}
