# Mekra3D — Contexto del proyecto

Tienda de impresión 3D personalizada y corporativa en Trujillo, Perú.
Sitio: mekra3d.com | Canal de venta: WhatsApp +51922372823

---

## Identidad visual

| Token | Valor | Uso |
|---|---|---|
| `mekra-black` | `#1A1A1A` | Fondos, navbar, textos principales |
| `mekra-orange` | `#FF6B00` | Acentos, botones CTA, hover, precios, badges |
| `mekra-white` | `#FFFFFF` | Fondos de sección, textos sobre negro |
| `mekra-dark` | `#111111` | Fondos secundarios, menú móvil |

Los colores están definidos en `src/index.css` via `@theme` de Tailwind v4.
Tipografía: sans-serif bold y condensed, estilo técnico/moderno. Clases preferidas: `font-black`, `uppercase`, `tracking-widest`.

---

## Categorías de productos

| Categoría | Notas |
|---|---|
| Mujer | Submarca **Laboon** — estética rosa, femenina |
| Personajes y figuras | Fanart, coleccionables, miniaturas |
| Hogar y decoración | Objetos funcionales y ornamentales |
| Técnico e industrial | Piezas funcionales, prototipos, repuestos |
| Corporativo y empresarial | Logos 3D, souvenirs, branding físico |

---

## Estructura de datos — Producto

Los productos viven en `src/data/index.js` como array de objetos JSON.

```js
{
  id: 'string',            // slug único, ej: "portavela-luna"
  nombre: 'string',
  categoria: 'string',     // una de las 5 categorías
  subcategoria: 'string',  // opcional
  material: 'string',      // ej: "PLA", "PETG", "Resina"
  precio: number,          // en soles (PEN)
  colores: ['string'],     // colores disponibles para ese modelo
  fotos: ['string'],       // rutas relativas a src/assets/ o URLs
  descripcion: 'string',
  descuentos_cantidad: [   // para Fase 2
    { minimo: 3, porcentaje: 10 },
    { minimo: 6, porcentaje: 20 },
  ],
  activo: boolean,
}
```

---

## Funcionalidades por fase

### Fase 1 — MVP (en curso)

- [x] Navbar fijo: logo izquierda, links + carrito con contador derecha, hamburguesa móvil
- [ ] Hero section: fondo negro, título impactante, botón CTA naranja
- [ ] Catálogo: grid de cards con foto, nombre, precio, categoría, botón "Agregar"
- [ ] Filtros por categoría y material
- [ ] Búsqueda en tiempo real (filtra sobre `src/data/index.js`)
- [ ] Página de detalle de producto: fotos, descripción, selector de color, precio
- [ ] Carrito lateral (drawer): resumen de ítems, cantidades, subtotal
- [ ] Botón "Enviar pedido por WhatsApp" — genera mensaje pre-armado

### Fase 2

- [ ] Tabla de descuentos por cantidad (lee `descuentos_cantidad` de cada producto)
- [ ] Campo de cupón de descuento con validación

### Fase 3

- [ ] Sistema de reviews con estrellas 1-5 por producto
- [ ] Requiere integración con Supabase

---

## Canal de venta — WhatsApp

No hay pasarela de pago. El cierre de compra es 100% por WhatsApp.

**Número:** +51922372823

El mensaje pre-armado debe incluir:
1. Saludo + identificación ("Hola, quiero hacer un pedido en Mekra3D:")
2. Lista de productos con cantidad, color elegido y precio unitario
3. Subtotal
4. Cupón aplicado y descuento (si aplica — Fase 2)
5. Total final

Formato de URL: `https://wa.me/51922372823?text=<mensaje_codificado>`

---

## Arquitectura del frontend

```
src/
├── App.jsx                  # CartProvider + BrowserRouter + Routes
├── main.jsx                 # entrypoint
├── index.css                # @import tailwindcss + @theme con colores
├── context/
│   └── CartContext.jsx      # estado global del carrito (items, count, total, isOpen)
├── components/
│   └── Navbar.jsx           # navbar fijo responsivo
├── pages/
│   ├── Home.jsx             # landing / hero
│   ├── Catalogo.jsx         # grid de productos + filtros + búsqueda
│   └── NotFound.jsx         # 404
├── data/
│   └── index.js             # array de productos + siteInfo
└── assets/                  # fotos de productos, logos
```

### CartContext — API

```js
const { items, addItem, removeItem, updateQuantity, clearCart, count, total, isOpen, setIsOpen } = useCart()
```

| Función | Firma |
|---|---|
| `addItem` | `(product, quantity?, color?) => void` |
| `removeItem` | `(id, color) => void` |
| `updateQuantity` | `(id, color, quantity) => void` |
| `clearCart` | `() => void` |

---

## Stack técnico

| Herramienta | Versión |
|---|---|
| React | 19 |
| Vite | 8 |
| Tailwind CSS | 4 (plugin `@tailwindcss/vite`) |
| React Router | 7 |

Tailwind v4: no hay `tailwind.config.js`. La configuración de colores va en `src/index.css` dentro de `@theme {}`.

---

## Convenciones de código

- Componentes en `PascalCase.jsx`, funciones helpers en `camelCase`
- Sin comentarios obvios; solo documentar invariantes no obvios
- Clases Tailwind arbitrarias solo si el token no existe en `@theme`
- El navbar tiene `position: fixed` → las páginas deben tener `pt-16` (ya aplicado en `App.jsx` con `<div className="pt-16">`)

---

## Reglas de desarrollo

### Estilos
- **Solo Tailwind CSS** — nunca `style={{}}` inline ni archivos `.css` adicionales
- **Solo la paleta definida** — `mekra-black` (`#1A1A1A`), `mekra-orange` (`#FF6B00`), `mekra-white` (`#FFFFFF`), `mekra-dark` (`#111111`). Ningún otro color hardcodeado
- Clases arbitrarias `bg-[#...]` solo si el valor no existe como token en `@theme`

### Diseño
- **Mobile-first siempre** — escribir primero las clases base (móvil) y luego `md:` / `lg:` para pantallas grandes
- **Imágenes con aspect-ratio fijo** — usar `aspect-square`, `aspect-video` o `aspect-[4/3]` en el contenedor para evitar layout shifts. Siempre `object-cover` dentro
- **Componentes pequeños y reutilizables** — si un bloque se repite 2 veces o más, extraerlo a `src/components/`

### Interacción
- **Animaciones suaves** — todo cambio visual lleva `transition-colors duration-150` o `transition-all duration-200`. Sin cambios bruscos
- **Hover explícito** — cada elemento interactivo tiene un estado `hover:` visible (color, opacidad o escala)

### Código
- **Comentarios en español** — cuando sea necesario comentar, hacerlo en español
- **Sin lógica en JSX** — extraer cálculos y condicionales complejos a variables o funciones antes del `return`
