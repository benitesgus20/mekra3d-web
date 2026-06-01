/**
 * CamaraScrollStory — scroll storytelling + color picker
 *
 * CONCEPTO: una sola cámara continua.
 * El canvas del scroll storytelling ES la cámara del color picker.
 * Los PNGs (negro/gris/azul) solo aparecen cuando el usuario hace click
 * en un swatch — se hacen crossfade sobre el canvas con opacity 0.4s.
 *
 * 700dvh total:
 *   0dvh – 500dvh → scroll story: frames 001→050 + textos
 *   500dvh – 700dvh → canvas desliza a izq-1/3 con scrub + picker panel
 *
 * Timeline normalizado (0.0 → 1.0 sobre 700dvh):
 *   0.10 → precio apparece
 *   0.22 → tagline apparece
 *   0.34 → subtítulo apparece
 *   0.60 → story texts desaparecen
 *   0.714 → canvas empieza a escalar (1 → 0.75, transformOrigin left center)
 *   0.75 → picker panel fade-in + slideUp
 *   1.0  → fin del scroll
 */

import { useRef, useEffect, useLayoutEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from '@studio-freight/lenis'
import { siteInfo } from '../data'
import camaraNegro from '../assets/camara-negro.png'
import camaraGris  from '../assets/camara-gris.png'
import camaraAzul  from '../assets/camara-azul.png'

gsap.registerPlugin(ScrollTrigger)

const _mods = import.meta.glob(
  '/src/assets/camara-frames/frame-*[13579].png',
  { eager: true }
)
const FRAME_SRCS = Object.keys(_mods).sort().map(k => _mods[k].default)

const COLOR_IMAGES   = { negro: camaraNegro, gris: camaraGris, azul: camaraAzul }
const COLOR_LABELS   = { negro: 'Negro',     gris: 'Gris',     azul: 'Azul'     }
const COLOR_SWATCHES = { negro: '#1A1A1A',   gris: '#808080',  azul: '#2563EB'  }

function waUrlColor(color) {
  const label = COLOR_LABELS[color].toUpperCase()
  return `https://wa.me/${siteInfo.whatsapp}?text=${encodeURIComponent(
    `Hola, quiero la Cámara de los Recuerdos en color ${label}`
  )}`
}

function waUrl(nombre) {
  return `https://wa.me/${siteInfo.whatsapp}?text=${encodeURIComponent(
    `Hola, quiero pedir "${nombre}" de Mekra3D 🎁`
  )}`
}

function prefiereSinMovimiento() {
  return typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function CamaraScrollStory({ producto }) {
  const [sinMovimiento] = useState(prefiereSinMovimiento)
  if (FRAME_SRCS.length === 0 || sinMovimiento) return <CamaraEstatica producto={producto} />
  return <CamaraAnimada producto={producto} />
}

// ── ANIMADA ───────────────────────────────────────────────────────────────────

function CamaraAnimada({ producto }) {
  const wrapperRef         = useRef(null)
  const canvasRef          = useRef(null)
  const canvasContainerRef = useRef(null)  // anima scale 1→0.75 al final del scroll
  const colorOverlayRef    = useRef(null)  // PNGs sobre canvas; fade-in solo al clickear swatch
  const storyTextsRef      = useRef(null)  // fade-out antes de la transición
  const pickerPanelRef     = useRef(null)  // panel derecho del color picker
  const priceRef           = useRef(null)
  const taglineRef         = useRef(null)
  const subtitleRef        = useRef(null)
  const imgsRef            = useRef([])
  const currentIndexRef    = useRef(0)
  const rafIdRef           = useRef(null)

  const [loaded,      setLoaded]      = useState(false)
  // null = ningún color clickeado aún (canvas visible, sin PNG)
  const [activeColor, setActiveColor] = useState(null)

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

  useLayoutEffect(() => {
    if (!loaded) return
    const wrapper   = wrapperRef.current
    const canvas    = canvasRef.current
    const container = canvasContainerRef.current
    if (!wrapper || !canvas || !container) return

    const ctx  = canvas.getContext('2d')
    const imgs = imgsRef.current
    const dpr  = window.devicePixelRatio || 1

    function drawFrame(idx) {
      const img = imgs[Math.max(0, Math.min(idx, imgs.length - 1))]
      if (!img?.complete || !canvas.width || !canvas.height) return

      const imgRatio    = img.naturalWidth / img.naturalHeight
      const canvasRatio = canvas.width / canvas.height

      let drawW, drawH, offsetX, offsetY
      if (canvasRatio > imgRatio) {
        drawH   = canvas.height
        drawW   = drawH * imgRatio
        offsetX = (canvas.width - drawW) / 2
        offsetY = 0
      } else {
        drawW   = canvas.width
        drawH   = drawW / imgRatio
        offsetX = 0
        offsetY = (canvas.height - drawH) / 2
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, offsetX, offsetY, drawW, drawH)
    }

    canvas.width  = Math.round(container.clientWidth  * dpr)
    canvas.height = Math.round(container.clientHeight * dpr)
    drawFrame(0)

    const ro = new ResizeObserver(([entry]) => {
      const { width: w, height: h } = entry.contentRect
      canvas.width  = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      drawFrame(currentIndexRef.current)
    })
    ro.observe(container)

    const lenis = new Lenis({
      duration: 1.4,
      easing:   t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth:   true,
    })
    lenis.on('scroll', ScrollTrigger.update)
    const lenisRaf = time => lenis.raf(time * 1000)
    gsap.ticker.add(lenisRaf)
    gsap.ticker.lagSmoothing(0)

    const gCtx = gsap.context(() => {
      // Estados iniciales
      gsap.set([priceRef.current, taglineRef.current, subtitleRef.current], { opacity: 0, y: 40 })
      gsap.set(pickerPanelRef.current, { opacity: 0, y: 30, pointerEvents: 'none' })
      // El canvas escala desde el borde izquierdo (no desde el centro)
      gsap.set(canvasContainerRef.current, { transformOrigin: 'left center' })

      // Dibuja frames (capeados en el 71.4% del scroll = primeros 500dvh)
      ScrollTrigger.create({
        trigger: wrapper,
        start:   'top top',
        end:     'bottom bottom',
        onUpdate(self) {
          const frameP = Math.min(self.progress / 0.714, 1)
          const idx    = Math.min(Math.floor(frameP * imgs.length), imgs.length - 1)
          if (rafIdRef.current) return
          rafIdRef.current = requestAnimationFrame(() => {
            if (idx !== currentIndexRef.current) {
              currentIndexRef.current = idx
              drawFrame(idx)
            }
            rafIdRef.current = null
          })
        },
      })

      // Timeline principal scrubbed — cubre los 700dvh completos
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start:   'top top',
          end:     'bottom bottom',
          scrub:   0.5,
        },
      })

      // Story: textos aparecen progresivamente (0.10–0.39)
      tl.fromTo(priceRef.current,
        { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.05, ease: 'power2.out' }, 0.10)
      tl.fromTo(taglineRef.current,
        { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.05, ease: 'power2.out' }, 0.22)
      tl.fromTo(subtitleRef.current,
        { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.05, ease: 'power2.out' }, 0.34)

      // Pausa con textos estáticos
      tl.to({}, { duration: 0.26 }, 0.39)

      // Story texts desaparecen hacia arriba (0.60–0.68)
      tl.to(storyTextsRef.current, {
        opacity: 0, y: -50, duration: 0.08, ease: 'power2.in',
      }, 0.60)

      // Canvas desliza a izquierda 1/3: scale 1→0.75 con scrub (0.714–1.0)
      // transformOrigin 'left center' → el borde izquierdo queda fijo,
      // la cámara se achica hacia la derecha quedando en el tercio izquierdo
      tl.to(canvasContainerRef.current, {
        scale:    0.75,
        ease:     'power2.inOut',
        duration: 0.286,
      }, 0.714)

      // Picker panel aparece a la derecha mientras la cámara desliza (0.75–1.0)
      tl.to(pickerPanelRef.current, {
        opacity:       1,
        y:             0,
        pointerEvents: 'auto',
        duration:      0.25,
        ease:          'power2.out',
      }, 0.75)

      // Reveals de secciones inferiores
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

  // Etiqueta del selector de color
  const colorLabel = activeColor ? `Color: ${COLOR_LABELS[activeColor]}` : 'Elige un color'
  // URL de WhatsApp — usa negro por defecto si no se ha elegido
  const waHref = waUrlColor(activeColor ?? 'negro')

  return (
    <>
      {/* Breadcrumb */}
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

      {/* Scroll zone 700dvh */}
      <div ref={wrapperRef} className="relative h-[700dvh]">
        <div
          className="sticky top-16 h-[calc(100dvh-4rem)] bg-mekra-white overflow-hidden flex flex-col md:block"
          style={{ zIndex: 1 }}
        >

          {/* ── CÁMARA ─────────────────────────────────────────────────────── */}
          {/* Mobile: flex child, h-55dvh                                       */}
          {/* Desktop: absolute left-0, w-55% → scale 0.75 al terminar scroll  */}
          <div
            ref={canvasContainerRef}
            className="relative shrink-0 h-[55dvh] w-full md:absolute md:top-0 md:left-0 md:h-full md:w-[55%]"
          >
            {!loaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="w-10 h-10 rounded-full border-4 border-mekra-black/10 border-t-mekra-orange animate-spin" />
              </div>
            )}

            {/* Canvas — frames animados y congelado en frame-050 al final */}
            <canvas
              ref={canvasRef}
              style={{
                display:        'block',
                width:          '100%',
                height:         '100%',
                imageRendering: 'crisp-edges',
                willChange:     'transform',
                transform:      'translateZ(0)',
                opacity:        loaded ? 1 : 0,
                transition:     'opacity 0.4s ease',
              }}
            />

            {/* PNG de color — solo aparece al hacer click en un swatch */}
            {/* Crossfade sobre el canvas (0.4s), canvas queda debajo   */}
            <div
              ref={colorOverlayRef}
              className="absolute inset-0 pointer-events-none"
            >
              {Object.entries(COLOR_IMAGES).map(([color, src]) => (
                <img
                  key={color}
                  src={src}
                  alt={`Cámara ${COLOR_LABELS[color]}`}
                  className="absolute inset-0 w-full h-full object-contain"
                  style={{
                    opacity:    activeColor === color ? 1 : 0,
                    transition: 'opacity 0.4s ease',
                  }}
                />
              ))}
            </div>
          </div>

          {/* ── STORY TEXTS ────────────────────────────────────────────────── */}
          {/* Desaparecen antes de la transición (fade-out + slide-up)         */}
          <div
            ref={storyTextsRef}
            className="flex-1 flex flex-col justify-center px-8 gap-5 md:absolute md:top-0 md:right-0 md:bottom-auto md:left-auto md:h-full md:w-[45%] md:px-10 md:pr-20 md:gap-8"
            style={{ willChange: 'opacity, transform' }}
          >
            <h1
              className="font-extrabold text-mekra-black leading-tight tracking-tight text-balance"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3.5rem)', fontWeight: 800 }}
            >
              {producto.nombre}
            </h1>
            <p
              ref={priceRef}
              className="will-change-transform font-bold text-mekra-orange tabular-nums leading-none"
              style={{ fontSize: 'clamp(2rem, 3vw, 3rem)', fontWeight: 700 }}
            >
              {precio}
            </p>
            <p
              ref={taglineRef}
              className="will-change-transform font-black text-mekra-black leading-snug"
              style={{ fontSize: 'clamp(1.1rem, 1.8vw, 1.6rem)' }}
            >
              Personalizado con foto a elección
            </p>
            <p
              ref={subtitleRef}
              className="will-change-transform leading-relaxed"
              style={{ fontSize: '1rem', color: '#666666' }}
            >
              Envíanos la foto y nosotros hacemos el resto
            </p>
          </div>

          {/* ── COLOR PICKER PANEL ─────────────────────────────────────────── */}
          {/* Aparece a la derecha mientras la cámara desliza hacia izq-1/3    */}
          {/* Desktop: ocupa el espacio derecho que libera el canvas escalado  */}
          {/* Mobile:  panel en la parte inferior de la pantalla               */}
          <div
            ref={pickerPanelRef}
            className="absolute bottom-0 left-0 right-0 flex flex-col items-center gap-5 px-8 pb-10 pt-4 bg-mekra-white md:top-0 md:bottom-auto md:left-[42%] md:right-0 md:h-full md:items-start md:justify-center md:px-12 md:pb-0 md:pt-0 md:bg-transparent"
            style={{ willChange: 'opacity, transform' }}
          >
            {/* Título */}
            <p
              className="font-extrabold text-mekra-black leading-tight tracking-tight text-center md:text-left"
              style={{ fontSize: 'clamp(1.4rem, 2.2vw, 1.8rem)', fontWeight: 800 }}
            >
              {producto.nombre}
            </p>

            {/* Precio */}
            <p
              className="font-bold tabular-nums leading-none"
              style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 700, color: '#FF6B00' }}
            >
              {precio}
            </p>

            {/* Descripción */}
            <p style={{ fontSize: '1rem', color: '#666666' }}>
              Personalizado con foto a elección
            </p>

            {/* Selector de color */}
            <div className="flex flex-col items-center md:items-start gap-3">
              <div className="flex items-center" style={{ gap: 16 }}>
                {Object.entries(COLOR_SWATCHES).map(([color, bg]) => (
                  <button
                    key={color}
                    onClick={() => setActiveColor(color)}
                    aria-label={`Color ${COLOR_LABELS[color]}`}
                    className="rounded-full transition-all duration-150 hover:scale-110 active:scale-95"
                    style={{
                      width:           48,
                      height:          48,
                      backgroundColor: bg,
                      outline:         activeColor === color
                        ? '2px solid #FF6B00'
                        : '2px solid transparent',
                      outlineOffset:   2,
                      opacity:         1,
                    }}
                  />
                ))}
              </div>
              {/* Etiqueta: "Elige un color" hasta que se haga click */}
              <p style={{ fontSize: '0.9rem', color: '#666666' }}>
                {colorLabel}
              </p>
            </div>

            {/* Botón WhatsApp */}
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-mekra-orange text-mekra-white font-black rounded-full text-sm sm:text-base transition-all duration-200 hover:scale-[1.04] active:scale-[0.98] shadow-lg shadow-mekra-orange/25"
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

// ── ESTÁTICO (prefers-reduced-motion / sin frames) ────────────────────────────

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
            <h1
              className="font-extrabold text-mekra-black tracking-tight leading-tight"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3.5rem)', fontWeight: 800 }}
            >
              {producto.nombre}
            </h1>
            <p className="font-bold text-mekra-orange" style={{ fontSize: 'clamp(2rem, 3vw, 3rem)' }}>
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

// ── ÍCONOS ────────────────────────────────────────────────────────────────────

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
