import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Calculator,
  Layers,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import { Modal } from '../../autenticacion/componentes/ui/Modal';
import { FormularioZapata } from './FormularioZapata';
import { formatearDecimal } from './ResultadoCalculadora';
import {
  actualizarZapataElemento,
  eliminarElemento,
} from '../servicios/presupuestos.servicio';
import {
  formatearMonto,
  rutaElementosPresupuesto,
  rutaPresupuestarElemento,
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

  async function manejarEliminar(elemento: ElementoPresupuesto, indice: number) {
    const lineas = elemento.lineasCosto?.length ?? 0;
    const mensaje =
      lineas > 0
        ? `¿Eliminar ${etiquetaTipo(elemento.tipo)} ${indice + 1} y sus ${lineas} línea(s) de costo?`
        : `¿Eliminar ${etiquetaTipo(elemento.tipo)} ${indice + 1}?`;

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
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[52rem] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/80 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <th className="px-4 py-3 sm:px-6">#</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Cantidad</th>
              <th className="px-4 py-3">Dimensiones</th>
              <th className="px-4 py-3">Concreto</th>
              <th className="px-4 py-3">Acero</th>
              <th className="px-4 py-3">Costo</th>
              <th className="px-4 py-3 text-right sm:pr-6">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {elementos.map((elemento, indice) => (
              <FilaElementoTabla
                key={elemento.id}
                elemento={elemento}
                indice={indice}
                presupuestoId={presupuestoId}
                eliminando={eliminandoId === elemento.id}
                onEditar={() => setElementoEditar(elemento)}
                onEliminar={() => void manejarEliminar(elemento, indice)}
              />
            ))}
          </tbody>
        </table>
      </div>

      <ul className="divide-y divide-gray-100 md:hidden">
        {elementos.map((elemento, indice) => (
          <li key={elemento.id} className="p-4">
            <TarjetaElementoMovil
              elemento={elemento}
              indice={indice}
              presupuestoId={presupuestoId}
              eliminando={eliminandoId === elemento.id}
              onEditar={() => setElementoEditar(elemento)}
              onEliminar={() => void manejarEliminar(elemento, indice)}
            />
          </li>
        ))}
      </ul>

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
              await actualizarZapataElemento(elementoEditar.id, entrada);
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

function FilaElementoTabla({
  elemento,
  indice,
  presupuestoId,
  eliminando,
  onEditar,
  onEliminar,
}: {
  elemento: ElementoPresupuesto;
  indice: number;
  presupuestoId: string;
  eliminando: boolean;
  onEditar: () => void;
  onEliminar: () => void;
}) {
  const zapata = elemento.zapata;
  const lineas = elemento.lineasCosto?.length ?? 0;

  return (
    <tr className="text-gray-700">
      <td className="px-4 py-4 font-semibold text-gray-900 sm:px-6">{indice + 1}</td>
      <td className="px-4 py-4">
        <span className="inline-flex items-center gap-1.5 font-medium text-gray-900">
          <Calculator className="h-4 w-4 text-sky-500" />
          {etiquetaTipo(elemento.tipo)}
        </span>
      </td>
      <td className="px-4 py-4">{zapata ? `${zapata.cantidad} u` : '—'}</td>
      <td className="px-4 py-4">
        {zapata ? (
          <>
            {formatearDecimal(zapata.largo)} × {formatearDecimal(zapata.ancho)} ×{' '}
            {formatearDecimal(zapata.espesor)} m
            <span className="mt-0.5 block text-xs text-gray-400">
              f'c {zapata.resistenciaConcreto} PSI
            </span>
          </>
        ) : (
          '—'
        )}
      </td>
      <td className="px-4 py-4 font-medium text-sky-700">
        {zapata ? `${formatearDecimal(zapata.concretoEstimado)} m³` : '—'}
      </td>
      <td className="px-4 py-4">{zapata ? `${formatearDecimal(zapata.aceroPesoTotal)} kg` : '—'}</td>
      <td className="px-4 py-4">
        <p className="font-semibold text-gray-900">{formatearMonto(elemento.totalElemento ?? 0)}</p>
        <p className="text-xs text-gray-400">
          {lineas} línea{lineas === 1 ? '' : 's'}
        </p>
      </td>
      <td className="px-4 py-4 sm:pr-6">
        <div className="flex items-center justify-end gap-1">
          <Link
            to={rutaPresupuestarElemento(presupuestoId, elemento.id)}
            className="rounded-lg px-2.5 py-2 text-xs font-semibold text-sky-600 transition-colors hover:bg-sky-50"
            title="Presupuestar"
          >
            <span className="inline-flex items-center gap-1">
              Costos
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
          <button
            type="button"
            onClick={onEditar}
            disabled={!zapata}
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
      </td>
    </tr>
  );
}

function TarjetaElementoMovil({
  elemento,
  indice,
  presupuestoId,
  eliminando,
  onEditar,
  onEliminar,
}: {
  elemento: ElementoPresupuesto;
  indice: number;
  presupuestoId: string;
  eliminando: boolean;
  onEditar: () => void;
  onEliminar: () => void;
}) {
  const zapata = elemento.zapata;

  return (
    <article className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sm font-bold text-sky-700">
            {indice + 1}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{etiquetaTipo(elemento.tipo)}</p>
            {zapata ? (
              <p className="mt-0.5 text-sm text-gray-500">
                {zapata.cantidad} u · {formatearDecimal(zapata.largo)}×{formatearDecimal(zapata.ancho)}×
                {formatearDecimal(zapata.espesor)} m
              </p>
            ) : null}
          </div>
        </div>
        <p className="shrink-0 font-semibold text-sky-700">
          {formatearMonto(elemento.totalElemento ?? 0)}
        </p>
      </div>

      {zapata ? (
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg bg-gray-50 px-3 py-2">
            <p className="text-gray-400">Concreto</p>
            <p className="font-medium text-gray-900">{formatearDecimal(zapata.concretoEstimado)} m³</p>
          </div>
          <div className="rounded-lg bg-gray-50 px-3 py-2">
            <p className="text-gray-400">Acero</p>
            <p className="font-medium text-gray-900">{formatearDecimal(zapata.aceroPesoTotal)} kg</p>
          </div>
        </div>
      ) : null}

      <div className="flex gap-2">
        <Link
          to={rutaPresupuestarElemento(presupuestoId, elemento.id)}
          className="flex-1 rounded-xl bg-sky-600 py-2 text-center text-sm font-semibold text-white"
        >
          Presupuestar costos
        </Link>
        <button
          type="button"
          onClick={onEditar}
          disabled={!zapata}
          className="rounded-xl border border-gray-200 px-3 py-2 text-gray-600 disabled:opacity-40"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onEliminar}
          disabled={eliminando}
          className="rounded-xl border border-gray-200 px-3 py-2 text-red-500 disabled:opacity-40"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}
