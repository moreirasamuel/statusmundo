import { useState, useRef, useEffect } from 'react'

export default function SelectAutocomplete({
  opcoes,
  valor,
  aoSelecionar,
  placeholder = 'Digite para buscar...',
  label
}) {
  const [aberto, setAberto] = useState(false)
  const [termo, setTermo] = useState('')
  const wrapperRef = useRef(null)

  const filtradas = opcoes.filter(o =>
    o.toLowerCase().includes(termo.toLowerCase())
  )

  useEffect(() => {
    function handleClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setAberto(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function selecionar(opcao) {
    aoSelecionar(opcao)
    setTermo('')
    setAberto(false)
  }

  function limpar() {
    aoSelecionar(null)
    setTermo('')
  }

  return (
    <div ref={wrapperRef} className="relative">
      {label && (
        <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-1.5">
          {label}
        </p>
      )}

      <div className="relative">
        <input
          type="text"
          value={valor && aberto === false ? valor : termo}
          onChange={e => {
            setTermo(e.target.value)
            setAberto(true)
            if (valor) aoSelecionar(null)
          }}
          onFocus={() => {
            setTermo('')
            setAberto(true)
          }}
          placeholder={valor || placeholder}
          className="w-full bg-gray-800 text-gray-200 text-xs px-3 py-1.5 rounded-lg border border-gray-700 focus:border-gray-500 focus:outline-none transition-colors placeholder:text-gray-600"
        />

        {valor && (
          <button
            onClick={limpar}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 text-xs"
          >
            ✕
          </button>
        )}
      </div>

      {aberto && filtradas.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg max-h-40 overflow-y-auto shadow-xl">
          {filtradas.map(opcao => (
            <button
              key={opcao}
              onClick={() => selecionar(opcao)}
              className={`block w-full text-left text-xs px-3 py-1.5 transition-colors ${
                opcao === valor
                  ? 'bg-green-800 text-green-200'
                  : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'
              }`}
            >
              {opcao}
            </button>
          ))}
        </div>
      )}

      {aberto && filtradas.length === 0 && termo && (
        <div className="absolute z-50 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 shadow-xl">
          <p className="text-gray-500 text-xs">Nenhum resultado</p>
        </div>
      )}
    </div>
  )
}
