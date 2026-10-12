import { useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useInView } from 'motion/react'
import { productos, siteInfo } from '../data'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { AuroraBg } from '../components/AuroraBg'
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

// ── Reveal suave ──────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
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
    <div className="bg-mekra-glow">
      <Hero />
      <Beneficios />
      <Catalogo items={destacados} />
      <Proceso />
      <CtaFinal />
    </div>
  )
}

// ── 1. HERO — aurora + producto en tarjeta glass ─────────────────
function Hero() {
  const dias = useMemo(() => diasHasta('2026-06-21'), [])

  return (
    <section className="relative min-h-[calc(100dvh-4rem)] flex items-center overflow-hidden">
      <AuroraBg />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

        {/* Texto */}
        <div className="flex flex-col items-start">
          <Reveal>
            <span className="inline-flex items-center gap-2.5 glass rounded-full px-4 py-2 mb-7 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-mekra-orange animate-pulse" />
              <span className="text-mekra-black/70 font-bold text-xs tracking-wide">
                {dias} días para el Día del Padre · 21 jun
              </span>
            </span>
          </Reveal>

          <Reveal delay={0.08}>
            <h1
              className="text-mekra-black font-black leading-[0.95] tracking-tight"
              style={{ fontSize: 'clamp(3rem, 7vw, 6rem)' }}
            >
              El regalo que
              <span className="block bg-gradient-to-r from-mekra-orange via-mekra-rose to-mekra-orange bg-clip-text text-transparent">
                nunca olvidará
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-6 text-mekra-black/55 font-medium text-base sm:text-xl max-w-md leading-relaxed">
              Una cámara que se abre y revela su foto adentro.
              Personalizada y hecha a mano en Trujillo.
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div className="flex items-baseline gap-1.5">
                <span className="font-black text-mekra-black" style={{ fontSize: '2.6rem', lineHeight: 1 }}>S/10</span>
                <span className="text-mekra-black/40 text-sm font-bold">c/u</span>
              </div>

              <a
                href={WA}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-7 py-4 bg-mekra-black text-white font-bold text-sm rounded-full transition-all duration-200 hover:scale-[1.04] active:scale-[0.97] shadow-xl shadow-mekra-orange/20"
              >
                <SvgWhatsApp />
                Pedir ahora
              </a>

              <Link
                to="/producto/llavero-camara-papa"
                className="inline-flex items-center gap-1.5 px-6 py-4 glass text-mekra-black font-bold text-sm rounded-full transition-all duration-200 hover:bg-white/80"
              >
                Ver detalles →
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.32}>
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-2">
              {['📍 Trujillo', '⚡ 2-3 días', '✓ Garantía', '💳 Yape · Plin'].map(t => (
                <span key={t} className="text-mekra-black/40 text-xs font-bold">{t}</span>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Producto en tarjeta glass flotante */}
        <Reveal delay={0.15} className="relative">
          <div className="relative glass rounded-[2.5rem] p-8 sm:p-12 shadow-2xl shadow-mekra-orange/10">
            {/* Badge esquina */}
            <span className="absolute top-6 left-6 z-20 glass-dark text-white text-[11px] font-black uppercase tracking-wider px-3.5 py-2 rounded-full">
              ★ Más pedido
            </span>
            <span className="absolute top-6 right-6 z-20 bg-mekra-orange text-white font-black text-sm px-4 py-2 rounded-full shadow-lg shadow-mekra-orange/30">
              S/10
            </span>

            <img
              src={heroCamaraAbierta}
              alt="Cámara de los Recuerdos personalizada"
              className="relative z-10 w-full max-w-md mx-auto h-auto object-contain animate-mekra-float"
              style={{ mixBlendMode: 'multiply' }}
            />

            {/* Colores */}
            <div className="relative z-20 flex items-center justify-center gap-2.5 mt-4">
              {[
                { label: 'Negro', dot: '#1A1A1A' },
                { label: 'Gris',  dot: '#888' },
                { label: 'Azul',  dot: '#3B82F6' },
              ].map(c => (
                <div key={c.label} className="flex items-center gap-1.5 glass rounded-full px-3 py-1.5">
                  <span className="w-3 h-3 rounded-full border border-white/60" style={{ background: c.dot }} />
                  <span className="text-mekra-black/60 text-[11px] font-bold">{c.label}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// ── 2. BENEFICIOS — tarjetas glass ───────────────────────────────
const BENEFICIOS = [
  { icon: '📸', titulo: 'Su foto, adentro', desc: 'Se abre como una cámara real y muestra la imagen que tú elijas.' },
  { icon: '🏡', titulo: 'Hecho en Trujillo', desc: 'Gustavo y Paty arman cada pieza a mano. No es fábrica.' },
  { icon: '⚡', titulo: 'Listo en 2-3 días', desc: 'Delivery local o courier a todo el Perú. Siempre a tiempo.' },
]

function Beneficios() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <AuroraBg />
      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 lg:px-12">

        <Reveal className="text-center mb-14">
          <h2 className="text-mekra-black font-black tracking-tight leading-tight text-balance"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.6rem)' }}>
            Un regalo con alma,<br />no un objeto más
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {BENEFICIOS.map((b, i) => (
            <Reveal key={b.titulo} delay={i * 0.1}>
              <div className="h-full glass rounded-3xl p-8 shadow-xl shadow-mekra-orange/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-mekra-orange/15">
                <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-mekra-orange to-mekra-rose text-2xl mb-5 shadow-lg shadow-mekra-orange/25">
                  {b.icon}
                </span>
                <h3 className="text-mekra-black font-black text-xl mb-2 tracking-tight">{b.titulo}</h3>
                <p className="text-mekra-black/50 text-sm leading-relaxed">{b.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── 3. CATÁLOGO — tarjetas glass ─────────────────────────────────
function Catalogo({ items }) {
  if (!items.length) return null

  return (
    <section id="catalogo" className="relative py-24 sm:py-32 overflow-hidden bg-mekra-glow">
      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 lg:px-12">

        <Reveal className="flex items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-mekra-orange text-xs font-black uppercase tracking-[0.25em] mb-2">Catálogo</p>
            <h2 className="text-mekra-black font-black tracking-tight"
                style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3.2rem)' }}>
              Para el 21 de junio
            </h2>
          </div>
          <Link to="/catalogo" className="shrink-0 text-mekra-black/40 hover:text-mekra-orange text-sm font-bold transition-colors">
            Ver todo →
          </Link>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.07}>
              <CardProducto producto={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function CardProducto({ producto }) {
  const img = producto.id === 'llavero-camara-papa' ? heroCamaraCerrada : null
  const esCamara = producto.id === 'llavero-camara-papa'

  return (
    <article className="group flex flex-col h-full glass rounded-3xl overflow-hidden shadow-lg shadow-mekra-orange/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-mekra-orange/15">

      <div className="relative aspect-square overflow-hidden flex items-center justify-center"
           style={{ background: 'linear-gradient(135deg, #FFE8D6 0%, #FFD6E0 100%)' }}>
        {img
          ? <img src={img} alt={producto.nombre}
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                 style={{ mixBlendMode: 'multiply' }} />
          : <span className="text-mekra-black/30 font-black text-xs uppercase text-center px-4">{producto.categoria}</span>
        }
        {esCamara && (
          <span className="absolute top-3 left-3 glass-dark text-white text-[10px] font-black uppercase tracking-wide px-2.5 py-1 rounded-full">
            ★ Popular
          </span>
        )}
        <span className="absolute bottom-3 right-3 glass text-mekra-black font-black text-sm px-3 py-1 rounded-full">
          S/{producto.precio}
        </span>
      </div>

      <div className="flex flex-col flex-1 p-5 gap-3">
        <h3 className="text-mekra-black font-black text-sm leading-tight">{producto.nombre}</h3>
        {producto.descripcion && (
          <p className="text-mekra-black/45 text-xs leading-relaxed line-clamp-2">{producto.descripcion}</p>
        )}
        <div className="flex gap-2 mt-auto pt-1">
          <Link
            to={`/producto/${producto.id}`}
            className="flex-1 inline-flex items-center justify-center py-2.5 px-3 bg-mekra-black text-white font-bold text-xs rounded-full transition-all duration-200 hover:bg-mekra-orange active:scale-[0.98]"
          >
            Ver más
          </Link>
          <a
            href={waPedido(producto.nombre)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-mekra-orange to-mekra-rose text-white transition-all duration-200 hover:scale-110 active:scale-95 shadow-md shadow-mekra-orange/25"
            aria-label="Pedir por WhatsApp"
          >
            <SvgWhatsApp size={15} />
          </a>
        </div>
      </div>
    </article>
  )
}

// ── 4. PROCESO — timeline glass ──────────────────────────────────
const PASOS = [
  { n: '01', titulo: 'Eliges la foto', desc: 'Nos la envías por WhatsApp, la que más lo represente.' },
  { n: '02', titulo: 'Personalizamos', desc: 'Armamos tu cámara a mano con esa foto adentro.' },
  { n: '03', titulo: 'La recibes', desc: 'Delivery en Trujillo o courier nacional en 2-3 días.' },
]

function Proceso() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <AuroraBg />
      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 lg:px-12">

        <Reveal className="text-center mb-16">
          <p className="text-mekra-orange text-xs font-black uppercase tracking-[0.25em] mb-3">Cómo funciona</p>
          <h2 className="text-mekra-black font-black tracking-tight"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}>
            Pedir es así de simple
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PASOS.map((paso, i) => (
            <Reveal key={paso.n} delay={i * 0.12}>
              <div className="h-full glass rounded-3xl p-8 text-center shadow-xl shadow-mekra-orange/5">
                <span className="inline-block font-black bg-gradient-to-br from-mekra-orange to-mekra-rose bg-clip-text text-transparent leading-none mb-4"
                      style={{ fontSize: '3.5rem' }}>
                  {paso.n}
                </span>
                <h3 className="text-mekra-black font-black text-lg mb-2 tracking-tight">{paso.titulo}</h3>
                <p className="text-mekra-black/50 text-sm leading-relaxed">{paso.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── 5. CTA FINAL — dark glass con aurora ─────────────────────────
function CtaFinal() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [50, -50])

  return (
    <section ref={ref} className="relative py-28 sm:py-40 overflow-hidden bg-mekra-black">
      <AuroraBg dark />

      <motion.img
        style={{ y, mixBlendMode: 'screen' }}
        src={heroCamaraAbierta}
        alt=""
        aria-hidden
        className="absolute right-0 bottom-0 w-[340px] sm:w-[480px] opacity-30 pointer-events-none select-none"
      />

      <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 lg:px-12">
        <Reveal>
          <span className="inline-flex items-center gap-2 glass-dark rounded-full px-4 py-2 mb-7">
            <span className="w-2 h-2 rounded-full bg-mekra-orange animate-pulse" />
            <span className="text-white/70 font-bold text-xs tracking-wide">21 de junio · No lo dejes pasar</span>
          </span>
        </Reveal>

        <Reveal delay={0.06}>
          <h2 className="text-white font-black leading-[0.95] tracking-tight text-balance mb-7"
              style={{ fontSize: 'clamp(2.6rem, 7vw, 5.5rem)' }}>
            Queda poco tiempo.
            <span className="block bg-gradient-to-r from-mekra-orange via-mekra-rose to-mekra-peach bg-clip-text text-transparent">
              Pídela hoy.
            </span>
          </h2>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="text-white/45 text-base sm:text-lg max-w-md mb-10 leading-relaxed">
            Si la pides hoy, llega personalizada con su foto antes del 21.
            Si esperas el fin de semana, ya no hay garantía.
          </p>
        </Reveal>

        <Reveal delay={0.18}>
          <div className="flex flex-wrap gap-4">
            <a
              href={WA}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-9 py-5 bg-gradient-to-r from-mekra-orange to-mekra-rose text-white font-bold text-base rounded-full transition-all duration-200 hover:scale-[1.04] active:scale-[0.97] shadow-2xl shadow-mekra-orange/30"
            >
              <SvgWhatsApp size={18} />
              Hacer mi pedido
            </a>
            <Link
              to="/catalogo"
              className="inline-flex items-center px-8 py-5 glass-dark text-white/80 font-bold text-base rounded-full transition-all duration-200 hover:text-white"
            >
              Ver catálogo
            </Link>
          </div>
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
