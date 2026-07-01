import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';

type LayoutPresupuestoProps = {
  volverA: string;
  etiquetaVolver?: string;
  migas: { etiqueta: string; ruta?: string }[];
  titulo: string;
  subtitulo?: string;
  accion?: ReactNode;
  children: ReactNode;
};

export function LayoutPresupuesto({
  volverA,
  etiquetaVolver = 'Volver',
  migas,
  titulo,
  subtitulo,
  accion,
  children,
}: LayoutPresupuestoProps) {
  return (
    <div className="grid gap-6 sm:gap-8">
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
                {indice > 0 ? (
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 text-gray-300" />
                ) : null}
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

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
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

export function PanelPresupuesto({
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
