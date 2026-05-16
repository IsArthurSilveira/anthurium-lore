"use client";

import { useLore } from "@/context/LoreContext";
import { LayoutDashboard, Scroll, Layers, Clock, Map, HelpCircle, Plus, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { loreItems, boards } = useLore();

  // Contadores por Categoria
  const countByCategory = (cat: string) => loreItems.filter(item => item.category === cat).length;

  const stats = [
    { label: "Crônicas", count: countByCategory("lore"), color: "text-zinc-300" },
    { label: "Runas Arcanas", count: countByCategory("runa"), color: "text-amber-400" },
    { label: "Feitiços", count: countByCategory("magia"), color: "text-purple-400" },
    { label: "Nações & Locais", count: countByCategory("nacao") + countByCategory("local"), color: "text-blue-400" },
    { label: "Personagens (NPCs)", count: countByCategory("npc"), color: "text-emerald-400" },
    { label: "Monstros & Itens", count: countByCategory("monstro") + countByCategory("item"), color: "text-red-400" },
  ];

  // Lógica para detetar o maior GAP na história
  const timelineYears = loreItems
    .filter((item) => item.year && item.year.trim() !== "")
    .map((item) => parseInt(item.year))
    .sort((a, b) => a - b);

  let largestGap = { size: 0, from: null as number | null, to: null as number | null };
  for (let i = 0; i < timelineYears.length - 1; i++) {
    const currentGap = timelineYears[i + 1] - timelineYears[i];
    if (currentGap > largestGap.size) {
      largestGap = { size: currentGap, from: timelineYears[i], to: timelineYears[i + 1] };
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-4 flex items-center gap-3">
        <div className="p-2 bg-purple-950/40 rounded-lg border border-purple-900/50">
          <LayoutDashboard className="h-5 w-5 text-purple-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Visão Geral do Códice</h1>
          <p className="text-sm text-zinc-400">O panorama atual do éter e a estabilidade histórica de Anthurium.</p>
        </div>
      </div>

      {/* Grid de Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-zinc-900/20 border border-zinc-800/80 rounded-xl p-4 flex flex-col justify-between space-y-1">
            <span className="text-xs text-zinc-500 font-medium">{stat.label}</span>
            <span className={`text-2xl font-mono font-bold ${stat.color}`}>
              {stat.count}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Coluna Principal: Análise de Gaps Históricos */}
        <div className="md:col-span-2 bg-zinc-900/30 border border-zinc-800/80 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-semibold tracking-wider text-purple-400 uppercase flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-purple-500" /> Diagnóstico de Consistência
          </h3>

          {timelineYears.length < 2 ? (
            <div className="text-zinc-500 text-xs py-4 flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-zinc-600" /> 
              Insere pelo menos dois documentos com datas no editor para o oráculo calcular lacunas na cronologia.
            </div>
          ) : largestGap.size > 30 ? (
            <div className="bg-purple-950/10 border border-purple-900/30 rounded-lg p-4 space-y-2">
              <div className="text-sm font-medium text-purple-300 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-purple-500 animate-ping" />
                Grande Vazio Detetado na História
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Existe um buraco negro cronológico de <span className="text-purple-400 font-bold">{largestGap.size} anos</span> entre o <span className="font-mono text-zinc-300">Ano {largestGap.from}</span> e o <span className="font-mono text-zinc-300">Ano {largestGap.to}</span>. Durante este período, o destino de Andraeanum, Obovatum e Hookeri permanece na escuridão.
              </p>
              <div className="pt-2">
                <Link href="/editor">
                  <span className="text-[11px] text-purple-400 hover:underline cursor-pointer font-medium">
                    → Forjar crônica para preencher este gap
                  </span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-950/10 border border-emerald-900/20 text-emerald-400 text-xs p-4 rounded-lg">
              ✓ A cronologia mundial está estável. Não foram detetadas grandes eras de silêncio sem registos estruturados.
            </div>
          )}

          {/* Estado Geral dos Rascunhos */}
          <div className="border-t border-zinc-800/60 pt-4 flex justify-between items-center text-xs">
            <span className="text-zinc-400 flex items-center gap-1.5">
              <Map className="h-3.5 w-3.5 text-zinc-500" /> Mesas táticas de Brainstorm ativas:
            </span>
            <span className="font-mono font-bold text-zinc-200 bg-zinc-950 border border-zinc-800 px-2 py-0.5 rounded">
              {boards.length} quadros salvos
            </span>
          </div>
        </div>

        {/* Coluna Lateral: Acesso Rápido */}
        <div className="bg-zinc-900/20 border border-zinc-800/60 rounded-xl p-5 space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">Atalhos da Forja</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">Acede rapidamente à raiz da criação para expandir o teu mundo medieval.</p>
          </div>
          
          <div className="space-y-2 pt-2">
            <Link href="/editor" className="flex items-center justify-between p-2 rounded-lg bg-zinc-950/60 border border-zinc-800 hover:border-purple-900/40 transition-colors text-xs text-zinc-300 group">
              <span className="flex items-center gap-2"><Scroll className="h-3.5 w-3.5 text-purple-500" /> Nova Crônica</span>
              <Plus className="h-3.5 w-3.5 text-zinc-600 group-hover:text-purple-400" />
            </Link>
            <Link href="/whiteboard" className="flex items-center justify-between p-2 rounded-lg bg-zinc-950/60 border border-zinc-800 hover:border-purple-900/40 transition-colors text-xs text-zinc-300 group">
              <span className="flex items-center gap-2"><Map className="h-3.5 w-3.5 text-purple-500" /> Novo Quadro</span>
              <Plus className="h-3.5 w-3.5 text-zinc-600 group-hover:text-purple-400" />
            </Link>
            <Link href="/chat" className="flex items-center justify-between p-2 rounded-lg bg-zinc-950/60 border border-purple-950/40 bg-purple-950/5 text-xs text-purple-400 border-purple-900/20 hover:border-purple-700/40 transition-colors group">
              <span className="flex items-center gap-2">🔮 Consultar Oráculo</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}