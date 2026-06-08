# StatusMundo

## O que é
Site que mostra um resumo diário das notícias do Brasil em um mapa-múndi
interativo. O usuário clica no Brasil e vê os principais acontecimentos do dia,
resumidos de forma neutra, e pode filtrar por tema.

## Arquitetura (IMPORTANTE)
- NÃO existe servidor backend nem banco de dados.
- O site é estático (React) e só LÊ arquivos JSON prontos.
- Um robô (script Node.js) roda 1x por dia, busca notícias de fontes grátis,
  manda pro Gemini resumir/agrupar/etiquetar, e salva um JSON.
- Tudo precisa caber em camadas GRATUITAS. Custo zero é uma regra absoluta.

## Estrutura de pastas
- `/site`  → app React (Vite + Tailwind). É o que vai pro ar no Cloudflare Pages.
- `/robo`  → script Node.js que coleta e processa as notícias.
- O robô salva o resultado final em `/site/public/ultimo.json`.
  O site lê esse arquivo com fetch('/ultimo.json').

## Formato dos dados (cada acontecimento)
{ "id", "data", "titulo", "resumo", "categoria",
  "tags": [], "entidades": [], "importancia": 1-5,
  "pessoas": [], "estados": [], "cidades": [], "paises": [],
  "fontes": [ { "nome", "url" } ] }

## Segurança
- A chave da API do Gemini fica numa variável de ambiente GEMINI_API_KEY.
- NUNCA escreva a chave no código nem a envie pro Git. Sempre use .env + .gitignore.

## Como trabalhar comigo
- Sou iniciante em JavaScript. Explique decisões em comentários simples.
- Prefira soluções diretas a "espertas".
- Me avise ANTES de instalar dependências pesadas ou tomar decisões grandes.
- Faça uma coisa de cada vez; não tente adiantar fases futuras.