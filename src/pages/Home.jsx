import { useState, useEffect, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { productos, siteInfo } from '../data'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import heroCamaraAbierta from '../assets/hero-camara-abierta.png'
import heroCamaraCerrada from '../assets/hero-camara-cerrada.png'

const WA_PEDIR = `https://wa.me/${siteInfo.whatsapp}?text=${encodeURIComponent(
  'Hola! Quiero hacer un pedido en Mekra3D para el Día del Padre. ¿Me ayudan? 🧡'
)}`

const OCASIONES = [
  { emoji: '👨',         nombre: 'Papá',     to: '/papa' },
  { emoji: '💞',         nombre: 'Parejas',  to: '/parejas' },
  { emoji: '🧑‍🤝‍🧑', nombre: 'Hermanos', to: '/catalogo' },
  { emoji: '🤝',         nombre: 'Amigos',   to: '/catalogo' },
]

const PASOS = [
  { n: '01', titulo: 'Tú eliges la foto',       desc: 'La que más lo represente. Por WhatsApp en segundos.' },
  { n: '02', titulo: 'Nosotros personalizamos', desc: 'Cada pieza se adapta especialmente para él.' },
  { n: '03', titulo: 'Revisamos todo',           desc: 'Ningún regalo sale sin pasar por nuestras manos.' },
  { n: '04', titulo: 'Llega a tiempo',           desc: 'Delivery en Trujillo o courier a todo el Perú.' },
]

const FAQS_HOME = [
  { pregunta: '¿Cuánto tiempo demora mi pedido?',      respuesta: 'Entre 1 y 3 días hábiles según el diseño.' },
  { pregunta: '¿Hacen envíos fuera de Trujillo?',      respuesta: 'Sí, enviamos a todo el Perú por Shalom u Olva Courier.' },
  { pregunta: '¿Puedo pedir un diseño personalizado?',  respuesta: 'Sí, escríbenos por WhatsApp y lo cotizamos sin compromiso.' },
  { pregunta: '¿Cómo realizo mi pago?',                respuesta: 'El pago es por transferencia, Yape o Plin antes de producir.' },
  { pregunta: '¿Tienen garantía?',                     respuesta: 'Si el producto llega con defecto lo reemplazamos sin costo.' },
]

function waPedido(nombre) {
  return `https://wa.me/${siteInfo.whatsapp}?text=${encodeURIComponent(
    `Hola! Me interesa "${nombre}" de Mekra3D. ¿Pueden ayudarme? 🧡`
  )}`
}

function diasHasta(fechaISO) {
  const diff = new Date(fechaISO) - new Date()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

const IMAGEN_PRODUCTO = {
  'llavero-camara-papa': heroCamaraCerrada,
}

// ── ROOT ───────────────────────────────────────────────────────────

export default function Home() {
  useDocumentTitle()
  const location = useLocation()

  useEffect(() => {
    if (!location.hash) return
    const el = document.getElementById(location.hash.slice(1))
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 80)
  }, [location.hash])

  const destacados = productos.filter(p => p.activo).slice(0, 3)

  return (
    <>
      <SeccionEvento />
      <SeccionDestacados items={destacados} />
      <SeccionOcasion />
      <SeccionSobre />
      <SeccionFAQ />
    </>
  )
}

// ── SECCIÓN 1 — HERO ───────────────────────────────────────────────

function SeccionEvento() {
  const dias = useMemo(() => diasHasta('2026-06-21'), [])

  return (
    <section className="relative bg-mekra-black min-h-[calc(100dvh-4rem)] flex items-center overflow-hidden">

      {/* Halo de luz naranja detrás del producto */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[60vw] max-w-2xl aspect-square rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,107,0,0.18) 0%, transparent 70%)' }}
        aria-hidden
      />

      <div className="relative w-full max-w-7xl mx-auto px-6 lg:px-12 py-16 flex flex-col lg:flex-row items-center gap-10 lg:gap-0">

        {/* ── TEXTO ── */}
        <div className="flex-1 flex flex-col items-center text-center lg:items-start lg:text-left lg:pr-12 z-10">

          {/* Badge */}
          <div className="inline-flex items-center gap-0 rounded-full overflow-hidden border border-white/[0.12] mb-8">
            <span className="bg-mekra-orange px-4 py-1.5 text-xs font-black text-white leading-none">
              {dias > 0 ? `${dias} días` : 'Hoy'}
            </span>
            <span className="px-4 py-1.5 text-xs font-bold text-white/50 leading-none">
              21 de junio
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-black text-mekra-white leading-[0.9] tracking-tight text-balance"
              style={{ fontSize: 'clamp(3.5rem, 9vw, 7rem)' }}>
            Día del<br />
            Padre<br />
            <span className="text-mekra-orange">2026</span>
          </h1>

          <p className="mt-6 text-mekra-white/45 text-base sm:text-lg max-w-xs lg:max-w-sm leading-relaxed">
            El regalo que nunca olvidará
          </p>

          {/* Precio */}
          <div className="mt-5 flex items-center gap-3 flex-wrap justify-center lg:justify-start">
            <span className="text-mekra-white/35 text-sm font-bold">
              Desde{' '}
              <span className="text-mekra-orange font-black" style={{ fontSize: '1.5rem' }}>S/10</span>
            </span>
            <span className="w-px h-4 bg-white/15" aria-hidden />
            <span className="text-mekra-white/30 text-xs font-bold">+23 regalos entregados</span>
          </div>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <Link
              to="/#destacados"
              className="inline-flex items-center justify-center px-8 py-4 bg-mekra-orange text-mekra-white font-black rounded-full text-sm transition-all duration-200 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-mekra-orange/30"
            >
              Ver regalos
            </Link>
            <a
              href={WA_PEDIR}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-mekra-white font-bold rounded-full text-sm transition-all duration-200 hover:bg-white/[0.06] hover:border-white/35 active:scale-[0.98]"
            >
              <IconWhatsApp />
              Pedir ahora
            </a>
          </div>

          <p className="mt-8 text-[10px] font-black uppercase tracking-[0.3em] text-mekra-white/20">
            Hecho en Trujillo, Perú
          </p>
        </div>

        {/* ── IMAGEN ── */}
        <div className="relative flex-1 flex items-center justify-center lg:justify-end max-w-xs sm:max-w-sm lg:max-w-none lg:w-[45%]">
          <img
            src={heroCamaraAbierta}
            alt="Cámara de los Recuerdos — llavero personalizado con foto para el Día del Padre"
            className="w-full max-w-[340px] lg:max-w-[460px] h-auto object-contain"
            style={{ filter: 'drop-shadow(0 30px 80px rgba(255,107,0,0.30)) drop-shadow(0 10px 30px rgba(0,0,0,0.5))' }}
            loading="eager"
          />
        </div>

      </div>
    </section>
  )
}

