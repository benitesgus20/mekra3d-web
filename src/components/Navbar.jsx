import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { count, setIsOpen: openCart } = useCart()
  const menuRef = useRef(null)
  const location = useLocation()

  // Cerrar menú al cambiar de ruta (botón atrás incluido)
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  // Cerrar al hacer clic fuera
  useEffect(() => {
    function onOutsideClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMobileOpen(false)
      }
    }
    if (mobileOpen) document.addEventListener('mousedown', onOutsideClick)
    return () => document.removeEventListener('mousedown', onOutsideClick)
  }, [mobileOpen])

  // Cerrar con Escape
  useEffect(() => {
    const onEsc = e => { if (e.key === 'Escape') setMobileOpen(false) }
    document.addEventListener('keydown', onEsc)
    return () => document.removeEventListener('keydown', onEsc)
  }, [])

  const desktopLink = ({ isActive }) =>
    `text-sm font-bold uppercase tracking-widest transition-colors duration-150 ${
      isActive ? 'text-mekra-orange' : 'text-white hover:text-mekra-orange'
    }`

  const mobileLink = ({ isActive }) =>
    `block py-3 px-2 text-base font-bold uppercase tracking-widest border-b border-white/10 transition-colors ${
      isActive ? 'text-mekra-orange' : 'text-white hover:text-mekra-orange'
    }`

  return (
    <nav ref={menuRef} className="fixed top-0 left-0 right-0 z-50 bg-mekra-black shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 select-none">
            <span className="text-white font-black text-2xl tracking-tight leading-none">
              MEKRA<span className="text-mekra-orange">3D</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/" end className={desktopLink}>Inicio</NavLink>
            <NavLink to="/catalogo" className={desktopLink}>Catálogo</NavLink>
            <NavLink to="/faq" className={desktopLink}>FAQ</NavLink>
            <button
              onClick={() => openCart(true)}
              className="relative flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white hover:text-mekra-orange transition-colors duration-150"
              aria-label={`Carrito, ${count} producto${count !== 1 ? 's' : ''}`}
            >
              <CartIcon />
              <span>Carrito</span>
              {count > 0 && (
                <span className="absolute -top-2.5 -right-3 bg-mekra-orange text-white text-[10px] font-black rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 leading-none tabular-nums">
                  {count > 99 ? '99+' : count}
                </span>
              )}
            </button>
          </div>

          {/* Mobile: cart badge + hamburger */}
          <div className="flex md:hidden items-center gap-5">
            <button
              onClick={() => openCart(true)}
              className="relative text-white hover:text-mekra-orange transition-colors"
              aria-label="Carrito"
            >
              <CartIcon />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-mekra-orange text-white text-[10px] font-black rounded-full min-w-[16px] h-4 flex items-center justify-center px-0.5 leading-none tabular-nums">
                  {count > 99 ? '99+' : count}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="text-white hover:text-mekra-orange transition-colors p-1"
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
        className={`md:hidden bg-mekra-dark overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pt-2 pb-4 flex flex-col">
          <NavLink to="/" end className={mobileLink} onClick={() => setMobileOpen(false)}>
            Inicio
          </NavLink>
          <NavLink to="/catalogo" className={mobileLink} onClick={() => setMobileOpen(false)}>
            Catálogo
          </NavLink>
          <NavLink to="/faq" className={mobileLink} onClick={() => setMobileOpen(false)}>
            FAQ
          </NavLink>
          <button
            onClick={() => { openCart(true); setMobileOpen(false) }}
            className="flex items-center gap-2 py-3 px-2 text-base font-bold uppercase tracking-widest text-white hover:text-mekra-orange transition-colors text-left"
          >
            <CartIcon />
            Carrito
            {count > 0 && (
              <span className="ml-1 bg-mekra-orange text-white text-[10px] font-black rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 leading-none">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
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
