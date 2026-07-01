import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import { Boton } from '../../autenticacion/componentes/ui/Boton';
import { Modal } from '../../autenticacion/componentes/ui/Modal';
import { CampoTexto, ESTILO_CAMPO } from '../../autenticacion/componentes/ui/CampoTexto';
import { Tarjeta } from '../../autenticacion/componentes/ui/Tarjeta';
import { listarItemsCatalogo } from '../../catalogo/servicios/catalogo.servicio';
import type { ItemCatalogoConSeccion } from '../../catalogo/servicios/catalogo.servicio';
import { LayoutPresupuesto } from '../componentes/LayoutPresupuesto';
import { PasosFlujoPresupuesto } from '../componentes/PasosFlujoPresupuesto';
import { formatearDecimal, ResultadoCalculadora } from '../componentes/ResultadoCalculadora';
import { ResumenCostosPanel } from '../componentes/ResumenCostosPanel';
import {
  agregarLineaCosto,
  eliminarLineaCosto,
  listarLineasCosto,
  obtenerElemento,
} from '../servicios/presupuestos.servicio';
import {
  formatearMonto,
  rutaPresupuesto,
  type ElementoPresupuestoDetalle,
  type LineaCosto,
  type LineasCostoRespuesta,
  type SugerenciaCuantificacion,
} from '../tipos/presupuestos.tipos';

