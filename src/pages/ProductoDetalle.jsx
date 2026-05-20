import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { productos } from '../data'
import { useCart } from '../context/CartContext'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

// Devuelve el descuento aplicable y el precio final según la cantidad
function calcularPrecio(precioBase, cantidad, descuentos) {
  const desc = [...descuentos]
    .sort((a, b) => b.minimo - a.minimo)
    .find(d => cantidad >= d.minimo)
  if (!desc) return { precioFinal: precioBase, porcentaje: 0 }
  return {
    precioFinal: precioBase * (1 - desc.porcentaje / 100),
    porcentaje: desc.porcentaje,
  }
}

export default function ProductoDetalle() {
  const { id } = useParams()
  const producto = productos.find(p => p.id === id)

  if (!producto) return <ProductoNoEncontrado />
  return <DetalleContenido producto={producto} />
}

// ── CONTENIDO PRINCIPAL ────────────────────────────────────────────

function DetalleContenido({ producto }) {
  useDocumentTitle(producto.nombre)
  const { addItem, setIsOpen } = useCart()
  const [colorSeleccionado, setColorSeleccionado] = useState(producto.colores[0] ?? null)
  const [cantidad, setCantidad] = useState(1)
  const [imagenActiva, setImagenActiva] = useState(0)

  const descuentos = producto.descuentos_cantidad ?? []
  const { precioFinal, porcentaje: dtoActivo } = calcularPrecio(
    producto.precio, cantidad, descuentos
  )

  const waMensaje = encodeURIComponent(
    `Hola! Me interesa "${producto.nombre}" de Mekra3D. ¿Pueden ayudarme? 🧡`
  )

  function handleAgregar() {
    addItem(producto, cantidad, colorSeleccionado)
    setIsOpen(true)
  }

  // Genera N vistas placeholder si no hay fotos reales
  const vistas = producto.fotos.length > 0
    ? producto.fotos
    : [0, 1, 2]

  return (
    <div className="min-h-screen bg-mekra-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <Link
          to="/catalogo"
          className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-mekra-black/40 hover:text-mekra-orange transition-colors duration-150"
        >
          <IconFlecha izq />
          Catálogo
          <span className="text-mekra-black/20">/</span>
          <span className="text-mekra-black/60">{producto.categoria}</span>
        </Link>
      </div>

      {/* Grid principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14">

          {/* ── GALERÍA ─────────────────────────────── */}
          <Galeria
            vistas={vistas}
            fotos={producto.fotos}
            nombre={producto.nombre}
            imagenActiva={imagenActiva}
            onSeleccionar={setImagenActiva}
          />

          {/* ── INFO ────────────────────────────────── */}
          <div className="flex flex-col gap-5">

            {/* Categoría + material */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-mekra-orange text-[10px] font-black uppercase tracking-widest">
                {producto.categoria}
              </span>
              <span className="text-mekra-black/20 text-[10px]">·</span>
              <span className="text-mekra-black/40 text-[10px] font-bold uppercase tracking-widest">
                {producto.material}
              </span>
            </div>

            {/* Nombre */}
            <h1 className="text-2xl sm:text-3xl font-black text-mekra-black leading-tight tracking-tight">
              {producto.nombre}
            </h1>

            {/* Precio con descuento dinámico */}
            <div className="flex items-end gap-3">
              {producto.precio > 0 ? (
                <>
                  <span className="text-3xl font-black text-mekra-orange leading-none">
                    S/{precioFinal.toFixed(2)}
                  </span>
                  {dtoActivo > 0 && (
                    <>
                      <span className="text-base text-mekra-black/30 line-through leading-none mb-0.5">
                        S/{producto.precio.toFixed(2)}
                      </span>
                      <span className="px-2 py-0.5 bg-mekra-orange text-white text-[10px] font-black uppercase rounded-full mb-0.5">
                        -{dtoActivo}%
                      </span>
                    </>
                  )}
                </>
              ) : (
                <span className="text-2xl font-black text-mekra-black/40 leading-none">
                  Consultar precio
                </span>
              )}
            </div>

            {/* Metadatos: estilo, peso, tiempo */}
            {(producto.estilo || producto.peso || producto.tiempo_fabricacion) && (
              <div className="flex flex-wrap gap-2">
                {producto.estilo && (
                  <span className="px-2.5 py-1 bg-mekra-black/5 text-mekra-black/60 text-[10px] font-black uppercase tracking-widest rounded">
                    {producto.estilo}
                  </span>
                )}
                {producto.peso && (
                  <span className="px-2.5 py-1 bg-mekra-black/5 text-mekra-black/60 text-[10px] font-bold rounded">
                    ⚖ {producto.peso}
                  </span>
                )}
                {producto.tiempo_fabricacion && (
                  <span className="px-2.5 py-1 bg-mekra-black/5 text-mekra-black/60 text-[10px] font-bold rounded">
                    ⏱ {producto.tiempo_fabricacion}
                  </span>
                )}
              </div>
            )}

            {/* Tabla de descuentos */}
            {descuentos.length > 0 && (
              <TablaDescuentos
                precioBase={producto.precio}
                descuentos={descuentos}
                cantidadActual={cantidad}
              />
            )}

            {/* Selector de color — solo si hay colores disponibles */}
            {producto.colores.length > 0 && (
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-mekra-black/60 mb-2">
                  Color: <span className="text-mekra-black">{colorSeleccionado}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {producto.colores.map(color => (
                    <button
                      key={color}
                      onClick={() => setColorSeleccionado(color)}
                      className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded border-2 transition-all duration-150 ${
                        colorSeleccionado === color
                          ? 'bg-mekra-orange border-mekra-orange text-white'
                          : 'border-mekra-black/20 text-mekra-black hover:border-mekra-orange hover:text-mekra-orange'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Selector de cantidad */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-mekra-black/60 mb-2">
                Cantidad
              </p>
              <div className="flex items-center border-2 border-mekra-black/15 rounded w-fit overflow-hidden">
                <button
                  onClick={() => setCantidad(c => Math.max(1, c - 1))}
                  className="w-10 h-10 flex items-center justify-center text-mekra-black/60 hover:bg-mekra-black/5 transition-colors duration-150 text-lg font-bold"
                  aria-label="Reducir cantidad"
                >
                  −
                </button>
                <span className="w-12 text-center text-base font-black text-mekra-black tabular-nums">
                  {cantidad}
                </span>
                <button
                  onClick={() => setCantidad(c => c + 1)}
                  className="w-10 h-10 flex items-center justify-center text-mekra-black/60 hover:bg-mekra-orange hover:text-white transition-colors duration-150 text-lg font-bold"
                  aria-label="Aumentar cantidad"
                >
                  +
                </button>
              </div>
            </div>

            {/* Descripción */}
            <p className="text-mekra-black/60 text-sm leading-relaxed">
              {producto.descripcion}
            </p>

            {/* Botones de acción */}
            <div className="flex flex-col gap-3 pt-2">
              {producto.precio > 0 && (
                <button
                  onClick={handleAgregar}
                  className="w-full py-4 bg-mekra-orange text-white font-black uppercase tracking-widest text-sm rounded transition-all duration-200 hover:brightness-110 active:scale-[0.99]"
                >
                  Agregar al carrito — S/{(precioFinal * cantidad).toFixed(2)}
                </button>
              )}

              <a
                href={`https://wa.me/51922372823?text=${waMensaje}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 border-2 border-mekra-orange text-mekra-orange font-black uppercase tracking-widest text-sm rounded transition-all duration-200 hover:bg-mekra-orange hover:text-white flex items-center justify-center gap-2"
              >
                <IconWhatsApp />
                {producto.precio > 0 ? 'Pedir personalizado' : 'Consultar por WhatsApp'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── GALERÍA ────────────────────────────────────────────────────────

function Galeria({ vistas, fotos, nombre, imagenActiva, onSeleccionar }) {
  const tieneImagenesReales = fotos.length > 0

  return (
    <div className="flex flex-col gap-3">
      {/* Imagen principal */}
      <div className="aspect-square rounded-lg bg-mekra-black/5 flex items-center justify-center overflow-hidden">
        {tieneImagenesReales
          ? <img src={fotos[imagenActiva]} alt={nombre} className="w-full h-full object-cover" />
          : <IconCuboGrande />
        }
      </div>

      {/* Miniaturas */}
      <div className="flex gap-2">
        {vistas.map((vista, i) => (
          <button
            key={i}
            onClick={() => onSeleccionar(i)}
            className={`w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded border-2 bg-mekra-black/5 flex items-center justify-center overflow-hidden transition-all duration-150 ${
              imagenActiva === i
                ? 'border-mekra-orange'
                : 'border-transparent hover:border-mekra-orange/40'
            }`}
            aria-label={`Vista ${i + 1}`}
          >
            {tieneImagenesReales
              ? <img src={vista} alt="" className="w-full h-full object-cover" />
              : <IconCuboPequeno />
            }
          </button>
        ))}
      </div>
    </div>
  )
}

// ── TABLA DE DESCUENTOS ────────────────────────────────────────────

function TablaDescuentos({ precioBase, descuentos, cantidadActual }) {
  const filas = [
    { cantidad: '1 unidad',  minimo: 1, porcentaje: 0,  precio: precioBase },
    ...descuentos.map(d => ({
      cantidad: `${d.minimo} o más`,
      minimo:   d.minimo,
      porcentaje: d.porcentaje,
      precio:   precioBase * (1 - d.porcentaje / 100),
    })),
  ]

  // Fila activa: la de mayor mínimo que aplique a la cantidad actual
  const filaActiva = [...filas]
    .reverse()
    .find(f => cantidadActual >= f.minimo)

  return (
    <div className="border border-mekra-orange/20 rounded-lg overflow-hidden">
      <div className="bg-mekra-orange/5 px-4 py-2 border-b border-mekra-orange/20">
        <p className="text-[10px] font-black uppercase tracking-widest text-mekra-orange">
          🏷 Compra más, paga menos
        </p>
      </div>
      <div className="divide-y divide-mekra-orange/10">
        {filas.map((fila, i) => {
          const activa = fila === filaActiva
          return (
            <div
              key={i}
              className={`flex items-center justify-between px-4 py-2.5 transition-colors duration-150 ${
                activa ? 'bg-mekra-orange/8' : ''
              }`}
            >
              <span className={`text-xs font-bold ${activa ? 'text-mekra-orange' : 'text-mekra-black/60'}`}>
                {fila.cantidad}
              </span>
              <div className="flex items-center gap-3">
                {fila.porcentaje > 0
                  ? <span className="text-[10px] font-black text-mekra-orange bg-mekra-orange/10 px-2 py-0.5 rounded-full">
                      -{fila.porcentaje}% OFF
                    </span>
                  : <span className="text-[10px] text-mekra-black/30">precio normal</span>
                }
                <span className={`text-sm font-black tabular-nums ${activa ? 'text-mekra-orange' : 'text-mekra-black/70'}`}>
                  S/{fila.precio.toFixed(2)}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── PRODUCTO NO ENCONTRADO ─────────────────────────────────────────

function ProductoNoEncontrado() {
  return (
    <div className="min-h-screen bg-mekra-white flex flex-col items-center justify-center gap-4 text-center px-4">
      <p className="text-5xl font-black text-mekra-black/10">404</p>
      <h1 className="text-xl font-black text-mekra-black uppercase tracking-tight">
        Producto no encontrado
      </h1>
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
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden
      className={izq ? 'rotate-180' : ''}
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

function IconCuboGrande() {
  return (
    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" className="text-mekra-black/15" aria-hidden>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  )
}

function IconCuboPequeno() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round" className="text-mekra-black/20" aria-hidden>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  )
}

function IconWhatsApp() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  )
}
