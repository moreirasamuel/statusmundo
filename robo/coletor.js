// ============================================================
// coletor.js — Robô que busca notícias de feeds RSS do Brasil
// ============================================================
// O que faz:
// 1. Lê vários feeds RSS de notícias do Brasil
// 2. Normaliza cada notícia num formato único
// 3. Remove duplicatas (mesmo título)
// 4. Ordena da mais recente pra mais antiga
// 5. Salva em robo/saida/brutos.json
// ============================================================

const fs = require('fs')
const path = require('path')
const RssParser = require('rss-parser')
const parser = new RssParser()

// ============================================================
// LISTA DE FONTES
// Edite aqui: adicione ou remova URLs de feeds RSS
// ============================================================
const URLS_FEEDS = [
  'https://agenciabrasil.ebc.com.br/rss/ultimasnoticias/feed.xml',
  'https://g1.globo.com/rss/g1/',
  'https://www.cnnbrasil.com.br/feed/',
  'https://feeds.folha.uol.com.br/emcimadahora/rss.xml',
  'https://www.estadao.com.br/feed/',
]

// ============================================================
// busca UM feed e devolve as notícias num formato único
// ============================================================
async function buscarFeed(url) {
  try {
    const feed = await parser.parseURL(url)

    // Extrai o nome da fonte da URL (ex: "g1.globo.com" → "G1")
    const nomeFonte = new URL(url).hostname
      .replace('www.', '')
      .replace('.com.br', '')
      .replace('.globo', '')

    return feed.items.map(item => ({
      titulo: (item.title || '').trim(),
      link: item.link || '',
      fonte: nomeFonte,
      data: item.isoDate || item.pubDate || '',
      trecho: (item.contentSnippet || item.content || '')
        .replace(/<[^>]+>/g, '') // remove HTML se houver
        .trim()
        .substring(0, 300),     // limita a 300 caracteres
    }))
  } catch (erro) {
    // Se um feed falhar, mostra aviso mas não quebra o script
    console.error(`  ⚠ Erro ao ler ${url}: ${erro.message}`)
    return []
  }
}

// ============================================================
// Remove notícias duplicadas (mesmo título, ignorando maiúsculas)
// ============================================================
function removerDuplicatas(lista) {
  const vistos = new Set()
  return lista.filter(item => {
    const chave = item.titulo.toLowerCase().trim()
    if (vistos.has(chave)) return false
    vistos.add(chave)
    return true
  })
}

// ============================================================
// FUNÇÃO PRINCIPAL
// ============================================================
async function main() {
  console.log('🔍 Buscando notícias...\n')

  // Junta todas as notícias de todos os feeds
  let todas = []
  for (const url of URLS_FEEDS) {
    console.log(`📡 ${url}`)
    const noticias = await buscarFeed(url)
    console.log(`   → ${noticias.length} notícias`)
    todas = todas.concat(noticias)
  }

  console.log(`\n📊 Total bruto: ${todas.length} notícias`)

  // Remove duplicatas
  const semDuplicatas = removerDuplicatas(todas)
  console.log(`🗑️  Duplicatas removidas: ${todas.length - semDuplicatas.length}`)
  console.log(`📋 Total único: ${semDuplicatas.length} notícias`)

  // Ordena da mais recente para a mais antiga
  // Se não tiver data, coloca no final
  semDuplicatas.sort((a, b) => {
    const da = a.data ? new Date(a.data) : new Date(0)
    const db = b.data ? new Date(b.data) : new Date(0)
    return db - da
  })

  // Cria a pasta de saída se não existir
  const pastaSaida = path.resolve(__dirname, 'saida')
  if (!fs.existsSync(pastaSaida)) {
    fs.mkdirSync(pastaSaida, { recursive: true })
  }

  // Salva o arquivo JSON
  const caminhoArquivo = path.join(pastaSaida, 'brutos.json')
  fs.writeFileSync(caminhoArquivo, JSON.stringify(semDuplicatas, null, 2), 'utf-8')
  console.log(`\n💾 Salvo em: ${caminhoArquivo}`)
  console.log('✅ Busca concluída!')
}

// Executa o robô
main()
