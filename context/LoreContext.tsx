"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

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
  loreItems: LoreItem[];
  addLoreItem: (item: Omit<LoreItem, "id" | "createdAt">) => void;
  boards: Board[];
  addBoard: (name: string) => void;
  updateBoardNotes: (boardId: string, notes: WhiteboardNote[]) => void;
  deleteBoard: (boardId: string) => void;
}

const LoreContext = createContext<LoreContextType | undefined>(undefined);

export function LoreProvider({ children }: { children: React.ReactNode }) {
  const [loreItems, setLoreItems] = useState<LoreItem[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);

  // Carrega os dados do localStorage ao iniciar
  useEffect(() => {
    const savedLore = localStorage.getItem("anthurium_lore_db");
    if (savedLore) setLoreItems(JSON.parse(savedLore));

    const savedBoards = localStorage.getItem("anthurium_boards_db");
    if (savedBoards) setBoards(JSON.parse(savedBoards));
  }, []);

  const addLoreItem = (newItem: Omit<LoreItem, "id" | "createdAt">) => {
    const item: LoreItem = {
      ...newItem,
      id: crypto.randomUUID(),
      createdAt: new Date().toLocaleDateString("pt-BR"),
    };
    const updated = [item, ...loreItems];
    setLoreItems(updated);
    localStorage.setItem("anthurium_lore_db", JSON.stringify(updated));
  };

  // Funções do Quadro Branco (Miro)
  const addBoard = (name: string) => {
    const newBoard: Board = {
      id: crypto.randomUUID(),
      name,
      notes: [],
      createdAt: new Date().toLocaleDateString("pt-BR"),
    };
    const updated = [newBoard, ...boards];
    setBoards(updated);
    localStorage.setItem("anthurium_boards_db", JSON.stringify(updated));
  };

  const updateBoardNotes = (boardId: string, updatedNotes: WhiteboardNote[]) => {
    const updatedBoards = boards.map((b) =>
      b.id === boardId ? { ...b, notes: updatedNotes } : b
    );
    setBoards(updatedBoards);
    localStorage.setItem("anthurium_boards_db", JSON.stringify(updatedBoards));
  };

  const deleteBoard = (boardId: string) => {
    const updated = boards.filter((b) => b.id !== boardId);
    setBoards(updated);
    localStorage.setItem("anthurium_boards_db", JSON.stringify(updated));
  };

  return (
    <LoreContext.Provider value={{ loreItems, addLoreItem, boards, addBoard, updateBoardNotes, deleteBoard }}>
      {children}
    </LoreContext.Provider>
  );
}

export function useLore() {
  const context = useContext(LoreContext);
  if (!context) throw new Error("useLore deve ser usado dentro de um LoreProvider");
  return context;
}