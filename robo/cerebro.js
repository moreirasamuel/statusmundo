// ============================================================
// cerebro.js — Envia as notícias brutas pro Gemini resumir
// ============================================================
// O que faz:
// 1. Lê o arquivo com as notícias brutas (robo/saida/brutos.json)
// 2. Envia pro Gemini pedindo pra agrupar, resumir e etiquetar
// 3. Salva o resultado em site/public/ultimo.json
// ============================================================

require('dotenv').config()
const fs = require('fs')
const path = require('path')
const { GoogleGenerativeAI } = require('@google/generative-ai')

// Lê a chave da API da variável de ambiente (definida no .env)
const apiKey = process.env.GEMINI_API_KEY
if (!apiKey) {
  console.error('❌ Erro: GEMINI_API_KEY não encontrada. Configure o arquivo .env')
  process.exit(1)
}

const genAI = new GoogleGenerativeAI(apiKey)

// Caminhos dos arquivos
const CAMINHO_ENTRADA = path.resolve(__dirname, 'saida', 'brutos.json')
const CAMINHO_SAIDA = path.resolve(__dirname, '..', 'site', 'public', 'ultimo.json')

// ============================================================
// Lê as notícias brutas do arquivo
// ============================================================
function lerNoticias() {
  if (!fs.existsSync(CAMINHO_ENTRADA)) {
    console.error(`❌ Arquivo não encontrado: ${CAMINHO_ENTRADA}`)
    console.error('   Execute primeiro o coletor.js (npm run coletar)')
    process.exit(1)
  }

  const conteudo = fs.readFileSync(CAMINHO_ENTRADA, 'utf-8')
  return JSON.parse(conteudo)
}

// ============================================================
// Monta o prompt para o Gemini
// ============================================================
function montarPrompt(noticias) {
  // Limita a 30 notícias pra não estourar o limite gratuito
  const topNoticias = noticias.slice(0, 30)

  const textoNoticias = topNoticias.map((n, i) =>
    `${i + 1}. [${n.fonte}] ${n.titulo}\n   Link: ${n.link}\n   Trecho: ${n.trecho || '(sem resumo)'}`
  ).join('\n')

  return `
Você é um analista de notícias brasileiro. Abaixo estão manchetes do dia.

AGRUPE as notícias nos PRINCIPAIS ACONTECIMENTOS do dia (junte o mesmo fato que aparece em veículos diferentes).
Para cada acontecimento, escreva um resumo NEUTRO e factual de 2 a 4 frases, em português simples, sem opinião.
Classifique cada um com:
- categoria (ex: "politica", "economia", "saude", "esportes", "cultura", "meio-ambiente", "internacional", "seguranca", "educacao", "ciencia", "justica")
- tags (lista de palavras-chave)
- entidades (pessoas, órgãos, lugares mencionados)
- importancia (1 a 5, sendo 5 o mais importante)
- fontes (lista com nome e url de cada veículo que noticiou)

RESPONDA APENAS EM JSON PURO, sem texto antes ou depois, sem \`\`\` markdown.

Formato esperado (um array de objetos):
[
  {
    "id": "2026-06-06-titulo-curto",
    "data": "2026-06-06",
    "titulo": "Título do acontecimento",
    "resumo": "Resumo neutro de 2 a 4 frases.",
    "categoria": "politica",
    "tags": ["tag1", "tag2"],
    "entidades": ["Entidade 1", "Entidade 2"],
    "importancia": 4,
    "fontes": [
      { "nome": "G1", "url": "https://..." },
      { "nome": "CNN", "url": "https://..." }
    ]
  }
]

Notícias do dia:
${textoNoticias}
`
}

// ============================================================
// Tenta extrair JSON da resposta do Gemini
// (às vezes ele volta com texto extra ou ``` )
// ============================================================
function extrairJSON(texto) {
  // Tenta achar algo entre [ ] (array JSON)
  const match = texto.match(/\[[\s\S]*\]/)
  if (match) {
    try {
      return JSON.parse(match[0])
    } catch {
      // Se falhou, tenta limpar caracteres especiais
    }
  }

  // Tenta dar parse direto
  try {
    return JSON.parse(texto)
  } catch {
    throw new Error('Não foi possível extrair JSON da resposta do Gemini')
  }
}

// ============================================================
// Tenta gerar conteúdo com um modelo, com retry em caso de erro
// ============================================================
async function gerarComRetry(modelos, prompt, tentativa = 1) {
  if (modelos.length === 0) {
    throw new Error('Todos os modelos falharam')
  }

  const modelo = modelos[0]
  console.log(`🤖 Tentativa ${tentativa} — modelo: ${modelo}...`)

  try {
    const model = genAI.getGenerativeModel({ model: modelo })
    const result = await model.generateContent(prompt)
    return result.response.text()
  } catch (erro) {
    const msg = erro.message || ''
    // Se for 429 (cota) ou 503 (sobrecarga), espera e tenta de novo
    if (msg.includes('429') || msg.includes('503') || msg.includes('quota') || msg.includes('high demand')) {
      const espera = Math.min(5000 * tentativa, 30000) // espera 5s, 10s, 15s...
      console.log(`   ⏳ Limite atingido. Aguardando ${espera / 1000}s...`)
      await new Promise(r => setTimeout(r, espera))
      return gerarComRetry(modelos, prompt, tentativa + 1)
    }
    // Se for 404 (modelo não existe), tenta próximo modelo
    if (msg.includes('404') || msg.includes('not found')) {
      console.log(`   ⚠ Modelo ${modelo} não disponível, tentando próximo...`)
      return gerarComRetry(modelos.slice(1), prompt, tentativa + 1)
    }
    // Outro erro, tenta próximo modelo
    console.log(`   ⚠ Erro no modelo ${modelo}: ${erro.message}`)
    return gerarComRetry(modelos.slice(1), prompt, tentativa + 1)
  }
}

// ============================================================
// FUNÇÃO PRINCIPAL
// ============================================================
async function main() {
  console.log('🧠 Lendo notícias brutas...')
  const noticias = lerNoticias()
  console.log(`   → ${noticias.length} notícias carregadas`)

  const prompt = montarPrompt(noticias)

  // Lista de modelos pra tentar em ordem (se um falhar, tenta o próximo)
  const modelos = ['gemini-2.5-flash-lite', 'gemini-2.5-flash', 'gemini-2.0-flash']
  const resposta = await gerarComRetry(modelos, prompt)

  console.log('📝 Processando resposta...')
  const acontecimentos = extrairJSON(resposta)

  if (!Array.isArray(acontecimentos) || acontecimentos.length === 0) {
    throw new Error('Resposta veio vazia ou em formato inesperado')
  }

  console.log(`   → ${acontecimentos.length} acontecimentos identificados`)

  // Garante que a pasta de saída existe
  const pastaSaida = path.dirname(CAMINHO_SAIDA)
  if (!fs.existsSync(pastaSaida)) {
    fs.mkdirSync(pastaSaida, { recursive: true })
  }

  // Salva o resultado
  fs.writeFileSync(CAMINHO_SAIDA, JSON.stringify(acontecimentos, null, 2), 'utf-8')
  console.log(`💾 Salvo em: ${CAMINHO_SAIDA}`)
  console.log('✅ Processamento concluído!')
}

main().catch(erro => {
  console.error('❌ Erro ao processar com Gemini:', erro.message)
  process.exit(1)
})

main()
