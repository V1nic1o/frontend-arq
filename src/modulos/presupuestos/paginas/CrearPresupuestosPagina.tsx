import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calculator,
  FileSpreadsheet,
  Layers,
  Plus,
  Wallet,
} from 'lucide-react';
import { Modal } from '../../autenticacion/componentes/ui/Modal';
import { FormularioDatosCliente } from '../componentes/FormularioDatosCliente';
import { TarjetaPresupuestoLista } from '../componentes/TarjetaPresupuestoLista';
import {
  actualizarPresupuesto,
  crearPresupuesto,
  eliminarPresupuesto,
  listarPresupuestos,
} from '../servicios/presupuestos.servicio';
import { formatearMonto, type PresupuestoLista } from '../tipos/presupuestos.tipos';

function TarjetaResumen({
  etiqueta,
  valor,
  icono: Icono,
  destacado = false,
}: {
  etiqueta: string;
  valor: string;
  icono: typeof Wallet;
  destacado?: boolean;
}) {
  return (
    <div
      className={[
        'rounded-2xl border p-4 sm:p-5',
        destacado
          ? 'border-sky-200 bg-sky-50/80'
          : 'border-gray-200 bg-white',
      ].join(' ')}
    >
      <div className="flex items-center gap-3">
        <div
          className={[
            'rounded-xl p-2.5',
            destacado ? 'bg-sky-100 text-sky-600' : 'bg-gray-100 text-gray-600',
          ].join(' ')}
        >
          <Icono className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{etiqueta}</p>
          <p
            className={[
              'mt-0.5 truncate text-lg font-bold sm:text-xl',
              destacado ? 'text-sky-700' : 'text-gray-900',
            ].join(' ')}
          >
            {valor}
          </p>
        </div>
      </div>
    </div>
  );
}

