import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { productos, siteInfo } from '../data'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

const WA_PEDIR = `https://wa.me/${siteInfo.whatsapp}?text=${encodeURIComponent(
  'Hola! Quiero hacer un pedido en Mekra3D para el Día del Padre. ¿Me ayudan? 🧡'
)}`

const OCASIONES = [
  { emoji: '👨',          nombre: 'Papá',     to: '/papa' },
  { emoji: '💞',          nombre: 'Parejas',  to: '/parejas' },
  { emoji: '🧑‍🤝‍🧑',  nombre: 'Hermanos', to: '/hermanos' },
  { emoji: '🤝',          nombre: 'Amigos',   to: '/amigos' },
]

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

function waPedido(nombre) {
  return `https://wa.me/${siteInfo.whatsapp}?text=${encodeURIComponent(
    `Hola! Me interesa "${nombre}" de Mekra3D. ¿Pueden ayudarme? 🧡`
  )}`
}

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

// ── SECCIÓN 1 — EVENTO (Día del Padre) ─────────────────────────────

function SeccionEvento() {
  return (
    <section className="bg-mekra-white min-h-[calc(100dvh-4rem)] flex flex-col items-center justify-center text-center px-6 py-14 sm:py-16">
      <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] text-mekra-black/40 mb-5">
        Hasta el 21 de junio
      </p>
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-mekra-black tracking-tight leading-[1.02] text-balance">
        Día del Padre 2026
      </h1>
      <p className="mt-5 text-lg sm:text-xl text-mekra-black/55 max-w-xl">
        El regalo que nunca olvidará
      </p>

      <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <Link
          to="/#destacados"
          className="inline-flex items-center justify-center px-8 py-4 bg-mekra-black text-mekra-white font-bold rounded-full text-sm transition-all duration-200 hover:scale-[1.03] active:scale-[0.99]"
        >
          Ver regalos
        </Link>
        <a
          href={WA_PEDIR}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-mekra-black text-mekra-black font-bold rounded-full text-sm transition-all duration-200 hover:bg-mekra-black hover:text-mekra-white"
        >
          <IconWhatsApp />
          Pedir ahora
        </a>
      </div>

      {/* Imagen del producto (placeholder por ahora) */}
      <div className="mt-12 sm:mt-16 w-full max-w-3xl">
        <div className="aspect-[4/3] sm:aspect-[16/10] rounded-3xl bg-mekra-black flex items-center justify-center px-6">
          <span className="text-mekra-white font-black text-2xl sm:text-4xl tracking-tight text-center text-balance">
            Llavero Cámara Papá
          </span>
        </div>
      </div>
    </section>
  )
}

// ── SECCIÓN 2 — DESTACADOS (grid asimétrico) ───────────────────────

function SeccionDestacados({ items }) {
  if (items.length === 0) return null
  const [grande, ...resto] = items

  return (
    <section id="destacados" className="bg-mekra-white py-16 sm:py-24 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl sm:text-4xl font-black text-mekra-black tracking-tight mb-10 sm:mb-14">
          Destacados
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 sm:gap-6">
          <CardDestacada producto={grande} grande className="lg:col-span-3" />
          <div className="lg:col-span-2 flex flex-col gap-5 sm:gap-6">
            {resto.map(p => <CardDestacada key={p.id} producto={p} />)}
          </div>
        </div>
      </div>
    </section>
  )
}

