import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

// Cupones válidos hardcodeados
const CUPONES = {
  'MEKRA10':  { porcentaje: 10 },
  'MEKRA20':  { porcentaje: 20 },
  'LABOON15': { porcentaje: 15 },
  'PRIMERA':  { porcentaje:  5 },
}

function generarMensajeWA(items, total, cuponAplicado) {
  const lineas = items.map(item => {
    const subtotal = (item.precio * item.quantity).toFixed(2)
    const color = item.color ? ` (${item.color})` : ''
    return `• ${item.quantity}x ${item.nombre}${color} — S/${subtotal}`
  })

  const descuento = cuponAplicado ? total * (cuponAplicado.porcentaje / 100) : 0
  const totalFinal = total - descuento

  const bloqueTotal = cuponAplicado
    ? [
        `Subtotal: S/${total.toFixed(2)}`,
        `Cupón ${cuponAplicado.codigo} (${cuponAplicado.porcentaje}% OFF): -S/${descuento.toFixed(2)}`,
        `Total: S/${totalFinal.toFixed(2)}`,
      ]
    : [`Total: S/${total.toFixed(2)}`]

  return [
    'Hola! Quiero hacer un pedido en Mekra3D 🧡',
    '',
    ...lineas,
    '',
    ...bloqueTotal,
    '',
    'Quisiera coordinar la entrega en Trujillo.',
  ].join('\n')
}

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, clearCart, total } = useCart()
  const [itemAEliminar, setItemAEliminar] = useState(null)

  // Estado del cupón
  const [codigoInput, setCodigoInput]   = useState('')
  const [cuponAplicado, setCuponAplicado] = useState(null)   // { codigo, porcentaje } | null
  const [estadoCupon, setEstadoCupon]   = useState('idle')   // 'idle' | 'valido' | 'invalido'

  // Montos derivados del cupón
  const descuento  = cuponAplicado ? total * (cuponAplicado.porcentaje / 100) : 0
  const totalFinal = total - descuento

  // Resetear cupón cuando el carrito se queda vacío
  useEffect(() => {
    if (items.length === 0) resetCupon()
  }, [items.length])

  // Bloquear scroll del body mientras el drawer está abierto
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Cerrar con Escape; si hay modal abierto, cerrarlo primero
  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') {
        if (itemAEliminar) setItemAEliminar(null)
        else setIsOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [setIsOpen, itemAEliminar])

  const waUrl = `https://wa.me/51922372823?text=${encodeURIComponent(
    generarMensajeWA(items, total, cuponAplicado)
  )}`

  function confirmarEliminar() {
    if (!itemAEliminar) return
    removeItem(itemAEliminar.id, itemAEliminar.color)
    setItemAEliminar(null)
  }

  function aplicarCupon() {
    const codigo = codigoInput.trim().toUpperCase()
    if (CUPONES[codigo]) {
      setCuponAplicado({ codigo, ...CUPONES[codigo] })
      setEstadoCupon('valido')
    } else {
      setCuponAplicado(null)
      setEstadoCupon('invalido')
    }
  }

  function resetCupon() {
    setCuponAplicado(null)
    setCodigoInput('')
    setEstadoCupon('idle')
  }

  function limpiarTodo() {
    clearCart()
    resetCupon()
  }

  return (
    <>
      {/* Modal de confirmación — por encima del drawer */}
      {itemAEliminar && (
        <ModalConfirmacion
          nombre={itemAEliminar.nombre}
          onConfirmar={confirmarEliminar}
          onCancelar={() => setItemAEliminar(null)}
        />
      )}

      {/* Overlay */}
      <div
        onClick={() => setIsOpen(false)}
        aria-hidden
        className={`fixed inset-0 z-[55] bg-black/60 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Panel del drawer */}
      <div
        role="dialog"
        aria-label="Carrito de compras"
        className={`fixed top-0 right-0 z-[60] h-full w-full sm:max-w-sm bg-mekra-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Cabecera */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-mekra-black/10 shrink-0">
          <div className="flex items-center gap-2">
            <IconCarrito />
            <h2 className="text-base font-black uppercase tracking-widest text-mekra-black">
              Carrito
            </h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-mekra-black/40 hover:text-mekra-black transition-colors duration-150 p-1"
            aria-label="Cerrar carrito"
          >
            <IconX />
          </button>
        </div>

        {/* Contenido */}
        {items.length === 0
          ? <CarritoVacio onClose={() => setIsOpen(false)} />
          : (
            <>
              {/* Lista scrollable */}
              <ul className="flex-1 overflow-y-auto divide-y divide-mekra-black/8 px-5">
                {items.map(item => (
                  <ItemCarrito
                    key={`${item.id}-${item.color}`}
                    item={item}
                    onCambiarCantidad={(q) => updateQuantity(item.id, item.color, q)}
                    onEliminar={() => removeItem(item.id, item.color)}
                    onPedirConfirmacion={() => setItemAEliminar(item)}
                  />
                ))}
              </ul>

              {/* Pie con cupón + resumen + botones */}
              <div className="shrink-0 border-t border-mekra-black/10 px-5 pt-4 pb-6 space-y-3">

                {/* Campo de cupón */}
                <CampoCupon
                  codigoInput={codigoInput}
                  onCodigoChange={v => { setCodigoInput(v); setEstadoCupon('idle') }}
                  onAplicar={aplicarCupon}
                  onQuitar={resetCupon}
                  estadoCupon={estadoCupon}
                  cuponAplicado={cuponAplicado}
                />

                {/* Resumen de montos */}
                <div className="space-y-1.5">
                  {cuponAplicado && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-mekra-black/50 uppercase tracking-wider">
                        Subtotal
                      </span>
                      <span className="text-sm font-bold text-mekra-black/50">
                        S/{total.toFixed(2)}
                      </span>
                    </div>
                  )}

                  {cuponAplicado && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-green-600 uppercase tracking-wider">
                        Descuento ({cuponAplicado.porcentaje}%)
                      </span>
                      <span className="text-sm font-bold text-green-600">
                        -S/{descuento.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-mekra-black/50 uppercase tracking-wider">
                      Total del pedido
                    </span>
                    <span className="text-2xl font-black text-mekra-orange">
                      S/{totalFinal.toFixed(2)}
                    </span>
                  </div>
                </div>

                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-4 bg-mekra-orange text-white font-black uppercase tracking-widest text-sm rounded transition-all duration-200 hover:brightness-110"
                >
                  <IconWhatsApp />
                  Enviar pedido por WhatsApp
                </a>

                <button
                  onClick={limpiarTodo}
                  className="flex items-center justify-center gap-1.5 w-full text-xs font-bold text-mekra-black/30 hover:text-mekra-black/60 transition-colors duration-150 uppercase tracking-widest"
                >
                  <IconBasura />
                  Limpiar carrito
                </button>
              </div>
            </>
          )
        }
      </div>
    </>
  )
}

// ── CAMPO DE CUPÓN ─────────────────────────────────────────────────

function CampoCupon({ codigoInput, onCodigoChange, onAplicar, onQuitar, estadoCupon, cuponAplicado }) {
  function handleKeyDown(e) {
    if (e.key === 'Enter') onAplicar()
  }

  return (
    <div>
      {/* Input + botón */}
      <div className="flex gap-2">
        <input
          type="text"
          value={codigoInput}
          onChange={e => onCodigoChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="¿Tienes un cupón?"
          maxLength={20}
          disabled={!!cuponAplicado}
          className={`flex-1 px-3 py-2 text-xs font-bold border rounded transition-colors duration-150 focus:outline-none placeholder:text-mekra-black/30 bg-mekra-white text-mekra-black ${
            estadoCupon === 'valido'   ? 'border-green-500 focus:border-green-500' :
            estadoCupon === 'invalido' ? 'border-red-400 focus:border-red-400' :
            'border-mekra-black/20 focus:border-mekra-orange'
          } ${cuponAplicado ? 'opacity-60 cursor-not-allowed' : ''}`}
        />
        {cuponAplicado
          ? (
            <button
              onClick={onQuitar}
              className="px-3 py-2 border-2 border-mekra-orange text-mekra-orange text-[10px] font-black uppercase tracking-widest rounded transition-all duration-150 hover:bg-mekra-orange hover:text-white whitespace-nowrap"
            >
              Quitar
            </button>
          ) : (
            <button
              onClick={onAplicar}
              className="px-3 py-2 bg-mekra-orange text-white text-[10px] font-black uppercase tracking-widest rounded transition-all duration-150 hover:brightness-110 active:scale-95 whitespace-nowrap"
            >
              Aplicar
            </button>
          )
        }
      </div>

      {/* Mensajes de feedback */}
      {estadoCupon === 'valido' && cuponAplicado && (
        <p className="mt-1.5 text-[11px] font-bold text-green-600 flex items-center gap-1">
          <span>✓</span>
          Cupón aplicado — {cuponAplicado.porcentaje}% de descuento
        </p>
      )}
      {estadoCupon === 'invalido' && (
        <p className="mt-1.5 text-[11px] font-bold text-red-500 flex items-center gap-1">
          <span>✕</span>
          Cupón no válido o expirado
        </p>
      )}
    </div>
  )
}

// ── ITEM DEL CARRITO ───────────────────────────────────────────────

function ItemCarrito({ item, onCambiarCantidad, onEliminar, onPedirConfirmacion }) {
  function handleMenos() {
    if (item.quantity === 1) onPedirConfirmacion()
    else onCambiarCantidad(item.quantity - 1)
  }

  return (
    <li className="flex gap-3 py-4">
      {/* Imagen placeholder con aspect-ratio fijo */}
      <div className="w-16 h-16 shrink-0 rounded bg-mekra-black/5 flex items-center justify-center">
        <IconCubo />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-black text-mekra-black leading-tight line-clamp-2 mb-1">
          {item.nombre}
        </p>
        {item.color && (
          <span className="text-[10px] font-bold text-mekra-orange uppercase tracking-wider">
            {item.color}
          </span>
        )}

        <div className="flex items-center justify-between mt-2">
          {/* Controles de cantidad */}
          <div className="flex items-center border border-mekra-black/15 rounded overflow-hidden">
            <button
              onClick={handleMenos}
              className="w-7 h-7 flex items-center justify-center text-mekra-black/60 hover:bg-mekra-black/5 hover:text-mekra-black transition-colors duration-150 text-base leading-none"
              aria-label="Reducir cantidad"
            >
              −
            </button>
            <span className="w-8 text-center text-sm font-black text-mekra-black tabular-nums">
              {item.quantity}
            </span>
            <button
              onClick={() => onCambiarCantidad(item.quantity + 1)}
              className="w-7 h-7 flex items-center justify-center text-mekra-black/60 hover:bg-mekra-orange hover:text-white transition-colors duration-150 text-base leading-none"
              aria-label="Aumentar cantidad"
            >
              +
            </button>
          </div>

          {/* Precio de línea + eliminar */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-mekra-orange">
              S/{(item.precio * item.quantity).toFixed(2)}
            </span>
            <button
              onClick={onEliminar}
              className="text-mekra-black/25 hover:text-red-500 transition-colors duration-150"
              aria-label={`Eliminar ${item.nombre}`}
            >
              <IconBasura size={14} />
            </button>
          </div>
        </div>
      </div>
    </li>
  )
}

// ── ESTADO VACÍO ───────────────────────────────────────────────────

function CarritoVacio({ onClose }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8 text-center">
      <div className="w-16 h-16 rounded-full bg-mekra-black/5 flex items-center justify-center">
        <IconCarritoGrande />
      </div>
      <div>
        <p className="font-black text-mekra-black uppercase tracking-tight">
          Tu carrito está vacío
        </p>
        <p className="text-xs text-mekra-black/40 mt-1">
          Agrega productos desde el catálogo
        </p>
      </div>
      <Link
        to="/catalogo"
        onClick={onClose}
        className="inline-flex items-center gap-2 px-6 py-3 bg-mekra-orange text-white font-black uppercase tracking-widest text-xs rounded transition-all duration-200 hover:brightness-110"
      >
        Ver catálogo
        <IconFlecha />
      </Link>
    </div>
  )
}

// ── MODAL DE CONFIRMACIÓN ──────────────────────────────────────────

function ModalConfirmacion({ nombre, onConfirmar, onCancelar }) {
  return (
    <>
      {/* Overlay del modal — sobre el drawer */}
      <div
        onClick={onCancelar}
        aria-hidden
        className="fixed inset-0 z-[65] bg-black/70 transition-opacity duration-200"
      />

      {/* Tarjeta centrada */}
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label="Confirmar eliminación"
        className="fixed z-[70] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-xs bg-mekra-white rounded-lg shadow-2xl p-6 flex flex-col items-center text-center"
      >
        {/* Ícono de alerta */}
        <div className="w-12 h-12 rounded-full bg-mekra-orange/10 flex items-center justify-center mb-4">
          <IconBasura size={22} />
        </div>

        <h3 className="font-black text-mekra-black text-base mb-1 leading-tight">
          ¿Quieres eliminar este producto?
        </h3>
        <p className="text-mekra-black/50 text-xs mb-6 line-clamp-2 leading-relaxed">
          {nombre}
        </p>

        <div className="flex flex-col gap-2 w-full">
          <button
            onClick={onConfirmar}
            className="w-full py-3 bg-mekra-orange text-white font-black uppercase tracking-widest text-xs rounded transition-all duration-150 hover:brightness-110"
          >
            Sí, eliminar
          </button>
          <button
            onClick={onCancelar}
            className="w-full py-3 border-2 border-mekra-orange text-mekra-orange font-black uppercase tracking-widest text-xs rounded transition-all duration-150 hover:bg-mekra-orange hover:text-white"
          >
            Cancelar
          </button>
        </div>
      </div>
    </>
  )
}

// ── ÍCONOS SVG ─────────────────────────────────────────────────────

function IconCarrito() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-mekra-orange" aria-hidden>
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  )
}

function IconCarritoGrande() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-mekra-black/25" aria-hidden>
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  )
}

function IconX() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function IconCubo() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round" className="text-mekra-black/20" aria-hidden>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  )
}

function IconBasura({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  )
}

function IconFlecha() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

function IconWhatsApp() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  )
}
