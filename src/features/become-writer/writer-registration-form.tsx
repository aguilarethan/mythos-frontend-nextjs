"use client";

import type React from "react";

import { useState } from "react";
import { Calendar, MapPin, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Account } from "@/services/account/account-interfaces";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  WriterProfileData,
  Country,
} from "@/app/(site)/become-writer/page";
import { accountService } from "@/services/account/account-service";
import { useAccount } from "@/hooks/use-account"

const COUNTRIES: Country[] = [
  { code: "ES", name: "España" },
  { code: "MX", name: "México" },
  { code: "AR", name: "Argentina" },
  { code: "CO", name: "Colombia" },
  { code: "PE", name: "Perú" },
  { code: "CL", name: "Chile" },
  { code: "VE", name: "Venezuela" },
  { code: "EC", name: "Ecuador" },
  { code: "BO", name: "Bolivia" },
  { code: "PY", name: "Paraguay" },
  { code: "UY", name: "Uruguay" },
  { code: "US", name: "Estados Unidos" },
  { code: "FR", name: "Francia" },
  { code: "IT", name: "Italia" },
  { code: "DE", name: "Alemania" },
];

interface WriterRegistrationFormProps {
  onSuccess: () => void;
}

export function WriterRegistrationForm({
  onSuccess,
}: WriterRegistrationFormProps) {
  const { account, setAccount } = useAccount();
  const [formData, setFormData] = useState<WriterProfileData>({
    name: "",
    lastName: "",
    birthDate: "",
    country: "",
    biography: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof WriterProfileData, value: string) => {
    setFormData((prev: WriterProfileData) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    const requiredFields: (keyof WriterProfileData)[] = [
      "name",
      "lastName",
      "birthDate",
      "country",
      "biography",
    ];

    for (const field of requiredFields) {
      if (!formData[field].trim()) {
        toast.error(`El campo ${getFieldLabel(field)} es obligatorio.`);
        return false;
      }
    }

    // Validar fecha de nacimiento
    const birthDate = new Date(formData.birthDate);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();

    if (age < 16) {
      toast.error("Debes tener al menos 16 años para convertirte en escritor.");
      return false;
    }

    // Validar biografía
    if (formData.biography.length < 50) {
      toast("La biografía debe tener al menos 50 caracteres.");
      return false;
    }

    return true;
  };

  const getFieldLabel = (field: keyof WriterProfileData): string => {
    const labels = {
      name: "Nombre",
      lastName: "Apellidos",
      birthDate: "Fecha de nacimiento",
      country: "País de origen",
      biography: "Biografía",
    };
    return labels[field];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulación de llamada al backend
      //await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await accountService.becomeWriter(formData);
      // Simulamos una respuesta exitosa
      console.log("Datos enviados al backend:", formData);
      console.log(response.message || "!Te has convertido en escritor!");
      setAccount({
        ...account,
        role: "writer"
      } as Account);

      toast.success(
        "¡Felicidades! Te has convertido en escritor exitosamente. Ahora puedes comenzar a publicar tus obras."
      );


      onSuccess();
    } catch (error) {
      console.error("Error al registrar como escritor:", error);
      toast(
        "Error: Hubo un problema al procesar tu solicitud. Por favor, inténtalo de nuevo."
      );
    } finally {
      setIsSubmitting(false);

    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">
          Convertirse en Escritor
        </CardTitle>
        <CardDescription>
          Completa tu perfil para comenzar a publicar tus obras en Mythos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Nombre *
              </Label>
              <Input
                id="firstName"
                type="text"
                placeholder="Tu nombre"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Apellidos *
              </Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Tus apellidos"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="birthDate" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Fecha de nacimiento *
              </Label>
              <Input
                id="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleInputChange("birthDate", e.target.value)}
                disabled={isSubmitting}
                max={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                País de origen *
              </Label>
              <Select
                value={formData.country}
                onValueChange={(value) => handleInputChange("country", value)}
                disabled={isSubmitting}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tu país" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="biography" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Biografía corta *
            </Label>
            <Textarea
              id="biography"
              placeholder="Cuéntanos sobre ti, tu experiencia como escritor, tus géneros favoritos, etc. (mínimo 50 caracteres)"
              value={formData.biography}
              onChange={(e) => handleInputChange("biography", e.target.value)}
              disabled={isSubmitting}
              rows={4}
              className="resize-none"
              required
            />
            <p className="text-sm text-muted-foreground">
              {formData.biography.length}/50 caracteres mínimos
            </p>
          </div>

          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={isSubmitting}
            size="lg"
          >
            {isSubmitting ? "Procesando..." : "Convertirme en Escritor"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
