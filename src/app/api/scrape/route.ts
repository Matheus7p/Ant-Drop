import { scrapePageContent, extractProductInfo } from "@/app/services/scrapeService";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url || !url.startsWith("http")) {
      return NextResponse.json({ error: "URL inválida" }, { status: 400 });
    }

    const htmlContent = await scrapePageContent(url);
    const productInfo = await extractProductInfo(htmlContent, url);

    return NextResponse.json({ success: true, data: productInfo });
  } catch (error) {
    console.error("Erro na rota scrape:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}