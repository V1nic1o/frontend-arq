import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';

type LayoutCatalogoProps = {
  volverA: string;
  etiquetaVolver?: string;
  migas: { etiqueta: string; ruta?: string }[];
  titulo: string;
  subtitulo?: string;
  accion?: ReactNode;
  children: ReactNode;
};

export function LayoutCatalogo({
  volverA,
  etiquetaVolver = 'Volver',
  migas,
  titulo,
  subtitulo,
  accion,
  children,
}: LayoutCatalogoProps) {
  return (
    <div className="mx-auto grid w-full max-w-7xl gap-5 sm:gap-6">
      <header className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link
            to={volverA}
            className="inline-flex items-center gap-1 rounded-lg px-1 py-0.5 transition-colors hover:text-sky-600"
            aria-label={etiquetaVolver}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">{etiquetaVolver}</span>
          </Link>
          <span className="text-gray-300">|</span>
          <nav className="flex min-w-0 flex-wrap items-center gap-1">
            {migas.map((item, indice) => (
              <span key={`${item.etiqueta}-${indice}`} className="inline-flex items-center gap-1">
                {indice > 0 ? <ChevronRight className="h-3.5 w-3.5 shrink-0 text-gray-300" /> : null}
                {item.ruta ? (
                  <Link to={item.ruta} className="truncate transition-colors hover:text-sky-600">
                    {item.etiqueta}
                  </Link>
                ) : (
                  <span className="truncate font-medium text-gray-700">{item.etiqueta}</span>
                )}
              </span>
            ))}
          </nav>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{titulo}</h1>
            {subtitulo ? <p className="mt-1 text-sm text-gray-500">{subtitulo}</p> : null}
          </div>
          {accion ? <div className="shrink-0">{accion}</div> : null}
        </div>
      </header>

      {children}
    </div>
  );
}

export function PanelCatalogo({
  titulo,
  children,
  className = '',
}: {
  titulo?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={[
        'overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {titulo ? (
        <div className="border-b border-gray-100 px-4 py-3 sm:px-6">
          <h2 className="text-sm font-semibold text-gray-900">{titulo}</h2>
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function EstadoVacioCatalogo({
  mensaje,
  accion,
}: {
  mensaje: string;
  accion?: ReactNode;
}) {
  return (
    <div className="px-4 py-10 text-center sm:px-5">
      <p className="text-sm text-gray-500">{mensaje}</p>
      {accion ? <div className="mt-4">{accion}</div> : null}
    </div>
  );
}
