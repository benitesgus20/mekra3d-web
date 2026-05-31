import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const LINKS = [
  { label: 'Destacados',  to: '/#destacados', home: true },
  { label: 'Papá',        to: '/papa' },
  { label: 'Parejas',     to: '/parejas' },
  { label: 'Hermanos',    to: '/hermanos' },
  { label: 'Amigos',      to: '/amigos' },
  { label: 'Corporativo', to: '/corporativo' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { count, setIsOpen: openCart } = useCart()
  const menuRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    function onOutsideClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMobileOpen(false)
    }
    if (mobileOpen) document.addEventListener('mousedown', onOutsideClick)
    return () => document.removeEventListener('mousedown', onOutsideClick)
  }, [mobileOpen])

  useEffect(() => {
    const onEsc = e => { if (e.key === 'Escape') setMobileOpen(false) }
    document.addEventListener('keydown', onEsc)
    return () => document.removeEventListener('keydown', onEsc)
  }, [])

  const esActivo = (link) => link.home ? location.pathname === '/' : location.pathname === link.to

  return (
    <nav ref={menuRef} className="fixed top-0 left-0 right-0 z-50 bg-mekra-white border-b border-mekra-black/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="shrink-0 select-none">
            <span className="text-mekra-black font-black text-2xl tracking-tight leading-none">
              MEKRA<span className="text-mekra-orange">3D</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center h-16 gap-8">
            {LINKS.map(link => {
              const activo = esActivo(link)
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`h-16 flex items-center border-b-2 text-sm font-semibold tracking-wide transition-colors duration-150 ${
                    activo
                      ? 'border-mekra-black text-mekra-black'
                      : 'border-transparent text-mekra-black/50 hover:text-mekra-black'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Desktop cart */}
          <button
            onClick={() => openCart(true)}
            className="hidden md:flex relative items-center gap-2 text-sm font-semibold text-mekra-black hover:text-mekra-orange transition-colors duration-150"
            aria-label={`Carrito, ${count} producto${count !== 1 ? 's' : ''}`}
          >
            <CartIcon />
            <span>Carrito</span>
            {count > 0 && <Badge count={count} className="-top-2 -right-3" />}
          </button>

          {/* Mobile: cart + hamburger */}
          <div className="flex md:hidden items-center gap-5">
            <button
              onClick={() => openCart(true)}
              className="relative text-mekra-black hover:text-mekra-orange transition-colors"
              aria-label="Carrito"
            >
              <CartIcon />
              {count > 0 && <Badge count={count} className="-top-2 -right-2" />}
            </button>
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="text-mekra-black hover:text-mekra-orange transition-colors p-1"
              aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div
        className={`md:hidden bg-mekra-white border-t border-mekra-black/10 overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pt-2 pb-4 flex flex-col">
          {LINKS.map(link => {
            const activo = esActivo(link)
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`py-3 px-2 text-base font-semibold border-b border-mekra-black/8 transition-colors ${
                  activo ? 'text-mekra-black' : 'text-mekra-black/55 hover:text-mekra-black'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
          <button
            onClick={() => { openCart(true); setMobileOpen(false) }}
            className="flex items-center gap-2 py-3 px-2 text-base font-semibold text-mekra-black hover:text-mekra-orange transition-colors text-left"
          >
            <CartIcon />
            Carrito
            {count > 0 && (
              <span className="ml-1 bg-mekra-orange text-mekra-white text-[10px] font-black rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 leading-none">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  )
}

function Badge({ count, className = '' }) {
  return (
    <span className={`absolute bg-mekra-orange text-mekra-white text-[10px] font-black rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 leading-none tabular-nums ${className}`}>
      {count > 99 ? '99+' : count}
    </span>
  )
}

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}
