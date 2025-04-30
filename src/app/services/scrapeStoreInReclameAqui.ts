import { getBrowser } from "@/lib/browser";
import { cohere } from "@/lib/cohereClient";
import { IReclameAquiInfo } from "@/types/reclameAqui";

export async function scrapeReclameAquiContent(storeName: string): Promise<string> {
  const searchUrl = `https://www.reclameaqui.com.br/empresa/${storeName.toLowerCase().replace(/\s+/g, "-")}`;
  const browser = await getBrowser();
  const context = await browser.newContext({ userAgent: 'Mozilla/5.0', locale: 'pt-BR' });
  const page = await context.newPage();
  await page.goto(searchUrl, { timeout: 15000, waitUntil: 'domcontentloaded' });
  const content = await page.content();

  return content;
}

export async function extractReclameAquiInfo(htmlContent: string): Promise<IReclameAquiInfo> {
  const prompt = `
  Analise o HTML da página do Reclame Aqui fornecido abaixo e extraia as seguintes informações, se disponíveis:

  - Reputação da loja: Indique se é "Ótima", "Boa", "Regular", "Ruim" ou "Péssima".
  - Número de reclamações nos últimos 12 meses.
  - Percentual de reclamações respondidas.
  - Percentual de clientes que voltariam a fazer negócio.
  - Exemplos de últimas reclamações (título, texto e data de postagem).

  Se uma informação específica não estiver claramente presente no HTML, retorne null para esse campo.

  HTML da página:
  ${htmlContent}

  Responda ESTRITAMENTE no seguinte formato JSON. Não inclua nenhuma explicação ou texto adicional antes ou depois do JSON:
  \`\`\`json
  {
    "reputation": "...",
    "complaintsLast12Months": "...",
    "responseRate": "...",
    "customersWouldReturn": "...",
    "latestComplaints": [
      { "title": "...", "text": "...", "date": "dd/mm/aaaa" },
      { "title": "...", "text": "...", "date": "dd/mm/aaaa" }
    ]
  }
  \`\`\`
`;

  const chatResponse = await cohere.chat({
    model: "command-a-03-2025",
    messages: [{ role: "user", content: prompt }],
    maxTokens: 500,
  });

  const cohereContentArray = chatResponse.message?.content;

  if (!Array.isArray(cohereContentArray) || cohereContentArray.length === 0 || typeof cohereContentArray[0]?.text !== 'string' || !cohereContentArray[0].text.trim()) {
    console.error('Conteúdo da resposta da Cohere inválido:', cohereContentArray);
    throw new Error("Resposta inválida da API da Cohere: conteúdo não é uma string válida ou está vazio.");
  }

  const jsonStringWithMarkdown = cohereContentArray[0].text;
  const jsonString = jsonStringWithMarkdown.replace(/```json\n|```/g, '').trim();

  const reclameAquiInfo = JSON.parse(jsonString);
  return reclameAquiInfo;
}
