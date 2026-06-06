import { useEffect, useRef, useState } from 'react'
import { geoMercator, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'

const URL_TOPOJSON = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

export default function MapaMundi({ aoClicarBrasil }) {
  const containerRef = useRef(null)
  const [paises, setPaises] = useState([])
  const [erroMapa, setErroMapa] = useState(false)
  const [dimensoes, setDimensoes] = useState({ w: 800, h: 450 })

  // Carrega o TopoJSON e extrai os países
  useEffect(() => {
    fetch(URL_TOPOJSON)
      .then(r => r.json())
      .then(dados => {
        const geojson = feature(dados, dados.objects.countries)
        const lista = geojson.features.map(f => ({
          geometria: f.geometry,
          nome: f.properties?.name || '',
          codigo: f.id,
        }))
        setPaises(lista)
      })
      .catch(err => {
        console.error('Erro ao carregar mapa:', err)
        setErroMapa(true)
      })
  }, [])

  // Ajusta o tamanho ao container
  useEffect(() => {
    function atualizar() {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setDimensoes({ w: rect.width, h: rect.width * 0.55 })
      }
    }
    atualizar()
    window.addEventListener('resize', atualizar)
    return () => window.removeEventListener('resize', atualizar)
  }, [])

  // Se o mapa falhou ao carregar, mostra alternativa textual
  if (erroMapa) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p className="text-lg mb-2">🌍 Não foi possível carregar o mapa</p>
        <button
          onClick={aoClicarBrasil}
          className="bg-green-700 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Ver notícias do Brasil →
        </button>
      </div>
    )
  }

  // Identifica o Brasil pelo nome (mais confiável que código numérico)
  function ehBrasil(pais) {
    return pais.nome === 'Brazil'
  }

  const projecao = geoMercator()
    .scale(dimensoes.w * 0.17)
    .center([12, 8])
    .translate([dimensoes.w / 2, dimensoes.h / 2])

  const gerarCaminho = geoPath().projection(projecao)

  return (
    <div ref={containerRef} className="w-full max-w-4xl mx-auto">
      {paises.length === 0 ? (
        <div className="text-center text-gray-500 py-16">
          <p>Carregando mapa...</p>
        </div>
      ) : (
        <svg
          viewBox={`0 0 ${dimensoes.w} ${dimensoes.h}`}
          className="w-full h-auto"
        >
          {paises.map((p, i) => {
            const brasil = ehBrasil(p)
            const caminho = gerarCaminho(p.geometria)
            if (!caminho) return null

            return (
              <path
                key={i}
                d={caminho}
                onClick={brasil ? aoClicarBrasil : undefined}
                className={brasil ? 'cursor-pointer' : ''}
                fill={brasil ? '#16a34a' : '#1f2937'}
                stroke={brasil ? '#22c55e' : '#374151'}
                strokeWidth={brasil ? 0.8 : 0.3}
                onMouseEnter={e => {
                  if (brasil) e.target.style.fill = '#22c55e'
                }}
                onMouseLeave={e => {
                  if (brasil) e.target.style.fill = '#16a34a'
                }}
              />
            )
          })}
        </svg>
      )}

      <p className="text-center text-gray-500 text-sm mt-4">
        Clique no Brasil para ver os acontecimentos do dia
      </p>
    </div>
  )
}
