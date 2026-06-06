import { useState, useEffect } from 'react'

function App() {
  // Estado pra guardar as notícias, o estado de carregamento e erro
  const [noticias, setNoticias] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  // useEffect roda uma vez quando o componente aparece na tela
  useEffect(() => {
    fetch('/ultimo.json')
      .then(res => {
        if (!res.ok) throw new Error('Não foi possível carregar as notícias')
        return res.json()
      })
      .then(dados => {
        setNoticias(dados)
        setCarregando(false)
      })
      .catch(err => {
        setErro(err.message)
        setCarregando(false)
      })
  }, [])

  // Enquanto carrega
  if (carregando) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-400 text-xl">Carregando notícias...</p>
      </div>
    )
  }

  // Se deu erro
  if (erro) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-red-400 text-xl">{erro}</p>
      </div>
    )
  }

  // Mostra a lista de notícias
  return (
    <div className="min-h-screen bg-gray-950">
      <header className="border-b border-gray-800 py-6">
        <h1 className="text-3xl font-bold text-white text-center">StatusMundo</h1>
        <p className="text-gray-500 text-center text-sm mt-1">
          {noticias.length} notícias — {new Date().toLocaleDateString('pt-BR')}
        </p>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        {noticias.map((n, i) => (
          <article key={i} className="bg-gray-900 border border-gray-800 rounded-lg p-5 hover:border-gray-700 transition-colors">
            <h2 className="text-white font-semibold text-lg mb-2">{n.titulo}</h2>
            {n.trecho && (
              <p className="text-gray-400 text-sm mb-3 line-clamp-2">{n.trecho}</p>
            )}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">{n.fonte}</span>
              <a
                href={n.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Ler original →
              </a>
            </div>
          </article>
        ))}
      </main>
    </div>
  )
}

export default App
