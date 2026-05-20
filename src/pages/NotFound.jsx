import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-6xl font-bold text-gray-300">404</h1>
      <p className="text-gray-500">Página no encontrada</p>
      <Link to="/" className="text-blue-600 hover:underline">Volver al inicio</Link>
    </main>
  )
}
