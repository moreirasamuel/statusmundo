import { useState, useMemo } from 'react'
import SelectAutocomplete from './SelectAutocomplete'

const ESTADOS_BR = [
  'Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará',
  'Distrito Federal', 'Espírito Santo', 'Goiás', 'Maranhão',
  'Mato Grosso', 'Mato Grosso do Sul', 'Minas Gerais', 'Pará',
  'Paraíba', 'Paraná', 'Pernambuco', 'Piauí', 'Rio de Janeiro',
  'Rio Grande do Norte', 'Rio Grande do Sul', 'Rondônia', 'Roraima',
  'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins'
]

const RISCOS = [
  { valor: 1, rotulo: 'Baixo (1)' },
  { valor: 2, rotulo: 'Moderado (2)' },
  { valor: 3, rotulo: 'Importante (3)' },
  { valor: 4, rotulo: 'Crucial (4)' },
  { valor: 5, rotulo: 'Risco Máximo (5)' },
]

export default function ModalNoticias({ noticias, aberto, aoFechar, paisSelecionado }) {
  const [categoriaFiltro, setCategoriaFiltro] = useState(null)
  const [pessoaFiltro, setPessoaFiltro] = useState(null)
  const [estadoFiltro, setEstadoFiltro] = useState(null)
  const [cidadeFiltro, setCidadeFiltro] = useState(null)
  const [riscoFiltro, setRiscoFiltro] = useState(null)
  const [noticiaSelecionada, setNoticiaSelecionada] = useState(null)

  const categorias = useMemo(() => {
    const set = new Set(noticias.map(n => n.categoria).filter(Boolean))
    return [...set].sort()
  }, [noticias])

  const pessoas = useMemo(() => {
    const set = new Set(noticias.flatMap(n => n.pessoas || n.entidades || []))
    return [...set].sort()
  }, [noticias])

  const estados = useMemo(() => {
    const set = new Set(noticias.flatMap(n => {
      if (n.estados && n.estados.length > 0) return n.estados
      const candidatos = [...(n.entidades || []), ...(n.tags || [])]
      return candidatos.filter(c => ESTADOS_BR.includes(c))
    }))
    return [...set].sort()
  }, [noticias])

  const cidades = useMemo(() => {
    const set = new Set(noticias.flatMap(n => n.cidades || []))
    return [...set].sort()
  }, [noticias])

  const noticiasFiltradas = useMemo(() => {
    return noticias.filter(n => {
      if (categoriaFiltro && n.categoria !== categoriaFiltro) return false
      if (pessoaFiltro) {
        const lista = n.pessoas || n.entidades || []
        if (!lista.includes(pessoaFiltro)) return false
      }
      if (estadoFiltro) {
        const lista = n.estados || []
        if (!lista.includes(estadoFiltro)) {
          const candidatos = [...(n.entidades || []), ...(n.tags || [])]
          if (!candidatos.includes(estadoFiltro)) return false
        }
      }
      if (cidadeFiltro) {
        const lista = n.cidades || []
        if (!lista.includes(cidadeFiltro)) return false
      }
      if (riscoFiltro && n.importancia !== riscoFiltro) return false
      if (paisSelecionado) {
        const lista = n.paises || n.entidades || []
        if (!lista.includes(paisSelecionado)) return false
      }
      return true
    })
  }, [noticias, categoriaFiltro, pessoaFiltro, estadoFiltro, cidadeFiltro, riscoFiltro, paisSelecionado])

  const temFiltro = categoriaFiltro || pessoaFiltro || estadoFiltro || cidadeFiltro || riscoFiltro || paisSelecionado

  if (!aberto) return null

  function limparFiltros() {
    setCategoriaFiltro(null)
    setPessoaFiltro(null)
    setEstadoFiltro(null)
    setCidadeFiltro(null)
    setRiscoFiltro(null)
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
              <h2 className="text-xl font-bold text-white">
                {paisSelecionado || 'Mundo'}
              </h2>
              <p className="text-gray-500 text-sm">
                {temFiltro
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

              <SelectAutocomplete
                label="Categoria"
                opcoes={categorias}
                valor={categoriaFiltro}
                aoSelecionar={setCategoriaFiltro}
                placeholder="Buscar categoria..."
              />

              <SelectAutocomplete
                label="Pessoa"
                opcoes={pessoas}
                valor={pessoaFiltro}
                aoSelecionar={setPessoaFiltro}
                placeholder="Buscar pessoa..."
              />

              {estados.length > 0 && (
                <SelectAutocomplete
                  label="Estado"
                  opcoes={estados}
                  valor={estadoFiltro}
                  aoSelecionar={setEstadoFiltro}
                  placeholder="Buscar estado..."
                />
              )}

              {cidades.length > 0 && (
                <SelectAutocomplete
                  label="Cidade"
                  opcoes={cidades}
                  valor={cidadeFiltro}
                  aoSelecionar={setCidadeFiltro}
                  placeholder="Buscar cidade..."
                />
              )}

              <SelectAutocomplete
                label="Risco"
                opcoes={RISCOS.map(r => r.rotulo)}
                valor={riscoFiltro ? RISCOS.find(r => r.valor === riscoFiltro)?.rotulo : null}
                aoSelecionar={val => {
                  const found = RISCOS.find(r => r.rotulo === val)
                  setRiscoFiltro(found ? found.valor : null)
                }}
                placeholder="Selecionar risco..."
              />

              {temFiltro && (
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
              {!temFiltro ? (
                <p className="text-gray-600 text-sm text-center mt-16">
                  Selecione um filtro ao lado para ver as notícias
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
