import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Building2, MapPin, Pencil, Plus, Trash2, User } from 'lucide-react';
import { Boton } from '../../autenticacion/componentes/ui/Boton';
import { Modal } from '../../autenticacion/componentes/ui/Modal';
import { FormularioDatosCliente } from '../componentes/FormularioDatosCliente';
import { LayoutPresupuesto, PanelPresupuesto } from '../componentes/LayoutPresupuesto';
import { ListaElementosCuantificados } from '../componentes/ListaElementosCuantificados';
import { ResumenCostosPanel } from '../componentes/ResumenCostosPanel';
import {
  actualizarPresupuesto,
  eliminarPresupuesto,
  obtenerPresupuesto,
} from '../servicios/presupuestos.servicio';
import {
  rutaElementosPresupuesto,
  type PresupuestoDetalle,
} from '../tipos/presupuestos.tipos';

export function DetallePresupuestoPagina() {
  const { presupuestoId } = useParams<{ presupuestoId: string }>();
  const navigate = useNavigate();
  const [presupuesto, setPresupuesto] = useState<PresupuestoDetalle | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);

  const cargar = useCallback(async () => {
    if (!presupuestoId) return;
    setCargando(true);
    setError(null);
    try {
      setPresupuesto(await obtenerPresupuesto(presupuestoId));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar el presupuesto');
    } finally {
      setCargando(false);
    }
  }, [presupuestoId]);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  async function manejarEliminar() {
    if (!presupuesto || !presupuestoId) return;

    const mensaje =
      presupuesto.elementos.length > 0
        ? `¿Eliminar "${presupuesto.proyecto}" con sus ${presupuesto.elementos.length} elemento(s) y líneas de costo? Esta acción no se puede deshacer.`
        : `¿Eliminar el presupuesto "${presupuesto.proyecto}"?`;

    if (!window.confirm(mensaje)) return;

    try {
      await eliminarPresupuesto(presupuestoId);
      navigate('/presupuestos', { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'No se pudo eliminar el presupuesto');
    }
  }

  if (!presupuestoId) return null;

  const tieneElementos = (presupuesto?.elementos.length ?? 0) > 0;

  return (
    <LayoutPresupuesto
      volverA="/presupuestos"
      etiquetaVolver="Presupuestos"
      migas={[
        { etiqueta: 'Presupuestos', ruta: '/presupuestos' },
        { etiqueta: presupuesto?.proyecto ?? 'Detalle' },
      ]}
      titulo={presupuesto?.proyecto ?? 'Presupuesto'}
      subtitulo={
        presupuesto
          ? `${presupuesto.cliente} · NIT ${presupuesto.nit}`
          : undefined
      }
      accion={
        presupuesto ? (
          <div className="flex shrink-0 gap-2">
            <Boton
              type="button"
              variante="secundario"
              anchoCompleto={false}
              onClick={() => setModalEditarAbierto(true)}
            >
              <span className="inline-flex items-center gap-2">
                <Pencil className="h-4 w-4" />
                Editar
              </span>
            </Boton>
            <Boton
              type="button"
              variante="peligro"
              anchoCompleto={false}
              onClick={() => void manejarEliminar()}
            >
              <span className="inline-flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Eliminar
              </span>
            </Boton>
          </div>
        ) : null
      }
    >
      {cargando ? <p className="text-sm text-gray-500">Cargando presupuesto...</p> : null}
      {error ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      ) : null}

      {presupuesto ? (
        <div className="grid gap-6">
          <div className="grid gap-4 lg:grid-cols-[1fr_16rem] lg:items-start">
            <PanelPresupuesto titulo="Información del proyecto">
              <div className="grid gap-4 p-4 sm:grid-cols-3 sm:p-6">
                <div className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                      Cliente
                    </p>
                    <p className="truncate font-medium text-gray-900">{presupuesto.cliente}</p>
                    <p className="text-xs text-gray-500">NIT {presupuesto.nit}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                      Proyecto
                    </p>
                    <p className="truncate font-medium text-gray-900">{presupuesto.proyecto}</p>
                  </div>
                </div>
                <div className="flex gap-3 sm:col-span-1">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                      Ubicación
                    </p>
                    <p className="truncate text-sm text-gray-900">{presupuesto.ubicacion}</p>
                    <p className="truncate text-xs text-gray-500">
                      {presupuesto.municipio}, {presupuesto.departamento}
                    </p>
                  </div>
                </div>
              </div>
            </PanelPresupuesto>

            <aside className="lg:sticky lg:top-6">
              <ResumenCostosPanel
                resumen={presupuesto.resumenCostos}
                total={presupuesto.totalGeneral}
                titulo="Total del presupuesto"
              />
            </aside>
          </div>

          <PanelPresupuesto>
            <div className="flex flex-col gap-3 border-b border-gray-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">
                  Elementos cuantificados
                </h2>
                <p className="mt-0.5 text-xs text-gray-500">
                  {presupuesto.elementos.length} elemento
                  {presupuesto.elementos.length === 1 ? '' : 's'} en este presupuesto
                </p>
              </div>
              <Link
                to={rutaElementosPresupuesto(presupuestoId)}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-700 transition-colors hover:bg-sky-100"
              >
                <Plus className="h-4 w-4" />
                {tieneElementos ? 'Agregar más' : 'Agregar elementos'}
              </Link>
            </div>

            <ListaElementosCuantificados
              presupuestoId={presupuestoId}
              elementos={presupuesto.elementos}
              onActualizado={() => void cargar()}
              onError={setError}
            />
          </PanelPresupuesto>
        </div>
      ) : null}

      <Modal
        abierto={modalEditarAbierto}
        titulo="Editar presupuesto"
        tamano="lg"
        onCerrar={() => setModalEditarAbierto(false)}
      >
        {presupuesto ? (
          <FormularioDatosCliente
            modo="editar"
            valoresIniciales={{
              proyecto: presupuesto.proyecto,
              cliente: presupuesto.cliente,
              ubicacion: presupuesto.ubicacion,
              municipio: presupuesto.municipio,
              departamento: presupuesto.departamento,
              nit: presupuesto.nit,
            }}
            actualizarPresupuesto={async (entrada) => {
              await actualizarPresupuesto(presupuestoId, entrada);
            }}
            onGuardado={() => {
              setModalEditarAbierto(false);
              void cargar();
            }}
            onCancelar={() => setModalEditarAbierto(false)}
          />
        ) : null}
      </Modal>
    </LayoutPresupuesto>
  );
}
