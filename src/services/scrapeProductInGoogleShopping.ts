import { getBrowser } from "@/lib/browser";
import { cohere } from "@/lib/cohereClient";
import { IProductBasic } from "@/types/product";
import { generateGoogleSearchUrl } from "@/utils/generateGoogleSearchUrl";

export async function scrapeProductInGoogleShopping(productName: string): Promise<string> {
  const searchUrl = generateGoogleSearchUrl(productName)
  const browser = await getBrowser();
  const context = await browser.newContext({ userAgent: "Mozilla/5.0", locale: "pt-BR" });
  const page = await context.newPage();
  await page.goto(searchUrl, {timeout: 15000, waitUntil: "domcontentloaded" });
  const content = await page.content()

  return content
}


export async function extractProductInGoogleShopping(htmlContent: string, productName: string) {
  const prompt = `
no HTML existem produtos, quero que me retorne 3 produtos relacionados a o seguinte produto ${productName}:

Para cada produto, me retorne as seguintes informações:
- Nome do produto: Tente identificar o nome principal do produto. **Certifique-se de que não haja aspas duplas dentro do nome.**
- Nome da loja: Tente identificar o nome da loja. **Certifique-se de que não haja aspas duplas dentro do nome.**
- Preço do produto: Tente encontrar o preço atual do produto.
- Descrição do produto: Tente encontrar a descrição do produto e encurte ela por favor. **Certifique-se de que não haja aspas duplas dentro da descrição.**
- URL da imagem do produto: Tente encontrar a URL da imagem principal do produto.
- Data de envio (se disponível e em um formato reconhecível como data): Tente encontrar a data estimada de envio. Se não estiver disponível ou não for claramente uma data, retorne null.
- URL do produto: (nesse caso, apenas retorne a url do produto) se possivel

Se uma informação específica não estiver claramente presente no HTML, retorne null para esse campo.

HTML da página:
  ${htmlContent}

  Responda ESTRITAMENTE no seguinte formato JSON. Não inclua nenhuma explicação ou texto adicional antes ou depois do JSON:
\`\`\`json
[
  {
    "storeName": "...",
    "productName": "...",
    "description": "...",
    "price": "...",
    "imageUrl": "...",
    "estimatedShipping": "dd/mm/aaaa" ou null,
    "productUrl": "..."
  },
  ... ( até 3 objetos )
]
\`\`\`
`;

  const chatResponse = await cohere.chat({
    model: "command-a-03-2025",
    messages: [{ role: "user", content: prompt }],
    maxTokens: 1000,
  })

  const cohereContentArray = chatResponse.message?.content;
  
  if(!cohereContentArray || cohereContentArray.length === 0 || typeof cohereContentArray[0]?.text !== 'string' || !cohereContentArray[0].text.trim()) {
    console.error("Conteúdo da resposta da cohere inválido:", cohereContentArray)
    throw new Error("Resposta inválida da API da Cohere: conteudo não é uma string válida ou está vazio")
  }

  const jsonStringWithMarkdown = cohereContentArray[0].text;
  const jsonStringTrimmed = jsonStringWithMarkdown.replace(/```json\n|```/g, '').trim()

  console.log("resposta bruta do cohere ( apos trim):" , jsonStringTrimmed)

  const jsonString = jsonStringTrimmed.replace(/"([^"\\]*)"/g, (match, p1) => `"${p1.replace(/"/g, '\\"')}"`);

  const productInfo = JSON.parse(jsonString) as IProductBasic[];

  return productInfo;

}