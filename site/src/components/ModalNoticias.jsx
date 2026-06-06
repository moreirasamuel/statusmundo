import { useState, useMemo } from 'react'

export default function ModalNoticias({ noticias, aberto, aoFechar }) {
  const [filtros, setFiltros] = useState([])
  const [noticiaSelecionada, setNoticiaSelecionada] = useState(null)

  const categorias = useMemo(() => {
    const set = new Set(noticias.map(n => n.categoria).filter(Boolean))
    return [...set].sort()
  }, [noticias])

  const todasTags = useMemo(() => {
    const set = new Set(noticias.flatMap(n => n.tags || []))
    return [...set].sort()
  }, [noticias])

  const noticiasFiltradas = useMemo(() => {
    if (filtros.length === 0) return []
    return noticias.filter(n => {
      const categoria = n.categoria || ''
      const tags = n.tags || []
      return filtros.some(f =>
        categoria === f || tags.includes(f)
      )
    })
  }, [noticias, filtros])

  if (!aberto) return null

  function toggleFiltro(valor) {
    const novos = filtros.includes(valor)
      ? filtros.filter(f => f !== valor)
      : [...filtros, valor]
    setFiltros(novos)
    if (novos.length === 0) setNoticiaSelecionada(null)
  }

  function limparFiltros() {
    setFiltros([])
    setNoticiaSelecionada(null)
  }

  function selecionarNoticia(n) {
    setNoticiaSelecionada(n)
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/70 z-40"
        onClick={aoFechar}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
        <div className="bg-gray-900 border border-gray-700 rounded-2xl w-[1100px] max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">

          {/* Cabeçalho */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700 shrink-0">
            <div>
              <h2 className="text-xl font-bold text-white">🇧🇷 Brasil</h2>
              <p className="text-gray-500 text-sm">
                {filtros.length > 0
                  ? `${noticiasFiltradas.length} de ${noticias.length} acontecimentos`
                  : `${noticias.length} acontecimentos`}
              </p>
            </div>
            <button onClick={aoFechar} className="text-gray-400 hover:text-white text-2xl leading-none p-1">
              ✕
            </button>
          </div>

          {/* 3 colunas */}
          <div className="flex flex-1 min-h-0">

            {/* COLUNA 1 — Filtros */}
            <aside className="w-[220px] shrink-0 overflow-y-auto border-r border-gray-700 p-4 space-y-4">
              {categorias.length > 0 && (
                <div>
                  <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-2">Categorias</p>
                  <div className="space-y-1">
                    {categorias.map(cat => (
                      <button
                        key={cat}
                        onClick={() => toggleFiltro(cat)}
                        className={`block w-full text-left text-xs px-3 py-1.5 rounded-lg transition-colors ${
                          filtros.includes(cat)
                            ? 'bg-green-800 text-green-200'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {todasTags.length > 0 && (
                <div>
                  <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-2">Tags</p>
                  <div className="space-y-1">
                    {todasTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => toggleFiltro(tag)}
                        className={`block w-full text-left text-xs px-3 py-1.5 rounded-lg transition-colors ${
                          filtros.includes(tag)
                            ? 'bg-blue-800 text-blue-200'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {filtros.length > 0 && (
                <button
                  onClick={limparFiltros}
                  className="text-xs text-gray-500 hover:text-gray-300"
                >
                  ✕ Limpar filtros
                </button>
              )}
            </aside>

            {/* COLUNA 2 — Lista de notícias */}
            <section className="flex-1 overflow-y-auto p-4">
              {filtros.length === 0 ? (
                <p className="text-gray-600 text-sm text-center mt-16">
                  Selecione categorias ou tags ao lado para ver as notícias
                </p>
              ) : noticiasFiltradas.length === 0 ? (
                <p className="text-gray-600 text-sm text-center mt-16">
                  Nenhuma notícia encontrada com esses filtros
                </p>
              ) : (
                <div className="space-y-2">
                  {noticiasFiltradas.map((n, i) => {
                    const selecionada = noticiaSelecionada && (noticiaSelecionada.id === n.id || noticiaSelecionada.titulo === n.titulo)
                    return (
                      <button
                        key={n.id || i}
                        onClick={() => selecionarNoticia(n)}
                        className={`w-full text-left p-3 rounded-xl border transition-colors ${
                          selecionada
                            ? 'bg-gray-700 border-gray-500'
                            : 'bg-gray-800 border-gray-700 hover:bg-gray-750'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-white text-sm font-medium leading-snug">{n.titulo}</span>
                          <span className={`shrink-0 text-xs font-bold px-1.5 py-0.5 rounded ${
                            n.importancia >= 4 ? 'bg-red-900 text-red-300' :
                            n.importancia >= 2 ? 'bg-yellow-900 text-yellow-300' :
                            'bg-gray-700 text-gray-400'
                          }`}>
                            {n.importancia}/5
                          </span>
                        </div>
                        <span className="text-gray-500 text-xs mt-1 block">{n.categoria}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </section>

            {/* COLUNA 3 — Detalhe */}
            <aside className="w-[320px] shrink-0 overflow-y-auto border-l border-gray-700 p-4">
              {!noticiaSelecionada ? (
                <p className="text-gray-600 text-sm text-center mt-16">
                  Selecione uma notícia para ver os detalhes
                </p>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-white font-semibold text-lg leading-snug">{noticiaSelecionada.titulo}</h3>

                  <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded ${
                    noticiaSelecionada.importancia >= 4 ? 'bg-red-900 text-red-300' :
                    noticiaSelecionada.importancia >= 2 ? 'bg-yellow-900 text-yellow-300' :
                    'bg-gray-700 text-gray-400'
                  }`}>
                    Importância {noticiaSelecionada.importancia}/5
                  </span>

                  <div>
                    <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-1">Categoria</p>
                    <span className="inline-block bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded">
                      {noticiaSelecionada.categoria}
                    </span>
                  </div>

                  <div>
                    <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-1">Resumo</p>
                    <p className="text-gray-300 text-sm leading-relaxed">{noticiaSelecionada.resumo}</p>
                  </div>

                  {noticiaSelecionada.tags && noticiaSelecionada.tags.length > 0 && (
                    <div>
                      <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-1">Tags</p>
                      <div className="flex flex-wrap gap-1">
                        {noticiaSelecionada.tags.map((tag, j) => (
                          <span key={j} className="bg-gray-800 text-gray-500 text-xs px-2 py-0.5 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {noticiaSelecionada.entidades && noticiaSelecionada.entidades.length > 0 && (
                    <div>
                      <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-1">Entidades</p>
                      <p className="text-gray-400 text-sm">{noticiaSelecionada.entidades.join(', ')}</p>
                    </div>
                  )}

                  {noticiaSelecionada.fontes && noticiaSelecionada.fontes.length > 0 && (
                    <div>
                      <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-1">Fontes</p>
                      <div className="space-y-1">
                        {noticiaSelecionada.fontes.map((f, j) => (
                          <a
                            key={j}
                            href={f.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-blue-400 hover:text-blue-300 text-sm transition-colors"
                          >
                            {f.nome} →
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </aside>

          </div>
        </div>
      </div>
    </>
  )
}
