import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { productos, categorias } from '../data'
import { useCart } from '../context/CartContext'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

const MATERIALES = ['PLA', 'PLA+']
const ESTILOS    = ['Crochet', 'Clásico']

const OPCIONES_ORDEN = [
  { value: 'nuevos',      label: 'Más nuevos'   },
  { value: 'popular',     label: 'Tendencia'    },
  { value: 'precio-asc',  label: 'Precio menor' },
  { value: 'precio-desc', label: 'Precio mayor' },
]

const WA_URL = `https://wa.me/51922372823?text=${encodeURIComponent(
  'Hola, busco un producto que no encuentro en el catálogo de Mekra3D. ¿Pueden crearlo para mí? 🙌'
)}`

export default function Catalogo() {
  useDocumentTitle('Catálogo')
  const [searchParams, setSearchParams] = useSearchParams()
  const [busqueda, setBusqueda]   = useState('')
  const [material, setMaterial]   = useState('todos')
  const [estilo, setEstilo]       = useState('todos')
  const [orden, setOrden]         = useState('nuevos')
  const [categoria, setCategoria] = useState(() => searchParams.get('categoria') || 'todos')

  // Sincroniza la categoría cuando el usuario llega desde un link con ?categoria=xxx
  useEffect(() => {
    setCategoria(searchParams.get('categoria') || 'todos')
  }, [searchParams])

  function cambiarCategoria(nueva) {
    setCategoria(nueva)
    // El filtro de estilo solo aplica a Figuras; resetear al cambiar de categoría
    if (nueva !== 'figuras') setEstilo('todos')
    const p = new URLSearchParams(searchParams)
    if (nueva === 'todos') p.delete('categoria')
    else p.set('categoria', nueva)
    setSearchParams(p, { replace: true })
  }

  const resultados = useMemo(() => {
    let lista = productos.filter(p => p.activo)

    if (busqueda.trim()) {
      const q = busqueda.toLowerCase()
      lista = lista.filter(p =>
        p.nombre.toLowerCase().includes(q) ||
        p.descripcion.toLowerCase().includes(q)
      )
    }

    if (categoria !== 'todos')
      lista = lista.filter(p => p.categoria.toLowerCase() === categoria)

    if (material !== 'todos')
      lista = lista.filter(p => p.material === material)

    if (estilo !== 'todos')
      lista = lista.filter(p => p.estilo === estilo)

    if (orden === 'precio-asc')  return [...lista].sort((a, b) => a.precio - b.precio)
    if (orden === 'precio-desc') return [...lista].sort((a, b) => b.precio - a.precio)
    if (orden === 'popular')     return [...lista].sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0))
    return lista
  }, [busqueda, categoria, material, estilo, orden])

  return (
    <div className="min-h-screen bg-mekra-white">
      <BarraFiltros
        busqueda={busqueda}    onBusqueda={setBusqueda}
        categoria={categoria}  onCategoria={cambiarCategoria}
        material={material}    onMaterial={setMaterial}
        estilo={estilo}        onEstilo={setEstilo}
        orden={orden}          onOrden={setOrden}
        total={resultados.length}
      />

      {/* Banner Laboon — entre filtros y grid, solo en categoría Mujer */}
      {categoria === 'mujer' && <BannerLaboonTop />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {resultados.length === 0
          ? <EstadoVacio />
          : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {resultados.map(p => <CardProducto key={p.id} producto={p} />)}
            </div>
          )
        }

        {/* Banner Laboon — solo visible en categoría Mujer */}
        {categoria === 'mujer' && <BannerLaboon />}
      </div>
    </div>
  )
}

// ── BARRA DE FILTROS — sticky bajo el navbar ───────────────────────

