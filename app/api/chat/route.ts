import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const GEMINI_MODEL = "gemini-2.5-flash";
const SYSTEM_INSTRUCTION = `
  Você é o Anthurium Lore Engine, um co-autor e inteligência artificial especializada no universo de fantasia medieval sombria (dark medieval fantasy) chamado Anthurium.
  Seu objetivo é ajudar o criador a estruturar ideias, conectar pontos da história, preencher lacunas (gaps) e manter a consistência de nações como Andraeanum, Obovatum e Hookeri, além de sistemas de runas, magias e elementos cardinais.
  Seja imersivo, criativo e preciso nas respostas de escrita de lore.
`;

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY não foi configurada." },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey,
      apiVersion: "v1",
    });

    const generationConfig = {
      system_instruction: SYSTEM_INSTRUCTION,
      maxOutputTokens: 2048,
    } as any;

    const result = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: message,
      config: generationConfig,
    });

    const responseText = result.text ?? "";

    return NextResponse.json({ text: responseText });
  } catch (error: any) {
    console.error("Erro na API do Gemini:", error);
    return NextResponse.json(
      { error: "Erro ao processar sua mensagem." },
      { status: 500 }
    );
  }
}