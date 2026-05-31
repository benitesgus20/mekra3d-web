import { useState, useLayoutEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from '@studio-freight/lenis'
import { productos, siteInfo } from '../data'
import { useCart } from '../context/CartContext'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

gsap.registerPlugin(ScrollTrigger)

function prefiereSinMovimiento() {
  return typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function ProductoDetalle() {
  const { id } = useParams()
  const producto = productos.find(p => p.id === id)

  if (!producto) return <ProductoNoEncontrado />
  return <Detalle producto={producto} />
}

// ── CONTENEDOR PRINCIPAL ───────────────────────────────────────────
// Plantilla única que se adapta a cualquier producto de productos.js.

function Detalle({ producto }) {
  useDocumentTitle(producto.nombre)
  const [sinMovimiento] = useState(prefiereSinMovimiento)

  return (
    <main className="bg-[#0A0A0A] text-mekra-white">
      {sinMovimiento
        ? <HistoriaEstatica producto={producto} />
        : <HistoriaAnimada producto={producto} />}
      <Especificaciones producto={producto} />
      <CtaFinal producto={producto} />
    </main>
  )
}

// ── STORYTELLING ANIMADO (Lenis + GSAP ScrollTrigger) ──────────────

function HistoriaAnimada({ producto }) {
  const fotos = producto.fotos ?? []
  const tieneSegunda = fotos.length > 1

  const trackRef = useRef(null)
  const parallaxRef = useRef(null)
  const zoomRef = useRef(null)
  const capaARef = useRef(null)
  const capaBRef = useRef(null)
  const escena1Ref = useRef(null)
  const escena2Ref = useRef(null)

  useLayoutEffect(() => {
    const track = trackRef.current
    if (!track) return

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    })
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-in',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.12, delay: 0.1, clearProps: 'transform' }
      )

      gsap.set(escena2Ref.current, { opacity: 0, y: 32 })
      gsap.set(zoomRef.current, { scale: 1 })
      if (tieneSegunda) {
        gsap.set(capaARef.current, { opacity: 1 })
        gsap.set(capaBRef.current, { opacity: 0 })
      }

      const esMovil = window.matchMedia('(max-width: 768px)').matches

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: track, start: 'top top', end: 'bottom bottom', scrub: esMovil ? 0.6 : 1 },
      })

      // Escena 1 (nombre + precio) → Escena 2 (descripción)
      tl.to(escena1Ref.current, { opacity: 0, y: -32, duration: 0.12 }, 0.28)
        .fromTo(escena2Ref.current, { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.14 }, 0.34)
        .to(escena2Ref.current, { opacity: 0, y: -32, duration: 0.12 }, 0.82)
        .to({}, { duration: 0.1 }, 0.95)

      // Crossfade entre la primera y segunda foto (si existe)
      if (tieneSegunda) {
        tl.to(capaARef.current, { opacity: 0, duration: 0.2, ease: 'power1.inOut' }, 0.30)
          .to(capaBRef.current, { opacity: 1, duration: 0.2, ease: 'power1.inOut' }, 0.30)
      }

      // Zoom + parallax del producto a lo largo del recorrido
      gsap.to(zoomRef.current, {
        scale: 1.16, ease: 'none',
        scrollTrigger: { trigger: track, start: 'top top', end: 'bottom bottom', scrub: 1 },
      })
      gsap.to(parallaxRef.current, {
        yPercent: -5, ease: 'none',
        scrollTrigger: { trigger: track, start: 'top top', end: 'bottom bottom', scrub: 1 },
      })

      gsap.utils.toArray('.reveal-up').forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true } }
        )
      })
    }, track)

    return () => {
      ctx.revert()
      gsap.ticker.remove(raf)
      lenis.destroy()
    }
  }, [tieneSegunda])

  return (
    <section ref={trackRef} className="relative h-[240dvh] md:h-[280dvh]">
      <div className="sticky top-16 h-[calc(100dvh-4rem)] overflow-hidden">

        {/* Visual del producto (centrado, con parallax + zoom) */}
        <div ref={parallaxRef} className="absolute inset-0 will-change-transform">
          <div ref={zoomRef} className="relative w-full h-full will-change-transform">
            <CapaVisual innerRef={capaARef} producto={producto} foto={fotos[0]} />
            {tieneSegunda && <CapaVisual innerRef={capaBRef} producto={producto} foto={fotos[1]} />}
          </div>
        </div>

        {/* Velo inferior: legibilidad del texto sobre el producto en móvil */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/85 to-transparent md:hidden z-10 pointer-events-none" />

        {/* Escena 1 — nombre + precio */}
        <CapaEscena innerRef={escena1Ref} className="z-20">
          <EnlaceCatalogo producto={producto} className="hero-in" />
          <h1 className="hero-in mt-5 text-4xl sm:text-5xl md:text-6xl font-black leading-[1.02] tracking-tight text-balance">
            {producto.nombre}
          </h1>
          <p className="hero-in mt-6">
            <PrecioEtiqueta producto={producto} />
          </p>
        </CapaEscena>

        {/* Escena 2 — descripción */}
        <CapaEscena innerRef={escena2Ref} className="z-20">
          <p className="text-2xl sm:text-3xl md:text-4xl font-black leading-[1.12] tracking-tight text-balance">
            {producto.descripcion}
          </p>
        </CapaEscena>

        <IndicadorScroll />
      </div>
    </section>
  )
}