function CardDestacada({ producto, grande = false, className = '' }) {
  return (
    <article className={`group flex flex-col bg-mekra-white rounded-2xl overflow-hidden border border-mekra-black/[0.06] transition-all duration-200 hover:shadow-xl hover:shadow-mekra-black/[0.06] hover:scale-[1.02] ${className}`}>
      <Link to={`/producto/${producto.id}`} className={grande ? 'block flex-1 min-h-[240px]' : 'block'}>
        <div className={`bg-[#F5F5F7] flex items-center justify-center overflow-hidden ${grande ? 'h-full min-h-[240px]' : 'aspect-[16/10]'}`}>
          <IconCubo size={grande ? 84 : 48} />
        </div>
      </Link>
      <div className={`flex flex-col gap-2.5 ${grande ? 'px-7 pb-7 pt-4' : 'px-5 pb-5 pt-3'}`}>
        <h3 className={`text-mekra-black font-black tracking-tight ${grande ? 'text-2xl sm:text-3xl' : 'text-lg'}`}>
          {producto.nombre}
        </h3>
        <div className="flex items-center gap-5 text-sm">
          <Link to={`/producto/${producto.id}`} className="font-bold text-mekra-black hover:text-mekra-orange transition-colors duration-150">
            Ver más ›
          </Link>
          <a href={waPedido(producto.nombre)} target="_blank" rel="noopener noreferrer" className="font-bold text-mekra-orange hover:opacity-70 transition-opacity duration-150">
            Pedir ›
          </a>
        </div>
      </div>
    </article>
  )
}

// ── SECCIÓN 3 — POR OCASIÓN ────────────────────────────────────────

function SeccionOcasion() {
  return (
    <section className="bg-mekra-white py-16 sm:py-24 border-t border-mekra-black/[0.06]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl sm:text-4xl font-black text-mekra-black tracking-tight mb-10 sm:mb-14">
          ¿Para quién es el regalo?
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {OCASIONES.map(o => (
            <Link
              key={o.to}
              to={o.to}
              className="group flex flex-col items-center text-center gap-3 rounded-2xl border border-mekra-black/10 bg-mekra-white px-6 py-8 sm:py-10 transition-all duration-200 hover:border-mekra-black/25 hover:shadow-lg hover:shadow-mekra-black/[0.05] hover:scale-[1.02]"
            >
              <span className="text-4xl sm:text-5xl leading-none">{o.emoji}</span>
              <span className="text-mekra-black font-black text-base sm:text-lg">{o.nombre}</span>
              <span className="text-mekra-orange font-bold text-sm group-hover:opacity-70 transition-opacity duration-150">
                Ver regalos ›
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── SECCIÓN — SOBRE MEKRA3D ────────────────────────────────────────

function SeccionSobre() {
  return (
    <section id="sobre" className="bg-mekra-white py-20 sm:py-24 scroll-mt-20 border-t border-mekra-black/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-mekra-orange text-[10px] font-black uppercase tracking-widest mb-3">
            Nuestra historia
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-mekra-black uppercase tracking-tight mb-6">
            ¿Quiénes somos?
          </h2>
          <p className="text-mekra-black/55 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Somos un emprendimiento trujillano fundado por un ingeniero mecánico apasionado por
            la fabricación digital. Con nuestra impresora{' '}
            <strong className="text-mekra-black font-black">Bambu Lab</strong> producimos piezas
            únicas, personalizadas y de alta calidad.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5">
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
      </div>
    </section>
  )
}

// ── SECCIÓN — FAQ ──────────────────────────────────────────────────

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
              onToggle={() => setAbierto(prev => (prev === i ? null : i))}
            />
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/faq"
            className="inline-flex items-center gap-2 text-xs font-bold text-white/40 hover:text-mekra-orange uppercase tracking-widest transition-colors duration-150"
          >
            Ver todas las preguntas <span aria-hidden>›</span>
          </Link>
        </div>
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
        <span className={`text-sm font-bold leading-snug transition-colors duration-200 ${abierto ? 'text-white' : 'text-white/75'}`}>
          {faq.pregunta}
        </span>
        <span className={`shrink-0 text-mekra-orange transition-transform duration-300 ${abierto ? 'rotate-180' : ''}`} aria-hidden>
          <IconChevron />
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${abierto ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className="px-5 pb-5 text-sm text-white/45 leading-relaxed">{faq.respuesta}</p>
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

function IconWhatsApp() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  )
}
