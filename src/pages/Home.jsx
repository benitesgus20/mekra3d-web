import { useState, useMemo, useRef } from 'react'
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

// ── Animación de entrada ──────────────────────────────────────────
function FadeUp({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
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
    <>
      <HeroScroll />
      <PorQueNosotros />
      <Productos items={destacados} />
      <Proceso />
      <CtaFinal />
    </>
  )
}

// ── 1. HERO — ContainerScroll con todo el impacto ─────────────────
function HeroScroll() {
  const dias = useMemo(() => diasHasta('2026-06-21'), [])

  return (
    <section className="bg-mekra-black overflow-hidden">
      <ContainerScroll
        titleComponent={
          <div className="flex flex-col items-center gap-5 px-4">

            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: 'backOut' }}
              className="inline-flex items-center gap-3 border border-mekra-orange/40 rounded-full px-5 py-2.5"
              style={{ background: 'rgba(255,107,0,0.08)' }}
            >
              <span className="w-2 h-2 rounded-full bg-mekra-orange animate-pulse shrink-0" />
              <span className="text-mekra-orange font-black text-xs tracking-widest uppercase">
                {dias > 0 ? `${dias} días — Día del Padre` : 'Último día · 21 jun'}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-white font-black leading-[0.9] tracking-tight text-balance"
              style={{ fontSize: 'clamp(3.2rem, 9vw, 8rem)' }}
            >
              El regalo que<br />
              <span className="text-mekra-orange">nunca</span> olvidará
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-white/40 font-medium text-base sm:text-lg max-w-lg leading-relaxed"
            >
              Personalizado con su foto. Hecho a mano en Trujillo.
              Listo en 2-3 días hábiles.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="flex flex-wrap items-center justify-center gap-4 mt-2"
            >
              <div className="flex items-baseline gap-1.5">
                <span className="font-black text-white" style={{ fontSize: '3rem', lineHeight: 1 }}>S/10</span>
                <span className="text-white/30 text-sm font-bold">por unidad</span>
              </div>

              <a
                href={WA}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-mekra-orange text-white font-black text-sm rounded-full transition-all duration-200 hover:brightness-110 hover:scale-[1.04] active:scale-[0.97] shadow-2xl shadow-mekra-orange/40"
              >
                <SvgWhatsApp />
                Pedir ahora
              </a>

              <Link
                to="/producto/llavero-camara-papa"
                className="inline-flex items-center gap-2 px-6 py-4 border border-white/15 text-white/60 font-bold text-sm rounded-full transition-all duration-200 hover:border-white/40 hover:text-white"
              >
                Ver detalles →
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-[9px] font-black uppercase tracking-[0.4em] text-white/15 mt-4"
            >
              ↓ Desplázate para descubrir
            </motion.p>
          </div>
        }
      >
        {/* Contenido tarjeta 3D */}
        <div className="w-full h-full relative overflow-hidden bg-[#0D0D0D] flex items-center justify-center">
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 65% 55% at 50% 65%, rgba(255,107,0,0.22) 0%, transparent 70%)',
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'linear-gradient(#FF6B00 1px, transparent 1px), linear-gradient(90deg, #FF6B00 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />

          <img
            src={heroCamaraAbierta}
            alt="Cámara de los Recuerdos"
            draggable={false}
            className="relative z-10 h-[80%] w-auto object-contain select-none"
            style={{
              mixBlendMode: 'screen',
              filter: 'drop-shadow(0 24px 80px rgba(255,107,0,0.5))',
            }}
          />

          <div className="absolute top-5 left-5 z-20 flex flex-col gap-2">
            <span className="bg-mekra-orange text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg">
              ★ Más pedido
            </span>
            <span className="bg-white/10 border border-white/15 text-white/70 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full backdrop-blur-sm">
              Personalizable
            </span>
          </div>

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {[
              { label: 'Negro', dot: '#1A1A1A' },
              { label: 'Gris',  dot: '#888888' },
              { label: 'Azul',  dot: '#3B82F6' },
            ].map(c => (
              <div key={c.label} className="flex items-center gap-1.5 bg-white/10 border border-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
                <span className="w-2.5 h-2.5 rounded-full border border-white/30 shrink-0" style={{ background: c.dot }} />
                <span className="text-white/70 text-[10px] font-black uppercase tracking-wide">{c.label}</span>
              </div>
            ))}
          </div>

          <div className="absolute top-5 right-5 z-20 bg-white text-mekra-black font-black text-sm px-4 py-2 rounded-full">
            S/10
          </div>
        </div>
      </ContainerScroll>
    </section>
  )
}

