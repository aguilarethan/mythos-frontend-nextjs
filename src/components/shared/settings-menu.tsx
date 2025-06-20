import { User, Book, Coins, Settings, Subscript } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { url } from "inspector";

const items = [
  {
    title: "Perfil",
    url: "/settings/account",
    icon: User,
  },
  {
    title: "Crear novela",
    url: "/settings/my-novels/create-novel",
    icon: Book,
  },
  {
    title: "Mythras",
    url: "/settings/mythras-purchase",
    icon: Coins,
  },
  {
    title: "Preferencias",
    url: "/settings/reading-preferences",
    icon: Settings,
  },
  {
    title: "Planes Premium",
    url: "/subscription",
    icon: Subscript,
  },
];

interface AppHorizontalMenuProps {
  activeUrl?: string;
}

export function AppHorizontalMenu({ activeUrl }: AppHorizontalMenuProps) {
  return (
    <div className="w-full bg-muted/20">
      <div className="flex items-end justify-center px-4">
        <nav className="flex items-end -mb-px" role="tablist">
          {items.map((item) => (
            <Link
              key={item.title}
              href={item.url}
              role="tab"
              aria-selected={activeUrl === item.url}
              className={cn(
                "relative flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-200 ease-in-out",
                "border-t border-l border-r rounded-t-lg mr-1 last:mr-0",
                activeUrl === item.url
                  ? "bg-background border-border text-foreground -mb-px border-b border-b-background"
                  : "bg-muted/50 border-muted-foreground/20 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="w-4 h-4" />
              <span className="whitespace-nowrap">{item.title}</span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-b border-border" />
    </div>
  );
}
