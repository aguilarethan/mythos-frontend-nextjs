"use client";

import { useState } from "react";
import { PlanSelection } from "@/features/subscription/plan-selection";
import { PaymentForm } from "@/features/subscription/subscription-payment-form";
import { SuccessMessage } from "@/features/subscription/success-message";
import { subscriptionService } from "@/services/subscription/subscription-service";
import { toast } from "sonner";

export type Plan = {
  planId: number;
  id: string;
  name: string;
  price: number;
  duration: string;
  mythrasBonus: number;
  benefits: string[];
  popular?: boolean;
};

export type PaymentData = {
  cardholderName: string;
  email: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
};

export default function SubscriptionPage() {
  const [currentStep, setCurrentStep] = useState<
    "plans" | "payment" | "success"
  >("plans");
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
    setCurrentStep("payment");
  };

  const handlePaymentSubmit = async (paymentData: PaymentData) => {
    setIsProcessing(true);

    if (!selectedPlan) return;

    try {
      await subscriptionService.subscribeToPremiumPlan({
        planId: selectedPlan.planId,
      });

      setIsProcessing(false);
      setCurrentStep("success");
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message ||
              "Lo sentimos, ocurrió un error al intentar procesar el pago, intentelo de nuevo más tarde."
          : "Error desconocido"
      );

      setCurrentStep("plans");
    }

    // Simulación de procesamiento
    await new Promise((resolve) => setTimeout(resolve, 2000));
  };

  const handleBackToPlans = () => {
    setCurrentStep("plans");
    setSelectedPlan(null);
  };

  const handleBackToHome = () => {
    // TODO: Redirigir a la página principal o dashboard
    // router.push('/dashboard')
    console.log("Redirigiendo al dashboard...");
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {currentStep === "plans" && (
          <PlanSelection onPlanSelect={handlePlanSelect} />
        )}

        {currentStep === "payment" && selectedPlan && (
          <PaymentForm
            plan={selectedPlan}
            onSubmit={handlePaymentSubmit}
            onBack={handleBackToPlans}
            isProcessing={isProcessing}
          />
        )}

        {currentStep === "success" && selectedPlan && (
          <SuccessMessage plan={selectedPlan} onContinue={handleBackToHome} />
        )}
      </div>
    </div>
  );
}
