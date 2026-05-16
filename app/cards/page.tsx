"use client";

import { useState } from "react";
import { useLore } from "@/context/LoreContext";
import { Layers, Calendar, Scroll, FolderOpen } from "lucide-react";

const CATEGORIES = [
  { value: "all", label: "Tudo" },
  { value: "lore", label: "Crônicas" },
  { value: "runa", label: "Runas" },
  { value: "magia", label: "Magias" },
  { value: "nacao", label: "Nações" },
  { value: "local", label: "Locais" },
  { value: "npc", label: "NPCs" },
  { value: "item", label: "Itens" },
  { value: "monstro", label: "Criaturas" },
];

export default function CardsPage() {
  const { loreItems } = useLore();
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredItems = activeFilter === "all"
    ? loreItems
    : loreItems.filter(item => item.category === activeFilter);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-4 flex items-center gap-3">
        <div className="p-2 bg-purple-950/40 rounded-lg border border-purple-900/50">
          <Layers className="h-5 w-5 text-purple-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Códice de Fragmentos</h1>
          <p className="text-sm text-zinc-400">Navegue pelas suas criações e identifique lacunas no universo.</p>
        </div>
      </div>

      {/* Filtros horizontais */}
      <div className="flex flex-wrap gap-2 pb-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveFilter(cat.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 cursor-pointer ${
              activeFilter === cat.value
                ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-900/20"
                : "bg-zinc-900/60 border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid de Cards */}
      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 border border-dashed border-zinc-800 rounded-xl text-center p-6">
          <FolderOpen className="h-8 w-8 text-zinc-700 mb-2" />
          <p className="text-sm text-zinc-400">Nenhum registro encontrado nesta seção.</p>
          <p className="text-xs text-zinc-500">Vá até a Forja de Conteúdo para registrar os primeiros fatos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              className="group bg-zinc-900/30 border border-zinc-800/80 hover:border-purple-900/50 rounded-xl p-5 flex flex-col justify-between space-y-4 transition-all duration-200 hover:bg-zinc-900/50"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-zinc-950 border border-zinc-800 text-[10px] font-mono tracking-wider text-purple-400 uppercase rounded">
                    {item.category}
                  </span>
                  {item.year && (
                    <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-zinc-600" /> Ano {item.year}
                    </span>
                  )}
                </div>
                
                <h3 className="font-semibold text-zinc-200 group-hover:text-purple-400 transition-colors pt-1">
                  {item.title}
                </h3>
                
                <p className="text-xs text-zinc-400 line-clamp-4 leading-relaxed font-sans">
                  {item.content}
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-800/60 flex justify-between items-center text-[10px] text-zinc-600 font-mono">
                <span>ID: {item.id.substring(0, 8)}...</span>
                <span>Forjado em: {item.createdAt}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}