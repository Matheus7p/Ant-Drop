import { NextRequest, NextResponse } from "next/server";
import { chromium } from "playwright";
import { CohereClientV2 } from "cohere-ai";

const co = new CohereClientV2({ token: process.env.COHERE_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || !url.startsWith("http")) {
      return NextResponse.json({ error: "URL inválida." }, { status: 400 });
    }

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      locale: "pt-BR",
    });
    const page = await context.newPage();

    await page.goto(url, {
      timeout: 30000,
      waitUntil: "domcontentloaded",
    });

    const bodyContent = await page.content();
    await browser.close();

    const prompt = `
      Extraia as seguintes informações do HTML abaixo:
      - Nome do produto
      - Nome da loja
      - Preço do produto
      - URL da imagem do produto
      - Data de entrega (se disponível, se a data de entrega nn for uma data ex ( dd/mm/aaa) não retorne ela)
      - URL do produto (use o link fornecido)
      
      HTML da página:
      ${bodyContent}

      Responda no formato JSON:
      {
        "productName": "...",
        "storeName": "...",
        "price": "...",
        "imageUrl": "...",
        "estimatedShipping": "...",
        "sourceUrl": "${url}"
      }
    `;

    const chatResponse = await co.chat({
      model: "command-a-03-2025",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      maxTokens: 500,
    });

    const responseContent = chatResponse.message.content;
    let extractedData = {};

    try {
      if (responseContent && Array.isArray(responseContent)) {
        const rawText = responseContent.map((item) => item.text).join("");
        const jsonString = rawText.replace(/```json|```/g, "").trim();
        if (jsonString.startsWith("{") && jsonString.endsWith("}")) {
          extractedData = JSON.parse(jsonString);
        } else {
          console.error("Conteúdo inesperado:", rawText);
        }
      } else {
        console.error("Conteúdo da resposta não é um array esperado.");
      }
    } catch (err) {
      console.error("Erro ao parsear a resposta JSON:", err);
    }

    return NextResponse.json({
      success: true,
      data: extractedData,
    });
  } catch (error) {
    console.error("Erro ao acessar página:", error);
    return NextResponse.json({ error: "Falha ao acessar a página." }, { status: 500 });
  }
}
