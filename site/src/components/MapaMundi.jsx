import { useEffect, useRef, useState } from 'react'
import { geoMercator, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'

const URL_TOPOJSON = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

export default function MapaMundi({ aoClicarBrasil }) {
  const containerRef = useRef(null)
  const [paises, setPaises] = useState([])      // lista de { geometria, codigo }
  const [dimensoes, setDimensoes] = useState({ w: 800, h: 450 })

  // 1. Carrega o TopoJSON e extrai os países
  useEffect(() => {
    fetch(URL_TOPOJSON)
      .then(r => r.json())
      .then(dados => {
        const geojson = feature(dados, dados.objects.countries)
        const lista = geojson.features.map(f => ({
          geometria: f.geometry,
          codigo: f.id, // código ISO numérico (Brasil = 76)
        }))
        setPaises(lista)
      })
      .catch(err => console.error('Erro ao carregar mapa:', err))
  }, [])

  // 2. Ajusta o tamanho do SVG ao container
  useEffect(() => {
    function atualizarTamanho() {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setDimensoes({ w: rect.width, h: rect.width * 0.55 })
      }
    }
    atualizarTamanho()
    window.addEventListener('resize', atualizarTamanho)
    return () => window.removeEventListener('resize', atualizarTamanho)
  }, [])

  // 3. Projeta os países no plano cartesiano
  const projecao = geoMercator()
    .scale(dimensoes.w * 0.15)
    .center([10, 10])
    .translate([dimensoes.w / 2, dimensoes.h / 2])

  const gerarCaminho = geoPath().projection(projecao)

  return (
    <div ref={containerRef} className="w-full max-w-4xl mx-auto">
      <svg
        viewBox={`0 0 ${dimensoes.w} ${dimensoes.h}`}
        className="w-full h-auto"
      >
        {paises.map((p, i) => {
          const ehBrasil = p.codigo === 76
          const caminho = gerarCaminho(p.geometria)
          if (!caminho) return null

          return (
            <path
              key={i}
              d={caminho}
              onClick={ehBrasil ? aoClicarBrasil : undefined}
              className={ehBrasil ? 'cursor-pointer' : ''}
              fill={ehBrasil ? '#16a34a' : '#1f2937'}
              stroke={ehBrasil ? '#22c55e' : '#374151'}
              strokeWidth={ehBrasil ? 0.8 : 0.3}
              onMouseEnter={e => {
                if (ehBrasil) e.target.style.fill = '#22c55e'
              }}
              onMouseLeave={e => {
                if (ehBrasil) e.target.style.fill = '#16a34a'
              }}
            />
          )
        })}
      </svg>
      <p className="text-center text-gray-500 text-sm mt-4">
        Clique no Brasil para ver os acontecimentos do dia
      </p>
    </div>
  )
}