export function PresupuestarElementoPagina() {
  const { presupuestoId, elementoId } = useParams<{
    presupuestoId: string;
    elementoId: string;
  }>();

  const [elemento, setElemento] = useState<ElementoPresupuestoDetalle | null>(null);
  const [lineasData, setLineasData] = useState<LineasCostoRespuesta | null>(null);
  const [itemsCatalogo, setItemsCatalogo] = useState<ItemCatalogoConSeccion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [itemSeleccionado, setItemSeleccionado] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [enviando, setEnviando] = useState(false);

  const cargar = useCallback(async () => {
    if (!elementoId) return;
    setCargando(true);
    setError(null);
    try {
      const [elementoData, lineas, items] = await Promise.all([
        obtenerElemento(elementoId),
        listarLineasCosto(elementoId),
        listarItemsCatalogo(),
      ]);
      setElemento(elementoData);
      setLineasData(lineas);
      setItemsCatalogo(items);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar el elemento');
    } finally {
      setCargando(false);
    }
  }, [elementoId]);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  const itemsFiltrados = useMemo(() => {
    if (!filtroTipo) return itemsCatalogo;
    return itemsCatalogo.filter((item) => item.seccion.tipo === filtroTipo);
  }, [filtroTipo, itemsCatalogo]);

  function aplicarSugerencia(sugerencia: SugerenciaCuantificacion) {
    setCantidad(String(sugerencia.cantidad));
    setModalAbierto(true);
  }

  async function manejarAgregar(evento: FormEvent) {
    evento.preventDefault();
    if (!elementoId || !itemSeleccionado || !cantidad) return;

    setEnviando(true);
    setError(null);
    try {
      const resultado = await agregarLineaCosto(
        elementoId,
        itemSeleccionado,
        Number(cantidad),
      );
      setLineasData(resultado);
      setModalAbierto(false);
      setItemSeleccionado('');
      setCantidad('');
      await cargar();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'No se pudo agregar la línea');
    } finally {
      setEnviando(false);
    }
  }

  async function manejarEliminar(linea: LineaCosto) {
    if (!window.confirm(`¿Eliminar "${linea.codigo}"?`)) return;
    try {
      const resultado = await eliminarLineaCosto(linea.id);
      setLineasData(resultado);
      await cargar();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'No se pudo eliminar');
    }
  }

  if (!presupuestoId || !elementoId) return null;

  const zapata = elemento?.zapata;
  const lineas = lineasData?.lineas ?? [];

  const lineasAgrupadas = lineas.reduce<Record<string, LineaCosto[]>>((grupos, linea) => {
    const clave = linea.renglonOrigen ?? linea.id;
    grupos[clave] = grupos[clave] ?? [];
    grupos[clave].push(linea);
    return grupos;
  }, {});

  return (
    <LayoutPresupuesto
      volverA={rutaPresupuesto(presupuestoId)}
      etiquetaVolver="Presupuesto"
      migas={[
        { etiqueta: 'Presupuestos', ruta: '/presupuestos' },
        { etiqueta: elemento?.presupuesto.proyecto ?? '...', ruta: rutaPresupuesto(presupuestoId) },
        { etiqueta: 'Presupuestar zapata' },
      ]}
      titulo="Presupuestar zapata"
      subtitulo="Asigna ítems del catálogo según las cantidades calculadas."
    >
      <div className="mb-2">
        <PasosFlujoPresupuesto pasoActivo={3} />
      </div>

      {cargando ? <p className="text-sm text-gray-500">Cargando...</p> : null}
      {error ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p> : null}

      {zapata ? (
        <Tarjeta titulo="Cuantificación técnica">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <ResultadoCalculadora
              etiqueta="Concreto estimado"
              valor={formatearDecimal(zapata.concretoEstimado)}
              unidad="m³"
              destacado
            />
            <ResultadoCalculadora
              etiqueta="Acero estimado"
              valor={formatearDecimal(zapata.aceroPesoTotal)}
              unidad="kg"
            />
            <ResultadoCalculadora
              etiqueta="Excavación"
              valor={formatearDecimal(zapata.volumenExcavacion)}
              unidad="m³"
            />
            <ResultadoCalculadora
              etiqueta="Longitud acero"
              valor={formatearDecimal(zapata.aceroLongitudTotal)}
              unidad="m"
            />
          </div>

          {lineasData?.sugerenciasCuantificacion.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {lineasData.sugerenciasCuantificacion.map((sugerencia) => (
                <button
                  key={sugerencia.concepto}
                  type="button"
                  onClick={() => aplicarSugerencia(sugerencia)}
                  className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-700 transition-colors hover:bg-sky-100"
                >
                  {sugerencia.descripcion}: {formatearDecimal(sugerencia.cantidad)}{' '}
                  {sugerencia.unidad}
                </button>
              ))}
            </div>
          ) : null}
        </Tarjeta>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <Tarjeta titulo="Líneas de costo">
          <div className="mb-4 flex justify-end">
            <button
              type="button"
              onClick={() => setModalAbierto(true)}
              className="inline-flex items-center gap-1 text-sm font-semibold text-sky-600 hover:text-sky-700"
            >
              <Plus className="h-4 w-4" />
              Agregar del catálogo
            </button>
          </div>

          {lineas.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center">
              <p className="text-sm text-gray-500">
                Agrega ítems del catálogo con sus cantidades.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {Object.values(lineasAgrupadas).map((grupo) => {
                const primera = grupo[0];
                const esRenglon = grupo.length > 1 && primera.renglonOrigen;

                if (esRenglon) {
                  const subtotalGrupo = grupo.reduce((s, l) => s + Number(l.subtotal), 0);
                  return (
                    <div key={primera.renglonOrigen!} className="py-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-violet-700">Renglón compuesto</p>
                          <p className="text-sm text-gray-500">{grupo.length} componentes</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900">
                            {formatearMonto(subtotalGrupo)}
                          </p>
                          <button
                            type="button"
                            onClick={() => void manejarEliminar(primera)}
                            className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <ul className="mt-3 space-y-2 border-l-2 border-violet-100 pl-3">
                        {grupo.map((linea) => (
                          <li key={linea.id} className="flex justify-between text-sm">
                            <span className="text-gray-700">
                              {linea.codigo} — {linea.descripcion}
                            </span>
                            <span className="text-gray-900">
                              {Number(linea.cantidad)} {linea.unidad} ·{' '}
                              {formatearMonto(linea.subtotal)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                }

                return grupo.map((linea) => (
                  <div key={linea.id} className="flex items-center gap-3 py-3.5">
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-sm font-semibold text-sky-700">{linea.codigo}</p>
                      <p className="truncate text-sm text-gray-900">{linea.descripcion}</p>
                      <p className="text-xs text-gray-500">
                        {Number(linea.cantidad)} {linea.unidad} ×{' '}
                        {formatearMonto(linea.precioUnitario)}
                      </p>
                    </div>
                    <p className="shrink-0 font-semibold text-gray-900">
                      {formatearMonto(linea.subtotal)}
                    </p>
                    <button
                      type="button"
                      onClick={() => void manejarEliminar(linea)}
                      className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ));
              })}
            </div>
          )}
        </Tarjeta>

        {lineasData ? (
          <ResumenCostosPanel
            resumen={lineasData.resumenCostos}
            total={lineasData.totalElemento}
            titulo="Subtotales"
          />
        ) : null}
      </div>

      <Modal
        abierto={modalAbierto}
        titulo="Agregar del catálogo"
        tamano="lg"
        onCerrar={() => setModalAbierto(false)}
      >
        <form className="space-y-4" onSubmit={manejarAgregar}>
          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-gray-700">Filtrar por tipo</span>
            <select
              className={ESTILO_CAMPO}
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="MATERIAL">Materiales</option>
              <option value="MANO_OBRA">Mano de obra</option>
              <option value="MAQUINARIA_EQUIPO">Maquinaria y equipo</option>
              <option value="RENGLON">Renglones</option>
            </select>
          </label>

          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-gray-700">Ítem del catálogo</span>
            <select
              className={ESTILO_CAMPO}
              value={itemSeleccionado}
              onChange={(e) => setItemSeleccionado(e.target.value)}
              required
            >
              <option value="">Seleccionar...</option>
              {itemsFiltrados.map((item) => (
                <option key={item.id} value={item.id}>
                  [{item.seccion.tipo}] {item.codigo} — {item.descripcion} ({item.unidad}) — Q
                  {Number(item.precioUnitario).toFixed(2)}
                </option>
              ))}
            </select>
          </label>

          <CampoTexto
            etiqueta="Cantidad"
            name="cantidad"
            type="number"
            min={0.0001}
            step="0.0001"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            required
          />

          <div className="flex justify-end gap-2">
            <Boton
              type="button"
              variante="secundario"
              anchoCompleto={false}
              onClick={() => setModalAbierto(false)}
            >
              Cancelar
            </Boton>
            <Boton type="submit" anchoCompleto={false} disabled={enviando}>
              {enviando ? 'Agregando...' : 'Agregar'}
            </Boton>
          </div>
        </form>
      </Modal>
    </LayoutPresupuesto>
  );
}