function BarraFiltros({ busqueda, onBusqueda, categoria, onCategoria, material, onMaterial, estilo, onEstilo, orden, onOrden, total }) {
  const todasCats    = [{ id: 'todos', nombre: 'Todos' }, ...categorias]
  const todosMats    = ['todos', ...MATERIALES]
  const todosEstilos = ['todos', ...ESTILOS]
  // El filtro de estilo solo tiene sentido en la categoría de Figuras
  const mostrarEstilo = categoria === 'figuras'

  return (
    <div className="sticky top-16 z-40 bg-mekra-white border-b border-mekra-black/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col gap-2.5">

        {/* Fila 1: buscador + selector de orden */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-mekra-black/35">
              <IconLupa />
            </span>
            <input
              type="search"
              value={busqueda}
              onChange={e => onBusqueda(e.target.value)}
              placeholder="Buscar productos..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-mekra-black/20 rounded bg-mekra-white focus:outline-none focus:border-mekra-orange transition-colors duration-150 text-mekra-black placeholder:text-mekra-black/30"
            />
          </div>
          <select
            value={orden}
            onChange={e => onOrden(e.target.value)}
            className="px-3 py-2 text-[11px] font-bold border border-mekra-black/20 rounded bg-mekra-white focus:outline-none focus:border-mekra-orange transition-colors duration-150 text-mekra-black cursor-pointer"
          >
            {OPCIONES_ORDEN.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Fila 2: pills de categoría */}
        <div className="flex items-center gap-2 overflow-x-auto pb-px">
          <div className="flex gap-1.5 shrink-0">
            {todasCats.map(cat => (
              <button
                key={cat.id}
                onClick={() => onCategoria(cat.id)}
                className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded whitespace-nowrap transition-all duration-150 ${
                  categoria === cat.id
                    ? 'bg-mekra-orange text-white'
                    : 'bg-mekra-black/5 text-mekra-black hover:bg-mekra-orange/10 hover:text-mekra-orange'
                }`}
              >
                {cat.nombre}
              </button>
            ))}
          </div>
        </div>

        {/* Fila 3: pills de material + estilo + contador */}
        <div className="flex items-center gap-2 overflow-x-auto pb-px">
          <div className="flex gap-1.5 shrink-0">
            {todosMats.map(mat => (
              <button
                key={mat}
                onClick={() => onMaterial(mat)}
                className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded whitespace-nowrap transition-all duration-150 ${
                  material === mat
                    ? 'bg-mekra-black text-white'
                    : 'bg-mekra-black/5 text-mekra-black hover:bg-mekra-black/15'
                }`}
              >
                {mat === 'todos' ? 'Material' : mat}
              </button>
            ))}
          </div>

          {mostrarEstilo && (
            <>
              <div className="w-px h-4 bg-mekra-black/15 shrink-0" />
              <div className="flex gap-1.5 shrink-0">
                {todosEstilos.map(est => (
                  <button
                    key={est}
                    onClick={() => onEstilo(est)}
                    className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded whitespace-nowrap transition-all duration-150 ${
                      estilo === est
                        ? 'bg-mekra-black text-white'
                        : 'bg-mekra-black/5 text-mekra-black hover:bg-mekra-black/15'
                    }`}
                  >
                    {est === 'todos' ? 'Estilo' : est}
                  </button>
                ))}
              </div>
            </>
          )}

          <span className="ml-auto shrink-0 text-[10px] text-mekra-black/40 font-bold tabular-nums whitespace-nowrap">
            {total} resultado{total !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  )
}

// ── CARD DE PRODUCTO ───────────────────────────────────────────────

function CardProducto({ producto }) {
  const { addItem } = useCart()
  const navigate = useNavigate()

  return (
    <article
      onClick={() => navigate(`/producto/${producto.id}`)}
      className="group flex flex-col bg-mekra-white border border-mekra-black/10 rounded overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[rgba(255,107,0,0.12)] hover:border-mekra-orange/25 cursor-pointer"
    >

      {/* Imagen con aspect-ratio fijo */}
      <div className="aspect-square bg-mekra-black/5 flex items-center justify-center">
        <IconCubo />
      </div>

      <div className="flex flex-col flex-1 p-3">
        <span className="text-mekra-orange text-[9px] sm:text-[10px] font-bold uppercase tracking-widest leading-none">
          {producto.categoria}
        </span>
        <h3 className="text-mekra-black font-black text-xs sm:text-sm mt-1 mb-3 leading-tight line-clamp-2 flex-1">
          {producto.nombre}
        </h3>
        <div className="flex items-center justify-between gap-1">
          <span className="text-mekra-orange font-black text-sm sm:text-base leading-none">
            {producto.precio > 0 ? `S/${producto.precio}` : 'Consultar'}
          </span>
          <button
            onClick={e => { e.stopPropagation(); addItem(producto, 1, producto.colores[0] ?? '') }}
            className="px-2.5 py-1.5 bg-mekra-orange text-white text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded transition-all duration-200 hover:brightness-110 active:scale-95 whitespace-nowrap"
          >
            + Agregar
          </button>
        </div>
      </div>
    </article>
  )
}

// ── BANNER LABOON SUPERIOR — entre filtros y grid ─────────────────

function BannerLaboonTop() {
  return (
    <a
      href="https://www.instagram.com/laboon_pe/"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-2.5 px-4 py-3 bg-[#FFF0F5] border-b border-pink-100 hover:bg-pink-100 transition-colors duration-150"
    >
      <IconInstagram />
      <span className="text-xs sm:text-sm font-bold text-mekra-black">
        <span className="text-pink-500 font-black">@laboon_pe</span>
        {' '}— nuestra línea femenina
      </span>
    </a>
  )
}

// ── BANNER LABOON INFERIOR — debajo del grid ───────────────────────

function BannerLaboon() {
  return (
    <div className="mt-8 bg-pink-50 border border-pink-100 rounded-xl px-6 py-6 sm:py-8 flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
      <div>
        <p className="text-pink-400 text-[10px] font-black uppercase tracking-widest mb-1">
          Línea Laboon
        </p>
        <p className="text-mekra-black font-bold text-sm sm:text-base leading-snug">
          ¿Te inspira Laboon?{' '}
          <span className="font-black">Síguenos para contenido exclusivo y promociones especiales 💗</span>
        </p>
      </div>
      <a
        href="https://www.instagram.com/laboon_pe/"
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 inline-flex items-center gap-2 px-5 py-3 bg-pink-400 hover:bg-pink-500 text-white font-black uppercase tracking-widest text-xs rounded transition-all duration-200"
      >
        <IconInstagram />
        @laboon_pe
      </a>
    </div>
  )
}

// ── ESTADO VACÍO ───────────────────────────────────────────────────

function EstadoVacio() {
  return (
    <div className="flex flex-col items-center justify-center py-28 text-center">
      <div className="w-16 h-16 rounded-full bg-mekra-orange/10 flex items-center justify-center mb-6">
        <IconCuboVacio />
      </div>
      <h3 className="text-xl font-black text-mekra-black uppercase tracking-tight mb-2">
        No encontramos lo que buscas
      </h3>
      <p className="text-mekra-black/40 text-sm mb-8">
        ¿Lo creamos para ti?
      </p>
      <a
        href={WA_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-7 py-3 bg-mekra-orange text-white font-black uppercase tracking-widest text-xs rounded transition-all duration-200 hover:brightness-110"
      >
        <IconWhatsApp />
        Pedir personalizado
      </a>
    </div>
  )
}

// ── ÍCONOS SVG ─────────────────────────────────────────────────────

function IconInstagram() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

function IconLupa() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function IconCubo() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round" className="text-mekra-black/20" aria-hidden>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  )
}

function IconCuboVacio() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="text-mekra-orange/60" aria-hidden>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  )
}

function IconWhatsApp() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  )
}
