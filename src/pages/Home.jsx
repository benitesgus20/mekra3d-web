import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { productos } from '../data'
import { useCart } from '../context/CartContext'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

const PASOS = [
  { emoji: '📐', titulo: 'Diseño',             desc: 'Adaptamos o creamos tu modelo 3D a medida.' },
  { emoji: '🖨️', titulo: 'Impresión',          desc: 'Producimos con impresora Bambu Lab de alta precisión.' },
  { emoji: '🔍', titulo: 'Control de calidad', desc: 'Revisamos cada pieza antes de empacar.' },
  { emoji: '📦', titulo: 'Entrega',             desc: 'Domicilio en Trujillo o courier a todo el Perú.' },
]

const FAQS_HOME = [
  { pregunta: '¿Cuánto tiempo demora mi pedido?',      respuesta: 'Entre 1 y 3 días hábiles según la complejidad del diseño.' },
  { pregunta: '¿Hacen envíos fuera de Trujillo?',      respuesta: 'Sí, enviamos a todo el Perú por Shalom u Olva Courier.' },
  { pregunta: '¿Puedo pedir un diseño personalizado?',  respuesta: 'Sí, escríbenos por WhatsApp y lo cotizamos sin compromiso.' },
  { pregunta: '¿Cómo realizo mi pago?',                respuesta: 'El pago es por transferencia, Yape o Plin antes de producir.' },
  { pregunta: '¿Tienen garantía?',                     respuesta: 'Sí, si el producto llega con defecto de impresión lo reemplazamos sin costo.' },
]

export default function Home() {
  useDocumentTitle()
  const location = useLocation()

  useEffect(() => {
    if (!location.hash) return
    const el = document.getElementById(location.hash.slice(1))
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 80)
  }, [location.hash])

  return (
    <>
      <Hero />
      <BarraConfianza />
      <SeccionMasVendidos />
      <SeccionNovedades />
      <SeccionSobre />
      <SeccionFAQ />
    </>
  )
}

// ── 1. HERO ────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="bg-mekra-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-[60px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Texto */}
          <div>
            <p className="inline-flex items-center gap-2 text-mekra-orange text-[10px] font-black uppercase tracking-widest mb-6">
              <span className="block h-px w-6 bg-mekra-orange" />
              Trujillo, Perú
            </p>

            <h1 className="text-[48px] font-black text-white leading-[1.1] tracking-tight mb-5">
              Creamos lo que<br />
              <span className="text-mekra-orange">imaginas.</span>
            </h1>

            <p className="text-white/55 text-[14px] leading-relaxed mb-6 max-w-md">
              Piezas únicas hechas a pedido en Trujillo, Perú.
              Impresión 3D de alta calidad para tu hogar, empresa o colección.
            </p>

            <Link
              to="/catalogo"
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-mekra-orange text-white font-black uppercase tracking-widest text-sm rounded transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
            >
              Ver catálogo
              <IconFlecha />
            </Link>
          </div>

          {/* Visual placeholder elegante */}
          <div className="hidden lg:flex items-center justify-center">
            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  )
}

