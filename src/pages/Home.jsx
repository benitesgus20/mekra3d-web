import { useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'motion/react'
import { productos, siteInfo } from '../data'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import heroCamaraAbierta from '../assets/hero-camara-abierta.png'
import heroCamaraCerrada from '../assets/hero-camara-cerrada.png'

const WA = `https://wa.me/${siteInfo.whatsapp}?text=${encodeURIComponent(
  'Hola! Quiero hacer un pedido en Mekra3D para el Día del Padre 🧡'
)}`

function diasHasta(iso) {
  return Math.max(0, Math.ceil((new Date(iso) - new Date()) / 86400000))
}

function waPedido(nombre) {
  return `https://wa.me/${siteInfo.whatsapp}?text=${encodeURIComponent(
    `Hola! Me interesa "${nombre}" de Mekra3D. ¿Pueden ayudarme? 🧡`
  )}`
}

// ── Pop-in al entrar en viewport ──────────────────────────────────
function Pop({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.45, delay, ease: [0.34, 1.56, 0.64, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ── ROOT ──────────────────────────────────────────────────────────
export default function Home() {
  useDocumentTitle()
  const destacados = productos.filter(p => p.activo)

  return (
    <div className="bg-mekra-paper">
      <TiraMarquee />
      <HeroBento />
      <TiraMarquee invert />
      <Beneficios />
      <Catalogo items={destacados} />
      <Proceso />
      <CtaBrutal />
    </div>
  )
}

// ── TIRA MARQUEE ──────────────────────────────────────────────────
function TiraMarquee({ invert = false }) {
  const items = ['PERSONALIZADO', 'HECHO A MANO', 'TRUJILLO PERÚ', 'LISTO EN 2-3 DÍAS', 'DÍA DEL PADRE']
  const fila = [...items, ...items, ...items, ...items]
  return (
    <div className={`overflow-hidden border-y-2 border-mekra-black py-2.5 ${invert ? 'bg-mekra-yellow' : 'bg-mekra-orange'}`}>
      <div className="flex whitespace-nowrap animate-mekra-marquee w-max">
        {fila.map((t, i) => (
          <span key={i} className="flex items-center text-mekra-black text-sm font-black uppercase tracking-tight px-4">
            {t} <span className="px-4 text-lg">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}

// ── 1. HERO BENTO ─────────────────────────────────────────────────
function HeroBento() {
  const dias = useMemo(() => diasHasta('2026-06-21'), [])

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">

        {/* Caja principal — título */}
        <Pop className="lg:col-span-8">
          <div className="relative h-full bg-mekra-orange border-2 border-mekra-black shadow-brutal-lg p-7 sm:p-10 overflow-hidden">
            {/* Sticker rotado */}
            <span className="absolute top-5 right-5 sm:top-7 sm:right-8 z-10 inline-block bg-mekra-black text-mekra-yellow text-xs font-black uppercase tracking-wide px-4 py-2 rotate-6 border-2 border-mekra-black">
              ★ Más pedido
            </span>

            <span className="inline-block bg-mekra-paper border-2 border-mekra-black text-mekra-black text-xs font-black uppercase tracking-wider px-3 py-1.5 mb-6">
              🎁 Edición Día del Padre
            </span>

            <h1
              className="text-mekra-black font-black uppercase leading-[0.85] tracking-tighter"
              style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}
            >
              El regalo<br />
              que <span className="bg-mekra-black text-mekra-orange px-2 inline-block -rotate-1">nunca</span><br />
              olvidará
            </h1>

            <p className="mt-6 text-mekra-black font-bold text-base sm:text-xl max-w-md leading-snug">
              Una cámara que se abre y muestra su foto adentro. Hecha a mano en Trujillo.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={WA}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-mekra-black text-mekra-white font-black text-sm uppercase tracking-wide px-7 py-4 border-2 border-mekra-black shadow-brutal-sm hover-brutal"
              >
                <SvgWhatsApp />
                Pedir ahora
              </a>
              <Link
                to="/producto/llavero-camara-papa"
                className="inline-flex items-center bg-mekra-paper text-mekra-black font-black text-sm uppercase tracking-wide px-7 py-4 border-2 border-mekra-black shadow-brutal-sm hover-brutal"
              >
                Ver pieza →
              </Link>
            </div>
          </div>
        </Pop>

        {/* Columna derecha — 2 cajas apiladas */}
        <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-5">

          {/* Caja contador */}
          <Pop delay={0.1}>
            <div className="h-full bg-mekra-yellow border-2 border-mekra-black shadow-brutal p-5 sm:p-6 flex flex-col justify-center text-center">
              <span className="font-black text-mekra-black tabular-nums leading-none" style={{ fontSize: 'clamp(3rem, 9vw, 5rem)' }}>
                {dias}
              </span>
              <span className="text-mekra-black font-black uppercase text-xs tracking-wider mt-2">
                días para<br />el 21 de junio
              </span>
            </div>
          </Pop>

          {/* Caja precio */}
          <Pop delay={0.2}>
            <div className="h-full bg-mekra-blue border-2 border-mekra-black shadow-brutal p-5 sm:p-6 flex flex-col justify-center text-center">
              <span className="text-mekra-white font-black uppercase text-xs tracking-wider mb-1">desde</span>
              <span className="font-black text-mekra-white leading-none" style={{ fontSize: 'clamp(3rem, 9vw, 5rem)' }}>
                S/10
              </span>
              <span className="text-mekra-white/80 font-bold uppercase text-xs tracking-wide mt-2">por unidad</span>
            </div>
          </Pop>
        </div>

        {/* Banda inferior — imagen producto full width */}
        <Pop delay={0.15} className="lg:col-span-12">
          <div className="relative bg-mekra-black border-2 border-mekra-black shadow-brutal-lg overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-3 items-center">
              {/* Imagen */}
              <div className="sm:col-span-1 flex items-center justify-center p-6 bg-mekra-paper border-b-2 sm:border-b-0 sm:border-r-2 border-mekra-black">
                <img
                  src={heroCamaraAbierta}
                  alt="Cámara de los Recuerdos"
                  className="w-[200px] h-auto object-contain animate-mekra-float"
                  style={{ mixBlendMode: 'multiply' }}
                />
              </div>
              {/* Texto */}
              <div className="sm:col-span-2 p-7 sm:p-10">
                <p className="text-mekra-yellow font-black uppercase text-xs tracking-[0.2em] mb-3">Cómo funciona</p>
                <p className="text-mekra-white font-black text-xl sm:text-3xl leading-tight tracking-tight">
                  Eliges su foto → la imprimimos a color → la cámara la guarda para siempre.
                </p>
              </div>
            </div>
          </div>
        </Pop>
      </div>
    </section>
  )
}

// ── 2. BENEFICIOS — 3 cajas de colores ───────────────────────────
const BENEFICIOS = [
  { icon: '📸', titulo: 'Su foto adentro', desc: 'Se abre como cámara real y revela la imagen que tú elijas.', bg: 'bg-mekra-yellow', fg: 'text-mekra-black' },
  { icon: '🏡', titulo: 'Hecho en Trujillo', desc: 'Gustavo y Paty arman cada pieza a mano. Cero fábrica.', bg: 'bg-mekra-blue', fg: 'text-mekra-white' },
  { icon: '⚡', titulo: 'Listo en 2-3 días', desc: 'Delivery local o courier a todo el Perú. A tiempo, siempre.', bg: 'bg-mekra-orange', fg: 'text-mekra-black' },
]

function Beneficios() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <Pop className="mb-10">
        <h2 className="text-mekra-black font-black uppercase tracking-tighter leading-none inline-block bg-mekra-yellow border-2 border-mekra-black shadow-brutal-sm px-5 py-3 -rotate-1"
            style={{ fontSize: 'clamp(1.6rem, 4.5vw, 3rem)' }}>
          ¿Por qué Mekra3D?
        </h2>
      </Pop>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {BENEFICIOS.map((b, i) => (
          <Pop key={b.titulo} delay={i * 0.1}>
            <div className={`h-full ${b.bg} border-2 border-mekra-black shadow-brutal p-7 hover-brutal`}>
              <span className="inline-flex items-center justify-center w-14 h-14 bg-mekra-paper border-2 border-mekra-black text-3xl mb-5">
                {b.icon}
              </span>
              <h3 className={`${b.fg} font-black uppercase text-xl tracking-tight mb-2`}>{b.titulo}</h3>
              <p className={`${b.fg} font-bold text-sm leading-snug ${b.fg === 'text-mekra-white' ? 'opacity-90' : 'opacity-80'}`}>
                {b.desc}
              </p>
            </div>
          </Pop>
        ))}
      </div>
    </section>
  )
}

// ── 3. CATÁLOGO — cards brutalistas ──────────────────────────────
function Catalogo({ items }) {
  if (!items.length) return null

  return (
    <section id="catalogo" className="bg-mekra-black border-y-2 border-mekra-black py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <Pop className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <h2 className="text-mekra-white font-black uppercase tracking-tighter leading-none"
              style={{ fontSize: 'clamp(1.8rem, 5vw, 3.5rem)' }}>
            Para el <span className="bg-mekra-orange text-mekra-black px-2">21 de junio</span>
          </h2>
          <Link to="/catalogo"
                className="bg-mekra-yellow text-mekra-black font-black uppercase text-xs tracking-wide px-5 py-3 border-2 border-mekra-yellow shadow-brutal-sm hover-brutal">
            Ver catálogo →
          </Link>
        </Pop>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((p, i) => (
            <Pop key={p.id} delay={i * 0.07}>
              <CardProducto producto={p} />
            </Pop>
          ))}
        </div>
      </div>
    </section>
  )
}

function CardProducto({ producto }) {
  const img = producto.id === 'llavero-camara-papa' ? heroCamaraCerrada : null
  const esCamara = producto.id === 'llavero-camara-papa'
  const bgImg = esCamara ? 'bg-mekra-orange' : 'bg-mekra-yellow'

  return (
    <article className="flex flex-col h-full bg-mekra-paper border-2 border-mekra-black shadow-brutal hover-brutal overflow-hidden">

      {/* Imagen */}
      <div className={`relative aspect-square ${bgImg} border-b-2 border-mekra-black flex items-center justify-center overflow-hidden`}>
        {img
          ? <img src={img} alt={producto.nombre} className="w-full h-full object-cover" style={{ mixBlendMode: 'multiply' }} />
          : <span className="text-mekra-black/40 font-black uppercase text-xs text-center px-4">{producto.categoria}</span>
        }
        {esCamara && (
          <span className="absolute top-3 left-3 bg-mekra-black text-mekra-yellow text-[10px] font-black uppercase px-2.5 py-1 border-2 border-mekra-black -rotate-3">
            ★ Popular
          </span>
        )}
        <span className="absolute bottom-3 right-3 bg-mekra-paper text-mekra-black font-black text-lg px-3 py-1 border-2 border-mekra-black">
          S/{producto.precio}
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <h3 className="text-mekra-black font-black uppercase text-sm tracking-tight leading-tight">{producto.nombre}</h3>
        {producto.descripcion && (
          <p className="text-mekra-black/60 font-medium text-xs leading-snug line-clamp-2">{producto.descripcion}</p>
        )}
        <div className="flex gap-2 mt-auto pt-1">
          <Link
            to={`/producto/${producto.id}`}
            className="flex-1 inline-flex items-center justify-center bg-mekra-black text-mekra-white font-black uppercase text-[11px] tracking-wide py-2.5 px-3 border-2 border-mekra-black hover:bg-mekra-orange hover:text-mekra-black transition-colors duration-150"
          >
            Ver más
          </Link>
          <a
            href={waPedido(producto.nombre)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-10 h-10 bg-mekra-orange text-mekra-black border-2 border-mekra-black hover:bg-mekra-black hover:text-mekra-white transition-colors duration-150"
            aria-label="Pedir por WhatsApp"
          >
            <SvgWhatsApp size={15} />
          </a>
        </div>
      </div>
    </article>
  )
}

// ── 4. PROCESO — pasos en cajas numeradas ────────────────────────
const PASOS = [
  { n: '1', titulo: 'Eliges la foto', desc: 'Nos la mandas por WhatsApp.' },
  { n: '2', titulo: 'Personalizamos', desc: 'Armamos tu pieza a mano.' },
  { n: '3', titulo: 'La recibes', desc: 'Delivery o courier en 2-3 días.' },
]

function Proceso() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <Pop className="mb-10">
        <h2 className="text-mekra-black font-black uppercase tracking-tighter leading-none inline-block bg-mekra-blue text-mekra-white border-2 border-mekra-black shadow-brutal-sm px-5 py-3 rotate-1"
            style={{ fontSize: 'clamp(1.6rem, 4.5vw, 3rem)' }}>
          Pedir es fácil
        </h2>
      </Pop>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {PASOS.map((paso, i) => (
          <Pop key={paso.n} delay={i * 0.12}>
            <div className="h-full bg-mekra-paper border-2 border-mekra-black shadow-brutal p-7 flex items-start gap-5 hover-brutal">
              <span className="shrink-0 flex items-center justify-center w-16 h-16 bg-mekra-orange text-mekra-black font-black border-2 border-mekra-black" style={{ fontSize: '2.2rem' }}>
                {paso.n}
              </span>
              <div>
                <h3 className="text-mekra-black font-black uppercase text-lg tracking-tight mb-1">{paso.titulo}</h3>
                <p className="text-mekra-black/65 font-bold text-sm leading-snug">{paso.desc}</p>
              </div>
            </div>
          </Pop>
        ))}
      </div>
    </section>
  )
}

// ── 5. CTA BRUTAL ────────────────────────────────────────────────
function CtaBrutal() {
  return (
    <section className="bg-mekra-orange border-t-2 border-mekra-black py-20 sm:py-28">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Pop>
          <div className="bg-mekra-black border-2 border-mekra-black shadow-brutal-lg p-8 sm:p-14 text-center">
            <span className="inline-block bg-mekra-yellow text-mekra-black font-black uppercase text-xs tracking-wider px-4 py-2 border-2 border-mekra-black -rotate-2 mb-7">
              21 de junio · No esperes
            </span>

            <h2 className="text-mekra-white font-black uppercase tracking-tighter leading-[0.85] mb-6"
                style={{ fontSize: 'clamp(2.6rem, 9vw, 6rem)' }}>
              Pídela<br />
              <span className="text-mekra-orange">hoy mismo</span>
            </h2>

            <p className="text-mekra-white/70 font-bold text-base sm:text-lg max-w-md mx-auto mb-9 leading-snug">
              Si lo pides hoy, llega personalizado con su foto antes del 21. No lo dejes para última hora.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href={WA}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-mekra-yellow text-mekra-black font-black text-base uppercase tracking-wide px-9 py-5 border-2 border-mekra-yellow shadow-brutal hover-brutal"
              >
                <SvgWhatsApp size={18} />
                Hacer mi pedido
              </a>
              <Link
                to="/catalogo"
                className="inline-flex items-center text-mekra-white font-black text-base uppercase tracking-wide px-8 py-5 border-2 border-mekra-white hover:bg-mekra-white hover:text-mekra-black transition-colors duration-150"
              >
                Ver catálogo
              </Link>
            </div>

            <p className="text-mekra-white/40 font-bold uppercase text-xs tracking-[0.15em] mt-9">
              Trujillo · Garantía incluida · Yape · Plin
            </p>
          </div>
        </Pop>
      </div>
    </section>
  )
}

// ── SVG WhatsApp ──────────────────────────────────────────────────
function SvgWhatsApp({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  )
}
