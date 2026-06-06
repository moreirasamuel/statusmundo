import { useState, useMemo } from 'react'

export default function ModalNoticias({ noticias, aberto, aoFechar }) {
  // Filtros selecionados (categorias e tags)
  const [filtros, setFiltros] = useState([])

  // NOTA: hooks (useMemo) precisam vir ANTES de qualquer return,
  // senão o React quebra com "hooks chamados condicionalmente"

  // Extrai categorias e tags únicas das notícias
  const categorias = useMemo(() => {
    const set = new Set(noticias.map(n => n.categoria).filter(Boolean))
    return [...set].sort()
  }, [noticias])

  const todasTags = useMemo(() => {
    const set = new Set(noticias.flatMap(n => n.tags || []))
    return [...set].sort()
  }, [noticias])

  // Filtra as notícias com base nos chips selecionados
  const noticiasFiltradas = useMemo(() => {
    if (filtros.length === 0) return noticias
    return noticias.filter(n => {
      const categoria = n.categoria || ''
      const tags = n.tags || []
      // Retorna true se PELO MENOS UM filtro bater com categoria ou tags
      return filtros.some(f =>
        categoria === f || tags.includes(f)
      )
    })
  }, [noticias, filtros])

  // ⬇ Só depois de todos os hooks é que podemos sair mais cedo
  if (!aberto) return null

  // Alterna um filtro (adiciona ou remove)
  function toggleFiltro(valor) {
    setFiltros(prev =>
      prev.includes(valor)
        ? prev.filter(f => f !== valor)
        : [...prev, valor]
    )
  }

  function limparFiltros() {
    setFiltros([])
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/70 z-40 transition-opacity"
        onClick={aoFechar}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl">
          {/* Cabeçalho */}
          <div className="flex items-center justify-between p-5 border-b border-gray-700 shrink-0">
            <div>
              <h2 className="text-xl font-bold text-white">🇧🇷 Brasil</h2>
              <p className="text-gray-500 text-sm">
                {noticiasFiltradas.length} de {noticias.length} acontecimento{noticias.length !== 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={aoFechar}
              className="text-gray-400 hover:text-white text-2xl leading-none p-1"
            >
              ✕
            </button>
          </div>

          {/* Barra de filtros */}
          <div className="p-4 border-b border-gray-700 shrink-0">
            {/* Categorias */}
            {categorias.length > 0 && (
              <div className="mb-2">
                <p className="text-gray-500 text-xs mb-1.5">Categorias</p>
                <div className="flex flex-wrap gap-1.5">
                  {categorias.map(cat => (
                    <button
                      key={cat}
                      onClick={() => toggleFiltro(cat)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                        filtros.includes(cat)
                          ? 'bg-green-800 border-green-600 text-green-200'
                          : 'bg-gray-800 border-gray-600 text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {todasTags.length > 0 && (
              <div className="mb-2">
                <p className="text-gray-500 text-xs mb-1.5">Tags</p>
                <div className="flex flex-wrap gap-1.5">
                  {todasTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleFiltro(tag)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                        filtros.includes(tag)
                          ? 'bg-blue-800 border-blue-600 text-blue-200'
                          : 'bg-gray-800 border-gray-600 text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Botão limpar */}
            {filtros.length > 0 && (
              <button
                onClick={limparFiltros}
                className="text-xs text-gray-500 hover:text-gray-300 mt-1"
              >
                ✕ Limpar filtros
              </button>
            )}
          </div>

          {/* Lista de acontecimentos (rolável) */}
          <div className="p-5 space-y-4 overflow-y-auto">
            {noticiasFiltradas.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Nenhum acontecimento encontrado com esses filtros
              </p>
            ) : (
              noticiasFiltradas.map((n, i) => (
                <article key={n.id || i} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                  {/* Título + importância */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-white font-semibold">{n.titulo}</h3>
                    <span className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded ${
                      n.importancia >= 4 ? 'bg-red-900 text-red-300' :
                      n.importancia >= 2 ? 'bg-yellow-900 text-yellow-300' :
                      'bg-gray-700 text-gray-400'
                    }`}>
                      {n.importancia}/5
                    </span>
                  </div>

                  {/* Categoria */}
                  {n.categoria && (
                    <span className="inline-block bg-gray-700 text-gray-300 text-xs px-2 py-0.5 rounded mb-2">
                      {n.categoria}
                    </span>
                  )}

                  {/* Resumo */}
                  {n.resumo && (
                    <p className="text-gray-400 text-sm mb-3">{n.resumo}</p>
                  )}

                  {/* Tags */}
                  {n.tags && n.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {n.tags.map((tag, j) => (
                        <span key={j} className="bg-gray-700 text-gray-500 text-xs px-2 py-0.5 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Fontes */}
                  {n.fontes && n.fontes.length > 0 && (
                    <div className="flex flex-wrap gap-2 text-sm">
                      {n.fontes.map((f, j) => (
                        <a
                          key={j}
                          href={f.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          {f.nome} →
                        </a>
                      ))}
                    </div>
                  )}
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  )
}
