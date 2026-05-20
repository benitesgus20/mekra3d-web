import { useEffect } from 'react'

const TITULO_BASE = 'Mekra3D — Impresiones 3D personalizadas en Trujillo, Perú'

/**
 * Actualiza el título del documento.
 * Sin argumento → título base del sitio.
 * Con argumento → "Texto | Mekra3D"
 */
export function useDocumentTitle(titulo) {
  useEffect(() => {
    document.title = titulo ? `${titulo} | Mekra3D` : TITULO_BASE
  }, [titulo])
}
