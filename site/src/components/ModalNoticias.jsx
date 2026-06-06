export default function ModalNoticias({ noticias, aberto, aoFechar }) {
  if (!aberto) return null

  return (
    <>
      {/* Overlay escuro atrás do modal */}
      <div
        className="fixed inset-0 bg-black/70 z-40 transition-opacity"
        onClick={aoFechar}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl">
          {/* Cabeçalho */}
          <div className="flex items-center justify-between p-5 border-b border-gray-700">
            <div>
              <h2 className="text-xl font-bold text-white">🇧🇷 Brasil</h2>
              <p className="text-gray-500 text-sm">
                {noticias.length} acontecimento{noticias.length !== 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={aoFechar}
              className="text-gray-400 hover:text-white text-2xl leading-none p-1"
            >
              ✕
            </button>
          </div>

          {/* Lista de acontecimentos */}
          <div className="p-5 space-y-4">
            {noticias.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Nenhum acontecimento encontrado
              </p>
            ) : (
              noticias.map((n, i) => (
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
                  <span className="inline-block bg-gray-700 text-gray-300 text-xs px-2 py-0.5 rounded mb-2">
                    {n.categoria}
                  </span>

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
