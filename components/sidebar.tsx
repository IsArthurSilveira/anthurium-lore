"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  PenTool, 
  Layers, 
  Map, 
  MessageSquare, 
  Clock, 
  Sparkles 
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Visão Geral", href: "/dashboard", icon: LayoutDashboard },
  { name: "Produzir Conteúdo", href: "/editor", icon: PenTool },
  { name: "Visualizar Cards", href: "/cards", icon: Layers },
  { name: "Quadro Branco", href: "/whiteboard", icon: Map },
  { name: "Falar com IA", href: "/chat", icon: MessageSquare },
  { name: "Linha do Tempo", href: "/timeline", icon: Clock },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col border-r border-zinc-800 bg-zinc-950 text-zinc-200">
      <div className="flex h-16 items-center px-6 border-b border-zinc-800 gap-2">
        <Sparkles className="h-5 w-5 text-purple-500 animate-pulse" />
        <span className="font-semibold tracking-wider text-purple-400 uppercase text-sm">
          Anthurium Lore
        </span>
      </div>
      
      <nav className="flex-1 space-y-1 px-4 py-6">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-purple-950/40 text-purple-400 border border-purple-900/50" 
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
              )}
            >
              <item.icon className={cn("h-4 w-4", isActive ? "text-purple-400" : "text-zinc-400")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-800 text-xs text-zinc-600 text-center">
        v1.0.0 · Dark Fantasy Engine
      </div>
    </div>
  );
}