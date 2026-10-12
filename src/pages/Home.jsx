import { useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useInView } from 'motion/react'
import { productos, siteInfo } from '../data'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import heroCamaraAbierta from '../assets/hero-camara-abierta.png'
import heroCamaraCerrada from '../assets/hero-camara-cerrada.png'
import { ContainerScroll } from '../components/ui/container-scroll-animation'

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

// ── Reveal editorial — fade + clip ────────────────────────────────
function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
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
    <div className="bg-mekra-cream">
      <Marquee />
      <HeroEditorial />
      <Manifiesto />
      <ShowcaseScroll />
      <Coleccion items={destacados} />
      <Proceso />
      <CierreEditorial />
    </div>
  )
}

// ── MARQUEE superior ──────────────────────────────────────────────
function Marquee() {
  const texto = '✦ HECHO EN TRUJILLO ✦ DÍA DEL PADRE 2026 ✦ PERSONALIZADO CON TU FOTO ✦ LISTO EN 2-3 DÍAS '
  return (
    <div className="bg-mekra-black overflow-hidden py-2.5 select-none">
      <div className="flex whitespace-nowrap animate-mekra-marquee">
        {[0, 1].map(i => (
          <span key={i} className="text-mekra-cream/70 text-[11px] font-black uppercase tracking-[0.25em] px-4">
            {texto.repeat(2)}
          </span>
        ))}
      </div>
    </div>
  )
}

// ── 1. HERO EDITORIAL ─────────────────────────────────────────────
function HeroEditorial() {
  const dias = useMemo(() => diasHasta('2026-06-21'), [])

  return (
    <section className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-12 pb-20 sm:pt-16 sm:pb-28">

      {/* Línea superior tipo magazine */}
      <Reveal>
        <div className="flex items-center justify-between border-b border-mekra-black/15 pb-4 mb-10 sm:mb-16">
          <span className="text-mekra-black/50 text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em]">
            Edición Día del Padre
          </span>
          <span className="text-mekra-black/50 text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] tabular-nums">
            Trujillo · Nº 01
          </span>
        </div>
      </Reveal>

      {/* Título display gigante */}
      <Reveal delay={0.05}>
        <h1
          className="text-mekra-black font-black uppercase leading-[0.82] tracking-tighter"
          style={{ fontSize: 'clamp(3.8rem, 15vw, 13rem)' }}
        >
          Recuerdos
          <span className="block text-right italic lowercase font-black" style={{ fontFamily: 'Georgia, serif' }}>
            que se <span className="text-mekra-orange">tocan</span>
          </span>
        </h1>
      </Reveal>

      {/* Fila info inferior */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 mt-12 sm:mt-16 items-start">

        <Reveal delay={0.1} className="lg:col-span-4">
          <p className="text-mekra-black/70 text-base sm:text-lg leading-relaxed max-w-sm">
            Una cámara que se abre y revela su foto adentro. No es un llavero —
            es el momento que vivieron, hecho objeto. Diseñado y armado a mano en Trujillo.
          </p>
        </Reveal>

        <Reveal delay={0.15} className="lg:col-span-4 lg:col-start-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-baseline gap-3">
              <span className="font-black text-mekra-black" style={{ fontSize: '3.5rem', lineHeight: 0.9 }}>S/10</span>
              <span className="text-mekra-black/40 text-sm font-bold uppercase tracking-wider">por pieza</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={WA}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-mekra-black text-mekra-cream font-black text-sm uppercase tracking-wider rounded-none transition-all duration-200 hover:bg-mekra-orange active:scale-[0.98]"
              >
                <SvgWhatsApp />
                Pedir ahora
              </a>
              <Link
                to="/producto/llavero-camara-papa"
                className="inline-flex items-center px-7 py-3.5 border border-mekra-black text-mekra-black font-black text-sm uppercase tracking-wider transition-all duration-200 hover:bg-mekra-black hover:text-mekra-cream"
              >
                Ver pieza
              </Link>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2} className="lg:col-span-2 lg:col-start-11">
          <div className="border border-mekra-black/15 p-5 text-center">
            <span className="block font-black text-mekra-orange tabular-nums" style={{ fontSize: '3rem', lineHeight: 1 }}>
              {dias}
            </span>
            <span className="block text-mekra-black/50 text-[10px] font-black uppercase tracking-[0.15em] mt-1">
              días para<br />el 21 jun
            </span>
          </div>
        </Reveal>
      </div>

      {/* Imagen producto flotante esquina */}
      <Reveal delay={0.1} className="hidden lg:block absolute top-[26%] right-12 w-[300px] xl:w-[360px] pointer-events-none">
        <motion.img
          src={heroCamaraAbierta}
          alt="Cámara de los Recuerdos"
          className="w-full h-auto object-contain animate-mekra-float"
          style={{ filter: 'drop-shadow(0 30px 50px rgba(26,26,26,0.18))', mixBlendMode: 'multiply' }}
        />
      </Reveal>
    </section>
  )
}

