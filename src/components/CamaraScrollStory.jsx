/**
 * CamaraScrollStory
 * Scroll storytelling estilo Huawei para el Llavero Cámara Papá.
 * Desktop: cámara izquierda 55% | textos derecha 45%
 * Mobile:  cámara arriba 60dvh  | textos abajo
 * Scroll total: 400dvh. GSAP ScrollTrigger scrub: 1.5
 */

import { useRef, useEffect, useLayoutEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from '@studio-freight/lenis'
import { siteInfo } from '../data'

gsap.registerPlugin(ScrollTrigger)

// Vite resuelve el glob en build-time; frames ordenados 001 → 050
const _raw = import.meta.glob('../assets/camara-frames/frame-*.png', { eager: true })
const FRAME_SRCS = Object.keys(_raw).sort().map(k => _raw[k].default)

// Dimensiones conocidas de los frames (720×1280 RGBA)
const FRAME_W = 720
const FRAME_H = 1280

const WA_URL = `https://wa.me/${siteInfo.whatsapp}?text=${encodeURIComponent(
  'Hola, quiero el Llavero Cámara Papá 🎁'
)}`

function prefiereSinMovimiento() {
  return typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// ── EXPORT ────────────────────────────────────────────────────────

export default function CamaraScrollStory({ producto }) {
  const [sinMovimiento] = useState(prefiereSinMovimiento)

  if (FRAME_SRCS.length === 0 || sinMovimiento) {
    return <CamaraEstatica producto={producto} />
  }
  return <CamaraAnimada producto={producto} />
}

// ── ANIMADA ───────────────────────────────────────────────────────

function CamaraAnimada({ producto }) {
  const wrapperRef  = useRef(null)
  const canvasRef   = useRef(null)
  const titleRef    = useRef(null)
  const priceRef    = useRef(null)
  const taglineRef  = useRef(null)
  const subtitleRef = useRef(null)
  const btnRef      = useRef(null)
  const imagesRef   = useRef([])
  const [cargado, setCargado] = useState(false)

  // Precarga de los 50 frames
  useEffect(() => {
    // Fijar dimensiones del canvas desde ya (evita layout-shift antes de onload)
    if (canvasRef.current) {
      canvasRef.current.width  = FRAME_W
      canvasRef.current.height = FRAME_H
    }

    const total = FRAME_SRCS.length
    let n = 0
    const imgs = FRAME_SRCS.map(src => {
      const img = new Image()
      img.onload  = () => { if (++n === total) setCargado(true) }
      img.onerror = () => { if (++n === total) setCargado(true) }
      img.src = src
      return img
    })
    imagesRef.current = imgs
    return () => { imagesRef.current = [] }
  }, [])

  // GSAP + Lenis una vez que todos los frames están listos
  useLayoutEffect(() => {
    if (!cargado) return
    const wrapper = wrapperRef.current
    const canvas  = canvasRef.current
    if (!wrapper || !canvas) return

    const ctx2d = canvas.getContext('2d')
    const imgs  = imagesRef.current
    const total = imgs.length

    function drawFrame(raw) {
      const i   = Math.max(0, Math.min(Math.round(raw), total - 1))
      const img = imgs[i]
      if (!img?.complete || !img.naturalWidth) return
      ctx2d.clearRect(0, 0, FRAME_W, FRAME_H)
      ctx2d.drawImage(img, 0, 0, FRAME_W, FRAME_H)
    }
    drawFrame(0)

    // Lenis smooth scroll sincronizado con GSAP
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
      // Estado inicial: todos los textos ocultos
      gsap.set(
        [titleRef.current, priceRef.current, taglineRef.current,
         subtitleRef.current, btnRef.current],
        { opacity: 0, y: 30 }
      )

      const frameObj = { n: 0 }

      // Timeline vinculada al scroll del wrapper (400dvh)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: 'top top',
          end:   'bottom bottom',
          scrub: 1.5,
        },
      })

      // Frame 0 → 49 a lo largo de todo el scroll
      tl.to(frameObj, {
        n: total - 1,
        ease: 'none',
        duration: 1,
        onUpdate: () => drawFrame(frameObj.n),
      }, 0)

      // Textos: cada uno entra en fade-in + slide-up en su porcentaje
      const textos = [
        { ref: titleRef,    at: 0.25 },
        { ref: priceRef,    at: 0.45 },
        { ref: taglineRef,  at: 0.60 },
        { ref: subtitleRef, at: 0.75 },
        { ref: btnRef,      at: 0.90 },
      ]

      textos.forEach(({ ref, at }) => {
        tl.fromTo(
          ref.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.06, ease: 'power2.out' },
          at
        )
      })

      // Reveals de secciones inferiores (ficha + CTA)
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

      {/* Wrapper 400dvh — da recorrido de scroll; contenido sticky adentro */}
      <div ref={wrapperRef} className="relative h-[400dvh]">
        <div className="sticky top-16 h-[calc(100dvh-4rem)] bg-mekra-white flex flex-col md:flex-row overflow-hidden">

          {/* ── IZQUIERDA / ARRIBA — cámara ──────────────────────── */}
          <div className="h-[60dvh] md:h-auto md:w-[55%] md:flex-none flex items-center justify-center bg-mekra-white">
            <canvas
              ref={canvasRef}
              className={`w-auto block transition-opacity duration-500 ${cargado ? 'opacity-100' : 'opacity-0'}`}
              style={{ height: '100%', maxHeight: '80%' }}
            />
          </div>

          {/* ── DERECHA / ABAJO — textos ──────────────────────────── */}
          <div className="flex-1 md:w-[45%] flex flex-col justify-center items-start px-8 md:pr-16 md:pl-10 gap-5 md:gap-7">

            {/* Título */}
            <h1
              ref={titleRef}
              className="will-change-transform font-extrabold text-mekra-black leading-[1.05] tracking-tight"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
            >
              {producto.nombre}
            </h1>

            {/* Precio */}
            <p
              ref={priceRef}
              className="will-change-transform font-bold text-mekra-orange tabular-nums leading-none"
              style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)' }}
            >
              {producto.precio > 0 ? `S/${producto.precio}` : 'Consultar precio'}
            </p>

            {/* Tagline */}
            <p
              ref={taglineRef}
              className="will-change-transform font-black text-mekra-black leading-snug"
              style={{ fontSize: 'clamp(1.1rem, 2vw, 1.5rem)' }}
            >
              Personalizado con su foto
            </p>

            {/* Subtítulo */}
            <p
              ref={subtitleRef}
              className="will-change-transform text-mekra-black/60 leading-relaxed"
              style={{ fontSize: '1rem', color: '#666' }}
            >
              Envíanos la foto y nosotros hacemos el resto
            </p>

            {/* Botón WhatsApp */}
            <a
              ref={btnRef}
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="will-change-transform inline-flex items-center gap-2.5 px-8 py-4 bg-mekra-orange text-mekra-white font-black rounded-full text-sm sm:text-base transition-all duration-200 hover:scale-[1.04] active:scale-[0.98] shadow-lg shadow-mekra-orange/25"
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
              <img src={midSrc} alt={producto.nombre} className="h-72 sm:h-96 w-auto" />
            </div>
          )}
          <div className="flex-1 flex flex-col gap-5">
            <h1 className="font-extrabold text-mekra-black tracking-tight text-4xl sm:text-5xl leading-tight">
              {producto.nombre}
            </h1>
            <p className="font-bold text-mekra-orange text-3xl">
              {producto.precio > 0 ? `S/${producto.precio}` : 'Consultar precio'}
            </p>
            <p className="font-black text-mekra-black text-xl">Personalizado con su foto</p>
            <p className="text-mekra-black/60 leading-relaxed">
              Envíanos la foto y nosotros hacemos el resto
            </p>
            <a
              href={WA_URL}
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
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="rotate-180">
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
