import { useState, useLayoutEffect, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from '@studio-freight/lenis'
import { productos, siteInfo } from '../data'
import { useCart } from '../context/CartContext'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

gsap.registerPlugin(ScrollTrigger)

// Frames de la cámara — Vite resuelve el glob en build time
const _framesRaw = import.meta.glob(
  '../assets/camara-frames/frame-*.png',
  { eager: true }
)
const FRAME_SRCS = Object.keys(_framesRaw)
  .sort()
  .map(k => _framesRaw[k].default)

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

// ── ENRUTADOR DE PLANTILLAS ────────────────────────────────────────

function Detalle({ producto }) {
  useDocumentTitle(producto.nombre)
  const [sinMovimiento] = useState(prefiereSinMovimiento)

  // La cámara tiene su propia experiencia de scroll con frames
  if (producto.id === 'llavero-camara-papa') {
    return (
      <main className="bg-mekra-white">
        {sinMovimiento
          ? <HeroCamaraEstatico producto={producto} />
          : <HeroCamaraFrames producto={producto} />}
        <Especificaciones producto={producto} />
        <CtaFinal producto={producto} />
      </main>
    )
  }

  // Plantilla genérica oscura para el resto de productos
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

// ── CÁMARA — ANIMACIÓN FRAME BY FRAME ─────────────────────────────

function HeroCamaraFrames({ producto }) {
  // Si no hay frames, delegar al estático (sin hooks propios aquí)
  if (FRAME_SRCS.length === 0) return <HeroCamaraEstatico producto={producto} />
  return <HeroCamaraFramesInner producto={producto} />
}

function HeroCamaraFramesInner({ producto }) {
  const wrapperRef  = useRef(null)
  const canvasRef   = useRef(null)
  const textRef     = useRef(null)
  const subtextRef  = useRef(null)
  const imagesRef   = useRef([])
  const [cargado, setCargado] = useState(false)

  // Precarga de los 50 frames + ajuste de dimensiones del canvas
  useEffect(() => {
    const total = FRAME_SRCS.length
    let n = 0
    let dimsListed = false

    const imgs = FRAME_SRCS.map(src => {
      const img = new Image()
      img.onload = () => {
        // Tomar dimensiones del primer frame cargado
        if (!dimsListed && canvasRef.current) {
          canvasRef.current.width  = img.naturalWidth
          canvasRef.current.height = img.naturalHeight
          dimsListed = true
        }
        if (++n === total) setCargado(true)
      }
      img.onerror = () => { if (++n === total) setCargado(true) }
      img.src = src
      return img
    })

    imagesRef.current = imgs
    return () => { imagesRef.current = [] }
  }, [])

  // GSAP + Lenis — solo cuando todos los frames están cargados
  useLayoutEffect(() => {
    if (!cargado) return
    const wrapper = wrapperRef.current
    const canvas  = canvasRef.current
    if (!wrapper || !canvas) return

    // Garantizar dimensiones si el onload fue antes del mount
    const first = imagesRef.current[0]
    if (first?.naturalWidth && !canvas.width) {
      canvas.width  = first.naturalWidth
      canvas.height = first.naturalHeight
    }

    const ctx2d  = canvas.getContext('2d')
    const imgs   = imagesRef.current
    const total  = imgs.length

    function drawFrame(raw) {
      const i   = Math.max(0, Math.min(Math.round(raw), total - 1))
      const img = imgs[i]
      if (!img?.complete || !img.naturalWidth) return
      ctx2d.clearRect(0, 0, canvas.width, canvas.height)
      ctx2d.drawImage(img, 0, 0, canvas.width, canvas.height)
    }
    drawFrame(0)

    const lenis = new Lenis({
      duration: 1.4,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    })
    lenis.on('scroll', ScrollTrigger.update)
    const raf = time => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    const gCtx = gsap.context(() => {
      // Estado inicial del texto
      gsap.set([textRef.current, subtextRef.current], { opacity: 0, y: 18 })

      const frameObj = { n: 0 }

      // Timeline principal vinculado al scroll del wrapper
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: 'top top',
          end:   'bottom bottom',
          scrub: 0.8,
        },
      })

      // Frame 0 → 49 durante el scroll completo
      tl.to(frameObj, {
        n: total - 1,
        ease: 'none',
        duration: 1,
        onUpdate: () => drawFrame(frameObj.n),
      })

      // Texto: entra en stagger suave al 60 % del scroll
      tl.fromTo(textRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.18, ease: 'power2.out' },
        0.60
      )
      tl.fromTo(subtextRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.18, ease: 'power2.out' },
        0.67
      )

      // Reveals para especificaciones y CTA que vienen debajo
      gsap.utils.toArray('.reveal-up').forEach(el => {
        gsap.fromTo(el,
          { opacity: 0, y: 28 },
          {
            opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          }
        )
      })
    }, wrapper)

    return () => {
      gCtx.revert()
      gsap.ticker.remove(raf)
      lenis.destroy()
    }
  }, [cargado])

  return (
    <section className="bg-mekra-white">
      {/* Breadcrumb: fuera del pin zone */}
      <div className="max-w-6xl mx-auto px-6 pt-6">
        <Link
          to="/catalogo"
          className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-mekra-black/35 hover:text-mekra-orange transition-colors duration-150"
        >
          <IconFlecha izq />
          Catálogo
          <span className="text-mekra-black/20">/</span>
          <span className="text-mekra-black/50">{producto.categoria}</span>
        </Link>
      </div>

      {/*
        Pin zone: wrapper 250dvh = 100dvh visible + 150dvh de recorrido
        El div sticky ocupa el viewport mientras el wrapper se scrollea.
      */}
      <div ref={wrapperRef} className="relative h-[250dvh]">
        <div className="sticky top-16 h-[calc(100dvh-4rem)] bg-mekra-white flex flex-col items-center overflow-hidden">

          {/* Nombre + precio — fijo en la parte superior */}
          <div className="text-center pt-7 sm:pt-9 px-6 shrink-0">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-mekra-black tracking-tight leading-tight">
              {producto.nombre}
            </h1>
            <p className="mt-2.5 text-2xl sm:text-3xl font-black text-mekra-orange tabular-nums">
              {producto.precio > 0 ? `S/${producto.precio}` : 'Consultar precio'}
            </p>
          </div>

          {/* Canvas frame-by-frame — centrado, invisible hasta cargado */}
          <div className="flex-1 flex items-center justify-center w-full px-4">
            <div className="h-[300px] md:h-[500px]">
              <canvas
                ref={canvasRef}
                className={`transition-opacity duration-500 ${cargado ? 'opacity-100' : 'opacity-0'}`}
                style={{ height: '100%', width: 'auto', display: 'block' }}
              />
            </div>
          </div>

          {/* Texto narrativo — aparece al 60 % via GSAP */}
          <div className="absolute bottom-10 sm:bottom-14 left-0 right-0 text-center px-6 pointer-events-none">
            <p ref={textRef} className="text-xl sm:text-2xl md:text-3xl font-black text-mekra-black leading-tight">
              Personalizado con su foto
            </p>
            <p ref={subtextRef} className="mt-2 text-sm sm:text-base text-mekra-black/55 leading-relaxed">
              Envíanos la foto y nosotros hacemos el resto
            </p>
          </div>

          {/* Indicador de scroll */}
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none">
            <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-mekra-black/25">
              Desliza
            </span>
            <span className="w-5 h-8 rounded-full border border-mekra-black/20 flex items-start justify-center p-1">
              <span className="w-1 h-2 rounded-full bg-mekra-orange animate-mekra-float" />
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

// Fallback estático (prefers-reduced-motion o sin frames)
function HeroCamaraEstatico({ producto }) {
  const midSrc = FRAME_SRCS[Math.floor(FRAME_SRCS.length / 2)] || null
  return (
    <section className="bg-mekra-white px-6 pt-8 pb-16">
      <div className="max-w-2xl mx-auto flex flex-col items-center text-center gap-7">
        <Link
          to="/catalogo"
          className="text-[11px] font-bold uppercase tracking-widest text-mekra-black/35 hover:text-mekra-orange transition-colors duration-150"
        >
          ← Catálogo / {producto.categoria}
        </Link>
        <h1 className="text-4xl sm:text-5xl font-black text-mekra-black tracking-tight leading-tight">
          {producto.nombre}
        </h1>
        <p className="text-2xl font-black text-mekra-orange">
          {producto.precio > 0 ? `S/${producto.precio}` : 'Consultar precio'}
        </p>
        {midSrc && (
          <img
            src={midSrc}
            alt={producto.nombre}
            className="h-64 sm:h-80 w-auto"
          />
        )}
        <p className="text-xl font-black text-mekra-black">Personalizado con su foto</p>
        <p className="text-base text-mekra-black/55 leading-relaxed">
          Envíanos la foto y nosotros hacemos el resto
        </p>
      </div>
    </section>
  )
}

// ── PLANTILLA GENÉRICA OSCURA (todos los demás productos) ──────────

function HistoriaAnimada({ producto }) {
  const fotos = producto.fotos ?? []
  const tieneSegunda = fotos.length > 1

  const trackRef    = useRef(null)
  const parallaxRef = useRef(null)
  const zoomRef     = useRef(null)
  const capaARef    = useRef(null)
  const capaBRef    = useRef(null)
  const escena1Ref  = useRef(null)
  const escena2Ref  = useRef(null)

  useLayoutEffect(() => {
    const track = trackRef.current
    if (!track) return

    const lenis = new Lenis({
      duration: 1.4,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    })
    lenis.on('scroll', ScrollTrigger.update)
    const raf = time => lenis.raf(time * 1000)
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

      tl.to(escena1Ref.current, { opacity: 0, y: -32, duration: 0.12 }, 0.28)
        .fromTo(escena2Ref.current, { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.14 }, 0.34)
        .to(escena2Ref.current, { opacity: 0, y: -32, duration: 0.12 }, 0.82)
        .to({}, { duration: 0.1 }, 0.95)

      if (tieneSegunda) {
        tl.to(capaARef.current, { opacity: 0, duration: 0.2, ease: 'power1.inOut' }, 0.30)
          .to(capaBRef.current, { opacity: 1, duration: 0.2, ease: 'power1.inOut' }, 0.30)
      }

      gsap.to(zoomRef.current, {
        scale: 1.16, ease: 'none',
        scrollTrigger: { trigger: track, start: 'top top', end: 'bottom bottom', scrub: 1 },
      })
      gsap.to(parallaxRef.current, {
        yPercent: -5, ease: 'none',
        scrollTrigger: { trigger: track, start: 'top top', end: 'bottom bottom', scrub: 1 },
      })

      gsap.utils.toArray('.reveal-up').forEach(el => {
        gsap.fromTo(el,
          { opacity: 0, y: 28 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true } }
        )
      })
    }, track)

    return () => { ctx.revert(); gsap.ticker.remove(raf); lenis.destroy() }
  }, [tieneSegunda])

  return (
    <section ref={trackRef} className="relative h-[240dvh] md:h-[280dvh]">
      <div className="sticky top-16 h-[calc(100dvh-4rem)] overflow-hidden">
        <div ref={parallaxRef} className="absolute inset-0 will-change-transform">
          <div ref={zoomRef} className="relative w-full h-full will-change-transform">
            <CapaVisual innerRef={capaARef} producto={producto} foto={fotos[0]} />
            {tieneSegunda && <CapaVisual innerRef={capaBRef} producto={producto} foto={fotos[1]} />}
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/85 to-transparent md:hidden z-10 pointer-events-none" />

        <CapaEscena innerRef={escena1Ref} className="z-20">
          <EnlaceCatalogo producto={producto} className="hero-in" />
          <h1 className="hero-in mt-5 text-4xl sm:text-5xl md:text-6xl font-black leading-[1.02] tracking-tight text-balance">
            {producto.nombre}
          </h1>
          <p className="hero-in mt-6">
            <PrecioEtiqueta producto={producto} />
          </p>
        </CapaEscena>

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

// ── FICHA TÉCNICA — compartida ─────────────────────────────────────

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
        <h2 className="reveal-up mt-3 text-2xl sm:text-3xl font-black tracking-tight text-mekra-white">
          Cada detalle, especificado
        </h2>
        <dl className="reveal-up mt-10 divide-y divide-white/10">
          {filas.map((f, i) => (
            <div key={i} className="flex items-baseline justify-between gap-6 py-4">
              <dt className="text-xs sm:text-sm font-bold uppercase tracking-widest text-white/40">{f.etiqueta}</dt>
              <dd className="text-right text-base sm:text-lg font-black text-mekra-white">{f.valor}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

function derivarDetalles(p) {
  return [
    { etiqueta: 'Material',              valor: p.material },
    { etiqueta: 'Medidas',               valor: p.medidas },
    { etiqueta: 'Peso',                  valor: p.peso },
    { etiqueta: 'Tiempo de fabricación', valor: p.tiempo_fabricacion },
  ].filter(f => f.valor)
}

// ── CTA FINAL — compartido ─────────────────────────────────────────

function CtaFinal({ producto }) {
  const { addItem, setIsOpen } = useCart()
  const [color, setColor] = useState(producto.colores[0] ?? null)
  const waLabel = producto.whatsapp_texto || 'Pedir por WhatsApp'
  const mensaje  = encodeURIComponent(`Hola! Me interesa "${producto.nombre}" de Mekra3D. ¿Pueden ayudarme? 🧡`)
  const waHref   = `https://wa.me/${siteInfo.whatsapp}?text=${mensaje}`
  const seVende  = producto.precio > 0

  return (
    <section className="bg-mekra-orange px-6 py-24 sm:py-32">
      <div className="reveal-up max-w-3xl mx-auto text-center">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.03] tracking-tight text-mekra-black text-balance">
          Pídelo ahora
        </h2>

        {producto.colores.length > 0 && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {producto.colores.map(c => (
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
              onClick={() => { addItem(producto, 1, color); setIsOpen(true) }}
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

// ── PIEZAS REUTILIZABLES (plantilla genérica) ──────────────────────

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

function PlaceholderProducto({ nombre }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-mekra-orange/80">Mekra3D</span>
      <span className="text-mekra-white font-black text-2xl md:text-3xl leading-tight tracking-tight text-balance">{nombre}</span>
      <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Vista del producto</span>
    </div>
  )
}

function PrecioEtiqueta({ producto }) {
  if (producto.precio > 0)
    return <span className="text-3xl sm:text-4xl font-black text-mekra-orange leading-none tabular-nums">S/{producto.precio}</span>
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
        className="inline-flex items-center gap-2 px-6 py-3 bg-mekra-orange text-mekra-white font-black uppercase tracking-widest text-xs rounded transition-all duration-200 hover:brightness-110"
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
