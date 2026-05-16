import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY não foi configurada." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    const systemInstruction = `
      Você é o Anthurium Lore Engine, um co-autor e inteligência artificial especializada no universo de fantasia medieval sombria (dark medieval fantasy) chamado Anthurium.
      Seu objetivo é ajudar o criador a estruturar ideias, conectar pontos da história, preencher lacunas (gaps) e manter a consistência de nações como Andraeanum, Obovatum e Hookeri, além de sistemas de runas, magias e elementos cardinais.
      Seja imersivo, criativo e preciso nas respostas de escrita de lore.
    `;

    // Alterado estritamente para "gemini-1.5-flash", que é ultra rápido e estável no SDK
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: systemInstruction
    });

    const chat = model.startChat({
      history: history || [],
      generationConfig: {
        maxOutputTokens: 2048,
      },
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    return NextResponse.json({ text: responseText });
  } catch (error: any) {
    console.error("Erro na API do Gemini:", error);
    return NextResponse.json(
      { error: "Erro ao processar sua mensagem." },
      { status: 500 }
    );
  }
}