import { useSearchParams, Link } from 'react-router-dom'
import { productos, siteInfo } from '../data'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

const TABS = [
  { id: 'todos',          label: 'Todos' },
  { id: 'personalizados', label: 'Personalizados' },
  { id: 'hogar',          label: 'Hogar' },
  { id: 'corporativo',    label: 'Corporativo' },
]
const TAB_IDS = TABS.map(t => t.id)

function waPedido(nombre) {
  return `https://wa.me/${siteInfo.whatsapp}?text=${encodeURIComponent(
    `Hola! Me interesa "${nombre}" de Mekra3D. ¿Pueden ayudarme? 🧡`
  )}`
}

function descripcionCorta(p) {
  if (p.descripcion) return p.descripcion
  const sub = p.subcategoria ? `${p.subcategoria} · ` : ''
  return `${sub}Impreso en ${p.material || 'PLA'}`
}

export default function Catalogo() {
  useDocumentTitle('Catálogo')
  const [searchParams, setSearchParams] = useSearchParams()
  // El tab activo se deriva de la URL (fuente de verdad), sin estado duplicado
  const categoriaUrl = searchParams.get('categoria')
  const tab = TAB_IDS.includes(categoriaUrl) ? categoriaUrl : 'todos'

  function cambiarTab(id) {
    const p = new URLSearchParams(searchParams)
    if (id === 'todos') p.delete('categoria')
    else p.set('categoria', id)
    setSearchParams(p, { replace: true })
  }

  const activos = productos.filter(p => p.activo)
  const lista = tab === 'todos'
    ? activos
    : activos.filter(p => p.categoria.toLowerCase() === tab)

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <Tabs tab={tab} onTab={cambiarTab} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {tab === 'corporativo'
          ? <Corporativo />
          : <Resultados lista={lista} />}
      </div>
    </div>
  )
}

// ── TABS DE CATEGORÍA — sticky bajo el navbar ──────────────────────

