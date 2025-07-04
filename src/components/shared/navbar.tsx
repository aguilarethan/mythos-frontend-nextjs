"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./mode-toggle";
import { Search, Settings } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useAccount } from "@/hooks/use-account";
import { logout } from "@/services/auth/auth-service";


export function Navbar() {
  const { isLoggedIn, isLoading, setIsLoggedIn } = useAuth();
  const { account } = useAccount();


  if (isLoading) return null;

  async function handleLogout() {
    try {
      await logout();
      setIsLoggedIn(false);
      window.location.reload();
    } catch (error: any) {
      console.error("Error al cerrar sesión:", error);
    }
  }

  return (
    <header className="w-full">
      <div className="max-w-5xl min-h-[65px] mx-auto px-0 py-3 flex flex-wrap md:flex-nowrap items-center justify-between gap-4">
        <div className="flex items-center gap-6 flex-grow md:flex-grow-0">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-md">
              <img src="/mythos-logo.png" alt="Logo" className="size-9" />
            </div>
            <span className="font-medium text-sm">Mythos</span>
          </Link>
        </div>

        <NavigationMenu viewport={false}>
          <NavigationMenuList>
            {account?.role !== "writer" && (
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href="/become-writer">Conviértete en autor</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex-1 mx-6">
          <div className="flex items-center w-full">
            <Input
              type="text"
              placeholder="Buscar..."
              className="rounded-r-none border-r-0"
            />
            <Button type="submit" size="icon" className="rounded-l-none">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>


        <div className="flex items-center gap-4">
          <ModeToggle />
          {isLoggedIn && (
            <Button asChild variant="ghost" size="icon">
              <Link href="/settings/account">
                <Settings className="h-5 w-5" />
              </Link>
            </Button>
          )}
          {isLoggedIn ? (
            <Button onClick={handleLogout}>Cerrar sesión</Button>
          ) : (
            <Button asChild>
              <Link href="/login">Iniciar sesión</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
