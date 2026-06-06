# Arquitetura do MVP — Mapa de Notícias (Brasil)

> Documento-guia para desenvolvimento solo. Pensado para um dev aprendendo JavaScript, com restrição de **custo zero** (criar e manter), **atualização diária** e **só texto**.

---

## 1. A ideia central que faz custar R$ 0

A decisão mais importante de toda a arquitetura é mental, não técnica:

**Você NÃO vai construir "um app com servidor e banco de dados".
Você vai construir "um site estático que um robô regenera 1x por dia".**

Separe duas coisas que normalmente andam juntas:

- **Processamento** (caro e complexo): acontece 1x por dia, dentro de um robô automático.
- **Exibição** (barata): o site é só um monte de arquivos prontos que o navegador lê.

Por que isso zera o custo:

- Sem servidor rodando 24h por visitante → hospedagem de site estático é grátis.
- Sem banco de dados pra manter → os dados são só arquivos JSON.
- O custo de LLM fica preso a **um lote por dia** → cabe folgado no tier gratuito.

O preço disso é que os dados não são "ao vivo" — são de até 24h atrás. Para o seu caso (resumo diário), isso é exatamente o que você quer.

---

## 2. As 3 peças do sistema

```
  [ FONTES GRÁTIS ]                    
   RSS, GDELT, APIs                    
   de dados abertos                    
        │                              
        ▼                              
  ┌─────────────┐   gera    ┌──────────────┐   lê    ┌─────────────┐
  │  O ROBÔ     │ ────────▶ │  OS DADOS    │ ──────▶ │   O SITE    │
  │ (Node.js,   │           │ (arquivos    │         │ (React,     │
  │  1x por dia)│           │  JSON)       │         │  estático)  │
  └─────────────┘           └──────────────┘         └─────────────┘
   roda no GitHub            versionados no            hospedado de
   Actions (cron)            repositório               graça
```

**1. O Robô** — um script Node.js que busca as notícias, manda pro LLM resumir e salva o resultado. Roda sozinho 1x por dia.

**2. Os Dados** — arquivos JSON gerados pelo robô. No MVP, **não há banco de dados.**

**3. O Site** — uma página React que lê esses JSON e desenha o mapa, os modais e os filtros. Não "pensa" nada por visitante; só mostra o que o robô já preparou.

---

## 3. O que o Robô faz (passo a passo)

1. **Buscar** — baixa notícias das fontes grátis (feeds RSS, GDELT, APIs do governo).
2. **Normalizar** — converte tudo pra um formato único: título, link, fonte, data, trecho.
3. **Agrupar + Resumir + Etiquetar** — manda o conjunto pro LLM e pede pra ele identificar os principais acontecimentos do dia, escrever um resumo neutro de cada um, e marcar categoria + tags. (Ver o atalho esperto na seção 8.)
4. **Salvar** — grava o resultado como JSON.
5. **Publicar** — faz commit/deploy pra o site novo entrar no ar.

---

## 4. Stack recomendada

Tudo em JavaScript, pra alinhar com o que você está aprendendo, e tudo em camada gratuita.

| Camada | Escolha | Por quê |
|---|---|---|
| Linguagem | **JavaScript / Node.js** | Uma linguagem só pro projeto inteiro. |
| Site (frontend) | **React + Vite** | Padrão de mercado, comunidade gigante, ótimo pra aprender. |
| Estilo | **Tailwind CSS** | Faz UI bonita rápido sem virar especialista em CSS. |
| Mapa | **react-simple-maps** (usa GeoJSON/SVG) | Mapa vetorial leve e clicável. |
| Robô (processamento) | **Script Node.js** | Mesmo idioma do resto. |
| Agendamento | **GitHub Actions (cron)** | Roda o robô 1x/dia de graça. |
| Hospedagem | **Cloudflare Pages** (ou Netlify/Vercel) | Site estático grátis, com deploy automático. |
| Cérebro (LLM) | **Gemini (tier grátis)**, Groq como backup | Resumo diário dentro do limite gratuito. |
| Armazenamento | **Arquivos JSON no repositório** | Sem banco no MVP. Simples e grátis. |

> Lembrete: a IA do OpenCode é pra você *programar*. O **LLM acima** é o que o app usa pra resumir — precisa de uma chave de API própria (gratuita).

---

## 5. A forma dos dados (o JSON)

Definir isso cedo te dá um "alvo" claro pra mirar. Cada acontecimento do dia vira um objeto assim:

```json
{
  "id": "2026-06-05-reforma-sus",
  "data": "2026-06-05",
  "titulo": "Governo anuncia mudança no financiamento do SUS",
  "resumo": "Resumo neutro de 2 a 4 frases explicando o que aconteceu, de forma simples.",
  "categoria": "saude",
  "tags": ["sus", "saude", "orcamento"],
  "entidades": ["Ministério da Saúde", "SUS"],
  "importancia": 4,
  "fontes": [
    { "nome": "Agência Brasil", "url": "https://..." },
    { "nome": "G1", "url": "https://..." }
  ]
}
```

Organização dos arquivos (sugestão):

```
/dados
  /2026-06-05.json     ← todos os acontecimentos do dia
  /2026-06-04.json
  /ultimo.json         ← cópia do dia mais recente (o site lê este)
```

