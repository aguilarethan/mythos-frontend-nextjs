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
import { useRouter } from "next/navigation";
import { useSearchStore } from "@/store/search-store";
import { FormEvent, useState } from "react";

export function Navbar() {
  // ✅ Todos los hooks al principio
  const { isLoggedIn, isLoading, setIsLoggedIn } = useAuth();
  const { account } = useAccount();
  const router = useRouter();
  const { setSearch } = useSearchStore();
  const [searchText, setSearchText] = useState("");

  // ✅ Return condicional después de todos los hooks
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

  function handleSearchSubmit(e: FormEvent) {
    e.preventDefault();
    if (searchText.trim() === "") return;
    setSearch(searchText.trim(), "title");
    router.push("/search");
    setSearchText("");
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

        <form onSubmit={handleSearchSubmit} className="flex-1 mx-6">
          <div className="flex items-center w-full">
            <Input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Buscar..."
              className="rounded-r-none border-r-0"
            />
            <Button type="submit" size="icon" className="rounded-l-none cursor-pointer">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </form>

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
            <Button onClick={handleLogout} className="cursor-pointer">Cerrar sesión</Button>
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