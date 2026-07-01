export function PantallaCarga({ mensaje = 'Cargando...' }: { mensaje?: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <p className="text-sm text-gray-500 sm:text-base">{mensaje}</p>
    </div>
  );
}