// ── STORYTELLING ESTÁTICO (prefers-reduced-motion) ─────────────────

function HistoriaEstatica({ producto }) {
  return (
    <section className="px-6 pt-12 pb-16">
      <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-8">
        <div className="w-[80vw] max-w-[360px] aspect-[3/4] rounded-3xl overflow-hidden bg-white/[0.04] border border-white/10">
          {producto.fotos?.[0]
            ? <img src={producto.fotos[0]} alt={producto.nombre} className="w-full h-full object-cover" />
            : <PlaceholderProducto nombre={producto.nombre} />}
        </div>
        <div className="max-w-xl">
          <EnlaceCatalogo producto={producto} centrado />
          <h1 className="mt-4 text-4xl sm:text-5xl font-black leading-tight tracking-tight">{producto.nombre}</h1>
          <p className="mt-5 flex justify-center"><PrecioEtiqueta producto={producto} /></p>
          <p className="mt-6 text-base sm:text-lg text-white/70 leading-relaxed">{producto.descripcion}</p>
        </div>
      </div>
    </section>
  )
}

// ── SECCIÓN — FICHA TÉCNICA (producto.detalles) ────────────────────

function Especificaciones({ producto }) {
  const filas = (producto.detalles?.length > 0)
    ? producto.detalles
    : derivarDetalles(producto)

  if (filas.length === 0) return null

  return (
    <section className="bg-[#0A0A0A] border-t border-white/10 px-6 py-20 sm:py-28">
      <div className="max-w-3xl mx-auto">
        <p className="reveal-up text-[11px] font-black uppercase tracking-[0.3em] text-mekra-orange">
          Ficha técnica
        </p>
        <h2 className="reveal-up mt-3 text-2xl sm:text-3xl font-black tracking-tight">
          Cada detalle, especificado
        </h2>

        <dl className="reveal-up mt-10 divide-y divide-white/10">
          {filas.map((f, i) => (
            <div key={i} className="flex items-baseline justify-between gap-6 py-4">
              <dt className="text-xs sm:text-sm font-bold uppercase tracking-widest text-white/40">{f.etiqueta}</dt>
              <dd className="text-right text-base sm:text-lg font-black text-white">{f.valor}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

// Respaldo: arma detalles desde los campos sueltos si el producto no define detalles[]
function derivarDetalles(p) {
  return [
    { etiqueta: 'Material',              valor: p.material },
    { etiqueta: 'Medidas',               valor: p.medidas },
    { etiqueta: 'Peso',                  valor: p.peso },
    { etiqueta: 'Tiempo de fabricación', valor: p.tiempo_fabricacion },
  ].filter(f => f.valor)
}

// ── SECCIÓN — CTA FINAL ────────────────────────────────────────────

function CtaFinal({ producto }) {
  const { addItem, setIsOpen } = useCart()
  const [color, setColor] = useState(producto.colores[0] ?? null)
  const waLabel = producto.whatsapp_texto || 'Pedir por WhatsApp'
  const mensaje = encodeURIComponent(`Hola! Me interesa "${producto.nombre}" de Mekra3D. ¿Pueden ayudarme? 🧡`)
  const waHref = `https://wa.me/${siteInfo.whatsapp}?text=${mensaje}`
  const seVende = producto.precio > 0

  function agregarAlCarrito() {
    addItem(producto, 1, color)
    setIsOpen(true)
  }

  return (
    <section className="bg-mekra-orange px-6 py-24 sm:py-32">
      <div className="reveal-up max-w-3xl mx-auto text-center">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.03] tracking-tight text-mekra-black text-balance">
          Pídelo ahora
        </h2>

        {producto.colores.length > 0 && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {producto.colores.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded border-2 transition-all duration-150 ${
                  color === c
                    ? 'bg-mekra-black border-mekra-black text-mekra-white'
                    : 'border-mekra-black/30 text-mekra-black hover:border-mekra-black'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
          {seVende && (
            <button
              onClick={agregarAlCarrito}
              className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-mekra-black text-mekra-white font-black uppercase tracking-widest text-sm sm:text-base rounded transition-all duration-200 hover:scale-[1.02] active:scale-[0.99]"
            >
              Agregar al carrito
            </button>
          )}
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-mekra-white text-mekra-black font-black uppercase tracking-widest text-sm sm:text-base rounded transition-all duration-200 hover:scale-[1.02] active:scale-[0.99] shadow-xl shadow-mekra-black/15"
          >
            <IconWhatsApp />
            {waLabel}
          </a>
        </div>
      </div>
    </section>
  )
}

// ── PIEZAS REUTILIZABLES ───────────────────────────────────────────

// Una capa visual: foto real o placeholder oscuro, dentro de un marco común
function CapaVisual({ innerRef, producto, foto }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center md:justify-end md:pr-[7%]">
      <div
        ref={innerRef}
        className="will-change-[transform,opacity] w-[76vw] max-w-[340px] md:w-[32vw] md:max-w-[460px] aspect-[3/4] rounded-3xl overflow-hidden bg-white/[0.04] border border-white/10"
      >
        {foto
          ? <img src={foto} alt={producto.nombre} className="w-full h-full object-cover" draggable={false} />
          : <PlaceholderProducto nombre={producto.nombre} />}
      </div>
    </div>
  )
}

// Capa de texto superpuesta: abajo en móvil, centro-izquierda en desktop
function CapaEscena({ innerRef, className = '', children }) {
  return (
    <div
      ref={innerRef}
      className={`absolute inset-0 flex flex-col justify-end pb-24 md:justify-center md:pb-0 px-6 md:pl-[8%] md:pr-[52%] pointer-events-none ${className}`}
    >
      <div className="pointer-events-auto max-w-md">{children}</div>
    </div>
  )
}

// Placeholder oscuro con el nombre (cuando fotos[] está vacío)
function PlaceholderProducto({ nombre }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-mekra-orange/80">Mekra3D</span>
      <span className="text-white font-black text-2xl md:text-3xl leading-tight tracking-tight text-balance">{nombre}</span>
      <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Vista del producto</span>
    </div>
  )
}

function PrecioEtiqueta({ producto }) {
  if (producto.precio > 0) {
    return (
      <span className="text-3xl sm:text-4xl font-black text-mekra-orange leading-none tabular-nums">
        S/{producto.precio}
      </span>
    )
  }
  return <span className="text-2xl font-black text-white/50 leading-none">Consultar precio</span>
}

function EnlaceCatalogo({ producto, centrado = false, className = '' }) {
  return (
    <Link
      to="/catalogo"
      className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-white/40 hover:text-mekra-orange transition-colors duration-150 ${centrado ? 'justify-center' : ''} ${className}`}
    >
      <IconFlecha izq />
      Catálogo
      <span className="text-white/20">/</span>
      <span className="text-white/60">{producto.categoria}</span>
    </Link>
  )
}

function IndicadorScroll() {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none">
      <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/30">Desliza</span>
      <span className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1">
        <span className="w-1 h-2 rounded-full bg-mekra-orange animate-mekra-float" />
      </span>
    </div>
  )
}

// ── PRODUCTO NO ENCONTRADO ─────────────────────────────────────────

function ProductoNoEncontrado() {
  return (
    <div className="min-h-screen bg-mekra-white flex flex-col items-center justify-center gap-4 text-center px-4">
      <p className="text-5xl font-black text-mekra-black/10">404</p>
      <h1 className="text-xl font-black text-mekra-black uppercase tracking-tight">Producto no encontrado</h1>
      <Link
        to="/catalogo"
        className="inline-flex items-center gap-2 px-6 py-3 bg-mekra-orange text-white font-black uppercase tracking-widest text-xs rounded transition-all duration-200 hover:brightness-110"
      >
        Ver catálogo
      </Link>
    </div>
  )
}

// ── ÍCONOS SVG ─────────────────────────────────────────────────────

function IconFlecha({ izq = false }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={izq ? 'rotate-180' : ''}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

function IconWhatsApp() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  )
}
