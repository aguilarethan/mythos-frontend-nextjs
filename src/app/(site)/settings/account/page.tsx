"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { LogOut, Trash2, ArrowLeft } from "lucide-react";
import { EditProfileForm } from "@/features/settings/components/edit-profile-form";

export default function SettingsAccountPage() {
  const router = useRouter();

  return (
    <div className="p-4 space-y-8 max-w-5xl m-auto">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-2xl font-semibold">Mi perfil</h2>
      </div>

      <Separator className="mb-4" />

      <div className="flex items-center gap-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src="https://picsum.photos/200" alt="Perfil" />
        </Avatar>
        <div>
          <div className="flex gap-2 mb-1">
            <Button>Subir imagen</Button>
            <Button variant="outline">Remover imagen</Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Soporta imágenes PNG, JPEG hasta 2 MB
          </p>
        </div>
      </div>

      <EditProfileForm />

      <div>
        <h3 className="text-xl font-semibold mt-6 mb-2">Seguridad</h3>
        <Separator className="mb-4" />
        <Card className="p-4">[Formulario de cambio de contraseña]</Card>
      </div>

      <div>
        <h3 className="text-xl font-semibold mt-6 mb-2">Acceso</h3>
        <Separator className="mb-4" />

        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <p className="font-medium">Cerrar sesión</p>
            <p className="text-sm text-muted-foreground max-w-sm">
              Al cerrar la sesión deberás ingresar tu correo y contraseña para
              poder acceder nuevamente
            </p>
          </div>
          <Button
            variant="outline"
            className="w-48"
            onClick={() => alert("Sesión cerrada")}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar sesión
          </Button>
        </div>

        <div className="flex justify-between items-start flex-wrap gap-4 mt-4">
          <div>
            <p className="text-red-500 font-medium">Eliminar cuenta</p>
            <p className="text-sm text-muted-foreground max-w-sm">
              Esta acción no se puede deshacer
            </p>
          </div>
          <Button
            variant="destructive"
            className="w-48"
            onClick={() => alert("Cuenta eliminada")}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar cuenta
          </Button>
        </div>
      </div>
    </div>
  );
}
