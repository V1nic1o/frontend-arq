import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Layers, Pencil, Plus, Trash2 } from 'lucide-react';
import { Modal } from '../../autenticacion/componentes/ui/Modal';
import { FormularioZapata } from './FormularioZapata';
import {
  actualizarZapataElemento,
  eliminarElemento,
} from '../servicios/presupuestos.servicio';
import {
  cantidadElementoPresupuesto,
  descripcionElementoPresupuesto,
  detalleTecnicoElementoPresupuesto,
  formatearMonto,
  rutaCostoDesglosadoElemento,
  rutaElementosPresupuesto,
  subtotalElementoPresupuesto,
  unidadElementoPresupuesto,
  type CuantificarZapataEntrada,
  type ElementoPresupuesto,
  type ZapataCuantificacion,
} from '../tipos/presupuestos.tipos';

type ListaElementosCuantificadosProps = {
  presupuestoId: string;
  elementos: ElementoPresupuesto[];
  onActualizado: () => void;
  onError: (mensaje: string) => void;
};

function zapataAEntrada(zapata: ZapataCuantificacion): CuantificarZapataEntrada {
  return {
    cantidad: zapata.cantidad,
    largo: Number(zapata.largo),
    ancho: Number(zapata.ancho),
    espesor: Number(zapata.espesor),
    profundidad: Number(zapata.profundidad),
    recubrimiento: Number(zapata.recubrimiento),
    diametroAcero: zapata.diametroAcero,
    espaciamientoVarillas: Number(zapata.espaciamientoVarillas),
    ambosSentidos: zapata.ambosSentidos,
    resistenciaConcreto: zapata.resistenciaConcreto,
  };
}

function etiquetaTipo(tipo: ElementoPresupuesto['tipo']) {
  return tipo === 'ZAPATA' ? 'Zapata' : tipo;
}

export function ListaElementosCuantificados({
  presupuestoId,
  elementos,
  onActualizado,
  onError,
}: ListaElementosCuantificadosProps) {
  const [elementoEditar, setElementoEditar] = useState<ElementoPresupuesto | null>(null);
  const [eliminandoId, setEliminandoId] = useState<string | null>(null);

  const totalPresupuesto = elementos.reduce(
    (total, elemento) => total + subtotalElementoPresupuesto(elemento),
    0,
  );

  async function manejarEliminar(elemento: ElementoPresupuesto, indice: number) {
    const mensaje = `¿Eliminar la partida ${indice + 1}: ${descripcionElementoPresupuesto(elemento)}?`;

    if (!window.confirm(mensaje)) return;

    setEliminandoId(elemento.id);
    try {
      await eliminarElemento(elemento.id);
      onActualizado();
    } catch (err: unknown) {
      onError(err instanceof Error ? err.message : 'No se pudo eliminar el elemento');
    } finally {
      setEliminandoId(null);
    }
  }

  if (elementos.length === 0) {
    return (
      <div className="px-4 py-12 text-center sm:px-6">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
          <Layers className="h-7 w-7" />
        </div>
        <p className="mt-4 text-sm font-medium text-gray-900">
          Aún no hay elementos en este presupuesto
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Comienza cuantificando zapatas u otros elementos estructurales.
        </p>
        <Link
          to={rutaElementosPresupuesto(presupuestoId)}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-sky-600 hover:text-sky-700"
        >
          <Plus className="h-4 w-4" />
          Agregar primer elemento
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3 p-4 sm:p-6">
        {elementos.map((elemento, indice) => (
          <TarjetaElementoCuantificado
            key={elemento.id}
            presupuestoId={presupuestoId}
            elemento={elemento}
            indice={indice}
            eliminando={eliminandoId === elemento.id}
            onEditar={() => setElementoEditar(elemento)}
            onEliminar={() => void manejarEliminar(elemento, indice)}
          />
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50/90 px-4 py-4 sm:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Total</p>
          <p className="mt-0.5 text-sm text-gray-600">
            {elementos.length} partida{elementos.length === 1 ? '' : 's'}
          </p>
        </div>
        <p className="text-xl font-bold tabular-nums text-sky-700">{formatearMonto(totalPresupuesto)}</p>
      </div>

      <Modal
        abierto={elementoEditar !== null}
        titulo={`Editar ${elementoEditar ? etiquetaTipo(elementoEditar.tipo).toLowerCase() : 'elemento'}`}
        tamano="lg"
        onCerrar={() => setElementoEditar(null)}
      >
        {elementoEditar?.zapata ? (
          <FormularioZapata
            modo="editar"
            valoresIniciales={zapataAEntrada(elementoEditar.zapata)}
            cuantificarZapata={async (entrada) => {
              return await actualizarZapataElemento(elementoEditar.id, entrada);
            }}
            onGuardado={() => {
              setElementoEditar(null);
              onActualizado();
            }}
            onCancelar={() => setElementoEditar(null)}
          />
        ) : null}
      </Modal>
    </>
  );
}

function TarjetaElementoCuantificado({
  presupuestoId,
  elemento,
  indice,
  eliminando,
  onEditar,
  onEliminar,
}: {
  presupuestoId: string;
  elemento: ElementoPresupuesto;
  indice: number;
  eliminando: boolean;
  onEditar: () => void;
  onEliminar: () => void;
}) {
  const cantidad = cantidadElementoPresupuesto(elemento);
  const unidad = unidadElementoPresupuesto(elemento);
  const detalle = detalleTecnicoElementoPresupuesto(elemento);
  const tieneApu = Boolean(elemento.apuZapata);

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 flex-1 gap-3">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sm font-bold text-sky-800"
              aria-label={`Partida ${indice + 1}`}
            >
              {indice + 1}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                Descripción
              </p>
              <h3 className="mt-0.5 text-base font-semibold text-gray-900">
                {descripcionElementoPresupuesto(elemento)}
              </h3>
              {detalle ? (
                <p className="mt-1 text-sm leading-relaxed text-gray-500">{detalle}</p>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-[minmax(0,7rem)_minmax(0,9rem)_auto] sm:items-stretch lg:shrink-0">
            <div className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                Cantidad
              </p>
              <p className="mt-1 text-lg font-semibold tabular-nums text-gray-900">
                {cantidad != null ? cantidad : '—'}
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                Unidad
              </p>
              <p className="mt-1 text-lg font-semibold uppercase text-gray-900">{unidad}</p>
            </div>
            <div className="col-span-2 flex items-center justify-end gap-1 sm:col-span-1 sm:flex-col sm:justify-center">
              <button
                type="button"
                onClick={onEditar}
                disabled={!elemento.zapata}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 disabled:opacity-40"
                title="Editar"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onEliminar}
                disabled={eliminando}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                title="Eliminar"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-sky-600/80">
              Subtotal
            </p>
            <p className="text-xl font-bold tabular-nums text-sky-700">
              {formatearMonto(subtotalElementoPresupuesto(elemento))}
            </p>
          </div>

          {tieneApu ? (
            <Link
              to={rutaCostoDesglosadoElemento(presupuestoId, elemento.id)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-4 py-2.5 text-sm font-semibold text-sky-700 transition-colors hover:bg-sky-100"
            >
              Costo desglosado
              <ChevronRight className="h-4 w-4" />
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