// ── 2. MANIFIESTO — texto grande con palabra resaltada ───────────
function Manifiesto() {
  return (
    <section className="bg-mekra-black py-24 sm:py-36">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-12">
        <Reveal>
          <p className="text-mekra-cream/40 text-xs font-black uppercase tracking-[0.3em] mb-10">
            El manifiesto
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <p
            className="text-mekra-cream font-black leading-[1.05] tracking-tight text-balance"
            style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3.6rem)' }}
          >
            Un regalo de tienda lo olvida en una semana.
            <span className="text-mekra-orange"> Un regalo con su foto adentro lo guarda toda la vida.</span>
            {' '}Eso es lo que hacemos.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

// ── 3. SHOWCASE — ContainerScroll, fondo crema ────────────────────
function ShowcaseScroll() {
  return (
    <section className="bg-mekra-cream overflow-hidden">
      <ContainerScroll
        titleComponent={
          <div className="flex flex-col items-center gap-4 px-4">
            <span className="text-mekra-orange text-xs font-black uppercase tracking-[0.3em]">
              La pieza
            </span>
            <h2
              className="text-mekra-black font-black uppercase leading-[0.85] tracking-tighter"
              style={{ fontSize: 'clamp(2.6rem, 8vw, 7rem)' }}
            >
              Mírala<br />
              <span className="italic lowercase font-black" style={{ fontFamily: 'Georgia, serif' }}>de cerca</span>
            </h2>
            <p className="text-mekra-black/50 text-base sm:text-lg max-w-md leading-relaxed mt-2">
              Se abre como una cámara real. Adentro, la foto que tú elijas.
            </p>
          </div>
        }
      >
        <div className="w-full h-full relative overflow-hidden bg-mekra-sand flex items-center justify-center">
          {/* Textura de papel sutil */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.5]"
            style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 40%, rgba(255,255,255,0.6) 0%, transparent 70%)' }}
          />

          <img
            src={heroCamaraAbierta}
            alt="Cámara de los Recuerdos abierta"
            draggable={false}
            className="relative z-10 h-[82%] w-auto object-contain select-none"
            style={{ mixBlendMode: 'multiply', filter: 'drop-shadow(0 30px 50px rgba(26,26,26,0.22))' }}
          />

          {/* Etiqueta tipo museo */}
          <div className="absolute bottom-6 left-6 z-20 bg-mekra-cream border border-mekra-black/15 px-5 py-3 max-w-[200px]">
            <p className="text-mekra-black font-black text-sm leading-tight">Cámara de los Recuerdos</p>
            <p className="text-mekra-black/45 text-[11px] font-bold uppercase tracking-wide mt-1">
              Negro · Gris · Azul · S/10
            </p>
          </div>
        </div>
      </ContainerScroll>
    </section>
  )
}

