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

interface LoreContextType {
  loreItems: LoreItem[];
  addLoreItem: (item: Omit<LoreItem, "id" | "createdAt">) => void;
}

const LoreContext = createContext<LoreContextType | undefined>(undefined);

export function LoreProvider({ children }: { children: React.ReactNode }) {
  const [loreItems, setLoreItems] = useState<LoreItem[]>([]);

  // Carrega do localStorage para você não perder os dados ao dar F5
  useEffect(() => {
    const saved = localStorage.getItem("anthurium_lore_db");
    if (saved) {
      try {
        setLoreItems(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao carregar o éter local", e);
      }
    }
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

  return (
    <LoreContext.Provider value={{ loreItems, addLoreItem }}>
      {children}
    </LoreContext.Provider>
  );
}

export function useLore() {
  const context = useContext(LoreContext);
  if (!context) throw new Error("useLore deve ser usado dentro de um LoreProvider");
  return context;
}