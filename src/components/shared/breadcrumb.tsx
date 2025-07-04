"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useMemo } from "react"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const routeNames: Record<string, string> = {
    "/": "Inicio",
    "/become-writer": "Conviertete en autor",
    "/search": "Búsqueda",
    "/chapter/reader": "Perfil",
    "/novel": "Novela",
    "/novel/create-chapter": "Crear capítulo",
    "/novel/chapter": "Capítulo",
    "/novel/edit-novel": "Editar novela",
    "/settings": "Configuraciones",
    "/settings/account": "Mi cuenta",
    "/settings/my-novels": "Mis novelas",
    "/settings/my-novels/create-novel": "Crear novela",
    "/settings/mythras-purchase": "Compra Mythras",
    "/settings/reading-preferences": "Preferencias de lectura",
    "/subscription": "Suscripciones",
}

const getRouteName = (path: string): string => {
    return routeNames[path] || path.charAt(1).toUpperCase() + path.slice(2)
}

export function BreadcrumbDemo() {

    const pathname = usePathname()

    const breadcrumbs = useMemo(() => {
        const segments = pathname.split('/').filter(Boolean)

        if (segments.length === 0) {
            return [{ name: "Inicio", path: "/" }]
        }

        const crumbs = [{ name: "Inicio", path: "/" }]

        let currentPath = ""
        segments.forEach((segment) => {
            currentPath += `/${segment}`
            crumbs.push({
                name: getRouteName(currentPath),
                path: currentPath
            })
        })

        return crumbs
    }, [pathname])

    return (
        <Breadcrumb className="max-w-5xl mx-auto px-0 py-3">
            <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => (
                    <div key={crumb.path} className="flex items-center">
                        <BreadcrumbItem>
                            {index === breadcrumbs.length - 1 ? (
                                <BreadcrumbPage>{crumb.name}</BreadcrumbPage>
                            ) : (
                                <BreadcrumbLink asChild>
                                    <Link href={crumb.path}>{crumb.name}</Link>
                                </BreadcrumbLink>
                            )}
                        </BreadcrumbItem>

                        {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                    </div>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    )
}
