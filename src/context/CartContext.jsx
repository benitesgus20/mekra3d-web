import { createContext, useContext, useState, useEffect } from 'react'

const STORAGE_KEY = 'mekra3d_carrito'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [isOpen, setIsOpen] = useState(false)

  // Persistir en localStorage cada vez que el carrito cambie
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // localStorage no disponible (modo privado con storage lleno, etc.)
    }
  }, [items])

  const addItem = (product, quantity = 1, color = null) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id && i.color === color)
      if (existing) {
        return prev.map(i =>
          i.id === product.id && i.color === color
            ? { ...i, quantity: i.quantity + quantity }
            : i
        )
      }
      return [...prev, { ...product, quantity, color }]
    })
  }

  const removeItem = (id, color) => {
    setItems(prev => prev.filter(i => !(i.id === id && i.color === color)))
  }

  const updateQuantity = (id, color, quantity) => {
    if (quantity <= 0) return removeItem(id, color)
    setItems(prev =>
      prev.map(i => (i.id === id && i.color === color ? { ...i, quantity } : i))
    )
  }

  const clearCart = () => {
    setItems([])
    try { localStorage.removeItem(STORAGE_KEY) } catch { /* noop */ }
  }

  const count = items.reduce((sum, i) => sum + i.quantity, 0)
  const total = items.reduce((sum, i) => sum + i.precio * i.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, count, total, isOpen, setIsOpen }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
