import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LayoutPresupuesto, PanelPresupuesto } from '../componentes/LayoutPresupuesto';
import { TablaApuZapata } from '../componentes/TablaApuZapata';
import { obtenerElemento } from '../servicios/presupuestos.servicio';
import {
  cantidadElementoPresupuesto,
  descripcionElementoPresupuesto,
  detalleTecnicoElementoPresupuesto,
  formatearMonto,
  rutaPresupuesto,
  subtotalElementoPresupuesto,
  unidadElementoPresupuesto,
  type ElementoPresupuestoDetalle,
} from '../tipos/presupuestos.tipos';

export function CostoDesglosadoElementoPagina() {
  const { presupuestoId, elementoId } = useParams<{
    presupuestoId: string;
    elementoId: string;
  }>();

  const [elemento, setElemento] = useState<ElementoPresupuestoDetalle | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    if (!elementoId) {
      return;
    }

    setCargando(true);
    setError(null);

    try {
      setElemento(await obtenerElemento(elementoId));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar el costo desglosado');
    } finally {
      setCargando(false);
    }
  }, [elementoId]);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  if (!presupuestoId || !elementoId) {
    return null;
  }

  const cantidad = elemento ? cantidadElementoPresupuesto(elemento) : null;
  const detalle = elemento ? detalleTecnicoElementoPresupuesto(elemento) : null;

  return (
    <LayoutPresupuesto
      volverA={rutaPresupuesto(presupuestoId)}
      etiquetaVolver="Presupuesto"
      migas={[
        { etiqueta: 'Presupuestos', ruta: '/presupuestos' },
        { etiqueta: elemento?.presupuesto.proyecto ?? '...', ruta: rutaPresupuesto(presupuestoId) },
        { etiqueta: 'Costo desglosado' },
      ]}
      titulo="Costo desglosado"
      subtitulo="Materiales, mano de obra y equipo del análisis de precio unitario."
    >
      {cargando ? <p className="text-sm text-gray-500">Cargando desglose...</p> : null}
      {error ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      ) : null}

      {elemento ? (
        <div className="grid gap-6">
          <PanelPresupuesto>
            <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
              <ResumenCampo etiqueta="Descripción" valor={descripcionElementoPresupuesto(elemento)} />
              <ResumenCampo
                etiqueta="Cantidad"
                valor={cantidad != null ? String(cantidad) : '—'}
              />
              <ResumenCampo etiqueta="Unidad" valor={unidadElementoPresupuesto(elemento)} />
              <ResumenCampo
                etiqueta="Subtotal"
                valor={formatearMonto(subtotalElementoPresupuesto(elemento))}
                destacado
              />
            </div>
            {detalle ? (
              <p className="border-t border-gray-100 px-4 pb-4 text-sm text-gray-500 sm:px-6">
                {detalle}
              </p>
            ) : null}
          </PanelPresupuesto>

          {elemento.apuZapata ? (
            <PanelPresupuesto titulo="Desglose del APU">
              <div className="px-4 pb-5 sm:px-6 sm:pb-6">
                <TablaApuZapata apu={elemento.apuZapata} />
              </div>
            </PanelPresupuesto>
          ) : (
            <p className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
              No hay análisis de precio disponible para este elemento.
            </p>
          )}
        </div>
      ) : null}
    </LayoutPresupuesto>
  );
}

function ResumenCampo({
  etiqueta,
  valor,
  destacado = false,
}: {
  etiqueta: string;
  valor: string;
  destacado?: boolean;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/80 px-4 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">{etiqueta}</p>
      <p
        className={[
          'mt-1 text-sm font-semibold',
          destacado ? 'text-sky-700' : 'text-gray-900',
        ].join(' ')}
      >
        {valor}
      </p>
    </div>
  );
}
