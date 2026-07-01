import { useCallback, useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Pencil, Plus, Trash2, Layers } from 'lucide-react';
import { Boton } from '../../autenticacion/componentes/ui/Boton';
import { Modal } from '../../autenticacion/componentes/ui/Modal';
import {
  EstadoVacioCatalogo,
  LayoutCatalogo,
  PanelCatalogo,
} from '../componentes/LayoutCatalogo';
import { FormularioItemCatalogo } from '../componentes/FormularioItemCatalogo';
import { ModalComponentesRenglon } from '../componentes/ModalComponentesRenglon';
import {
  actualizarItem,
  crearItem,
  eliminarItem,
  listarItems,
  obtenerSeccion,
} from '../servicios/catalogo.servicio';
import {
  formatearQuetzales,
  obtenerCatalogoPorSlug,
  type ItemCatalogo,
  type SeccionCatalogo,
} from '../tipos/catalogo.tipos';

export function CodigosSeccionPagina() {
  const { slug, seccionId } = useParams<{ slug: string; seccionId: string }>();
  const catalogo = slug ? obtenerCatalogoPorSlug(slug) : undefined;
  const [seccion, setSeccion] = useState<SeccionCatalogo | null>(null);
  const [items, setItems] = useState<ItemCatalogo[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalCrearAbierto, setModalCrearAbierto] = useState(false);
  const [itemEditar, setItemEditar] = useState<ItemCatalogo | null>(null);
  const [renglonComponentes, setRenglonComponentes] = useState<ItemCatalogo | null>(null);

  const esRenglones = catalogo?.tipo === 'RENGLON';

  const cargarDatos = useCallback(async () => {
    if (!seccionId || !catalogo) {
      return;
    }

    setCargando(true);
    setError(null);

    try {
      const [seccionData, itemsData] = await Promise.all([
        obtenerSeccion(seccionId),
        listarItems(seccionId),
      ]);
      setSeccion(seccionData);
      setItems(itemsData);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los códigos');
    } finally {
      setCargando(false);
    }
  }, [catalogo, seccionId]);

  useEffect(() => {
    void cargarDatos();
  }, [cargarDatos]);

  if (!catalogo || !seccionId) {
    return <Navigate to="/catalogo" replace />;
  }

  async function manejarEliminar(item: ItemCatalogo) {
    if (!window.confirm(`¿Eliminar "${item.codigo} — ${item.descripcion}"?`)) {
      return;
    }

    try {
      await eliminarItem(item.id);
      if (itemEditar?.id === item.id) {
        setItemEditar(null);
      }
      await cargarDatos();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'No se pudo eliminar el código');
    }
  }

  const etiquetaItem = catalogo.etiquetaItem;

  return (
    <LayoutCatalogo
      volverA={`/catalogo/${catalogo.slug}`}
      etiquetaVolver={catalogo.titulo}
      migas={[
        { etiqueta: 'Catálogo', ruta: '/catalogo' },
        { etiqueta: catalogo.titulo, ruta: `/catalogo/${catalogo.slug}` },
        { etiqueta: seccion?.nombre ?? '…' },
      ]}
      titulo={seccion?.nombre ?? 'Códigos'}
      subtitulo={`${items.length} código${items.length === 1 ? '' : 's'} · precios en Q`}
      accion={
        <Boton anchoCompleto={false} onClick={() => setModalCrearAbierto(true)}>
          <span className="inline-flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Agregar código
          </span>
        </Boton>
      }
    >
      <PanelCatalogo titulo={etiquetaItem}>
        {cargando ? <EstadoVacioCatalogo mensaje="Cargando códigos..." /> : null}

        {error ? (
          <div className="px-4 py-6 text-center text-sm text-red-500 sm:px-6">{error}</div>
        ) : null}

        {!cargando && !error && items.length === 0 ? (
          <EstadoVacioCatalogo
            mensaje="Aún no hay códigos en esta sección."
            accion={
              <Boton anchoCompleto={false} onClick={() => setModalCrearAbierto(true)}>
                <span className="inline-flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Agregar código
                </span>
              </Boton>
            }
          />
        ) : null}

        {!cargando && !error && items.length > 0 ? (
          <>
            <div className="hidden border-b border-gray-100 bg-gray-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400 md:grid md:grid-cols-[6rem_1fr_5rem_7rem_5.5rem] md:gap-4">
              <span>Código</span>
              <span>Descripción</span>
              <span>Unidad</span>
              <span className="text-right">Precio unit.</span>
              <span />
            </div>
            <ul className="divide-y divide-gray-100">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-3 px-4 py-3.5 sm:px-6 md:grid md:grid-cols-[6rem_1fr_5rem_7rem_5.5rem] md:items-center md:gap-4"
                >
                  <div className="shrink-0 md:min-w-0">
                    <span className="font-mono text-sm font-semibold text-sky-700">{item.codigo}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-gray-900">{item.descripcion}</p>
                    <p className="text-sm text-gray-500 md:hidden">{item.unidad}</p>
                  </div>
                  <p className="hidden text-sm text-gray-600 md:block">{item.unidad}</p>
                  <p className="shrink-0 text-sm font-semibold text-gray-900 md:text-right">
                    {formatearQuetzales(item.precioUnitario)}
                  </p>
                  <div className="flex justify-end gap-1">
                    {esRenglones ? (
                      <button
                        type="button"
                        onClick={() => setRenglonComponentes(item)}
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-violet-50 hover:text-violet-600"
                        aria-label={`Componentes de ${item.codigo}`}
                        title="Componentes"
                      >
                        <Layers className="h-4 w-4" />
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => setItemEditar(item)}
                      className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                      aria-label={`Editar ${item.codigo}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => void manejarEliminar(item)}
                      className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      aria-label={`Eliminar ${item.codigo}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </PanelCatalogo>

      <Modal
        abierto={modalCrearAbierto}
        titulo={`Nuevo ${etiquetaItem.toLowerCase()}`}
        tamano="lg"
        onCerrar={() => setModalCrearAbierto(false)}
      >
        <FormularioItemCatalogo
          onGuardar={async (datos) => {
            await crearItem(seccionId, datos);
            setModalCrearAbierto(false);
            await cargarDatos();
          }}
          onCancelar={() => setModalCrearAbierto(false)}
        />
      </Modal>

      <Modal
        abierto={Boolean(itemEditar)}
        titulo={itemEditar ? `Editar ${itemEditar.codigo}` : 'Editar código'}
        tamano="lg"
        onCerrar={() => setItemEditar(null)}
      >
        {itemEditar ? (
          <FormularioItemCatalogo
            itemInicial={itemEditar}
            onGuardar={async (datos) => {
              await actualizarItem(itemEditar.id, {
                descripcion: datos.descripcion,
                unidad: datos.unidad,
                precioUnitario: datos.precioUnitario,
              });
              setItemEditar(null);
              await cargarDatos();
            }}
            onCancelar={() => setItemEditar(null)}
          />
        ) : null}
      </Modal>

      {renglonComponentes ? (
        <ModalComponentesRenglon
          renglon={renglonComponentes}
          abierto={Boolean(renglonComponentes)}
          onCerrar={() => setRenglonComponentes(null)}
        />
      ) : null}
    </LayoutCatalogo>
  );
}
