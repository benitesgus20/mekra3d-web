import { Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import CartDrawer from './components/CartDrawer'
import Home from './pages/Home'
import Catalogo from './pages/Catalogo'
import ProductoDetalle from './pages/ProductoDetalle'
import FAQ from './pages/FAQ'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <CartProvider>
      <Navbar />
      <CartDrawer />
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/producto/:id" element={<ProductoDetalle />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </CartProvider>
  )
}
