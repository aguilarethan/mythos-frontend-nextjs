"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { WriterRegistrationForm } from "@/features/become-writer/writer-registration-form";
import { SuccessMessage } from "@/features/become-writer/success-message";
import { AccessDenied } from "@/features/become-writer/access-denied";
import { useAccount } from "@/hooks/use-account";

export interface User {
  id: string;
  email: string;
  role: "reader" | "writer" | "admin";
  name?: string;
}

export interface WriterProfileData {
  name: string;
  lastName: string;
  birthDate: string;
  country: string;
  biography: string;
}

export interface Country {
  code: string;
  name: string;
}

export default function BecomeWriterPage() {
  const { account, isLoading } = useAccount();
  const [registrationComplete, setRegistrationComplete] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Verificando permisos...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const canBecomeWriter = account?.role == "reader";

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {registrationComplete ? (
            <SuccessMessage />
          ) : canBecomeWriter ? (
            <WriterRegistrationForm
              onSuccess={() => setRegistrationComplete(true)}
            />
          ) : (
            <AccessDenied userRole={"writer"} />
          )}
        </div>
      </div>
    </div>
  );
}
