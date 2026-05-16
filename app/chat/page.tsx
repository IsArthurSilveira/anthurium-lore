"use client";

import { useState } from "react";
import { Send, Sparkles, User, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  role: "user" | "model";
  text: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      
      if (data.text) {
        setMessages((prev) => [...prev, { role: "model", text: data.text }]);
      } else {
        setMessages((prev) => [...prev, { role: "model", text: "Erro crônico no grimório da IA." }]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: "model", text: "Falha na conexão com o éter." }]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col max-w-4xl mx-auto bg-zinc-900/40 border border-zinc-800/80 rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 bg-zinc-950/60 p-4 border-b border-zinc-800">
        <div className="p-2 bg-purple-950/50 rounded-lg border border-purple-900/40">
          <Sparkles className="h-5 w-5 text-purple-400" />
        </div>
        <div>
          <h2 className="font-semibold text-zinc-100">Oráculo de Anthurium</h2>
          <p className="text-xs text-zinc-400">Co-autor inteligente do seu universo sombrio</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-2">
            <Bot className="h-10 w-10 text-zinc-600 animate-bounce" />
            <p className="text-zinc-400 font-medium">O Codex está em silêncio.</p>
            <p className="text-xs text-zinc-500 max-w-xs">Pergunte algo sobre as nações, crie ganchos de história ou desenvolva uma runa nova agora.</p>
          </div>
        )}
        
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex gap-4 p-4 rounded-lg border ${
              msg.role === "user"
                ? "bg-zinc-900/60 border-zinc-800 ml-12"
                : "bg-purple-950/10 border-purple-900/30 mr-12"
            }`}
          >
            <div className="mt-0.5">
              {msg.role === "user" ? (
                <User className="h-5 w-5 text-zinc-400" />
              ) : (
                <Bot className="h-5 w-5 text-purple-400" />
              )}
            </div>
            <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="text-xs text-purple-400 animate-pulse flex items-center gap-2">
            <Sparkles className="h-3 w-3" /> O oráculo está consultando as estrelas de Anthurium...
          </div>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="p-4 bg-zinc-950/40 border-t border-zinc-800 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua ideia de lore ou comando..."
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
        />
        <Button type="submit" size="icon" className="bg-purple-600 hover:bg-purple-700 text-white">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}