"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
// --- Interfaces Baseadas no seu Documento de Lore ---

export interface Nacao {
  id: string;
  nome: string;
  deus_devoto: string;
  dogma_principal: string;
  populacao_status: string;
  descricao: string;
  created_at: string;
}

export interface Etnia {
  id: string;
  nome: string;
  tracos_anatomicos: string;
  fraquezas_psicologicas: string;
  nacao_origem_id: string | null;
  descricao: string;
  created_at: string;
}

export interface MagiaEstigma {
  id: string;
  nome: string;
  emocao_gatilho: string;
  estigma_carne: string;
  nivel_instabilidade: number;
  descricao: string;
  created_at: string;
}

export interface LoreItem {
  id: string;
  title: string;
  category: string;
  year: string;
  content: string;
  createdAt: string;
}

export interface WhiteboardNote {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
}

export interface Board {
  id: string;
  name: string;
  notes: WhiteboardNote[];
  createdAt: string;
}

interface LoreContextType {
  // Estados Globais
  loreItems: LoreItem[];
  nacoes: Nacao[];
  etnias: Etnia[];
  magiasEstigmas: MagiaEstigma[];
  boards: Board[];
  isLoading: boolean;

  // Funções de Crônicas (Cards / Timeline)
  fetchLoreItems: () => Promise<void>;
  addLoreItem: (item: Omit<LoreItem, "id" | "createdAt">) => Promise<void>;
  updateLoreItem: (id: string, updatedFields: Partial<Omit<LoreItem, "id" | "createdAt">>) => Promise<void>;
  deleteLoreItem: (id: string) => Promise<void>;

  // Funções de Nações
  addNacao: (nacao: Omit<Nacao, "id" | "created_at">) => Promise<void>;
  updateNacao: (id: string, fields: Partial<Nacao>) => Promise<void>;

  // Funções de Etnias
  addEtnia: (etnia: Omit<Etnia, "id" | "created_at">) => Promise<void>;

  // Funções de Magias/Estigmas
  addMagiaEstigma: (magia: Omit<MagiaEstigma, "id" | "created_at">) => Promise<void>;

  // Funções do Quadro Branco (Miro)
  fetchBoards: () => Promise<void>;
  addBoard: (name: string) => Promise<void>;
  updateBoardNotes: (boardId: string, notes: WhiteboardNote[]) => Promise<void>;
  deleteBoard: (boardId: string) => Promise<void>;
}

const LoreContext = createContext<LoreContextType | undefined>(undefined);

