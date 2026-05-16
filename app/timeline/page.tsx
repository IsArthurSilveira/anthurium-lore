"use client";

import { useLore } from "@/context/LoreContext";
import { Clock, Calendar, ArrowUpDown, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function TimelinePage() {
  const { loreItems } = useLore();

  // Filtra apenas os itens que possuem ano definido e ordena do menor para o maior
  const timelineItems = loreItems
    .filter((item) => item.year && item.year.trim() !== "")
    .sort((a, b) => parseInt(a.year) - parseInt(b.year));

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-950/40 rounded-lg border border-purple-900/50">
            <Clock className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Anais do Tempo</h1>
            <p className="text-sm text-zinc-400">A evolução cronológica e os grandes marcos de Anthurium.</p>
          </div>
        </div>
        
        <div className="text-xs text-zinc-500 flex items-center gap-1 bg-zinc-900/40 px-3 py-1.5 rounded-lg border border-zinc-800/60">
          <ArrowUpDown className="h-3 w-3 text-purple-400" /> Ordem Cronológica
        </div>
      </div>

      {/* Validação de itens vazios */}
      {timelineItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 border border-dashed border-zinc-800 rounded-xl text-center p-6 space-y-3">
          <Calendar className="h-8 w-8 text-zinc-700" />
          <p className="text-sm text-zinc-400">Nenhum evento cronológico forjado ainda.</p>
          <p className="text-xs text-zinc-500 max-w-sm">
            Para ver a linha do tempo ganhar vida, crie um conteúdo na <Link href="/editor" className="text-purple-400 hover:underline">Forja de Conteúdo</Link> preenchendo o campo <strong>"Ano da Lore"</strong>.
          </p>
        </div>
      ) : (
        <div className="relative border-l border-zinc-800 ml-4 md:ml-32 space-y-8 pb-12">
          {timelineItems.map((item, index) => {
            // Cálculo simples de gap com o evento anterior para alertar o escritor
            const currentYear = parseInt(item.year);
            const previousYear = index > 0 ? parseInt(timelineItems[index - 1].year) : null;
            const gap = previousYear !== null ? currentYear - previousYear : 0;
            const isBigGap = gap > 50; // Alerta se o buraco na história for maior que 50 anos

            return (
              <div key={item.id} className="relative pl-6 group">
                
                {/* Indicador visual de GAP GRANDE antes do card */}
                {isBigGap && (
                  <div className="absolute -top-6 left-[-1px] transform -translate-x-1/2 flex items-center gap-2 bg-amber-950/20 border border-amber-900/40 text-amber-400 text-[10px] font-mono px-2 py-0.5 rounded-md ml-6 md:ml-0">
                    <HelpCircle className="h-3 w-3" /> Alerta de Gap Histórico: +{gap} anos de silêncio
                  </div>
                )}

                {/* Marcador da Linha (Bolinha) */}
                <div className="absolute left-0 top-1.5 h-3 w-3 -translate-x-1/2 rounded-full border border-purple-500 bg-zinc-950 group-hover:bg-purple-500 transition-colors duration-200" />

                {/* Ano flutuante na esquerda (visível em telas médias/grandes) */}
                <div className="absolute left-0 top-0 -translate-x-32 w-24 text-right hidden md:block">
                  <span className="font-mono text-sm font-bold text-purple-400">
                    Ano {item.year}
                  </span>
                </div>

                {/* Card do Evento */}
                <div className="bg-zinc-900/20 border border-zinc-800/80 hover:border-purple-900/40 rounded-xl p-5 space-y-3 transition-all duration-200 hover:bg-zinc-900/40">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    {/* Ano visível no mobile */}
                    <span className="font-mono text-xs font-bold text-purple-400 md:hidden bg-purple-950/30 border border-purple-900/40 px-2 py-0.5 rounded">
                      Ano {item.year}
                    </span>
                    
                    <span className="px-2 py-0.5 bg-zinc-950 border border-zinc-800 text-[9px] font-mono tracking-wider text-zinc-400 uppercase rounded">
                      {item.category}
                    </span>
                    
                    <span className="text-[10px] text-zinc-600 font-mono">
                      Registrado em: {item.createdAt}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-zinc-200 group-hover:text-purple-400 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs md:text-sm text-zinc-400 leading-relaxed font-sans whitespace-pre-wrap">
                    {item.content}
                  </p>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}