// ── SECCIÓN 2 — DESTACADOS ─────────────────────────────────────────

function SeccionDestacados({ items }) {
  if (items.length === 0) return null
  const [grande, ...resto] = items

  return (
    <section id="destacados" className="bg-mekra-white py-16 sm:py-24 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-end justify-between mb-10 sm:mb-14 gap-4">
          <h2 className="text-3xl sm:text-4xl font-black text-mekra-black tracking-tight leading-tight">
            Para el 21<br className="sm:hidden" /> de junio
          </h2>
          <Link
            to="/catalogo"
            className="shrink-0 text-sm font-bold text-mekra-black/35 hover:text-mekra-orange transition-colors duration-150"
          >
            Ver todo ›
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-5">
          <CardDestacada producto={grande} grande className="lg:col-span-3" />
          <div className="lg:col-span-2 flex flex-col gap-4 sm:gap-5">
            {resto.map(p => <CardDestacada key={p.id} producto={p} />)}
          </div>
        </div>
      </div>
    </section>
  )
}

function CardDestacada({ producto, grande = false, className = '' }) {
  const imagenSrc = IMAGEN_PRODUCTO[producto.id] ?? producto.fotos?.[0] ?? null

  return (
    <article className={`group flex flex-col bg-white rounded-2xl overflow-hidden border border-mekra-black/[0.07] transition-all duration-300 hover:shadow-2xl hover:shadow-mekra-black/[0.1] hover:-translate-y-1 ${className}`}>

      <Link to={`/producto/${producto.id}`} className={grande ? 'block flex-1 min-h-[280px]' : 'block'}>
        <div className={`bg-[#F2F2F4] flex items-center justify-center overflow-hidden ${grande ? 'h-full min-h-[280px]' : 'aspect-[16/10]'}`}>
          {imagenSrc
            ? <img
                src={imagenSrc}
                alt={producto.nombre}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
              />
            : <IconCubo size={grande ? 84 : 48} />
          }
        </div>
      </Link>

      <div className={`flex flex-col gap-3 ${grande ? 'px-7 pb-7 pt-5' : 'px-5 pb-5 pt-4'}`}>
        <div className="flex items-start justify-between gap-3">
          <h3 className={`text-mekra-black font-black tracking-tight leading-snug ${grande ? 'text-2xl sm:text-3xl' : 'text-base sm:text-lg'}`}>
            {producto.nombre}
          </h3>
          {producto.precio > 0 && (
            <span className={`shrink-0 font-black text-mekra-orange tabular-nums leading-none ${grande ? 'text-2xl sm:text-3xl' : 'text-xl'}`}>
              S/{producto.precio}
            </span>
          )}
        </div>

        {grande && producto.descripcion && (
          <p className="text-sm text-mekra-black/40 leading-relaxed line-clamp-2">
            {producto.descripcion}
          </p>
        )}

        <div className="flex items-center gap-4 text-sm mt-1">
          <Link
            to={`/producto/${producto.id}`}
            className="font-black text-mekra-black hover:text-mekra-orange transition-colors duration-150"
          >
            Ver más ›
          </Link>
          <a
            href={waPedido(producto.nombre)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-black text-mekra-orange hover:opacity-70 transition-opacity duration-150"
          >
            <IconWhatsApp size={13} />
            Pedir
          </a>
        </div>
      </div>
    </article>
  )
}

// ── SECCIÓN 3 — OCASIÓN ────────────────────────────────────────────

function SeccionOcasion() {
  return (
    <section className="bg-[#F5F5F7] py-16 sm:py-24 border-t border-mekra-black/[0.05]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-black text-mekra-black tracking-tight mb-10 sm:mb-14">
          ¿Para quién es<br className="sm:hidden" /> el regalo?
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {OCASIONES.map(o => (
            <Link
              key={o.to + o.nombre}
              to={o.to}
              className="group flex flex-col items-center text-center gap-3 rounded-2xl bg-mekra-white border border-transparent px-6 py-8 sm:py-10 transition-all duration-200 hover:border-mekra-orange/25 hover:shadow-xl hover:shadow-mekra-black/[0.06] hover:-translate-y-0.5"
            >
              <span className="text-4xl sm:text-5xl leading-none">{o.emoji}</span>
              <span className="text-mekra-black font-black text-base sm:text-lg">{o.nombre}</span>
              <span className="text-mekra-orange font-bold text-sm opacity-70 group-hover:opacity-100 transition-opacity duration-150">
                Ver regalos ›
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── SECCIÓN 4 — SOBRE ──────────────────────────────────────────────

function SeccionSobre() {
  return (
    <section id="sobre" className="bg-mekra-black py-20 sm:py-28 scroll-mt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="max-w-2xl mb-14">
          <h2 className="text-3xl sm:text-4xl font-black text-mekra-white tracking-tight leading-tight text-balance mb-5">
            Regalos que se guardan para siempre
          </h2>
          <p className="text-mekra-white/45 text-base sm:text-lg leading-relaxed">
            Somos Gustavo y Paty, en Trujillo. Cada regalo que hacemos lleva adentro algo que importa: la foto de un momento, el recuerdo de una persona. No hay dos iguales.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {PASOS.map(paso => (
            <div key={paso.n} className="flex flex-col gap-3">
              <span className="font-black text-mekra-orange leading-none tabular-nums" style={{ fontSize: '2.5rem' }}>
                {paso.n}
              </span>
              <div>
                <p className="font-black text-mekra-white text-sm leading-snug mb-2">{paso.titulo}</p>
                <p className="text-mekra-white/30 text-xs leading-relaxed">{paso.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── SECCIÓN 5 — FAQ ────────────────────────────────────────────────

function SeccionFAQ() {
  const [abierto, setAbierto] = useState(null)

  return (
    <section id="faq" className="bg-mekra-black border-t border-white/[0.05] py-20 sm:py-24 scroll-mt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-black text-mekra-white tracking-tight mb-10">
          Preguntas frecuentes
        </h2>

        <div className="space-y-2 mb-8">
          {FAQS_HOME.map((faq, i) => (
            <ItemFAQ
              key={i}
              faq={faq}
              abierto={abierto === i}
              onToggle={() => setAbierto(prev => (prev === i ? null : i))}
            />
          ))}
        </div>

        <Link
          to="/faq"
          className="inline-flex items-center gap-2 text-xs font-bold text-white/25 hover:text-mekra-orange uppercase tracking-widest transition-colors duration-150"
        >
          Ver todas las preguntas ›
        </Link>
      </div>
    </section>
  )
}

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
        <span className={`text-sm font-bold leading-snug transition-colors duration-200 ${abierto ? 'text-white' : 'text-white/65'}`}>
          {faq.pregunta}
        </span>
        <span className={`shrink-0 text-mekra-orange transition-transform duration-300 ${abierto ? 'rotate-180' : ''}`} aria-hidden>
          <IconChevron />
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${abierto ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className="px-5 pb-5 text-sm text-white/35 leading-relaxed">{faq.respuesta}</p>
      </div>
    </div>
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

function IconChevron() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function IconWhatsApp({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  )
}
