"use client";

import type React from "react";

import { useState } from "react";
import { ArrowLeft, CreditCard, Lock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { Plan, PaymentData } from "@/app/(site)/subscription/page";

interface PaymentFormProps {
  plan: Plan;
  onSubmit: (data: PaymentData) => void;
  onBack: () => void;
  isProcessing: boolean;
}

export function PaymentForm({
  plan,
  onSubmit,
  onBack,
  isProcessing,
}: PaymentFormProps) {
  const [formData, setFormData] = useState<PaymentData>({
    cardholderName: "",
    email: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const handleInputChange = (field: keyof PaymentData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Validaciones del lado del cliente
    // - Validar formato de email
    // - Validar formato de tarjeta (Luhn algorithm)
    // - Validar fecha de expiración
    // - Validar CVV

    onSubmit(formData);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a planes
        </Button>
        <h1 className="text-3xl font-bold text-center mb-2">
          Finalizar suscripción
        </h1>
        <p className="text-gray-600 text-center">
          Completa tu información de pago de forma segura
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Payment Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Información de pago
            </CardTitle>
            <CardDescription>
              Tus datos están protegidos con encriptación de nivel bancario
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardholderName">Nombre del titular</Label>
                <Input
                  id="cardholderName"
                  placeholder=""
                  value={formData.cardholderName}
                  onChange={(e) =>
                    handleInputChange("cardholderName", e.target.value)
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="mythos@ejemplo.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardNumber">Número de tarjeta</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 1234 123 1234"
                  value={formData.cardNumber}
                  onChange={(e) =>
                    handleInputChange(
                      "cardNumber",
                      formatCardNumber(e.target.value)
                    )
                  }
                  maxLength={19}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Fecha de expiración</Label>
                  <Input
                    id="expiryDate"
                    placeholder="MM/AA"
                    value={formData.expiryDate}
                    onChange={(e) =>
                      handleInputChange(
                        "expiryDate",
                        formatExpiryDate(e.target.value)
                      )
                    }
                    maxLength={5}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={formData.cvv}
                    onChange={(e) =>
                      handleInputChange(
                        "cvv",
                        e.target.value.replace(/\D/g, "")
                      )
                    }
                    maxLength={4}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Procesando...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Confirmar suscripción
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Resumen del pedido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">{plan.name}</span>
              <span className="font-bold">${plan.price}</span>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Incluye:</h4>
              <ul className="text-sm opacity-70 space-y-1">
                {plan.benefits.map((benefit, index) => (
                  <li key={index}>• {benefit}</li>
                ))}
              </ul>
            </div>

            <Separator />

            <div className="border-amber-200 border-1 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Mythras incluidas</span>
                <span className="font-bold">
                  +{plan.mythrasBonus.toLocaleString()}
                </span>
              </div>
            </div>

            <Separator />

            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total</span>
              <span>${plan.price}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500 mt-4">
              <Shield className="h-4 w-4" />
              <span>Pago seguro y encriptado</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