function Tabs({ tab, onTab }) {
  return (
    <div className="sticky top-16 z-40 bg-[#F5F5F7] border-b border-mekra-black/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-start sm:justify-center gap-7 sm:gap-12 overflow-x-auto">
          {TABS.map(t => {
            const activo = tab === t.id
            return (
              <button
                key={t.id}
                onClick={() => onTab(t.id)}
                className={`relative shrink-0 py-4 text-sm font-bold tracking-wide whitespace-nowrap transition-colors duration-150 ${
                  activo ? 'text-mekra-black' : 'text-mekra-black/45 hover:text-mekra-black/70'
                }`}
              >
                {t.label}
                <span
                  className={`absolute left-0 right-0 -bottom-px h-0.5 rounded-full transition-colors duration-200 ${
                    activo ? 'bg-mekra-black' : 'bg-transparent'
                  }`}
                />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── RESULTADOS — grid asimétrico (Huawei) o simétrico ──────────────

function Resultados({ lista }) {
  if (lista.length === 0) return <SinProductos />

  // Menos de 3 productos: grid simétrico de 2 columnas
  if (lista.length < 3) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
        {lista.map(p => <Card key={p.id} producto={p} />)}
      </div>
    )
  }

  // 3+ productos: 1 featured (60%) + grid 2x2 (40%), resto debajo
  const featured = lista[0]
  const derecha  = lista.slice(1, 5)
  const resto    = lista.slice(5)

  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 sm:gap-6">
        <FeaturedCard producto={featured} className="lg:col-span-3" />
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          {derecha.map(p => <Card key={p.id} producto={p} />)}
        </div>
      </div>

      {resto.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {resto.map(p => <Card key={p.id} producto={p} />)}
        </div>
      )}
    </div>
  )
}

// ── CARD ESTÁNDAR ──────────────────────────────────────────────────

function Card({ producto }) {
  return (
    <article className="group flex flex-col bg-mekra-white rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-xl hover:shadow-mekra-black/[0.06] hover:scale-[1.02]">
      <Link to={`/producto/${producto.id}`} className="block">
        <Lienzo producto={producto} className="aspect-square" />
      </Link>
      <div className="flex flex-col gap-3 px-5 pb-5 pt-3">
        <h3 className="text-mekra-black font-black text-base leading-tight">
          {producto.nombre}
        </h3>
        <Acciones producto={producto} />
      </div>
    </article>
  )
}

// ── CARD FEATURED (grande, izquierda) ──────────────────────────────

function FeaturedCard({ producto, className = '' }) {
  return (
    <article className={`group flex flex-col bg-mekra-white rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-xl hover:shadow-mekra-black/[0.06] hover:scale-[1.01] ${className}`}>
      <Link to={`/producto/${producto.id}`} className="block flex-1 min-h-[260px]">
        <Lienzo producto={producto} grande className="h-full min-h-[260px]" />
      </Link>
      <div className="flex flex-col gap-3 px-7 pb-7 pt-4">
        <h3 className="text-mekra-black font-black text-2xl sm:text-3xl leading-tight tracking-tight">
          {producto.nombre}
        </h3>
        <p className="text-mekra-black/55 text-sm sm:text-base leading-relaxed line-clamp-1">
          {descripcionCorta(producto)}
        </p>
        <Acciones producto={producto} className="mt-1" />
      </div>
    </article>
  )
}

// ── PIEZAS REUTILIZABLES ───────────────────────────────────────────

// Lienzo del producto: foto si existe, si no un placeholder centrado
function Lienzo({ producto, grande = false, className = '' }) {
  return (
    <div className={`bg-[#F5F5F7] flex items-center justify-center overflow-hidden ${className}`}>
      {producto.fotos.length > 0
        ? <img src={producto.fotos[0]} alt={producto.nombre} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        : <IconCubo size={grande ? 88 : 52} />}
    </div>
  )
}

function Acciones({ producto, className = '' }) {
  return (
    <div className={`flex items-center gap-5 text-sm ${className}`}>
      <Link
        to={`/producto/${producto.id}`}
        className="font-bold text-mekra-black hover:text-mekra-orange transition-colors duration-150"
      >
        Ver más ›
      </Link>
      <a
        href={waPedido(producto.nombre)}
        target="_blank"
        rel="noopener noreferrer"
        className="font-bold text-mekra-orange hover:opacity-70 transition-opacity duration-150"
      >
        Pedir ›
      </a>
    </div>
  )
}

// ── CORPORATIVO — sin productos, solo cotización ───────────────────

function Corporativo() {
  const wa = `https://wa.me/${siteInfo.whatsapp}?text=${encodeURIComponent(
    'Hola! Quiero una cotización corporativa para mi empresa o colegio en Mekra3D.'
  )}`
  return (
    <div className="flex flex-col items-center text-center py-20 sm:py-28 max-w-xl mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-mekra-black flex items-center justify-center mb-7">
        <IconEdificio />
      </div>
      <h2 className="text-2xl sm:text-3xl font-black text-mekra-black tracking-tight mb-4">
        Pedidos para empresas y colegios
      </h2>
      <p className="text-mekra-black/55 text-base leading-relaxed mb-9">
        Pedidos especiales para empresas y colegios. Cotización personalizada.
      </p>
      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-8 py-4 bg-mekra-orange text-white font-black uppercase tracking-widest text-sm rounded-lg transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
      >
        Solicitar cotización
      </a>
    </div>
  )
}

// ── ESTADO VACÍO ───────────────────────────────────────────────────

function SinProductos() {
  return (
    <p className="text-center text-mekra-black/40 text-sm py-24">
      Pronto agregaremos productos en esta categoría.
    </p>
  )
}

// ── ÍCONOS SVG ─────────────────────────────────────────────────────

function IconCubo({ size = 52 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.6" strokeLinecap="round" strokeLinejoin="round" className="text-mekra-black/15" aria-hidden>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  )
}

function IconEdificio() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-mekra-white" aria-hidden>
      <rect x="4" y="2" width="16" height="20" rx="1" />
      <line x1="9" y1="6" x2="9" y2="6" />
      <line x1="15" y1="6" x2="15" y2="6" />
      <line x1="9" y1="10" x2="9" y2="10" />
      <line x1="15" y1="10" x2="15" y2="10" />
      <line x1="9" y1="14" x2="9" y2="14" />
      <line x1="15" y1="14" x2="15" y2="14" />
      <path d="M9 22v-4h6v4" />
    </svg>
  )
}
