import { Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Catalogo from './pages/Catalogo'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <CartProvider>
      <Navbar />
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </CartProvider>
  )
}
