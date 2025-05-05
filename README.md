# Ant-Drop

Este é um projeto desenvolvido para auxiliar na avaliação da confiabilidade de produtos utilizando tecnologias modernas como web scraping e processamento de linguagem natural. O sistema faz uso do Playwright para realizar scraping de páginas web, enviando o HTML extraído para a API da Cohere, que analisa e retorna apenas as informações relevantes.

## Tecnologias Utilizadas

* [Next.js](https://nextjs.org/): Framework React para renderização no lado do servidor e geração de sites estáticos.
* [Tailwind CSS](https://tailwindcss.com/): Framework CSS utilitário para estilizações rápidas.
* [Shadcn UI](https://ui.shadcn.com/): Coleção de componentes React acessíveis que você copia e cola, permitindo personalização total.
* [TypeScript](https://www.typescriptlang.org/): Superconjunto de JavaScript com tipagem estática.
* [Playwright](https://playwright.dev/): Ferramenta de automação para browsers.
* [Zod](https://zod.dev/): Biblioteca para validação e definição de esquemas.
* [React Query](https://tanstack.com/query/latest): Biblioteca para busca e gerenciamento de dados no React.
* [Axios](https://axios-http.com/): Cliente HTTP baseado em promessas.
* [Cohere AI](https://cohere.ai/): API para processamento de linguagem natural.

## Como Rodar o Projeto

Siga os passos abaixo para configurar e executar o projeto localmente.

### 1. Clonar o Repositório

```bash
git clone https://github.com/Matheus7p/Ant-Drop.git
cd ant-drop
```

### 2. Instalar Dependências

Instale as dependências do projeto usando npm ou yarn:

```bash
npm install
# ou
yarn install
```

### 3. Configurar Variáveis de Ambiente

Crie um arquivo chamado `.env.local` na raiz do projeto e adicione sua chave API do Cohere:

```env
COHERE_API_KEY=sua-chave-api
```

Para obter sua chave API do Cohere, acesse [Cohere Dashboard](https://cohere.ai/) e siga as instruções para gerar uma chave.

### 4. Executar o Projeto

Inicie o servidor de desenvolvimento com o comando:

```bash
npm run dev
# ou
yarn dev
```

Depois disso, você pode rodar os testes ou realizar o scraping conforme implementado no projeto.

Também é possível realizar o scraping utilizando ferramentas de teste de API. Para isso, envie uma requisição POST para a URL http://localhost:3000/api/scrape com um corpo contendo a URL do produto a ser avaliado. Por exemplo:

```bash
{
   "url": "https://exemplo.com/produto"
}
```
