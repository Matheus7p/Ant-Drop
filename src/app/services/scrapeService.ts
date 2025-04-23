import { getBrowser } from "@/lib/browser";
import { cohere } from "@/lib/cohereClient";
import { IProduct } from "@/types/product";

export async function scrapePageContent(url: string): Promise<string> {
  const browser = await getBrowser();
  const context = await browser.newContext({ userAgent: 'Mozilla/5.0', locale: 'pt-BR' });
  const page = await context.newPage();
  try {
    await page.goto(url, { timeout: 15000, waitUntil: 'domcontentloaded' });
    const content = await page.content();
    return content;
  } catch (error) {
    console.error("Erro ao raspar o conteúdo da página:", error);
    throw new Error("Erro ao raspar o conteúdo da página.");
  } finally {
    await browser.close();
  }
}

export async function extractProductInfo(htmlContent: string, productUrl: string): Promise<IProduct> {
  const prompt = `
  Analise o HTML da página de um produto fornecido abaixo e extraia as seguintes informações, se disponíveis:

  - Nome do produto: Tente identificar o nome principal do produto.
  - Nome da loja: Tente identificar o nome da loja.
  - Preço do produto: Tente encontrar o preço atual do produto.
  - Descrição do produto: Tente encontrar a descrição do produto e encurte ela por favor.
  - URL da imagem do produto: Tente encontrar a URL da imagem principal do produto.
  - Data de entrega (se disponível e em um formato reconhecível como data): Tente encontrar a data estimada de entrega. Se não estiver disponível ou não for claramente uma data, retorne null.
  - URL do produto: ${productUrl}

  Se uma informação específica não estiver claramente presente no HTML, retorne null para esse campo.

  HTML da página:
  ${htmlContent}

  Responda ESTRITAMENTE no seguinte formato JSON. Não inclua nenhuma explicação ou texto adicional antes ou depois do JSON:
  \`\`\`json
  {
    "storeName": "...",
    "productName": "...",
    "description": "...",
    "price": "...",
    "imageUrl": "...",
    "estimatedShipping": "dd/mm/aaaa" ou null,
    "productUrl": "${productUrl}"
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

  const productInfo = JSON.parse(jsonString) as IProduct;
  return productInfo;
  
}