`categoria`, `tags` e `entidades` são o que torna o filtro inteligente possível (próxima seção).
`fontes` é o que te mantém honesto e fora de problema com direito autoral: você **resume e linka**, nunca copia a matéria inteira.

---

## 6. As "verticais" = filtro inteligente

A sua ideia de "quero só o que tá acontecendo no SUS" ou "só nessa lei" **não exige nada de infra nova**. Funciona assim:

1. O LLM já marcou cada acontecimento com `categoria`, `tags` e `entidades` quando resumiu.
2. O site carrega o JSON do dia.
3. Quando você clica em "Saúde" ou digita "SUS", o site **filtra a lista que já está na memória** — sem ir buscar nada, instantâneo.

É como um filtro de loja online: os produtos (acontecimentos) já vêm etiquetados, e clicar numa etiqueta esconde o resto. Aprofundar = ir empilhando filtros (ex.: `saude` → `sus` → `orçamento`).

*(Busca por significado, tipo "me mostra tudo parecido com isso", é mais avançado e fica pra depois — exige "embeddings". No MVP, filtro por etiqueta resolve.)*

---

## 7. Escopo do MVP — o que entra e o que NÃO entra

**Entra:**
- Apenas **Brasil**.
- **Resumo diário neutro** (só informar, sem opinião).
- 5 a 10 fontes grátis (RSS + dados abertos).
- Mapa clicável → modal com os acontecimentos do dia.
- Filtro por categoria/tema.

**Fica para depois (v2+):**
- A análise de **"quem se beneficia"** (é a parte mais arriscada — jurídico e viés; melhor entrar depois, com cuidado).
- **Cruzar países** (Brasil × Espanha).
- Vídeo, tempo real, busca semântica, histórico longo, login de usuário.

---

## 8. Seu roteiro de construção (a ordem importa)

A UI bonita é o que mais te empolga, mas é a **última** fase. Construa primeiro as partes difíceis e arriscadas (de onde vêm os dados, o robô, o agendamento). Um site lindo sem dados não serve pra nada; dados bons num site feio já são úteis.

- **Fase 0 — Vença o deploy cedo.** Coloque um "Olá mundo" em React no ar (Cloudflare Pages). Sentir que algo seu está publicado tira metade da ansiedade.
- **Fase 1 — Leia 1 fonte.** Script Node que lê **um** feed RSS e imprime os títulos no terminal.
- **Fase 2 — Leia várias e salve.** Junte 5–10 fontes, normalize pro formato da seção 5, salve um `JSON`.
- **Fase 3 — Mostre no site.** Faça o site React ler esse JSON e exibir uma lista simples. (Aqui o ciclo já fecha: dado → tela.)
- **Fase 4 — Adicione o cérebro.** Plugue o LLM no robô pra agrupar, resumir e etiquetar.
  - *Atalho esperto:* em vez de programar "clusterização" do zero, mande as manchetes do dia pro Gemini (que aguenta 1 milhão de tokens) com um pedido tipo: *"agrupe nos principais acontecimentos, escreva um resumo neutro de cada um, e devolva categoria + tags em JSON"*. Ele faz agrupar + resumir + etiquetar de uma vez.
- **Fase 5 — Automatize.** Configure o GitHub Actions pra rodar o robô 1x/dia sozinho.
- **Fase 6 — A parte bonita.** Agora sim: mapa, modal, filtros, animações, capricho na UI estilo "joguinho".
- **Fase 7 — Polir.** Estados de carregamento, vazio, erro; deixar redondo.

---

## 9. Pontos de atenção (onde costuma doer)

- **Limite do LLM grátis.** Não resuma 500 notícias por dia. Pegue os **principais acontecimentos** (top 20–40). Isso mantém você no tier gratuito e melhora a qualidade.
- **Direito autoral.** Resuma com suas palavras (as do LLM) e **sempre** mostre a fonte com link. Nunca republique a matéria inteira. Esse é o limite entre "produto legal" e "problema jurídico".
- **Agrupar notícias é o "difícil escondido".** O mesmo fato aparece em 10 veículos. O atalho da Fase 4 (deixar o LLM agrupar) resolve no MVP. Agrupamento dedicado (com embeddings) é otimização futura.
- **Sem garantia no tier grátis.** O robô pode falhar às vezes. Programe pra **tentar de novo** e pra o site continuar mostrando o último dia que deu certo.
- **Qualidade/viés do resumo.** Peça explicitamente ao LLM um tom **neutro e factual**, e teste lendo as saídas no começo. IA inventa com confiança — confira antes de confiar.
- **Mapa-múndi com 1 país só.** Visualmente estranho. Veja a decisão abaixo.

---

## 10. Decisões que eu preciso de você (pra fechar os detalhes)

1. **O mapa no MVP.** Sua visão é um mapa-múndi, mas com só o Brasil ele fica vazio. Duas opções:
   - (a) **Mapa-múndi** com só o Brasil "aceso/clicável" — respeita a visão e já deixa pronto pra expandir.
   - (b) **Zoom no Brasil** com os estados clicáveis — mais útil agora, com só um país.
2. **Nome do projeto.** Tem algum em mente? (ajuda a nomear repositório, pastas, etc.)
3. **LLM.** Topa usar o Gemini (tier grátis)? Vai precisar criar uma conta no Google AI Studio e gerar uma chave de API — separada do seu OpenCode.

Me responde essas três e eu ajusto o que precisar e a gente parte pra primeira fase.
