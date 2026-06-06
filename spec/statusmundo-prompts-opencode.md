# StatusMundo — Pacote de prompts para o OpenCode

Cada fase tem três partes: **Objetivo**, o **Prompt** (copie e cole no OpenCode) e **Como saber que deu certo** (só avance quando isso bater).

---

## Antes de tudo: o arquivo de contexto (AGENTS.md)

O OpenCode lê um arquivo chamado `AGENTS.md` na raiz do projeto e usa como "manual" em toda sessão. Crie esse arquivo **uma vez**, antes da Fase 0, com o conteúdo abaixo. Isso mantém o agente orientado sobre o projeto inteiro e evita que ele invente demais.

> Crie um arquivo `AGENTS.md` na raiz da pasta do projeto e cole isto dentro:

```markdown
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
  "fontes": [ { "nome", "url" } ] }

## Segurança
- A chave da API do Gemini fica numa variável de ambiente GEMINI_API_KEY.
- NUNCA escreva a chave no código nem a envie pro Git. Sempre use .env + .gitignore.

## Como trabalhar comigo
- Sou iniciante em JavaScript. Explique decisões em comentários simples.
- Prefira soluções diretas a "espertas".
- Me avise ANTES de instalar dependências pesadas ou tomar decisões grandes.
- Faça uma coisa de cada vez; não tente adiantar fases futuras.
```

*(Mais pra frente, conforme o código crescer, você pode rodar o comando `/init` no OpenCode pra ele atualizar esse arquivo sozinho.)*

---

## Fase 0 — Colocar um site vazio no ar

**Objetivo:** vencer o deploy logo de cara. Um React "Olá mundo" publicado de graça.

**Prompt:**
```
Crie a estrutura inicial do projeto StatusMundo. Dentro de uma pasta `site`,
monte um app com Vite + React + Tailwind CSS. A página inicial deve mostrar
apenas o título "StatusMundo" centralizado na tela, com fundo escuro e visual
limpo, usando Tailwind. Use a forma de instalação mais atual do Tailwind.

Depois de criar e testar localmente, me dê o passo a passo EXATO (comandos git
e o que eu clico no painel) para publicar isso de graça no Cloudflare Pages
conectando meu repositório do GitHub. Lembre que o app está na subpasta `site`,
então me diga qual "root directory", "build command" e "output directory"
configurar no Cloudflare.

Antes de instalar qualquer coisa, me mostre o plano do que vai fazer.
```

**Como saber que deu certo:** você abre uma URL pública (ex.: `statusmundo.pages.dev`) e vê "StatusMundo" na tela.

---

## Fase 1 — Ler uma fonte de notícias

**Objetivo:** um script Node que lê um feed RSS e imprime os títulos no terminal.

**Prompt:**
```
Crie uma pasta `robo` no projeto. Dentro dela, crie um script Node.js chamado
`coletor.js` que busca um feed RSS de notícias do Brasil e imprime no terminal
o título, a fonte e o link de cada notícia.

Use uma biblioteca simples de RSS (ex.: rss-parser). Use um feed que funcione
de verdade — bons candidatos são a Agência Brasil (conteúdo público, ótimo para
nós) ou o G1; confirme que o feed responde antes de seguir. Adicione um script
no package.json para eu rodar com `npm run coletar`.

Comente o código explicando cada parte, porque sou iniciante.
```

**Como saber que deu certo:** rodar `npm run coletar` e ver uma lista de títulos reais no terminal.

---

## Fase 2 — Várias fontes, normalizar e salvar

**Objetivo:** juntar várias fontes num formato único e gravar um arquivo.

**Prompt:**
```
Expanda o `robo/coletor.js`: leia de 5 a 8 feeds RSS de notícias do Brasil.
Deixe a lista de URLs num array no topo do arquivo, fácil de eu editar.

Junte todas as notícias e normalize cada uma para este formato:
{ titulo, link, fonte, data, trecho }. Remova duplicatas óbvias (mesmo título).
Ordene da mais recente para a mais antiga. Salve o resultado em
`robo/saida/brutos.json`.

Mantenha o código simples e comentado. Trate erros de feeds que não responderem
(não deixe o script quebrar por causa de uma fonte fora do ar).
```

**Como saber que deu certo:** existe um `robo/saida/brutos.json` com notícias de fontes diferentes.

---

## Fase 3 — O site mostra as notícias

**Objetivo:** fechar o ciclo dado → tela (ainda sem mapa, ainda sem IA).

**Prompt:**
```
Copie o `robo/saida/brutos.json` para `site/public/ultimo.json` (por enquanto
manualmente, depois automatizamos). No app React, crie um componente que carrega
`/ultimo.json` com fetch e mostra cada notícia como um card simples: título,
fonte e link clicável que abre em nova aba. Lista vertical, estilizada com
Tailwind, visual limpo e escuro. Mostre um aviso enquanto carrega.

Ainda não faça mapa nem filtros.
```

**Como saber que deu certo:** o site publicado mostra a lista de notícias reais.

---

## Fase 4 — Plugar o cérebro (Gemini)

**Objetivo:** o robô passa a agrupar, resumir e etiquetar com a IA.

