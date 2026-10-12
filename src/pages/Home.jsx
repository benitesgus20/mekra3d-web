import { useState, useEffect, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { productos, siteInfo } from '../data'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import heroCamaraAbierta from '../assets/hero-camara-abierta.png'
import heroCamaraCerrada from '../assets/hero-camara-cerrada.png'
import { ContainerScroll } from '../components/ui/container-scroll-animation'

const WA_PEDIR = `https://wa.me/${siteInfo.whatsapp}?text=${encodeURIComponent(
  'Hola! Quiero hacer un pedido en Mekra3D para el Día del Padre. ¿Me ayudan? 🧡'
)}`

const OCASIONES = [
  { emoji: '👨',         nombre: 'Para papá',    sub: 'Regalos Día del Padre', to: '/papa' },
  { emoji: '💞',         nombre: 'Para parejas', sub: 'Detalles con significado', to: '/parejas' },
  { emoji: '🧑‍🤝‍🧑', nombre: 'Hermanos',     sub: 'Ver catálogo completo', to: '/catalogo' },
  { emoji: '🤝',         nombre: 'Amigos',       sub: 'Ver catálogo completo', to: '/catalogo' },
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
  { pregunta: '¿Cómo realizo mi pago?',                respuesta: 'Transferencia, Yape o Plin. Siempre antes de producir.' },
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
      <BandaTrust />
      <SeccionScrollShowcase />
      <SeccionDestacados items={destacados} />
      <SeccionOcasion />
      <SeccionSobre />
      <SeccionFAQ />
    </>
  )
}

// ── SECCIÓN 1 — HERO (naranja drenched) ───────────────────────────

