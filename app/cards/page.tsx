"use client";

import { useLore, LoreItem } from "@/context/LoreContext";
import { useState } from "react";
import { Search, Scroll, Shield, Zap, MapPin, Users, Skull, Sword, Sparkles, Check, X, Calendar } from "lucide-react";

export default function CardsPage() {
  const { loreItems, updateLoreItem } = useLore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // Estado para controlar qual card está a ser editado inline
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editYear, setEditYear] = useState("");

  const categories = [
    { id: "all", label: "Tudo", icon: Sparkles, color: "text-zinc-400" },
    { id: "lore", label: "Crônicas", icon: Scroll, color: "text-zinc-300" },
    { id: "runa", label: "Runas", icon: Shield, color: "text-amber-400" },
    { id: "magia", label: "Feitiços", icon: Zap, color: "text-purple-400" },
    { id: "nacao", label: "Nações/Locais", icon: MapPin, color: "text-blue-400" },
    { id: "npc", label: "Personagens", icon: Users, color: "text-emerald-400" },
    { id: "monstro", label: "Monstros/Itens", icon: Skull, color: "text-red-400" },
  ];

  const filteredItems = loreItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedCategory === "all") return matchesSearch;
    if (selectedCategory === "nacao") return matchesSearch && (item.category === "nacao" || item.category === "local");
    if (selectedCategory === "monstro") return matchesSearch && (item.category === "monstro" || item.category === "item");
    return matchesSearch && item.category === selectedCategory;
  });

  // Ativa o modo de edição inline para o card selecionado
  const startEditing = (item: LoreItem) => {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditContent(item.content);
    setEditYear(item.year || "");
  };

  // Cancela a edição limpando os estados
  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle("");
    setEditContent("");
    setEditYear("");
  };

  // Salva as alterações diretamente no Context (Alquimia do Conhecimento)
  const saveInlineEdit = (id: string) => {
    if (!editTitle.trim() || !editContent.trim()) return;

    updateLoreItem(id, {
      title: editTitle,
      content: editContent,
      year: editYear,
    });

    setEditingId(null);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "lore": return <Scroll className="h-4 w-4 text-zinc-400" />;
      case "runa": return <Shield className="h-4 w-4 text-amber-400" />;
      case "magia": return <Zap className="h-4 w-4 text-purple-400" />;
      case "nacao":
      case "local": return <MapPin className="h-4 w-4 text-blue-400" />;
      case "npc": return <Users className="h-4 w-4 text-emerald-400" />;
      case "monstro": return <Skull className="h-4 w-4 text-red-400" />;
      default: return <Sword className="h-4 w-4 text-zinc-500" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header e Barra de Busca */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Códice de Anthurium</h1>
          <p className="text-sm text-zinc-400">Navega e edita os fragmentos e mistérios catalogados diretamente nos cards.</p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Pesquisar no grimório..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900/40 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-purple-900/60 transition-colors focus:ring-1 focus:ring-purple-900/30"
          />
        </div>
      </div>

      {/* Filtros de Categoria */}
      <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                cancelEditing();
                setSelectedCategory(cat.id);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-200 ${
                isSelected
                  ? "bg-purple-950/30 border-purple-800/80 text-purple-300 shadow-[0_0_12px_rgba(147,51,234,0.1)]"
                  : "bg-zinc-900/20 border-zinc-800/60 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${cat.color}`} />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Grid de Cards */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/5">
          <p className="text-sm text-zinc-500">Nenhum fragmento arcano encontrado com estes filtros.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const isEditing = editingId === item.id;

            return (
              <div
                key={item.id}
                className={`group relative border rounded-xl p-5 flex flex-col justify-between space-y-4 transition-all duration-300 min-h-[220px] ${
                  isEditing
                    ? "bg-zinc-950 border-purple-800 shadow-[0_0_15px_rgba(147,51,234,0.07)]"
                    : "bg-zinc-900/20 hover:bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700/60 shadow-md"
                }`}
              >
                {isEditing ? (
                  /* MODO EDIÇÃO INLINE (Igual aos Quadros) */
                  <div className="space-y-3 h-full flex flex-col justify-between">
                    <div className="space-y-3">
                      {/* Inputs de Título e Ano lado a lado */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1 text-xs font-bold text-zinc-100 focus:outline-none focus:border-purple-500"
                          placeholder="Título do Card"
                        />
                        <div className="relative w-20 flex items-center">
                          <Calendar className="absolute left-1.5 h-3 w-3 text-zinc-500" />
                          <input
                            type="text"
                            value={editYear}
                            onChange={(e) => setEditYear(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded pl-5 pr-1.5 py-1 text-[11px] font-mono text-purple-400 focus:outline-none focus:border-purple-500"
                            placeholder="Ano"
                          />
                        </div>
                      </div>

                      {/* Textarea para a descrição/conteúdo */}
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={4}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-xs text-zinc-300 focus:outline-none focus:border-purple-500 resize-none leading-relaxed flex-1"
                        placeholder="Escreve o manuscrito aqui..."
                      />
                    </div>

                    {/* Ações de confirmação da Edição Inline */}
                    <div className="flex justify-end gap-1.5 pt-2 border-t border-zinc-800/60">
                      <button
                        onClick={cancelEditing}
                        className="p-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
                        title="Cancelar"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => saveInlineEdit(item.id)}
                        className="p-1 rounded bg-purple-900/40 border border-purple-800/80 text-purple-300 hover:bg-purple-900/60 transition-all"
                        title="Salvar Alterações"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* MODO VISUALIZAÇÃO PADRÃO (Duplo clique ou clique no botão ativa edição) */
                  <div 
                    className="h-full flex flex-col justify-between cursor-pointer"
                    onDoubleClick={() => startEditing(item)}
                    title="Duplo clique para editar"
                  >
                    <div className="space-y-2.5">
                      {/* Meta do Card */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 px-2 py-0.5 rounded-md bg-zinc-950 border border-zinc-800/80">
                          {getCategoryIcon(item.category)}
                          <span className="text-[10px] font-mono font-semibold tracking-wider text-zinc-400 uppercase">
                            {item.category}
                          </span>
                        </div>
                        
                        {item.year && (
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-purple-950/20 border border-purple-900/30 text-purple-400">
                            Ano {item.year}
                          </span>
                        )}
                      </div>

                      {/* Conteúdo */}
                      <h3 className="text-sm font-bold text-zinc-100 tracking-tight group-hover:text-purple-300 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-zinc-400 leading-relaxed line-clamp-5 whitespace-pre-wrap">
                        {item.content}
                      </p>
                    </div>

                    {/* Botão discreto no hover caso prefira clicar a dar duplo clique */}
                    <div className="pt-2 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditing(item);
                        }}
                        className="text-[10px] text-purple-400/80 hover:text-purple-300 font-medium transition-colors"
                      >
                        Editar card
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}