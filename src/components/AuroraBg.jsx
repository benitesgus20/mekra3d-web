// Fondo aurora — blobs de color difuminados que se desplazan lentamente.
// `dark` invierte para secciones oscuras.
export function AuroraBg({ dark = false }) {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute -top-1/4 -left-1/4 w-[55%] h-[55%] rounded-full blur-3xl aurora-1"
        style={{ background: dark ? 'rgba(255,107,0,0.35)' : 'rgba(255,176,136,0.6)' }}
      />
      <div
        className="absolute top-1/3 -right-1/5 w-[50%] h-[50%] rounded-full blur-3xl aurora-2"
        style={{ background: dark ? 'rgba(255,122,156,0.28)' : 'rgba(255,122,156,0.5)' }}
      />
      <div
        className="absolute -bottom-1/4 left-1/4 w-[45%] h-[45%] rounded-full blur-3xl aurora-3"
        style={{ background: dark ? 'rgba(255,107,0,0.22)' : 'rgba(255,210,150,0.55)' }}
      />
    </div>
  )
}
