import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { LoreProvider } from "@/context/LoreContext"; // Importe aqui

const geistSans = Geist({ variable: "--font-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Anthurium Lore",
  description: "Ferramenta de gerenciamento e co-criação de Lore Dark Fantasy",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-950 text-zinc-50 flex h-screen overflow-hidden`}>
        <LoreProvider> {/* Envolva aqui */}
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-8 bg-[#09090b]">
            {children}
          </main>
        </LoreProvider>
      </body>
    </html>
  );
}