import { LoginForm } from "@/features/auth/components/login-form"
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">

        <div className="flex items-center gap-6 flex-grow md:flex-grow-0">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-md">
              <img src="/mythos-logo.png" alt="Logo" className="size-9" />
            </div>
            <span className="font-bold text-sm">Mythos</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>

      </div>

      <div className="bg-muted relative hidden lg:block">
        <img
          src="/images/login-image.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>

    </div>
  );
}