"use client"

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Settings } from "lucide-react"
import Link from "next/link"
import { ModeToggle } from "./mode-toggle"
import { useAuth } from "@/context/auth-context"

export function Navbar() {
    const { isLoggedIn, isLoading, setIsLoggedIn } = useAuth();

    console.log("¿Está logueado?", isLoggedIn)

    if (isLoading) return null

    const handleLogout = () => {
        
        setIsLoggedIn(false)
    }

    return (
        <header className="w-full border-b bg-white dark:bg-black">
            <div className="max-w-5xl min-h-[65px] mx-auto px-4 py-3 flex flex-wrap md:flex-nowrap items-center justify-between gap-4">

                <div className="flex items-center gap-6 flex-grow md:flex-grow-0">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-md">
                            <img src="/mythos-logo.png" alt="Logo" className="size-9" />
                        </div>
                        <span className="font-bold text-sm">Mythos</span>
                    </Link>
                </div>

                <NavigationMenu viewport={false}>
                    <NavigationMenuList >

                        <NavigationMenuItem>
                            <NavigationMenuTrigger>
                                Explora nuevas historias
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[300px] gap-4">
                                    <li>
                                        <NavigationMenuLink asChild>
                                            <Link href="#">
                                                <div className="font-medium">Géneros</div>
                                                <div className="text-muted-foreground">
                                                    Browse all components in the library.
                                                </div>
                                            </Link>
                                        </NavigationMenuLink>
                                        <NavigationMenuLink asChild>
                                            <Link href="#">
                                                <div className="font-medium">Documentation</div>
                                                <div className="text-muted-foreground">
                                                    Learn how to use the library.
                                                </div>
                                            </Link>
                                        </NavigationMenuLink>
                                    </li>
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                                <Link href="/become-an-author">Conviertete en autor</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                    </NavigationMenuList>
                </NavigationMenu>

                <div className="flex-1 mx-6 max-w-lg">
                    <div className="flex items-center w-full max-w-sm">
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
                    <Button variant="ghost" size="icon">
                        <Settings className="w-6 h-6" />
                    </Button>
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
    )
}