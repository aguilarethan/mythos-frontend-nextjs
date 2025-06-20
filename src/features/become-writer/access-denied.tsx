import { ShieldX, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

interface AccessDeniedProps {
  userRole?: string;
}

export function AccessDenied({ userRole }: AccessDeniedProps) {
  return (
    <Card className="w-full max-w-md mx-auto text-center">
      <CardHeader>
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <ShieldX className="h-8 w-8 text-red-600" />
        </div>
        <CardTitle className="text-xl font-bold text-red-800">
          Acceso Denegado
        </CardTitle>
        <CardDescription>
          {userRole === "writer"
            ? "Ya eres un escritor registrado en la plataforma."
            : "Solo las personas autenticadas pueden convertirse en escritores. Si ya tienes una cuenta, por favor inicia sesión"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {userRole === "writer" && (
            <p className="text-sm text-muted-foreground">
              Puedes acceder directamente a tu dashboard para gestionar tus
              obras.
            </p>
          )}

          <div className="flex flex-col gap-2">
            {userRole === "writer" ? (
              <Link href="/">
                <Button className="w-full">Ir a Dashboard</Button>
              </Link>
            ) : (
              <Link href="/">
                <Button className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Ir a página principal
                </Button>
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
