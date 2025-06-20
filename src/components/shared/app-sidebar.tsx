import { User, Bell, Shield, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Elementos del menú de configuraciones
const items = [
  {
    title: "Perfil",
    url: "/settings/account",
    icon: User,
  },
  {
    title: "Crear novela",
    url: "/settings/my-novels/create-novel",
    icon: Bell,
  },
  {
    title: "Mythras",
    url: "/settings/mythras-purchase",
    icon: Shield,
  },
  {
    title: "Preferencias",
    url: "/settings/preferences",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Configuraciones</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