// ── 2. POR QUÉ NOSOTROS ───────────────────────────────────────────
const PILARES = [
  { n: '01', titulo: 'Tu foto, adentro',    desc: 'La cámara se abre y revela la imagen que tú eliges. No hay dos iguales en el mundo.', icon: '📸' },
  { n: '02', titulo: 'Hecho en Trujillo',   desc: 'Gustavo y Paty hacen cada pieza con sus manos. No es fábrica, es un taller personal.', icon: '🏡' },
  { n: '03', titulo: 'Listo antes del 21',  desc: 'Producción en 2-3 días hábiles. Delivery en Trujillo o courier a todo el Perú.', icon: '⚡' },
]

function PorQueNosotros() {
  return (
    <section className="bg-mekra-black border-t border-white/[0.06] py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <FadeUp className="mb-16 text-center">
          <p className="text-mekra-orange text-xs font-black uppercase tracking-[0.3em] mb-4">
            Por qué elegir Mekra3D
          </p>
          <h2
            className="text-white font-black leading-tight tracking-tight text-balance"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.8rem)' }}
          >
            Un regalo con alma,<br />no un objeto genérico
          </h2>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PILARES.map((p, i) => (
            <FadeUp key={p.n} delay={i * 0.1}>
              <div
                className="group relative h-full rounded-3xl border border-white/[0.07] p-8 overflow-hidden transition-all duration-300 hover:border-mekra-orange/30"
                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 100%)' }}
              >
                <span
                  className="absolute -top-3 -right-2 font-black text-white/[0.04] select-none pointer-events-none"
                  style={{ fontSize: '7rem', lineHeight: 1 }}
                  aria-hidden
                >
                  {p.n}
                </span>
                <div className="relative z-10 flex flex-col h-full gap-5">
                  <span className="text-4xl">{p.icon}</span>
                  <div>
                    <h3 className="text-white font-black text-xl mb-2 tracking-tight">{p.titulo}</h3>
                    <p className="text-white/35 text-sm leading-relaxed">{p.desc}</p>
                  </div>
                </div>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"
                  style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(255,107,0,0.08) 0%, transparent 70%)' }}
                />
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── 3. PRODUCTOS ──────────────────────────────────────────────────
function Productos({ items }) {
  if (!items.length) return null

  return (
    <section id="productos" className="bg-[#0A0A0A] py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <FadeUp className="flex items-end justify-between mb-12 gap-4">
          <div>
            <p className="text-mekra-orange text-xs font-black uppercase tracking-[0.3em] mb-3">Catálogo</p>
            <h2
              className="text-white font-black tracking-tight"
              style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3.2rem)' }}
            >
              Para el 21 de junio
            </h2>
          </div>
          <Link to="/catalogo" className="shrink-0 text-xs font-bold text-white/25 hover:text-mekra-orange transition-colors uppercase tracking-widest">
            Ver todo ›
          </Link>
        </FadeUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((p, i) => (
            <FadeUp key={p.id} delay={i * 0.07}>
              <TarjetaProducto producto={p} />
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}

function TarjetaProducto({ producto }) {
  const img = producto.id === 'llavero-camara-papa' ? heroCamaraCerrada : null
  const esCamara = producto.id === 'llavero-camara-papa'

  return (
    <article
      className="group flex flex-col rounded-2xl overflow-hidden border border-white/[0.07] transition-all duration-300 hover:border-mekra-orange/30 hover:-translate-y-1.5"
      style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)' }}
    >
      <div className="relative aspect-square overflow-hidden bg-[#111]">
        {img
          ? <img src={img} alt={producto.nombre}
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.07]"
                 style={{ mixBlendMode: 'screen' }} />
          : <div className="w-full h-full flex items-center justify-center px-5">
              <span className="text-white/15 font-black text-center text-sm leading-tight">{producto.nombre}</span>
            </div>
        }
        {esCamara && (
          <div className="absolute top-3 left-3 bg-mekra-orange text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">
            ★ Popular
          </div>
        )}
        <div className="absolute top-3 right-3 bg-black/60 text-mekra-orange font-black text-sm px-3 py-1 rounded-full backdrop-blur-sm">
          S/{producto.precio}
        </div>
      </div>

      <div className="flex flex-col gap-3 p-5 flex-1">
        <h3 className="text-white font-black text-sm leading-snug">{producto.nombre}</h3>
        {producto.descripcion && (
          <p className="text-white/30 text-xs leading-relaxed line-clamp-2">{producto.descripcion}</p>
        )}
        <div className="flex gap-2 mt-auto pt-2">
          <Link
            to={`/producto/${producto.id}`}
            className="flex-1 inline-flex items-center justify-center py-2.5 px-3 bg-white/[0.07] text-white/70 font-bold text-xs rounded-xl transition-all duration-200 hover:bg-white/[0.12] hover:text-white"
          >
            Ver más
          </Link>
          <a
            href={waPedido(producto.nombre)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-mekra-orange/10 text-mekra-orange transition-all duration-200 hover:bg-mekra-orange hover:text-white border border-mekra-orange/20"
            aria-label="Pedir por WhatsApp"
          >
            <SvgWhatsApp size={14} />
          </a>
        </div>
      </div>
    </article>
  )
}

// ── 4. PROCESO ────────────────────────────────────────────────────
const PASOS = [
  { n: 1, titulo: 'Elige la foto',    desc: 'La que más lo represente. Nos la envías por WhatsApp.' },
  { n: 2, titulo: 'Personalizamos',   desc: 'Cada pieza se adapta al diseño que tú imaginas.' },
  { n: 3, titulo: 'Producimos',       desc: 'Imprimimos, ensamblamos y revisamos todo.' },
  { n: 4, titulo: 'Lo tienes',        desc: 'Delivery en Trujillo o courier nacional en 2-3 días.' },
]

function Proceso() {
  return (
    <section className="bg-mekra-black border-t border-white/[0.06] py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <FadeUp className="mb-16 text-center">
          <p className="text-mekra-orange text-xs font-black uppercase tracking-[0.3em] mb-4">Cómo funciona</p>
          <h2 className="text-white font-black tracking-tight" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}>
            De WhatsApp al regalo<br />en 3 pasos
          </h2>
        </FadeUp>

        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-mekra-orange/30 to-transparent" aria-hidden />

          {PASOS.map((paso, i) => (
            <FadeUp key={paso.n} delay={i * 0.12}>
              <div className="flex flex-col items-center text-center gap-4">
                <div className="relative w-20 h-20 flex items-center justify-center rounded-2xl border border-mekra-orange/30 bg-mekra-orange/[0.07]">
                  <span className="font-black text-mekra-orange tabular-nums" style={{ fontSize: '1.8rem' }}>
                    {String(paso.n).padStart(2, '0')}
                  </span>
                </div>
                <div>
                  <h3 className="text-white font-black text-base mb-2">{paso.titulo}</h3>
                  <p className="text-white/30 text-sm leading-relaxed">{paso.desc}</p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── 5. CTA FINAL ──────────────────────────────────────────────────
function CtaFinal() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [40, -40])

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-28 sm:py-40"
      style={{ background: 'linear-gradient(135deg, #1A0800 0%, #0D0D0D 50%, #001A0A 100%)' }}
    >
      <motion.div
        style={{ y }}
        className="absolute right-0 bottom-0 w-[360px] sm:w-[520px] pointer-events-none select-none opacity-20 sm:opacity-30"
        aria-hidden
      >
        <img
          src={heroCamaraAbierta}
          alt=""
          className="w-full h-auto object-contain"
          style={{ mixBlendMode: 'screen', filter: 'drop-shadow(0 0 60px rgba(255,107,0,0.6))' }}
        />
      </motion.div>

      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 70% at 25% 50%, rgba(255,107,0,0.12) 0%, transparent 65%)' }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <p className="text-mekra-orange text-xs font-black uppercase tracking-[0.3em] mb-6">
            Día del Padre · 21 de junio 2026
          </p>
          <h2
            className="text-white font-black leading-tight tracking-tight text-balance mb-8"
            style={{ fontSize: 'clamp(2.4rem, 6.5vw, 5.5rem)' }}
          >
            Queda poco tiempo.<br />
            <span className="text-mekra-orange">Pide hoy.</span>
          </h2>
          <p className="text-white/35 text-base sm:text-lg max-w-md mb-10 leading-relaxed">
            Si lo pides hoy, llega personalizado con su foto antes del 21.
            Si esperas el fin de semana, ya no hay garantía.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href={WA}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-9 py-4 bg-mekra-orange text-white font-black text-base rounded-full transition-all duration-200 hover:brightness-110 hover:scale-[1.03] active:scale-[0.97] shadow-2xl shadow-mekra-orange/40"
            >
              <SvgWhatsApp size={18} />
              Hacer mi pedido
            </a>
            <Link
              to="/catalogo"
              className="inline-flex items-center gap-2 px-8 py-4 border border-white/15 text-white/60 font-bold text-base rounded-full transition-all duration-200 hover:border-white/40 hover:text-white"
            >
              Ver catálogo completo
            </Link>
          </div>

          <div className="flex flex-wrap gap-6 mt-10">
            {['📍 Hecho en Trujillo', '⚡ Lista en 2-3 días', '✓ Garantía incluida'].map(t => (
              <span key={t} className="text-white/25 text-xs font-bold">{t}</span>
            ))}
          </div>
        </FadeUp>
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
