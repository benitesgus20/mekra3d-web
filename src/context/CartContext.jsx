import { createContext, useContext, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [isOpen, setIsOpen] = useState(false)

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

  const clearCart = () => setItems([])

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
