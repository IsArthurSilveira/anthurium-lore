"use client";

import { useState } from "react";
import { useLore } from "@/context/LoreContext";
import { useRouter } from "next/navigation";
import { Scroll, Save, Type, Calendar, Globe, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const CATEGORIES = [
  { value: "lore", label: "História Geral / Crônica" },
  { value: "runa", label: "Runa Arcana" },
  { value: "magia", label: "Feitiço / Magia" },
  { value: "nacao", label: "Nação / Reino" },
  { value: "local", label: "Ponto de Interesse" },
  { value: "npc", label: "Personagem / NPC" },
  { value: "item", label: "Item / Relíquia" },
  { value: "monstro", label: "Criatura / Monstro" },
];

export default function EditorPage() {
  const { addLoreItem } = useLore();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("lore");
  const [year, setYear] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSaveDocument(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSaving(true);
    
    try {
      // Guarda no nosso contexto global (que faz o persist no localStorage)
      addLoreItem({
        title,
        category,
        year,
        content,
      });

      // Redireciona para a página de fragmentos para ver o card criado
      router.push("/cards");
    } catch (error) {
      console.error("Erro ao lacrar o manuscrito:", error);
      alert("Ocorreu uma falha mágica ao tentar salvar o documento.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header do Editor */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-950/40 rounded-lg border border-purple-900/50">
            <Scroll className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Forja de Conteúdo</h1>
            <p className="text-sm text-zinc-400">Escreva crônicas, catalogue runas e expanda as fronteiras do mundo.</p>
          </div>
        </div>
        
        <Button 
          onClick={handleSaveDocument} 
          disabled={isSaving}
          className="bg-purple-600 hover:bg-purple-700 text-white gap-2 self-start md:self-auto cursor-pointer"
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Arquivando..." : "Salvar no Códice"}
        </Button>
      </div>

      {/* Grid Principal do Editor */}
      <form onSubmit={handleSaveDocument} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Coluna de Configurações (Metadados da Lore) */}
        <div className="space-y-4 lg:col-span-1 bg-zinc-900/30 border border-zinc-800/80 rounded-xl p-5 h-fit">
          <h3 className="text-sm font-semibold tracking-wider text-purple-400 uppercase flex items-center gap-2 mb-2">
            <Globe className="h-4 w-4" /> Propriedades do Registro
          </h3>
          
          {/* Campo: Título */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
              <Type className="h-3 w-3" /> Título do Documento
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: A Queda de Andraeanum"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-purple-500 transition-colors"
              required
            />
          </div>

          {/* Campo: Categoria */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
              <Scroll className="h-3 w-3" /> Tipo de Conteúdo
            </label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-purple-500 transition-colors appearance-none cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value} className="bg-zinc-950 text-zinc-300">
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Campo: Ano Cronológico */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
              <Calendar className="h-3 w-3" /> Ano da Lore (Cronologia)
            </label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="Ex: 412 (Vazio se for atemporal)"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <div className="pt-4 border-t border-zinc-800/60 text-[11px] text-zinc-500 space-y-1">
            <p>💡 Dica: Vincule o ano correto para que este evento apareça ordenado automaticamente na sua <span className="text-purple-500 font-medium">Linha do Tempo</span>.</p>
          </div>
        </div>

        {/* Coluna do Editor de Texto Principal */}
        <div className="lg:col-span-2 flex flex-col bg-zinc-900/20 border border-zinc-800/60 rounded-xl overflow-hidden min-h-[500px]">
          {/* Barra de ferramentas estética minimalista */}
          <div className="bg-zinc-950/60 px-4 py-2 border-b border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500">
            <div className="flex gap-4">
              <span>Modo Manuscrito</span>
              <span>|</span>
              <span>Caracteres: {content.length}</span>
            </div>
            <div className="flex items-center gap-1 text-purple-400/80">
              <Sparkles className="h-3 w-3" /> Pronto para expansão arcana
            </div>
          </div>
          
          {/* Textarea estilo Notion / Google Docs escuro */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Comece a ditar a história de Anthurium aqui... Use detalhes sobre as runas, os efeitos colaterais dos elementos cardinais ou os segredos ocultos nas sombras de Obovatum e Hookeri..."
            className="flex-1 w-full bg-transparent p-6 text-sm md:text-base text-zinc-300 placeholder-zinc-600 focus:outline-none resize-none leading-relaxed font-mono"
            style={{ minHeight: "450px" }}
            required
          />
        </div>

      </form>
    </div>
  );
}