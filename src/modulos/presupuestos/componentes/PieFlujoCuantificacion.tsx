import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Boton } from '../../autenticacion/componentes/ui/Boton';
import {
  ELEMENTOS_PRESUPUESTO,
  rutaCuantificarElemento,
  rutaPresupuesto,
  type TipoElementoPresupuesto,
} from '../tipos/presupuestos.tipos';
import {
  leerElementosSeleccionados,
  siguienteElementoEnCola,
} from '../utilidades/seleccionElementos.util';

function tituloElemento(tipo: TipoElementoPresupuesto) {
  return ELEMENTOS_PRESUPUESTO.find((e) => e.id === tipo)?.titulo ?? tipo;
}

type PieFlujoCuantificacionProps = {
  presupuestoId: string;
  tipoActual: TipoElementoPresupuesto;
  cantidadRegistros: number;
  etiquetaRegistro?: string;
  resumen?: string;
  onAgregarOtro?: () => void;
};

export function PieFlujoCuantificacion({
  presupuestoId,
  tipoActual,
  cantidadRegistros,
  etiquetaRegistro = 'registros',
  resumen,
  onAgregarOtro,
}: PieFlujoCuantificacionProps) {
  const navigate = useNavigate();
  const cola = leerElementosSeleccionados(presupuestoId);
  const siguiente = siguienteElementoEnCola(presupuestoId, tipoActual);
  const puedeContinuar = cantidadRegistros > 0;

  if (!puedeContinuar) {
    return null;
  }

  const tituloSiguiente = siguiente ? tituloElemento(siguiente) : null;

  return (
    <div className="sticky bottom-20 z-10 -mx-1 mt-2 sm:bottom-4">
      <div className="rounded-2xl border border-gray-200 bg-white/95 p-4 shadow-lg backdrop-blur-sm sm:flex sm:items-center sm:justify-between sm:gap-4 sm:p-5">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900">
            {cantidadRegistros} {etiquetaRegistro}
          </p>
          {resumen ? <p className="mt-0.5 truncate text-sm text-gray-500">{resumen}</p> : null}
        </div>

        <div className="mt-3 flex flex-col gap-2 sm:mt-0 sm:flex-row sm:items-center">
          {onAgregarOtro ? (
            <button
              type="button"
              onClick={onAgregarOtro}
              className="text-sm font-medium text-gray-600 transition-colors hover:text-sky-600"
            >
              Agregar otra
            </button>
          ) : null}

          {siguiente ? (
            <Link
              to={rutaCuantificarElemento(presupuestoId, siguiente)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-500"
            >
              Siguiente: {tituloSiguiente}
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <Boton
              type="button"
              anchoCompleto={false}
              className="sm:min-w-[11rem]"
              onClick={() => navigate(rutaPresupuesto(presupuestoId))}
            >
              <span className="inline-flex items-center gap-2">
                Continuar
                <ArrowRight className="h-4 w-4" />
              </span>
            </Boton>
          )}
        </div>
      </div>
    </div>
  );
}
