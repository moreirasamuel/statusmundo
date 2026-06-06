import { useState, useEffect } from 'react'

function App() {
  const [noticias, setNoticias] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    fetch('/ultimo.json')
      .then(res => {
        if (!res.ok) throw new Error('Não foi possível carregar as notícias')
        return res.json()
      })
      .then(dados => {
        // Ordena por importância (maior primeiro)
        dados.sort((a, b) => b.importancia - a.importancia)
        setNoticias(dados)
        setCarregando(false)
      })
      .catch(err => {
        setErro(err.message)
        setCarregando(false)
      })
  }, [])

  if (carregando) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-400 text-xl">Carregando notícias...</p>
      </div>
    )
  }

  if (erro) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-red-400 text-xl">{erro}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <header className="border-b border-gray-800 py-6">
        <h1 className="text-3xl font-bold text-white text-center">StatusMundo</h1>
        <p className="text-gray-500 text-center text-sm mt-1">
          {noticias.length} acontecimentos — {new Date().toLocaleDateString('pt-BR')}
        </p>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        {noticias.map((n, i) => (
          <article key={n.id || i} className="bg-gray-900 border border-gray-800 rounded-lg p-5 hover:border-gray-700 transition-colors">
            {/* Cabeçalho: título + importância */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <h2 className="text-white font-semibold text-lg">{n.titulo}</h2>
              <span className={`shrink-0 text-xs font-bold px-2 py-1 rounded ${
                n.importancia >= 4 ? 'bg-red-900 text-red-300' :
                n.importancia >= 2 ? 'bg-yellow-900 text-yellow-300' :
                'bg-gray-700 text-gray-400'
              }`}>
                {n.importancia}/5
              </span>
            </div>

            {/* Categoria */}
            <span className="inline-block bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded mb-2">
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
                  <span key={j} className="bg-gray-800 text-gray-500 text-xs px-2 py-0.5 rounded">
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
        ))}
      </main>
    </div>
  )
}

export default App