// ── 4. COLECCIÓN — lista numerada editorial ──────────────────────
function Coleccion({ items }) {
  if (!items.length) return null

  return (
    <section id="coleccion" className="bg-mekra-cream py-24 sm:py-32 border-t border-mekra-black/10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">

        <Reveal className="flex items-end justify-between border-b border-mekra-black/15 pb-6 mb-2 gap-4">
          <h2
            className="text-mekra-black font-black uppercase tracking-tighter leading-none"
            style={{ fontSize: 'clamp(2rem, 6vw, 4.5rem)' }}
          >
            La colección
          </h2>
          <Link to="/catalogo" className="shrink-0 text-mekra-black/50 hover:text-mekra-orange text-xs font-black uppercase tracking-widest transition-colors pb-1">
            Catálogo completo →
          </Link>
        </Reveal>

        <div>
          {items.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.06}>
              <FilaProducto producto={p} index={i + 1} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function FilaProducto({ producto, index }) {
  const img = producto.id === 'llavero-camara-papa' ? heroCamaraCerrada : null

  return (
    <article className="group grid grid-cols-12 items-center gap-4 py-6 sm:py-8 border-b border-mekra-black/10 transition-colors duration-300 hover:bg-mekra-sand/40">

      {/* Número */}
      <span className="col-span-2 sm:col-span-1 font-black text-mekra-black/25 tabular-nums" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
        {String(index).padStart(2, '0')}
      </span>

      {/* Mini imagen */}
      <div className="col-span-3 sm:col-span-2">
        <div className="aspect-square bg-mekra-sand overflow-hidden flex items-center justify-center">
          {img
            ? <img src={img} alt={producto.nombre}
                   className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                   style={{ mixBlendMode: 'multiply' }} />
            : <span className="text-mekra-black/20 text-[9px] font-black uppercase text-center px-1">{producto.categoria}</span>
          }
        </div>
      </div>

      {/* Nombre + desc */}
      <div className="col-span-7 sm:col-span-6 min-w-0">
        <h3 className="text-mekra-black font-black text-base sm:text-2xl tracking-tight leading-tight truncate sm:whitespace-normal">
          {producto.nombre}
        </h3>
        <p className="hidden sm:block text-mekra-black/45 text-sm mt-1 line-clamp-1">{producto.descripcion}</p>
      </div>

      {/* Precio */}
      <div className="hidden sm:block sm:col-span-1 text-right">
        <span className="font-black text-mekra-black text-xl tabular-nums">S/{producto.precio}</span>
      </div>

      {/* Acción */}
      <div className="col-span-12 sm:col-span-2 flex justify-end gap-2 mt-3 sm:mt-0">
        <Link
          to={`/producto/${producto.id}`}
          className="inline-flex items-center justify-center px-4 py-2.5 border border-mekra-black text-mekra-black font-black text-[11px] uppercase tracking-wider transition-all duration-200 hover:bg-mekra-black hover:text-mekra-cream"
        >
          Ver
        </Link>
        <a
          href={waPedido(producto.nombre)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-10 h-10 bg-mekra-orange text-white transition-all duration-200 hover:bg-mekra-black"
          aria-label="Pedir por WhatsApp"
        >
          <SvgWhatsApp size={15} />
        </a>
      </div>
    </article>
  )
}

// ── 5. PROCESO — pasos tipo índice ───────────────────────────────
const PASOS = [
  { n: 'I',   titulo: 'Eliges la foto',   desc: 'La envías por WhatsApp. La que más lo represente.' },
  { n: 'II',  titulo: 'La personalizamos', desc: 'Cada pieza se arma a mano según tu pedido.' },
  { n: 'III', titulo: 'Llega a tiempo',    desc: 'Delivery en Trujillo o courier nacional, en 2-3 días.' },
]

function Proceso() {
  return (
    <section className="bg-mekra-sand py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">

        <Reveal>
          <p className="text-mekra-orange text-xs font-black uppercase tracking-[0.3em] mb-3">El proceso</p>
          <h2
            className="text-mekra-black font-black uppercase tracking-tighter leading-[0.9] mb-16"
            style={{ fontSize: 'clamp(2rem, 5.5vw, 4rem)' }}
          >
            Simple como<br />un mensaje
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-mekra-black/10">
          {PASOS.map((paso, i) => (
            <Reveal key={paso.n} delay={i * 0.12} className="bg-mekra-sand">
              <div className="flex flex-col gap-6 p-8 sm:p-10 h-full">
                <span className="font-black text-mekra-orange leading-none" style={{ fontSize: '3rem', fontFamily: 'Georgia, serif' }}>
                  {paso.n}
                </span>
                <div>
                  <h3 className="text-mekra-black font-black text-xl mb-2 tracking-tight">{paso.titulo}</h3>
                  <p className="text-mekra-black/50 text-sm leading-relaxed">{paso.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── 6. CIERRE EDITORIAL ──────────────────────────────────────────
function CierreEditorial() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 1], [1.15, 0.95])

  return (
    <section ref={ref} className="bg-mekra-black py-28 sm:py-40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 text-center">

        <Reveal>
          <p className="text-mekra-orange text-xs font-black uppercase tracking-[0.3em] mb-8">
            21 de junio · No lo dejes pasar
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <h2
            className="text-mekra-cream font-black uppercase tracking-tighter leading-[0.85] mb-4"
            style={{ fontSize: 'clamp(3rem, 12vw, 11rem)' }}
          >
            Pídela
            <span className="block italic lowercase text-mekra-orange" style={{ fontFamily: 'Georgia, serif' }}>
              hoy mismo
            </span>
          </h2>
        </Reveal>

        <motion.img
          style={{ scale, mixBlendMode: 'screen' }}
          src={heroCamaraAbierta}
          alt=""
          aria-hidden
          className="mx-auto w-[220px] sm:w-[320px] h-auto object-contain my-8"
        />

        <Reveal delay={0.1}>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={WA}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-10 py-5 bg-mekra-orange text-white font-black text-base uppercase tracking-wider transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
            >
              <SvgWhatsApp size={18} />
              Hacer mi pedido
            </a>
            <Link
              to="/catalogo"
              className="inline-flex items-center px-9 py-5 border border-mekra-cream/30 text-mekra-cream/70 font-black text-base uppercase tracking-wider transition-all duration-200 hover:border-mekra-cream hover:text-mekra-cream"
            >
              Ver catálogo
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="text-mekra-cream/30 text-xs font-bold uppercase tracking-[0.2em] mt-12">
            Hecho en Trujillo · Garantía incluida · Yape · Plin
          </p>
        </Reveal>
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
