import { CheckCircle, BookOpen, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export function SuccessMessage() {
  return (
    <Card className="w-full max-w-2xl mx-auto text-center shadow-lg">
      <CardHeader>
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <CardTitle className="text-2xl font-bold text-green-700">
          ¡Bienvenido a la comunidad de escritores!
        </CardTitle>
        <CardDescription className="text-lg">
          Tu perfil de escritor ha sido creado exitosamente
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col items-center p-4 border rounded-lg">
            <PenTool className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-semibold">Publica tus obras</h3>
            <p className="text-sm text-muted-foreground text-center">
              Comienza a compartir tus historias con la comunidad
            </p>
          </div>
          <div className="flex flex-col items-center p-4 border rounded-lg">
            <BookOpen className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-semibold">Gestiona tu perfil</h3>
            <p className="text-sm text-muted-foreground text-center">
              Actualiza tu información y biografía cuando quieras
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center w-full">
          <Link href="/" className="w-full">
            <Button className="w-full" size="lg">
              Volver al Dashboard Principal
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