function SeccionEvento() {
  const dias = useMemo(() => diasHasta('2026-06-21'), [])

  return (
    <section
      className="relative min-h-[calc(100dvh-4rem)] overflow-hidden flex items-center"
      style={{ background: 'radial-gradient(ellipse 130% 100% at 60% 40%, #FF6B00 0%, #D45500 100%)' }}
    >
      {/* Vignette sutil en esquinas */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 90% 90% at 50% 50%, transparent 55%, rgba(0,0,0,0.25) 100%)' }}
      />

      <div className="relative w-full max-w-7xl mx-auto px-6 lg:px-14 py-14 grid grid-cols-1 lg:grid-cols-[1fr_auto] items-center gap-8 lg:gap-16">

        {/* ── TEXTO ── */}
        <div className="flex flex-col items-start">

          {/* Badge días */}
          <div className="inline-flex items-center gap-3 bg-mekra-black/90 rounded-full px-5 py-2.5 mb-8">
            <span className="w-2 h-2 rounded-full bg-mekra-orange animate-pulse shrink-0" />
            <span className="text-white font-bold text-xs tracking-wide">
              {dias > 0 ? `${dias} días para el Día del Padre` : 'Último día'}
            </span>
            <span className="text-white/30 font-bold text-xs">· 21 jun</span>
          </div>

          {/* Heading */}
          <h1
            className="font-black text-mekra-black leading-[0.88] tracking-tight"
            style={{ fontSize: 'clamp(4.2rem, 11vw, 9.5rem)' }}
          >
            Día del<br />
            Padre<br />
            2026
          </h1>

          <p className="mt-6 text-mekra-black/55 font-medium text-base sm:text-xl max-w-md leading-relaxed">
            El regalo que nunca olvidará — personalizado con su foto, hecho en Trujillo.
          </p>

          {/* Precio */}
          <div className="mt-6 flex items-baseline gap-2">
            <span className="font-black text-mekra-black" style={{ fontSize: '3rem', lineHeight: 1 }}>
              S/10
            </span>
            <span className="text-mekra-black/40 font-bold text-sm">por unidad</span>
          </div>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/#destacados"
              className="inline-flex items-center justify-center px-8 py-4 bg-mekra-black text-white font-black rounded-full text-sm transition-all duration-200 hover:scale-[1.03] hover:bg-[#111] active:scale-[0.98] shadow-2xl shadow-black/30"
            >
              Ver regalos →
            </Link>
            <a
              href={WA_PEDIR}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 border-2 border-mekra-black/40 text-mekra-black font-black rounded-full text-sm transition-all duration-200 hover:border-mekra-black hover:bg-mekra-black/[0.08] active:scale-[0.98]"
            >
              <IconWhatsApp color="#1A1A1A" />
              Pedir ahora
            </a>
          </div>

          <p className="mt-7 text-[11px] font-black uppercase tracking-[0.25em] text-mekra-black/30">
            Hecho en Trujillo, Perú
          </p>
        </div>

        {/* ── IMAGEN — mix-blend-mode: multiply elimina el fondo blanco ── */}
        <div className="flex items-center justify-center lg:justify-end -mr-6 lg:-mr-14 self-stretch">
          <img
            src={heroCamaraAbierta}
            alt="Cámara de los Recuerdos personalizada con foto — regalo Día del Padre"
            loading="eager"
            className="w-[280px] sm:w-[360px] lg:w-[440px] xl:w-[520px] h-auto object-contain"
            style={{ mixBlendMode: 'multiply' }}
          />
        </div>

      </div>

      {/* Indicador scroll */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
        <span className="text-[9px] font-black uppercase tracking-[0.35em] text-mekra-black/30">Ver más</span>
        <span className="w-5 h-8 rounded-full border-2 border-mekra-black/20 flex items-start justify-center p-1">
          <span className="w-1 h-2 rounded-full bg-mekra-black/40 animate-mekra-float" />
        </span>
      </div>
    </section>
  )
}

// ── SCROLL SHOWCASE ───────────────────────────────────────────────

function SeccionScrollShowcase() {
  return (
    <section className="bg-mekra-white overflow-hidden">
      <ContainerScroll
        titleComponent={
          <div className="flex flex-col items-center gap-4">
            {/* Etiqueta superior */}
            <span className="inline-flex items-center gap-2 bg-mekra-orange/10 text-mekra-orange text-xs font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full border border-mekra-orange/20">
              ★ Más pedido en Trujillo
            </span>

            {/* Título */}
            <h2 className="text-mekra-black font-black leading-none tracking-tight"
                style={{ fontSize: 'clamp(2.4rem, 6vw, 5.5rem)' }}>
              La Cámara de<br />
              <span className="text-mekra-orange">los Recuerdos</span>
            </h2>

            {/* Subtítulo */}
            <p className="text-mekra-black/40 font-medium text-base sm:text-lg max-w-md leading-relaxed">
              Se abre. Adentro está él — en la foto que tú eligiste.
            </p>

            {/* Badge precio + CTA */}
            <div className="flex items-center gap-4 mt-2">
              <span className="font-black text-mekra-black" style={{ fontSize: '2.2rem', lineHeight: 1 }}>
                S/10
              </span>
              <Link
                to="/producto/llavero-camara-papa"
                className="inline-flex items-center gap-2 px-7 py-3 bg-mekra-black text-white font-black text-sm rounded-full transition-all duration-200 hover:bg-mekra-orange hover:scale-[1.03] active:scale-[0.98]"
              >
                Ver el producto →
              </Link>
            </div>

            {/* Indicador de scroll */}
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-mekra-black/20 mt-3">
              Desplázate para ver
            </p>
          </div>
        }
      >
        {/* Contenido dentro de la tarjeta 3D */}
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] relative overflow-hidden">

          {/* Glow naranja de fondo */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 70% 60% at 50% 60%, rgba(255,107,0,0.18) 0%, transparent 70%)',
            }}
          />

          {/* Imagen del producto */}
          <img
            src={heroCamaraAbierta}
            alt="Cámara de los Recuerdos abierta — llavero personalizado"
            draggable={false}
            className="relative z-10 h-[85%] w-auto object-contain select-none"
            style={{ mixBlendMode: 'screen', filter: 'drop-shadow(0 20px 60px rgba(255,107,0,0.35))' }}
          />

          {/* Etiquetas flotantes — colores disponibles */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-20">
            {['Negro', 'Gris', 'Azul'].map(c => (
              <span
                key={c}
                className="bg-white/10 border border-white/20 text-white/70 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full backdrop-blur-sm"
              >
                {c}
              </span>
            ))}
          </div>

          {/* Badge precio en esquina */}
          <div className="absolute top-5 right-5 z-20 bg-mekra-orange text-white font-black text-xs px-4 py-2 rounded-full shadow-lg shadow-mekra-orange/40">
            S/10 🎁
          </div>
        </div>
      </ContainerScroll>
    </section>
  )
}

