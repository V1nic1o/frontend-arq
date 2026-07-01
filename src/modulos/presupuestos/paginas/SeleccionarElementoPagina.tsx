import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, Calculator, Columns, Grid3x3, Minus } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Boton } from '../../autenticacion/componentes/ui/Boton';
import { LayoutPresupuesto, PanelPresupuesto } from '../componentes/LayoutPresupuesto';
import { PasosFlujoPresupuesto } from '../componentes/PasosFlujoPresupuesto';
import { obtenerPresupuesto } from '../servicios/presupuestos.servicio';
import { guardarElementosSeleccionados } from '../utilidades/seleccionElementos.util';
import {
  ELEMENTOS_PRESUPUESTO,
  rutaCuantificarElemento,
  rutaPresupuesto,
  type PresupuestoDetalle,
  type TipoElementoPresupuesto,
} from '../tipos/presupuestos.tipos';

const ICONOS_ELEMENTO: Record<TipoElementoPresupuesto, LucideIcon> = {
  ZAPATA: Calculator,
  COLUMNA: Columns,
  VIGA: Minus,
  LOSA: Grid3x3,
};

export function SeleccionarElementoPagina() {
  const { presupuestoId } = useParams<{ presupuestoId: string }>();
  const navigate = useNavigate();
  const [presupuesto, setPresupuesto] = useState<PresupuestoDetalle | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seleccionados, setSeleccionados] = useState<TipoElementoPresupuesto[]>([]);

  useEffect(() => {
    if (!presupuestoId) {
      return;
    }

    void (async () => {
      setCargando(true);
      setError(null);

      try {
        const datos = await obtenerPresupuesto(presupuestoId);
        setPresupuesto(datos);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'No se pudo cargar el presupuesto');
      } finally {
        setCargando(false);
      }
    })();
  }, [presupuestoId]);

  function alternarSeleccion(tipo: TipoElementoPresupuesto) {
    setSeleccionados((previos) =>
      previos.includes(tipo) ? previos.filter((id) => id !== tipo) : [...previos, tipo],
    );
  }

  function manejarSiguiente() {
    if (!presupuestoId || seleccionados.length === 0) return;

    guardarElementosSeleccionados(presupuestoId, seleccionados);
    navigate(rutaCuantificarElemento(presupuestoId, seleccionados[0]));
  }

  if (!presupuestoId) {
    return null;
  }

  const cantidadSeleccionados = seleccionados.length;

  return (
    <LayoutPresupuesto
      volverA={rutaPresupuesto(presupuestoId)}
      etiquetaVolver="Presupuesto"
      migas={[
        { etiqueta: 'Presupuestos', ruta: '/presupuestos' },
        { etiqueta: presupuesto?.proyecto ?? '...', ruta: rutaPresupuesto(presupuestoId) },
        { etiqueta: 'Agregar elementos' },
      ]}
      titulo="Agregar elementos"
      subtitulo="Marca los tipos de elemento que usarás en este presupuesto. Luego ingresarás los datos de cada uno."
    >
      <div className="mb-2">
        <PasosFlujoPresupuesto pasoActivo={2} />
      </div>

      {cargando ? <p className="text-sm text-gray-500">Cargando...</p> : null}
      {error ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      ) : null}

      <PanelPresupuesto titulo="Selecciona los elementos del presupuesto">
        <ul className="divide-y divide-gray-100">
          {ELEMENTOS_PRESUPUESTO.map((elemento) => {
            const Icono = ICONOS_ELEMENTO[elemento.id];
            const marcado = seleccionados.includes(elemento.id);
            const deshabilitado = !elemento.disponible;

            return (
              <li key={elemento.id}>
                <label
                  className={[
                    'flex cursor-pointer items-center gap-4 px-4 py-4 transition-colors sm:px-6',
                    deshabilitado
                      ? 'cursor-not-allowed opacity-60'
                      : marcado
                        ? 'bg-sky-50/80'
                        : 'hover:bg-gray-50',
                  ].join(' ')}
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                    checked={marcado}
                    disabled={deshabilitado}
                    onChange={() => {
                      if (!deshabilitado) alternarSeleccion(elemento.id);
                    }}
                  />
                  <div
                    className={[
                      'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
                      marcado ? 'bg-sky-100 text-sky-700' : 'bg-gray-100 text-gray-500',
                    ].join(' ')}
                  >
                    <Icono className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-gray-900">{elemento.titulo}</p>
                      {!elemento.disponible ? (
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                          Próximamente
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">{elemento.descripcion}</p>
                  </div>
                </label>
              </li>
            );
          })}
        </ul>

        <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm text-gray-500">
            {cantidadSeleccionados === 0
              ? 'Selecciona al menos un elemento para continuar.'
              : `${cantidadSeleccionados} elemento${cantidadSeleccionados === 1 ? '' : 's'} seleccionado${cantidadSeleccionados === 1 ? '' : 's'}.`}
          </p>
          <Boton
            type="button"
            anchoCompleto={false}
            disabled={cantidadSeleccionados === 0}
            onClick={manejarSiguiente}
          >
            <span className="inline-flex items-center gap-2">
              Siguiente
              <ArrowRight className="h-4 w-4" />
            </span>
          </Boton>
        </div>
      </PanelPresupuesto>
    </LayoutPresupuesto>
  );
}
