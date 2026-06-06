// ============================================================
// coletor.js — Robô que busca notícias de feeds RSS do Brasil
// ============================================================
// O que faz: lê vários feeds RSS, extrai título/fonte/link de cada
// notícia e imprime no terminal.
// ============================================================

const RssParser = require('rss-parser')
const parser = new RssParser()

// Lista de feeds RSS de notícias do Brasil
// Fácil de editar: adicione ou remova URLs aqui
const URLS_FEEDS = [
  'https://agenciabrasil.ebc.com.br/rss/ultimasnoticias/feed.xml',
  'https://g1.globo.com/rss/g1/',
  'https://rss.uol.com.br/feed/noticias.xml',
  'https://www.cnnbrasil.com.br/feed/',
  'https://www.r7brasil.com/rss/',
]

// Função que busca UM feed e devolve a lista de notícias dele
async function buscarFeed(url) {
  try {
    const feed = await parser.parseURL(url)
    // Extrai o nome da fonte a partir da URL (ex: "g1.globo.com" → "G1")
    const nomeFonte = new URL(url).hostname.replace('www.', '')
    return feed.items.map(item => ({
      titulo: item.title || 'Sem título',
      link: item.link || '',
      fonte: nomeFonte,
    }))
  } catch (erro) {
    // Se um feed falhar, mostra aviso mas não quebra o script
    console.error(`  ⚠ Erro ao ler ${url}: ${erro.message}`)
    return []
  }
}

// Função principal: busca TODOS os feeds e imprime
async function main() {
  console.log('🔍 Buscando notícias...\n')

  for (const url of URLS_FEEDS) {
    console.log(`📡 ${url}`)
    const noticias = await buscarFeed(url)

    if (noticias.length === 0) {
      console.log('   (nenhuma notícia encontrada)\n')
      continue
    }

    // Mostra cada notícia numerada
    noticias.forEach((n, i) => {
      console.log(`  ${i + 1}. ${n.titulo}`)
      console.log(`     ${n.fonte} — ${n.link}`)
    })
    console.log(`   → ${noticias.length} notícias\n`)
  }

  console.log('✅ Busca concluída!')
}

// Executa o robô
main()
