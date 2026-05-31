import { useLocation, Link } from 'react-router-dom'
import { productos, siteInfo } from '../data'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

// Cada ruta de ocasión filtra el catálogo por categoría
const OCASIONES = {
  '/papa':        { occ: 'papa',        titulo: 'Para Papá' },
  '/parejas':     { occ: 'parejas',     titulo: 'Para Parejas' },
  '/hermanos':    { occ: 'hermanos',    titulo: 'Para Hermanos' },
  '/amigos':      { occ: 'amigos',      titulo: 'Para Amigos' },
  '/corporativo': { occ: 'corporativo', titulo: 'Corporativo' },
  '/catalogo':    { occ: null,          titulo: 'Catálogo' },
}

function waPedido(nombre) {
  return `https://wa.me/${siteInfo.whatsapp}?text=${encodeURIComponent(
    `Hola! Me interesa "${nombre}" de Mekra3D. ¿Pueden ayudarme? 🧡`
  )}`
}

function descripcionCorta(p) {
  if (p.descripcion) return p.descripcion
  return `Impreso a pedido en ${p.material || 'PLA'}`
}

export default function Catalogo() {
  const { pathname } = useLocation()
  const { occ, titulo } = OCASIONES[pathname] ?? OCASIONES['/catalogo']
  useDocumentTitle(titulo)

  const activos = productos.filter(p => p.activo)
  const lista = occ ? activos.filter(p => p.categoria.toLowerCase() === occ) : activos

  return (
    <div className="min-h-screen bg-mekra-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <h1 className="text-center text-3xl sm:text-4xl font-black text-mekra-black tracking-tight mb-10 sm:mb-14">
          {titulo}
        </h1>

        {occ === 'corporativo'
          ? <Corporativo />
          : <Resultados lista={lista} />}
      </div>
    </div>
  )
}

// ── RESULTADOS — grid asimétrico (Huawei) o simétrico ──────────────

function Resultados({ lista }) {
  if (lista.length === 0) return <SinProductos />

  if (lista.length < 3) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
        {lista.map(p => <Card key={p.id} producto={p} />)}
      </div>
    )
  }

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

// ── CARDS ──────────────────────────────────────────────────────────

function Card({ producto }) {
  return (
    <article className="group flex flex-col bg-mekra-white rounded-2xl overflow-hidden border border-mekra-black/[0.06] transition-all duration-200 hover:shadow-xl hover:shadow-mekra-black/[0.06] hover:scale-[1.02]">
      <Link to={`/producto/${producto.id}`} className="block">
        <Lienzo producto={producto} className="aspect-square" />
      </Link>
      <div className="flex flex-col gap-3 px-5 pb-5 pt-3">
        <h3 className="text-mekra-black font-black text-base leading-tight">{producto.nombre}</h3>
        <Acciones producto={producto} />
      </div>
    </article>
  )
}

function FeaturedCard({ producto, className = '' }) {
  return (
    <article className={`group flex flex-col bg-mekra-white rounded-2xl overflow-hidden border border-mekra-black/[0.06] transition-all duration-200 hover:shadow-xl hover:shadow-mekra-black/[0.06] hover:scale-[1.01] ${className}`}>
      <Link to={`/producto/${producto.id}`} className="block flex-1 min-h-[260px]">
        <Lienzo producto={producto} grande className="h-full min-h-[260px]" />
      </Link>
      <div className="flex flex-col gap-3 px-7 pb-7 pt-4">
        <h3 className="text-mekra-black font-black text-2xl sm:text-3xl leading-tight tracking-tight">{producto.nombre}</h3>
        <p className="text-mekra-black/55 text-sm sm:text-base leading-relaxed line-clamp-1">{descripcionCorta(producto)}</p>
        <Acciones producto={producto} className="mt-1" />
      </div>
    </article>
  )
}

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
      <Link to={`/producto/${producto.id}`} className="font-bold text-mekra-black hover:text-mekra-orange transition-colors duration-150">
        Ver más ›
      </Link>
      <a href={waPedido(producto.nombre)} target="_blank" rel="noopener noreferrer" className="font-bold text-mekra-orange hover:opacity-70 transition-opacity duration-150">
        Pedir ›
      </a>
    </div>
  )
}

// ── CORPORATIVO ────────────────────────────────────────────────────

function Corporativo() {
  const wa = `https://wa.me/${siteInfo.whatsapp}?text=${encodeURIComponent(
    'Hola! Quiero una cotización corporativa para mi empresa o colegio en Mekra3D.'
  )}`
  return (
    <div className="flex flex-col items-center text-center py-16 sm:py-24 max-w-xl mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-mekra-black flex items-center justify-center mb-7">
        <IconEdificio />
      </div>
      <h2 className="text-2xl sm:text-3xl font-black text-mekra-black tracking-tight mb-4">
        Pedidos para empresas y colegios
      </h2>
      <p className="text-mekra-black/55 text-base leading-relaxed mb-9">
        Pedidos especiales para empresas y colegios. Cotización personalizada.
      </p>
      <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 bg-mekra-orange text-mekra-white font-black uppercase tracking-widest text-sm rounded-lg transition-all duration-200 hover:brightness-110 active:scale-[0.98]">
        Solicitar cotización
      </a>
    </div>
  )
}

function SinProductos() {
  return (
    <p className="text-center text-mekra-black/40 text-sm py-20">
      Pronto agregaremos regalos para esta ocasión.
    </p>
  )
}

// ── ÍCONOS ─────────────────────────────────────────────────────────

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
      <path d="M9 22v-4h6v4" />
      <line x1="9" y1="6" x2="9" y2="6.01" /><line x1="15" y1="6" x2="15" y2="6.01" />
      <line x1="9" y1="10" x2="9" y2="10.01" /><line x1="15" y1="10" x2="15" y2="10.01" />
      <line x1="9" y1="14" x2="9" y2="14.01" /><line x1="15" y1="14" x2="15" y2="14.01" />
    </svg>
  )
}
