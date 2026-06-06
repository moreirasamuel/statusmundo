import { ComposableMap, Geographies, Geography } from 'react-simple-maps'

// URL do TopoJSON com os países do mundo (110m de resolução)
const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

// Código ISO do Brasil
const CODIGO_BRASIL = 'BRA'

export default function MapaMundi({ aoClicarBrasil }) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 140, center: [10, 10] }}
        className="w-full h-auto"
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map(geo => {
              const codigo = geo.properties?.ISO_A3
              const ehBrasil = codigo === CODIGO_BRASIL

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={ehBrasil ? aoClicarBrasil : undefined}
                  style={{
                    default: {
                      fill: ehBrasil ? '#16a34a' : '#1f2937',
                      stroke: ehBrasil ? '#22c55e' : '#374151',
                      strokeWidth: ehBrasil ? 0.8 : 0.3,
                      outline: 'none',
                      cursor: ehBrasil ? 'pointer' : 'default',
                    },
                    hover: {
                      fill: ehBrasil ? '#22c55e' : '#1f2937',
                      stroke: ehBrasil ? '#4ade80' : '#374151',
                      strokeWidth: ehBrasil ? 1 : 0.3,
                      outline: 'none',
                      cursor: ehBrasil ? 'pointer' : 'default',
                    },
                    pressed: {
                      fill: ehBrasil ? '#15803d' : '#1f2937',
                      outline: 'none',
                    },
                  }}
                />
              )
            })
          }
        </Geographies>
      </ComposableMap>
      {/* Legenda */}
      <p className="text-center text-gray-500 text-sm mt-4">
        Clique no Brasil para ver os acontecimentos do dia
      </p>
    </div>
  )
}
