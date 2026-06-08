import { useState, useEffect } from 'react'
import MapaMundi from './components/MapaMundi'
import ModalNoticias from './components/ModalNoticias'

function App() {
  const [noticias, setNoticias] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [modalAberto, setModalAberto] = useState(false)
  const [paisSelecionado, setPaisSelecionado] = useState(null)

  useEffect(() => {
    fetch('/ultimo.json')
      .then(res => {
        if (!res.ok) throw new Error('Não foi possível carregar as notícias')
        return res.json()
      })
      .then(dados => {
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
        <p className="text-gray-400 text-xl">Carregando...</p>
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
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Logo / título */}
      <header className="py-6 text-center">
        <h1 className="text-3xl font-bold text-white tracking-wide">StatusMundo</h1>
        <p className="text-gray-500 text-sm mt-1">
          {new Date().toLocaleDateString('pt-BR')}
        </p>
      </header>

      {/* Mapa */}
      <section className="flex-1 flex items-center justify-center px-4">
        <MapaMundi aoClicarPais={(nome) => {
          setPaisSelecionado(nome)
          setModalAberto(true)
        }} />
      </section>

      {/* Rodapé */}
      <footer className="py-4 text-center text-gray-600 text-xs">
        Resumo diário baseado em fontes abertas • {noticias.length} acontecimentos hoje
      </footer>

      {/* Modal */}
      <ModalNoticias
        noticias={noticias}
        aberto={modalAberto}
        aoFechar={() => {
          setModalAberto(false)
          setPaisSelecionado(null)
        }}
        paisSelecionado={paisSelecionado}
      />
    </div>
  )
}

export default App
