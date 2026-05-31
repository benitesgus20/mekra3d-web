/**
 * CamaraScrollStory — optimizado para rendimiento
 *
 * Mejoras vs v2:
 * - 25 frames (frames impares 001,003...049) → la mitad de assets
 * - Preload completo con spinner hasta loaded===true
 * - Canvas (no <img>) + ctx.drawImage directo (sin re-render React)
 * - ResizeObserver sincroniza canvas buffer ↔ container + DPR
 * - RAF debounce en el scroll handler para batching de draws
 * - GSAP scrub reducido a 0.5 para respuesta más inmediata
 */

import { useRef, useEffect, useLayoutEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from '@studio-freight/lenis'
import { siteInfo } from '../data'

gsap.registerPlugin(ScrollTrigger)

// ── FRAMES: solo impares 001,003,005…049 = 25 imágenes ────────────
// El character class [13579] en el glob hace que Vite solo importe
// los frames con dígito final impar, reduciendo el bundle a la mitad.
const _mods = import.meta.glob(
  '/src/assets/camara-frames/frame-*[13579].png',
  { eager: true }
)
const FRAME_SRCS = Object.keys(_mods)
  .sort()
  .map(key => _mods[key].default)

function waUrl(nombre) {
  return `https://wa.me/${siteInfo.whatsapp}?text=${encodeURIComponent(
    `Hola, quiero pedir "${nombre}" de Mekra3D 🎁`
  )}`
}

function prefiereSinMovimiento() {
  return typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// ── EXPORT ────────────────────────────────────────────────────────

export default function CamaraScrollStory({ producto }) {
  const [sinMovimiento] = useState(prefiereSinMovimiento)
  if (FRAME_SRCS.length === 0 || sinMovimiento) return <CamaraEstatica producto={producto} />
  return <CamaraAnimada producto={producto} />
}

// ── ANIMADA ───────────────────────────────────────────────────────

function CamaraAnimada({ producto }) {
  const wrapperRef        = useRef(null)
  const canvasRef         = useRef(null)
  const containerRef      = useRef(null) // columna izquierda (ResizeObserver)
  const priceRef          = useRef(null)
  const taglineRef        = useRef(null)
  const subtitleRef       = useRef(null)
  const btnRef            = useRef(null)
  const imgsRef           = useRef([])   // HTMLImageElement[] precargados
  const currentIndexRef   = useRef(0)    // frame actual (mutable, sin re-render)
  const rafIdRef          = useRef(null) // id del RAF pendiente

  // loaded: true cuando todos los frames han terminado de cargar
  const [loaded, setLoaded] = useState(false)

  // ── Precarga completa de los 25 frames ────────────────────────
  useEffect(() => {
    let n = 0
    const imgs = FRAME_SRCS.map(src => {
      const img = new Image()
      img.onload  = () => { n++; if (n === FRAME_SRCS.length) setLoaded(true) }
      img.onerror = () => { n++; if (n === FRAME_SRCS.length) setLoaded(true) }
      img.src = src
      return img
    })
    imgsRef.current = imgs
    return () => { imgsRef.current = [] }
  }, [])

  // ── Canvas + GSAP + Lenis — arranca solo cuando loaded===true ──
  useLayoutEffect(() => {
    if (!loaded) return
    const wrapper   = wrapperRef.current
    const canvas    = canvasRef.current
    const container = containerRef.current
    if (!wrapper || !canvas || !container) return

    const ctx  = canvas.getContext('2d')
    const imgs = imgsRef.current
    const dpr  = window.devicePixelRatio || 1

    // Tamaño CSS del contenedor (actualizado por ResizeObserver)
    const cssSz = { w: container.clientWidth, h: container.clientHeight }

    // ── Dibuja el frame idx en el canvas ──────────────────────────
    function drawFrame(idx) {
      const img = imgs[Math.max(0, Math.min(idx, imgs.length - 1))]
      if (!img?.complete || !cssSz.w || !cssSz.h) return
      ctx.clearRect(0, 0, cssSz.w, cssSz.h)
      ctx.drawImage(img, 0, 0, cssSz.w, cssSz.h)
    }

    // Inicializar canvas buffer con tamaño actual del contenedor
    canvas.width  = Math.round(cssSz.w * dpr)
    canvas.height = Math.round(cssSz.h * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    drawFrame(0)

    // ResizeObserver: re-dimensionar buffer y redibujar al cambiar el contenedor
    const ro = new ResizeObserver(([entry]) => {
      const { width: w, height: h } = entry.contentRect
      cssSz.w = w
      cssSz.h = h
      canvas.width  = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      drawFrame(currentIndexRef.current)
    })
    ro.observe(container)

    // ── Lenis smooth scroll ───────────────────────────────────────
    const lenis = new Lenis({
      duration: 1.4,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    })
    lenis.on('scroll', ScrollTrigger.update)
    const lenisRaf = time => lenis.raf(time * 1000)
    gsap.ticker.add(lenisRaf)
    gsap.ticker.lagSmoothing(0)

    const gCtx = gsap.context(() => {
      // Textos: inician ocultos (título ya visible en JSX, no está aquí)
      gsap.set(
        [priceRef.current, taglineRef.current, subtitleRef.current, btnRef.current],
        { opacity: 0, y: 40 }
      )

      // ── Frames: RAF-debounced scroll handler ──────────────────
      // Captura progress en el momento del scroll event y
      // batea el drawImage al siguiente frame disponible de la GPU
      ScrollTrigger.create({
        trigger: wrapper,
        start: 'top top',
        end:   'bottom bottom',
        onUpdate(self) {
          const progress = self.progress          // captura inmediata
          if (rafIdRef.current) return            // ya hay un RAF pendiente
          rafIdRef.current = requestAnimationFrame(() => {
            const idx = Math.min(
              Math.floor(progress * imgs.length),
              imgs.length - 1
            )
            if (idx !== currentIndexRef.current) {
              currentIndexRef.current = idx
              drawFrame(idx)
            }
            rafIdRef.current = null
          })
        },
      })

      // ── Textos: timeline con scrub 0.5 (más inmediato) ────────
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: 'top top',
          end:   'bottom bottom',
          scrub: 0.5,
        },
      })

      tl.fromTo(priceRef.current,
        { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.06, ease: 'power2.out' }, 0.15)
      tl.fromTo(taglineRef.current,
        { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.06, ease: 'power2.out' }, 0.30)
      tl.fromTo(subtitleRef.current,
        { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.06, ease: 'power2.out' }, 0.45)
      tl.fromTo(btnRef.current,
        { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.06, ease: 'power2.out' }, 0.60)
      // Padding a duración total 1.0 (sin esto el botón aparece al 91%)
      tl.to({}, { duration: 0.34 }, 0.66)

      // Reveals de las secciones debajo (ficha + CTA)
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
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
      ro.disconnect()
      gCtx.revert()
      gsap.ticker.remove(lenisRaf)
      lenis.destroy()
    }
  }, [loaded])

  const precio = producto.precio > 0 ? `S/${producto.precio}` : 'Consultar precio'

  return (
    <>
      {/* Breadcrumb — fuera del scroll zone */}
      <div className="max-w-7xl mx-auto px-6 pt-5">
        <Link
          to="/catalogo"
          className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-mekra-black/35 hover:text-mekra-orange transition-colors duration-150"
        >
          <IconFlecha />
          Catálogo
          <span className="text-mekra-black/20 mx-0.5">/</span>
          <span className="text-mekra-black/50">{producto.categoria}</span>
        </Link>
      </div>

      {/* Wrapper 350 dvh — scroll zone */}
      <div ref={wrapperRef} className="relative h-[350dvh]">
        <div className="sticky top-16 h-[calc(100dvh-4rem)] bg-mekra-white flex flex-col md:flex-row overflow-hidden">

          {/* ── IZQUIERDA / ARRIBA — canvas ──────────────────────── */}
          <div
            ref={containerRef}
            className="relative h-[55dvh] md:h-full md:w-[55%] bg-mekra-white"
          >
            {/* Spinner mientras cargan los frames */}
            {!loaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="w-10 h-10 rounded-full border-4 border-mekra-black/10 border-t-mekra-orange animate-spin" />
              </div>
            )}

            {/* Canvas — siempre en el DOM para que el ref funcione */}
            <canvas
              ref={canvasRef}
              style={{
                display:         'block',
                width:           '100%',
                height:          '100%',
                imageRendering:  'crisp-edges',
                willChange:      'transform',
                transform:       'translateZ(0)',
                opacity:         loaded ? 1 : 0,
                transition:      'opacity 0.4s ease',
              }}
            />
          </div>

          {/* ── DERECHA / ABAJO — textos ─────────────────────────── */}
          <div className="flex-1 md:w-[45%] flex flex-col justify-center px-8 md:pl-10 md:pr-20 gap-5 md:gap-8">

            {/* Título — VISIBLE desde el inicio, sin animación GSAP */}
            <h1
              className="font-extrabold text-mekra-black leading-tight tracking-tight text-balance"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3.5rem)', fontWeight: 800 }}
            >
              {producto.nombre}
            </h1>

            {/* Precio */}
            <p
              ref={priceRef}
              className="will-change-transform font-bold text-mekra-orange tabular-nums leading-none"
              style={{ fontSize: 'clamp(2rem, 3vw, 3rem)', fontWeight: 700 }}
            >
              {precio}
            </p>

            {/* Tagline */}
            <p
              ref={taglineRef}
              className="will-change-transform font-black text-mekra-black leading-snug"
              style={{ fontSize: 'clamp(1.1rem, 1.8vw, 1.6rem)' }}
            >
              Personalizado con foto a elección
            </p>

            {/* Subtítulo */}
            <p
              ref={subtitleRef}
              className="will-change-transform leading-relaxed"
              style={{ fontSize: '1rem', color: '#666666' }}
            >
              Envíanos la foto y nosotros hacemos el resto
            </p>

            {/* Botón WhatsApp */}
            <a
              ref={btnRef}
              href={waUrl(producto.nombre)}
              target="_blank"
              rel="noopener noreferrer"
              className="will-change-transform self-start inline-flex items-center gap-2.5 px-8 py-4 bg-mekra-orange text-mekra-white font-black rounded-full text-sm sm:text-base transition-all duration-200 hover:scale-[1.04] active:scale-[0.98] shadow-lg shadow-mekra-orange/25"
            >
              <IconWhatsApp />
              Pedir ahora →
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

// ── ESTÁTICO (prefers-reduced-motion / sin frames) ─────────────────

function CamaraEstatica({ producto }) {
  const midSrc = FRAME_SRCS[Math.floor(FRAME_SRCS.length / 2)] || null
  return (
    <>
      <div className="max-w-7xl mx-auto px-6 pt-5">
        <Link
          to="/catalogo"
          className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-mekra-black/35 hover:text-mekra-orange transition-colors duration-150"
        >
          <IconFlecha />
          Catálogo
          <span className="text-mekra-black/20 mx-0.5">/</span>
          <span className="text-mekra-black/50">{producto.categoria}</span>
        </Link>
      </div>

      <section className="bg-mekra-white py-16 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-16">
          {midSrc && (
            <div className="flex-1 flex items-center justify-center">
              <img src={midSrc} alt={producto.nombre} className="h-72 sm:h-96 w-auto object-contain" />
            </div>
          )}
          <div className="flex-1 flex flex-col gap-5">
            <h1 className="font-extrabold text-mekra-black tracking-tight leading-tight"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3.5rem)', fontWeight: 800 }}>
              {producto.nombre}
            </h1>
            <p className="font-bold text-mekra-orange"
              style={{ fontSize: 'clamp(2rem, 3vw, 3rem)' }}>
              {producto.precio > 0 ? `S/${producto.precio}` : 'Consultar precio'}
            </p>
            <p className="font-black text-mekra-black" style={{ fontSize: '1.4rem' }}>
              Personalizado con foto a elección
            </p>
            <p className="leading-relaxed" style={{ color: '#666666' }}>
              Envíanos la foto y nosotros hacemos el resto
            </p>
            <a
              href={waUrl(producto.nombre)}
              target="_blank"
              rel="noopener noreferrer"
              className="self-start inline-flex items-center gap-2.5 px-8 py-4 bg-mekra-orange text-mekra-white font-black rounded-full text-base transition-all duration-200 hover:brightness-110"
            >
              <IconWhatsApp />
              Pedir ahora →
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

// ── ÍCONOS ─────────────────────────────────────────────────────────

function IconFlecha() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="rotate-180">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

function IconWhatsApp() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  )
}
