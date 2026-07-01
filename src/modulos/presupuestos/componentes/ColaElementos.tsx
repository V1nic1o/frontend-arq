import {
  ELEMENTOS_PRESUPUESTO,
  type TipoElementoPresupuesto,
} from '../tipos/presupuestos.tipos';
import {
  indiceElementoEnCola,
  leerElementosSeleccionados,
} from '../utilidades/seleccionElementos.util';

type ColaElementosIndicadorProps = {
  presupuestoId: string;
  tipoActual: TipoElementoPresupuesto;
};

function tituloElemento(tipo: TipoElementoPresupuesto) {
  return ELEMENTOS_PRESUPUESTO.find((e) => e.id === tipo)?.titulo ?? tipo;
}

export function ColaElementosIndicador({ presupuestoId, tipoActual }: ColaElementosIndicadorProps) {
  const cola = leerElementosSeleccionados(presupuestoId);

  if (!cola || cola.length <= 1) {
    return null;
  }

  const indiceActual = indiceElementoEnCola(presupuestoId, tipoActual);

  return (
    <div className="rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-3 sm:px-5">
      <p className="text-xs font-medium uppercase tracking-wide text-sky-600">
        Cuantificación en curso · {indiceActual + 1} de {cola.length}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {cola.map((tipo, indice) => {
          const activo = tipo === tipoActual;
          const completado = indice < indiceActual;

          return (
            <span
              key={tipo}
              className={[
                'rounded-full px-3 py-1 text-xs font-medium',
                activo
                  ? 'bg-sky-600 text-white'
                  : completado
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-white text-gray-500 ring-1 ring-gray-200',
              ].join(' ')}
            >
              {tituloElemento(tipo)}
            </span>
          );
        })}
      </div>
    </div>
  );
}