export function LoreProvider({ children }: { children: React.ReactNode }) {
  const [loreItems, setLoreItems] = useState<LoreItem[]>([]);
  const [nacoes, setNacoes] = useState<Nacao[]>([]);
  const [etnias, setEtnias] = useState<Etnia[]>([]);
  const [magiasEstigmas, setMagiasEstigmas] = useState<MagiaEstigma[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega todos os dados do Supabase assim que a aplicação inicia
  useEffect(() => {
    async function loadAllInitialData() {
      setIsLoading(true);
      await Promise.all([
        fetchLoreItems(),
        fetchNacoes(),
        fetchEtnias(),
        fetchMagiasEstigmas(),
        fetchBoards()
      ]);
      setIsLoading(false);
    }
    loadAllInitialData();
  }, []);

  // --- IMPLEMENTAÇÃO: CRÔNICAS (CARDS & TIMELINE) ---

  const fetchLoreItems = async () => {
    const { data, error } = await supabase
      .from("cronicas")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error("Erro ao buscar crônicas:", error);
    else if (data) {
      setLoreItems(data.map((item: any) => ({
        id: item.id,
        title: item.titulo,
        category: item.categoria,
        year: item.ano_cronologico || "",
        content: item.conteudo,
        createdAt: new Date(item.created_at).toLocaleDateString("pt-BR")
      })));
    }
  };

  const addLoreItem = async (newItem: Omit<LoreItem, "id" | "createdAt">) => {
    const { data, error } = await supabase
      .from("cronicas")
      .insert([{
        titulo: newItem.title,
        categoria: newItem.category,
        ano_cronologico: newItem.year,
        conteudo: newItem.content
      }])
      .select();

    if (error) console.error("Erro ao inserir crônica:", error);
    else if (data) await fetchLoreItems();
  };

  const updateLoreItem = async (id: string, updatedFields: Partial<Omit<LoreItem, "id" | "createdAt">>) => {
    const payload: any = {};
    if (updatedFields.title !== undefined) payload.titulo = updatedFields.title;
    if (updatedFields.category !== undefined) payload.categoria = updatedFields.category;
    if (updatedFields.year !== undefined) payload.ano_cronologico = updatedFields.year;
    if (updatedFields.content !== undefined) payload.conteudo = updatedFields.content;

    const { error } = await supabase
      .from("cronicas")
      .update(payload)
      .eq("id", id);

    if (error) console.error("Erro ao atualizar crônica:", error);
    else await fetchLoreItems();
  };

  const deleteLoreItem = async (id: string) => {
    const { error } = await supabase.from("cronicas").delete().eq("id", id);
    if (error) console.error("Erro ao deletar crônica:", error);
    else await fetchLoreItems();
  };

  // --- IMPLEMENTAÇÃO: NAÇÕES ---

  const fetchNacoes = async () => {
    const { data, error } = await supabase.from("nacoes").select("*").order("nome");
    if (!error && data) setNacoes(data);
  };

  const addNacao = async (nacao: Omit<Nacao, "id" | "created_at">) => {
    const { error } = await supabase.from("nacoes").insert([nacao]);
    if (!error) await fetchNacoes();
  };

  const updateNacao = async (id: string, fields: Partial<Nacao>) => {
    const { error } = await supabase.from("nacoes").update(fields).eq("id", id);
    if (!error) await fetchNacoes();
  };

  // --- IMPLEMENTAÇÃO: ETNIAS ---

  const fetchEtnias = async () => {
    const { data, error } = await supabase.from("etnias").select("*").order("nome");
    if (!error && data) setEtnias(data);
  };

  const addEtnia = async (etnia: Omit<Etnia, "id" | "created_at">) => {
    const { error } = await supabase.from("etnias").insert([etnia]);
    if (!error) await fetchEtnias();
  };

  // --- IMPLEMENTAÇÃO: MAGIAS / ESTIGMAS ---

  const fetchMagiasEstigmas = async () => {
    const { data, error } = await supabase.from("magias_estigmas").select("*").order("nome");
    if (!error && data) setMagiasEstigmas(data);
  };

  const addMagiaEstigma = async (magia: Omit<MagiaEstigma, "id" | "created_at">) => {
    const { error } = await supabase.from("magias_estigmas").insert([magia]);
    if (!error) await fetchMagiasEstigmas();
  };

  // --- IMPLEMENTAÇÃO: QUADRO BRANCO (MIRO STYLE) ---

  const fetchBoards = async () => {
    const { data: boardsData, error: bError } = await supabase.from("quadros").select("*");
    if (bError || !boardsData) return;

    const formattedBoards = await Promise.all(
      boardsData.map(async (board: any) => {
        const { data: notesData } = await supabase
          .from("quadro_notas")
          .select("*")
          .eq("quadro_id", board.id);

        return {
          id: board.id,
          name: board.nome,
          createdAt: new Date(board.created_at).toLocaleDateString("pt-BR"),
          notes: (notesData || []).map((note: any) => ({
            id: note.id,
            text: note.texto,
            x: note.x,
            y: note.y,
            color: note.cor
          }))
        };
      })
    );
    setBoards(formattedBoards);
  };

  const addBoard = async (name: string) => {
    const { error } = await supabase.from("quadros").insert([{ nome: name }]);
    if (!error) await fetchBoards();
  };

  const updateBoardNotes = async (boardId: string, updatedNotes: WhiteboardNote[]) => {
    // 1. Atualiza o estado local imediatamente para o arrasto ser fluido na tela
    setBoards(prev => prev.map(b => b.id === boardId ? { ...b, notes: updatedNotes } : b));

    // 2. Sincroniza em background com o Supabase limpando as notas antigas do quadro e inserindo a nova disposição
    await supabase.from("quadro_notas").delete().eq("quadro_id", boardId);
    
    if (updatedNotes.length > 0) {
      const dbNotes = updatedNotes.map(n => ({
        quadro_id: boardId,
        texto: n.text,
        x: n.x,
        y: n.y,
        cor: n.color
      }));
      await supabase.from("quadro_notas").insert(dbNotes);
    }
  };

  const deleteBoard = async (boardId: string) => {
    const { error } = await supabase.from("quadros").delete().eq("id", boardId);
    if (!error) await fetchBoards();
  };

  return (
    <LoreContext.Provider value={{
      loreItems, nacoes, etnias, magiasEstigmas, boards, isLoading,
      fetchLoreItems, addLoreItem, updateLoreItem, deleteLoreItem,
      addNacao, updateNacao, addEtnia, addMagiaEstigma,
      fetchBoards, addBoard, updateBoardNotes, deleteBoard
    }}>
      {children}
    </LoreContext.Provider>
  );
}

export function useLore() {
  const context = useContext(LoreContext);
  if (!context) throw new Error("useLore deve ser usado dentro de um LoreProvider");
  return context;
}