// ── BANDA DE CONFIANZA ─────────────────────────────────────────────

function BandaTrust() {
  const items = [
    { icon: '📍', text: 'Hecho en Trujillo' },
    { icon: '⚡', text: 'Lista en 2-3 días' },
    { icon: '🎁', text: '+23 regalos entregados' },
    { icon: '✓',  text: 'Garantía incluida' },
    { icon: '💳', text: 'Yape · Plin · Transferencia' },
  ]
  return (
    <div className="bg-mekra-black py-4 overflow-x-auto">
      <ul className="flex items-center justify-start sm:justify-center gap-8 px-6 min-w-max sm:min-w-0">
        {items.map(({ icon, text }) => (
          <li key={text} className="flex items-center gap-2 shrink-0">
            <span className="text-mekra-orange text-sm" aria-hidden>{icon}</span>
            <span className="text-white/45 text-xs font-bold whitespace-nowrap">{text}</span>
          </li>
        ))}
      </ul>
    </div>
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
          <div>
            <h2 className="text-3xl sm:text-4xl font-black text-mekra-black tracking-tight leading-tight">
              Para el 21 de junio
            </h2>
            <p className="text-mekra-black/40 text-sm font-medium mt-1.5">
              Regalos personalizados, listos en 2-3 días
            </p>
          </div>
          <Link
            to="/catalogo"
            className="shrink-0 inline-flex items-center gap-1.5 text-sm font-bold text-mekra-black/35 hover:text-mekra-orange transition-colors duration-150"
          >
            Ver catálogo ›
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
  const esCamara  = producto.id === 'llavero-camara-papa'

  return (
    <article className={`group relative flex flex-col bg-white rounded-3xl overflow-hidden border border-mekra-black/[0.06] transition-all duration-300 hover:shadow-2xl hover:shadow-mekra-black/[0.12] hover:-translate-y-1.5 ${className}`}>

      {/* Badge Destacado en la cámara */}
      {esCamara && (
        <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 bg-mekra-orange text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg shadow-mekra-orange/30">
          ★ Más pedido
        </div>
      )}

      <Link to={`/producto/${producto.id}`} className={grande ? 'block flex-1 min-h-[300px]' : 'block'}>
        <div className={`bg-[#F0F0F2] flex items-center justify-center overflow-hidden ${grande ? 'h-full min-h-[300px]' : 'aspect-[16/10]'}`}>
          {imagenSrc
            ? <img
                src={imagenSrc}
                alt={producto.nombre}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
              />
            : <PlaceholderCard nombre={producto.nombre} precio={producto.precio} />
          }
        </div>
      </Link>

      <div className={`flex flex-col gap-3 ${grande ? 'px-7 pb-7 pt-5' : 'px-5 pb-5 pt-4'}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className={`text-mekra-black font-black tracking-tight leading-snug ${grande ? 'text-xl sm:text-2xl' : 'text-base'}`}>
              {producto.nombre}
            </h3>
            {esCamara && (
              <p className="text-mekra-black/40 text-xs font-bold mt-1">Negro · Gris · Azul</p>
            )}
          </div>
          {producto.precio > 0 && (
            <div className="shrink-0 flex flex-col items-end">
              <span className={`font-black text-mekra-orange tabular-nums leading-none ${grande ? 'text-3xl' : 'text-2xl'}`}>
                S/{producto.precio}
              </span>
              <span className="text-mekra-black/25 text-[10px] font-bold mt-0.5">por unidad</span>
            </div>
          )}
        </div>

        {grande && producto.descripcion && (
          <p className="text-sm text-mekra-black/40 leading-relaxed line-clamp-2">
            {producto.descripcion}
          </p>
        )}

        <div className="flex items-center gap-3 mt-1">
          <Link
            to={`/producto/${producto.id}`}
            className="flex-1 inline-flex items-center justify-center py-2.5 px-4 bg-mekra-black text-white font-black text-xs rounded-full transition-all duration-200 hover:bg-mekra-orange active:scale-[0.98]"
          >
            Ver producto
          </Link>
          <a
            href={waPedido(producto.nombre)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-mekra-black/10 text-mekra-orange hover:bg-mekra-orange hover:text-white transition-all duration-200 hover:border-mekra-orange"
            aria-label="Pedir por WhatsApp"
          >
            <IconWhatsApp size={15} />
          </a>
        </div>
      </div>
    </article>
  )
}

function PlaceholderCard({ nombre, precio }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3 px-6 bg-gradient-to-br from-[#F5F5F7] to-[#EBEBED]">
      <span className="text-mekra-black/20 font-black text-center text-lg leading-tight tracking-tight">
        {nombre}
      </span>
      {precio > 0 && (
        <span className="text-mekra-orange font-black text-2xl tabular-nums">S/{precio}</span>
      )}
    </div>
  )
}

// ── SECCIÓN 3 — OCASIÓN ────────────────────────────────────────────

function SeccionOcasion() {
  return (
    <section className="bg-[#F5F5F7] py-16 sm:py-24 border-t border-mekra-black/[0.04]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-10 sm:mb-14">
          <h2 className="text-3xl sm:text-4xl font-black text-mekra-black tracking-tight">
            ¿Para quién es el regalo?
          </h2>
          <p className="text-mekra-black/40 text-sm font-medium mt-2">
            Personalizamos para cada ocasión
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {OCASIONES.map(o => (
            <Link
              key={o.to + o.nombre}
              to={o.to}
              className="group flex items-center gap-4 bg-white rounded-2xl px-6 py-5 border border-transparent transition-all duration-200 hover:border-mekra-orange/20 hover:shadow-xl hover:shadow-mekra-black/[0.07] hover:-translate-y-0.5"
            >
              <span className="text-4xl leading-none shrink-0">{o.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-mekra-black font-black text-base leading-tight">{o.nombre}</p>
                <p className="text-mekra-black/35 text-xs font-medium mt-0.5 truncate">{o.sub}</p>
              </div>
              <span className="text-mekra-orange opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0">
                <IconChevronRight />
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          <div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight text-balance mb-6">
              Regalos que se guardan para siempre
            </h2>
            <p className="text-white/40 text-base leading-relaxed mb-8">
              Somos Gustavo y Paty, en Trujillo. Cada regalo lleva adentro algo que importa: la foto de un momento, el recuerdo de una persona. No hay dos iguales.
            </p>
            <a
              href={WA_PEDIR}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-mekra-orange text-white font-black rounded-full text-sm transition-all duration-200 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98]"
            >
              <IconWhatsApp />
              Hacer mi pedido
            </a>
          </div>

          <div className="grid grid-cols-2 gap-5">
            {PASOS.map(paso => (
              <div
                key={paso.n}
                className="flex flex-col gap-3 bg-white/[0.04] rounded-2xl p-5 border border-white/[0.06]"
              >
                <span className="font-black text-mekra-orange tabular-nums leading-none" style={{ fontSize: '2rem' }}>
                  {paso.n}
                </span>
                <div>
                  <p className="font-black text-white text-sm leading-snug mb-1.5">{paso.titulo}</p>
                  <p className="text-white/30 text-xs leading-relaxed">{paso.desc}</p>
                </div>
              </div>
            ))}
          </div>

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

        <div className="flex items-end justify-between gap-4 mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Preguntas frecuentes
          </h2>
          <Link
            to="/faq"
            className="shrink-0 text-xs font-bold text-white/25 hover:text-mekra-orange uppercase tracking-widest transition-colors duration-150"
          >
            Ver todas ›
          </Link>
        </div>

        <div className="space-y-2">
          {FAQS_HOME.map((faq, i) => (
            <ItemFAQ
              key={i}
              faq={faq}
              abierto={abierto === i}
              onToggle={() => setAbierto(prev => (prev === i ? null : i))}
            />
          ))}
        </div>

      </div>
    </section>
  )
}

function ItemFAQ({ faq, abierto, onToggle }) {
  return (
    <div className={`rounded-xl border transition-all duration-200 ${
      abierto ? 'border-mekra-orange/30 bg-white/[0.04]' : 'border-white/[0.07] hover:border-white/15'
    }`}>
      <button
        onClick={onToggle}
        aria-expanded={abierto}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className={`text-sm font-bold leading-snug transition-colors duration-200 ${abierto ? 'text-white' : 'text-white/60'}`}>
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

function IconChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

function IconWhatsApp({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  )
}