function HeroVisual() {
  return (
    <div className="relative w-40 h-40 xl:w-48 xl:h-48">
      {/* Círculos concéntricos decorativos */}
      <div className="absolute inset-0 rounded-full border border-white/5" />
      <div className="absolute inset-4 rounded-full border border-white/8" />
      <div className="absolute inset-8 rounded-full border border-mekra-orange/20" />

      {/* Cubo wireframe centrado */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg width="60" height="60" viewBox="0 0 120 120" fill="none" aria-hidden>
          {/* Cara frontal */}
          <rect x="30" y="50" width="60" height="60" stroke="#FF6B00" strokeWidth="1.5" strokeOpacity="0.7" />
          {/* Cara superior */}
          <path d="M30 50 L50 30 L110 30 L90 50Z" stroke="white" strokeWidth="1.5" strokeOpacity="0.2" fill="none" />
          {/* Cara lateral */}
          <path d="M90 50 L110 30 L110 90 L90 110Z" stroke="white" strokeWidth="1.5" strokeOpacity="0.2" fill="none" />
          {/* Líneas de profundidad */}
          <line x1="30" y1="50" x2="50" y2="30" stroke="white" strokeWidth="1" strokeOpacity="0.15" />
          <line x1="90" y1="50" x2="110" y2="30" stroke="white" strokeWidth="1" strokeOpacity="0.15" />
          <line x1="90" y1="110" x2="110" y2="90" stroke="white" strokeWidth="1" strokeOpacity="0.15" />
        </svg>
      </div>

      {/* Puntos orbitales */}
      <div className="absolute top-3 right-5 w-1.5 h-1.5 rounded-full bg-mekra-orange opacity-60" />
      <div className="absolute bottom-5 left-3 w-1 h-1 rounded-full bg-mekra-orange opacity-40" />
      <div className="absolute top-1/2 right-1 w-1 h-1 rounded-full bg-white opacity-30" />
    </div>
  )
}

// ── 2. BARRA DE CONFIANZA ──────────────────────────────────────────

function BarraConfianza() {
  const datos = [
    '25+ Productos',
    'Envíos a todo el Perú',
    'Hecho a pedido',
  ]

  return (
    <div className="bg-mekra-orange">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-0 divide-y sm:divide-y-0 sm:divide-x divide-white/25">
          {datos.map((dato, i) => (
            <span key={i} className="w-full sm:w-auto text-center px-6 py-1 text-white text-sm font-black uppercase tracking-widest">
              {dato}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── 3. MÁS VENDIDOS ────────────────────────────────────────────────

function SeccionMasVendidos() {
  const { addItem } = useCart()

  // Priorizar productos con fotos
  const masVendidos = [...productos.filter(p => p.activo)]
    .sort((a, b) => (b.fotos.length > 0 ? 1 : 0) - (a.fotos.length > 0 ? 1 : 0))
    .slice(0, 4)

  return (
    <section className="bg-mekra-white py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-end justify-between mb-8">
          <h2 className="text-xl sm:text-2xl font-black text-mekra-black uppercase tracking-tight">
            Más vendidos
          </h2>
          <Link
            to="/catalogo"
            className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-mekra-black/30 hover:text-mekra-orange transition-colors duration-200"
          >
            Ver todos <IconFlecha size={11} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {masVendidos.map(producto => (
            <CardProducto
              key={producto.id}
              producto={producto}
              dark={false}
              onAgregar={() => addItem(producto, 1, producto.colores[0] ?? '')}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// ── 4. NOVEDADES ───────────────────────────────────────────────────

function SeccionNovedades() {
  const { addItem } = useCart()

  // Últimos 4 productos del catálogo (los más recientes)
  const novedades = [...productos.filter(p => p.activo)].slice(-4).reverse()

  return (
    <section className="bg-mekra-black py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-end justify-between mb-8">
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
            Novedades
          </h2>
          <Link
            to="/catalogo"
            className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-mekra-orange transition-colors duration-200"
          >
            Ver todos <IconFlecha size={11} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {novedades.map(producto => (
            <CardProducto
              key={producto.id}
              producto={producto}
              dark={true}
              onAgregar={() => addItem(producto, 1, producto.colores[0] ?? '')}
            />
          ))}
        </div>

        {/* Ver todos — solo móvil */}
        <div className="sm:hidden text-center mt-8">
          <Link
            to="/catalogo"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/30 hover:text-mekra-orange transition-colors duration-200"
          >
            Ver todos los productos <IconFlecha size={11} />
          </Link>
        </div>
      </div>
    </section>
  )
}

// ── 5. SOBRE MEKRA3D ──────────────────────────────────────────────

function SeccionSobre() {
  return (
    <section id="sobre" className="bg-mekra-white py-20 sm:py-24 scroll-mt-20 border-t border-mekra-black/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12 sm:mb-16">
          <p className="text-mekra-orange text-[10px] font-black uppercase tracking-widest mb-3">
            Nuestra historia
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-mekra-black uppercase tracking-tight mb-6">
            ¿Quiénes somos?
          </h2>
          <p className="text-mekra-black/55 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Somos un emprendimiento trujillano fundado por un ingeniero mecánico apasionado
            por la fabricación digital. Con nuestra impresora{' '}
            <strong className="text-mekra-black font-black">Bambu Lab</strong> producimos
            piezas únicas, personalizadas y de alta calidad para hogares, empresas y coleccionistas.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 mb-12 sm:mb-16">
          {PASOS.map((paso, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center p-5 sm:p-6 rounded-xl border border-mekra-black/8 hover:border-mekra-orange/30 transition-colors duration-200"
            >
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-mekra-orange text-white text-[10px] font-black mb-3 shrink-0">
                {i + 1}
              </span>
              <div className="text-3xl sm:text-4xl mb-3 leading-none">{paso.emoji}</div>
              <h3 className="text-mekra-black font-black text-xs sm:text-sm uppercase tracking-wide mb-1.5">
                {paso.titulo}
              </h3>
              <p className="text-mekra-black/45 text-[11px] sm:text-xs leading-relaxed">
                {paso.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Laboon */}
        <div className="bg-pink-50 border border-pink-100 rounded-xl overflow-hidden">
          <div className="px-6 sm:px-10 py-8 sm:py-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-10">
            <div className="flex-1 text-center sm:text-left">
              <span className="text-pink-400 text-[10px] font-black uppercase tracking-widest">
                Línea especial
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-mekra-black mt-1 mb-3 tracking-tight">
                LABOON 💄
              </h3>
              <p className="text-mekra-black/60 text-sm leading-relaxed max-w-md mx-auto sm:mx-0">
                Nuestra línea femenina, creada con amor. Accesorios, pulseras y objetos
                únicos para la mujer moderna que busca diferenciarse.
              </p>
            </div>
            <div className="shrink-0">
              <Link
                to="/catalogo?categoria=mujer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-pink-400 hover:bg-pink-500 text-white font-black uppercase tracking-widest text-xs rounded transition-all duration-200"
              >
                Ver colección
                <IconFlecha />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── 6. FAQ PREVIEW ─────────────────────────────────────────────────

function SeccionFAQ() {
  const [abierto, setAbierto] = useState(null)

  return (
    <section id="faq" className="bg-mekra-black py-20 sm:py-24 scroll-mt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-10">
          <p className="text-mekra-orange text-[10px] font-black uppercase tracking-widest mb-3">
            Soporte
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            Preguntas frecuentes
          </h2>
        </div>

        <div className="space-y-2 mb-8">
          {FAQS_HOME.map((faq, i) => (
            <ItemFAQ
              key={i}
              faq={faq}
              abierto={abierto === i}
              onToggle={() => setAbierto(prev => prev === i ? null : i)}
            />
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/faq"
            className="inline-flex items-center gap-2 text-xs font-bold text-white/40 hover:text-mekra-orange uppercase tracking-widest transition-colors duration-150"
          >
            Ver todas las preguntas <IconFlecha size={12} />
          </Link>
        </div>
      </div>
    </section>
  )
}

// ── ACORDEÓN FAQ ───────────────────────────────────────────────────

function ItemFAQ({ faq, abierto, onToggle }) {
  return (
    <div className={`rounded border transition-colors duration-200 ${
      abierto ? 'border-mekra-orange/40 bg-white/[0.03]' : 'border-white/[0.08] hover:border-white/20'
    }`}>
      <button
        onClick={onToggle}
        aria-expanded={abierto}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className={`text-sm font-bold leading-snug transition-colors duration-200 ${
          abierto ? 'text-white' : 'text-white/75'
        }`}>
          {faq.pregunta}
        </span>
        <span className={`shrink-0 text-mekra-orange transition-transform duration-300 ${abierto ? 'rotate-180' : ''}`} aria-hidden>
          <IconChevron />
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${abierto ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className="px-5 pb-5 text-sm text-white/45 leading-relaxed">
          {faq.respuesta}
        </p>
      </div>
    </div>
  )
}

// ── CARD DE PRODUCTO ───────────────────────────────────────────────

function CardProducto({ producto, onAgregar, dark = true }) {
  const navigate = useNavigate()

  const wrapperCls = dark
    ? 'bg-mekra-dark border-white/8 hover:shadow-black/30 hover:border-mekra-orange/30'
    : 'bg-white border-mekra-black/10 hover:shadow-mekra-black/8 hover:border-mekra-orange/30'

  const imgBgCls  = dark ? 'bg-white/5'              : 'bg-mekra-black/4'
  const catCls    = 'text-mekra-orange'
  const nameCls   = dark ? 'text-white'               : 'text-mekra-black'
  const priceCls  = 'text-mekra-orange'

  return (
    <article
      onClick={() => navigate(`/producto/${producto.id}`)}
      className={`group flex flex-col border rounded overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer ${wrapperCls}`}
    >
      <div className={`aspect-square flex items-center justify-center overflow-hidden ${imgBgCls}`}>
        {producto.fotos?.length > 0
          ? <img
              src={producto.fotos[0]}
              alt={producto.nombre}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          : <IconCubo dark={dark} />
        }
      </div>
      <div className="flex flex-col flex-1 p-3">
        <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest leading-none ${catCls}`}>
          {producto.categoria}
        </span>
        <h3 className={`font-black text-xs sm:text-sm mt-1 mb-2 leading-tight line-clamp-2 flex-1 ${nameCls}`}>
          {producto.nombre}
        </h3>
        <div className="flex items-center justify-between gap-1 mt-auto">
          <span className={`font-black text-sm sm:text-base ${priceCls}`}>
            {producto.precio > 0 ? `S/${producto.precio}` : 'Consultar'}
          </span>
          <button
            onClick={e => { e.stopPropagation(); onAgregar() }}
            className="px-2.5 py-1.5 bg-mekra-orange text-white text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded transition-all duration-200 hover:brightness-110 active:scale-95 whitespace-nowrap"
          >
            + Agregar
          </button>
        </div>
      </div>
    </article>
  )
}

// ── ÍCONOS SVG ─────────────────────────────────────────────────────

function IconFlecha({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

function IconChevron() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function IconCubo({ dark = true }) {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round" className={dark ? 'text-white/20' : 'text-mekra-black/20'} aria-hidden>
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
