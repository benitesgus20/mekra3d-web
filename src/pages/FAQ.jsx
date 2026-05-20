import { useState } from 'react'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

const WA_URL = `https://wa.me/51922372823?text=${encodeURIComponent(
  'Hola, tengo una pregunta sobre Mekra3D 👋'
)}`

const FAQS = [
  {
    pregunta: '¿Cuánto tiempo demora mi pedido?',
    respuesta: 'Entre 1 y 3 días hábiles según la complejidad del diseño.',
  },
  {
    pregunta: '¿Hacen envíos fuera de Trujillo?',
    respuesta: 'Sí, enviamos a todo el Perú por Shalom u Olva Courier.',
  },
  {
    pregunta: '¿Puedo pedir un diseño personalizado?',
    respuesta: 'Sí, escríbenos por WhatsApp y lo cotizamos sin compromiso.',
  },
  {
    pregunta: '¿Cómo realizo mi pago?',
    respuesta: 'El pago es por transferencia, Yape o Plin antes de producir.',
  },
  {
    pregunta: '¿Los colores son exactos a la foto?',
    respuesta:
      'Trabajamos con los colores disponibles en filamento. Confirmamos disponibilidad al momento del pedido.',
  },
  {
    pregunta: '¿Qué material usan?',
    respuesta: 'PLA de alta calidad, resistente y seguro para uso doméstico.',
  },
  {
    pregunta: '¿Tienen garantía?',
    respuesta:
      'Sí, si el producto llega con defecto de impresión lo reemplazamos sin costo.',
  },
  {
    pregunta: '¿Puedo hacer pedidos al por mayor?',
    respuesta:
      'Sí, manejamos precios especiales para pedidos corporativos y por cantidad.',
  },
]

export default function FAQ() {
  useDocumentTitle('Preguntas frecuentes')
  const [abierto, setAbierto] = useState(null)

  function toggle(i) {
    setAbierto(prev => (prev === i ? null : i))
  }

  return (
    <div className="min-h-screen bg-mekra-black">

      {/* Cabecera */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="block h-px w-8 bg-mekra-orange shrink-0" />
          <span className="text-mekra-orange text-[10px] font-black uppercase tracking-widest">
            Soporte
          </span>
          <span className="block h-px w-8 bg-mekra-orange shrink-0" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight leading-tight mb-4">
          Preguntas frecuentes
        </h1>
        <p className="text-white/40 text-sm max-w-sm mx-auto leading-relaxed">
          Todo lo que necesitas saber antes de hacer tu pedido.
        </p>
      </div>

      {/* Acordeón */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <ItemFAQ
              key={i}
              faq={faq}
              abierto={abierto === i}
              onToggle={() => toggle(i)}
            />
          ))}
        </div>

        {/* CTA WhatsApp */}
        <div className="mt-14 flex flex-col items-center gap-4 text-center">
          <p className="text-white/30 text-sm">
            ¿No encuentras lo que buscas?
          </p>
          <a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3 bg-mekra-orange text-white font-black uppercase tracking-widest text-xs rounded transition-all duration-200 hover:brightness-110"
          >
            <IconWhatsApp />
            Escríbenos por WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}

// ── ÍTEM DEL ACORDEÓN ──────────────────────────────────────────────

function ItemFAQ({ faq, abierto, onToggle }) {
  return (
    <div
      className={`rounded border transition-colors duration-200 ${
        abierto
          ? 'border-mekra-orange/40 bg-white/[0.03]'
          : 'border-white/[0.08] hover:border-white/20'
      }`}
    >
      {/* Botón pregunta */}
      <button
        onClick={onToggle}
        aria-expanded={abierto}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span
          className={`text-sm sm:text-base font-bold leading-snug transition-colors duration-200 ${
            abierto ? 'text-white' : 'text-white/75'
          }`}
        >
          {faq.pregunta}
        </span>

        {/* Chevron naranja que rota al abrir */}
        <span
          className={`shrink-0 text-mekra-orange transition-transform duration-300 ${
            abierto ? 'rotate-180' : 'rotate-0'
          }`}
          aria-hidden
        >
          <IconChevron />
        </span>
      </button>

      {/* Respuesta con animación max-h */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          abierto ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="px-5 pb-5 text-sm text-white/45 leading-relaxed">
          {faq.respuesta}
        </p>
      </div>
    </div>
  )
}

// ── ÍCONOS SVG ─────────────────────────────────────────────────────

function IconChevron() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function IconWhatsApp() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  )
}
