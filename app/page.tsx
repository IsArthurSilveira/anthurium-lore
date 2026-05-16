import Link from "next/link";
import { Sparkles, BookOpen, Scroll } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <div className="p-4 bg-purple-950/30 rounded-full border border-purple-900/50 mb-6 animate-pulse">
        <Scroll className="h-12 w-12 text-purple-400" />
      </div>
      
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-zinc-100 to-zinc-400">
        Anthurium Lore
      </h1>
      <p className="text-zinc-400 mt-4 max-w-xl text-lg leading-relaxed">
        Bem-vindo à Forja do Destino. Organize as crônicas, gerencie runas arcanas e preencha as lacunas históricas das nações de Andraeanum, Obovatum e Hookeri.
      </p>

      <div className="mt-10 flex flex-wrap gap-4 justify-center">
        <Link href="/chat">
          <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-3 rounded-lg transition-all shadow-lg shadow-purple-900/20 cursor-pointer">
            <Sparkles className="h-5 w-5" /> Consultar o Oráculo
          </button>
        </Link>
        <Link href="/editor">
          <button className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-medium px-6 py-3 rounded-lg border border-zinc-800 transition-all cursor-pointer">
            <BookOpen className="h-5 w-5" /> Iniciar Escrita
          </button>
        </Link>
      </div>
    </div>
  );
}