export function CrearPresupuestosPagina() {
  const navegar = useNavigate();
  const [presupuestos, setPresupuestos] = useState<PresupuestoLista[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [presupuestoEditar, setPresupuestoEditar] = useState<PresupuestoLista | null>(null);
  const [modalNuevoAbierto, setModalNuevoAbierto] = useState(false);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      setPresupuestos(await listarPresupuestos());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los presupuestos');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  const resumen = useMemo(() => {
    return {
      cantidad: presupuestos.length,
      montoTotal: presupuestos.reduce((suma, p) => suma + p.totalGeneral, 0),
      elementos: presupuestos.reduce((suma, p) => suma + p._count.elementos, 0),
    };
  }, [presupuestos]);

  async function manejarEliminar(presupuesto: PresupuestoLista) {
    const mensaje =
      presupuesto._count.elementos > 0
        ? `¿Eliminar "${presupuesto.proyecto}" con sus ${presupuesto._count.elementos} elemento(s)? Esta acción no se puede deshacer.`
        : `¿Eliminar el presupuesto "${presupuesto.proyecto}"?`;

    if (!window.confirm(mensaje)) return;

    try {
      await eliminarPresupuesto(presupuesto.id);
      if (presupuestoEditar?.id === presupuesto.id) {
        setPresupuestoEditar(null);
      }
      await cargar();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'No se pudo eliminar el presupuesto');
    }
  }

  return (
    <div className="grid gap-8">
      {/* Encabezado */}
      <section className="overflow-hidden rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-indigo-50/60 p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-sky-600">
              Gestión de obras
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
              Presupuestos
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
              Cuantifica zapatas, asigna precios del catálogo y obtén totales en quetzales para
              cada proyecto.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setModalNuevoAbierto(true)}
            className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-sky-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm shadow-sky-200 transition-all hover:bg-sky-500 hover:shadow-md lg:self-center"
          >
            <Plus className="h-5 w-5" />
            Nuevo presupuesto
          </button>
        </div>

        {/* Flujo en 3 pasos — visible en desktop */}
        <ol className="mt-8 hidden gap-4 sm:grid sm:grid-cols-3">
          {[
            { paso: '1', titulo: 'Datos del cliente', texto: 'Proyecto, ubicación y NIT' },
            { paso: '2', titulo: 'Cuantificar', texto: 'Zapatas con cálculo técnico' },
            { paso: '3', titulo: 'Presupuestar', texto: 'Líneas del catálogo en Q' },
          ].map((item) => (
            <li
              key={item.paso}
              className="rounded-2xl border border-white/80 bg-white/70 px-4 py-3 backdrop-blur-sm"
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-sky-600 text-xs font-bold text-white">
                {item.paso}
              </span>
              <p className="mt-2 text-sm font-semibold text-gray-900">{item.titulo}</p>
              <p className="text-xs text-gray-500">{item.texto}</p>
            </li>
          ))}
        </ol>
      </section>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      {/* Resumen — solo si hay presupuestos */}
      {!cargando && presupuestos.length > 0 ? (
        <section className="grid gap-4 sm:grid-cols-3">
          <TarjetaResumen
            etiqueta="Presupuestos"
            valor={String(resumen.cantidad)}
            icono={FileSpreadsheet}
          />
          <TarjetaResumen
            etiqueta="Elementos"
            valor={String(resumen.elementos)}
            icono={Layers}
          />
          <TarjetaResumen
            etiqueta="Monto total"
            valor={formatearMonto(resumen.montoTotal)}
            icono={Wallet}
            destacado
          />
        </section>
      ) : null}

      {/* Lista */}
      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-gray-900">
            {presupuestos.length > 0 ? 'Tus presupuestos' : 'Presupuestos recientes'}
          </h2>
          {presupuestos.length > 0 ? (
            <span className="text-sm text-gray-400">
              {presupuestos.length} proyecto{presupuestos.length === 1 ? '' : 's'}
            </span>
          ) : null}
        </div>

        {cargando ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-56 animate-pulse rounded-2xl border border-gray-200 bg-gray-100"
              />
            ))}
          </div>
        ) : null}

        {!cargando && presupuestos.length === 0 ? (
          <div className="flex flex-col items-center rounded-3xl border border-dashed border-gray-300 bg-gray-50/50 px-6 py-16 text-center">
            <div className="rounded-2xl bg-sky-100 p-4 text-sky-600">
              <Calculator className="h-10 w-10" />
            </div>
            <h3 className="mt-6 text-lg font-semibold text-gray-900">Sin presupuestos todavía</h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-gray-500">
              Comienza registrando los datos del cliente. Luego cuantifica zapatas y agrega
              materiales, mano de obra y equipo desde el catálogo.
            </p>
            <button
              type="button"
              onClick={() => setModalNuevoAbierto(true)}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-500"
            >
              <Plus className="h-4 w-4" />
              Crear primer presupuesto
            </button>
          </div>
        ) : null}

        {!cargando && presupuestos.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {presupuestos.map((presupuesto) => (
              <TarjetaPresupuestoLista
                key={presupuesto.id}
                presupuesto={presupuesto}
                onEditar={() => setPresupuestoEditar(presupuesto)}
                onEliminar={() => void manejarEliminar(presupuesto)}
              />
            ))}
          </div>
        ) : null}
      </section>

      <Modal
        abierto={modalNuevoAbierto}
        titulo="Nuevo presupuesto"
        tamano="lg"
        onCerrar={() => setModalNuevoAbierto(false)}
      >
        <FormularioDatosCliente
          crearPresupuesto={crearPresupuesto}
          onCreado={(presupuestoId) => {
            setModalNuevoAbierto(false);
            navegar(`/presupuestos/${presupuestoId}/elementos`);
          }}
          onCancelar={() => setModalNuevoAbierto(false)}
        />
      </Modal>

      <Modal
        abierto={Boolean(presupuestoEditar)}
        titulo="Editar presupuesto"
        tamano="lg"
        onCerrar={() => setPresupuestoEditar(null)}
      >
        {presupuestoEditar ? (
          <FormularioDatosCliente
            modo="editar"
            valoresIniciales={{
              proyecto: presupuestoEditar.proyecto,
              cliente: presupuestoEditar.cliente,
              ubicacion: presupuestoEditar.ubicacion,
              municipio: presupuestoEditar.municipio,
              departamento: presupuestoEditar.departamento,
              nit: presupuestoEditar.nit,
            }}
            actualizarPresupuesto={async (entrada) => {
              await actualizarPresupuesto(presupuestoEditar.id, entrada);
            }}
            onGuardado={() => {
              setPresupuestoEditar(null);
              void cargar();
            }}
            onCancelar={() => setPresupuestoEditar(null)}
          />
        ) : null}
      </Modal>
    </div>
  );
}