**Prompt:**
```
Adicione uma etapa final ao robô (pode ser um arquivo `robo/cerebro.js` chamado
pelo coletor). Depois de coletar e normalizar as notícias, envie-as para a API
do Gemini (modelo gemini-2.5-flash, ou flash-lite se ficar mais barato) usando
a chave que estará na variável de ambiente GEMINI_API_KEY.

Primeiro, me ensine a configurar isso com segurança: crie um `.env` para a chave
local, adicione `.env` no `.gitignore`, e me explique onde eu pego a chave no
Google AI Studio. NUNCA escreva a chave no código.

No prompt enviado ao Gemini, peça para ele, de uma vez só:
1. Agrupar as notícias nos principais acontecimentos do dia (junte o mesmo fato
   que aparece em veículos diferentes).
2. Escrever um resumo NEUTRO e factual de 2 a 4 frases de cada acontecimento,
   em português simples, sem opinião.
3. Classificar cada acontecimento com uma `categoria` e uma lista de `tags`,
   e listar as `entidades` envolvidas e um nível de `importancia` de 1 a 5.
4. Indicar as `fontes` (nome + url) de cada acontecimento.

Peça ao Gemini para responder APENAS em JSON puro (sem texto antes ou depois,
sem ```), seguindo o formato definido no AGENTS.md. Limite a entrada aos ~30
acontecimentos mais relevantes para não estourar o limite gratuito. Trate o caso
de a resposta vir mal-formatada. Salve o resultado em `site/public/ultimo.json`.
```

**Como saber que deu certo:** o `site/public/ultimo.json` agora tem acontecimentos resumidos e etiquetados, e o site mostra os resumos.

---

## Fase 5 — O robô roda sozinho todo dia

**Objetivo:** automatizar a atualização diária, de graça, com GitHub Actions.

**Prompt:**
```
Crie um workflow do GitHub Actions (`.github/workflows/diario.yml`) que roda o
robô uma vez por dia automaticamente (cron) e também possa ser disparado
manualmente pelo painel do GitHub.

O workflow deve: instalar o Node, instalar as dependências do robô, rodar o robô
usando a GEMINI_API_KEY guardada nos Secrets do repositório, e fazer commit do
`site/public/ultimo.json` atualizado de volta no repositório. Como o Cloudflare
Pages reconstrói a cada push, esse commit já atualiza o site.

Me explique, passo a passo, como adicionar a GEMINI_API_KEY nos Secrets do
GitHub. Garanta que o workflow tem permissão de escrita no repositório para
conseguir fazer o commit.
```

**Como saber que deu certo:** você dispara o workflow manualmente, ele roda sem erro, faz um commit novo, e o site atualiza sozinho.

---

## Fase 6 — A parte bonita: mapa, modal e filtros

**Objetivo:** a cara de "joguinho". Faça em duas etapas.

**Prompt 6a (mapa + modal):**
```
Primeiro, leia a estrutura atual do site para entender o que já existe.

Agora adicione um mapa-múndi como tela principal, usando react-simple-maps com
um GeoJSON de países. Visual escuro e bonito, com clima de jogo de estratégia
(tipo Civilization). APENAS o Brasil deve aparecer destacado e clicável; os
outros países ficam apagados e desabilitados.

Ao clicar no Brasil, abra um modal que mostra os acontecimentos do dia (lidos de
`/ultimo.json`) como cards com título, resumo, categoria e fontes. Ordene por
importância. Capriche na animação de abrir o modal.
```

**Prompt 6b (filtros / verticais):**
```
Adicione filtros dentro do modal do Brasil: mostre as categorias e tags
disponíveis como chips clicáveis. Clicar num chip mostra só os acontecimentos
com aquela etiqueta, e dá para combinar vários chips para ir afunilando (ex.:
"saúde" + "SUS"). Inclua um botão para limpar os filtros. Tudo client-side e
instantâneo, sem buscar nada novo.
```

**Como saber que deu certo:** você clica no Brasil no mapa, abre um modal com os resumos do dia, e consegue filtrar por tema.

---

## Fase 7 — Polir

**Objetivo:** deixar redondo e realmente bonito.

**Prompt:**
```
Reveja o site inteiro e adicione os toques finais:
- estado de carregamento, de erro (se o JSON não carregar) e vazio (sem notícias);
- responsividade boa no celular;
- refino visual geral para ficar coeso e bonito.
Além disso, me sugira de 3 a 5 melhorias de design ou de experiência que você
acha que fariam mais diferença no StatusMundo, e me explique o porquê de cada uma.
```

**Como saber que deu certo:** o site está bonito, funciona no celular, e não quebra quando algo dá errado.

---

## Dicas de ouro

1. **Uma fase por vez.** Só passe pro próximo prompt quando o "como saber que deu certo" bater de verdade.
2. **Sessão nova por tarefa.** Comece uma conversa nova no OpenCode a cada fase — ele se concentra melhor.
3. **Se desviar, me chama.** Se o resultado de uma fase sair diferente do que a próxima espera, me manda o que aconteceu e eu ajusto o prompt seguinte.
4. **A chave do Gemini é sagrada.** Nunca deixe ela ir pro GitHub. É o erro número 1 de iniciante (e pode te dar dor de cabeça).
5. **Leia o que o agente escreve.** Mesmo sendo iniciante, passar o olho no código e nos comentários é metade do aprendizado.
