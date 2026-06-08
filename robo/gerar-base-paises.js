// ============================================================
// gerar-base-paises.js — Gera a base de dados de países
// ============================================================
// Pede pro Gemini listar países com nomes em português,
// pessoas famosas, estados/regiões e principais cidades.
// Salva em site/src/data/paises.json
// ============================================================

require('dotenv').config()
const fs = require('fs')
const path = require('path')
const { GoogleGenerativeAI } = require('@google/generative-ai')

const apiKey = process.env.GEMINI_API_KEY
if (!apiKey) {
  console.error('Erro: GEMINI_API_KEY não encontrada')
  process.exit(1)
}

const genAI = new GoogleGenerativeAI(apiKey)

const CAMINHO_SAIDA = path.resolve(__dirname, '..', 'site', 'src', 'data', 'paises.json')

async function main() {
  console.log('🌍 Gerando base de dados de países...')

  // Pede pro Gemini gerar a base completa
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' })

  const prompt = `Gere UM ARQUIVO JSON com dados de países para um filtro de notícias.

Formato EXATO esperado:
{
  "Brasil": {
    "nomePt": "Brasil",
    "codigo": "BR",
    "estados": ["Acre", "Alagoas", ...],
    "cidades": ["São Paulo", "Rio de Janeiro", ...],
    "pessoas": ["Luiz Inácio Lula da Silva", "Jair Bolsonaro", "Neymar", "Anitta", "Fernando Haddad", "Sergio Moro", "Xuxa", "Silvio Santos", "Pelé", "Ayrton Senna", "Caetano Veloso", "Paulo Freire", "Machado de Assis", "Jorge Amado", "Tarsila do Amaral", "Gisele Bündchen", "Rubens Barrichello", "Ronaldinho Gaúcho", "Ratinho Junior", "Eduardo Paes"]
  },
  "United States": { ... }
}

REGRAS:
1. Inclua pelo menos ESTES 30 países: Brasil, Estados Unidos, Reino Unido, França, Alemanha, Japão, China, Rússia, Índia, Canadá, Austrália, Argentina, México, Itália, Espanha, Coreia do Sul, Arábia Saudita, Turquia, Israel, África do Sul, Portugal, Chile, Colômbia, Venezuela, Ucrânia, Suíça, Suécia, Noruega, Países Baixos, Bélgica.

2. Para CADA país inclua:
   - "nomePt": nome em português (ex: "Estados Unidos")
   - "codigo": código ISO de 2 letras (ex: "US", "BR")
   - "estados": lista de TODOS os estados / províncias / regiões (mínimo 5)
   - "cidades": lista de 15 a 30 cidades importantes
   - "pessoas": lista de 20 a 30 pessoas famosas (presidente ou chefe de estado atual + ex-presidentes + artistas + esportistas + influenciadores + cientistas)

3. ATENÇÃO: O nome da CHAVE no JSON é o nome em INGLÊS do país (ex: "Brazil", "United States", "United Kingdom"). O campo "nomePt" é o nome em português.

4. NÃO use \`\`\`markdown. Responda APENAS o JSON puro.

5. Para estados do Brasil, use os 26 estados + DF.
Para estados dos EUA, use todos os 50 estados.
Para outros países, use as principais divisões administrativas.

6. Para pessoas, priorize nomes conhecidos internacionalmente ou relevantes no país.
Pessoas do Brasil: inclua políticos, artistas, cantores, jogadores de futebol, apresentadores.
Pessoas dos EUA: inclua políticos, atores, cantores, bilionários.
E assim para cada país.
`

  const result = await model.generateContent(prompt)
  const texto = result.response.text()

  // Extrai o JSON
  const match = texto.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('Não encontrou JSON na resposta')

  const dados = JSON.parse(match[0])

  // Cria a pasta de saída
  const pastaSaida = path.dirname(CAMINHO_SAIDA)
  if (!fs.existsSync(pastaSaida)) {
    fs.mkdirSync(pastaSaida, { recursive: true })
  }

  fs.writeFileSync(CAMINHO_SAIDA, JSON.stringify(dados, null, 2), 'utf-8')
  console.log(`💾 Salvo em: ${CAMINHO_SAIDA}`)
  console.log(`📊 Países: ${Object.keys(dados).length}`)
  console.log('✅ Base gerada!')
}

main().catch(err => {
  console.error('❌ Erro:', err.message)
  process.exit(1)
})
