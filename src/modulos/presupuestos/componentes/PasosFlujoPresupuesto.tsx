import { Check } from 'lucide-react';

const PASOS = [
  { id: 1, etiqueta: 'Datos del proyecto' },
  { id: 2, etiqueta: 'Cuantificar elementos' },
  { id: 3, etiqueta: 'Presupuestar' },
] as const;

type PasoActivo = 1 | 2 | 3;

export function PasosFlujoPresupuesto({ pasoActivo }: { pasoActivo: PasoActivo }) {
  return (
    <ol className="flex flex-wrap items-center gap-2 sm:gap-0">
      {PASOS.map((paso, indice) => {
        const completado = paso.id < pasoActivo;
        const activo = paso.id === pasoActivo;

        return (
          <li key={paso.id} className="flex items-center">
            {indice > 0 ? (
              <span
                className={[
                  'mx-2 hidden h-px w-6 sm:block sm:w-10',
                  completado ? 'bg-sky-300' : 'bg-gray-200',
                ].join(' ')}
                aria-hidden
              />
            ) : null}
            <span
              className={[
                'inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium sm:text-sm',
                activo
                  ? 'bg-sky-100 text-sky-800 ring-1 ring-sky-200'
                  : completado
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-gray-100 text-gray-500',
              ].join(' ')}
            >
              <span
                className={[
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold',
                  activo
                    ? 'bg-sky-600 text-white'
                    : completado
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-300 text-white',
                ].join(' ')}
              >
                {completado ? <Check className="h-3 w-3" /> : paso.id}
              </span>
              <span className="whitespace-nowrap">{paso.etiqueta}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export function ResumenProyectoCompacto({
  proyecto,
  cliente,
  nit,
  ubicacion,
  municipio,
  departamento,
}: {
  proyecto: string;
  cliente: string;
  nit: string;
  ubicacion: string;
  municipio: string;
  departamento: string;
}) {
  return (
    <div className="grid gap-3 text-sm sm:grid-cols-2">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Proyecto</p>
        <p className="mt-0.5 font-semibold text-gray-900">{proyecto}</p>
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Cliente</p>
        <p className="mt-0.5 font-medium text-gray-900">
          {cliente} · NIT {nit}
        </p>
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Ubicación</p>
        <p className="mt-0.5 text-gray-700">{ubicacion}</p>
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Municipio</p>
        <p className="mt-0.5 text-gray-700">
          {municipio}, {departamento}
        </p>
      </div>
    </div>
  );
}
