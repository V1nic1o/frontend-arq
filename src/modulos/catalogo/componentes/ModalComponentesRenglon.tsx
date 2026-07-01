import { FormEvent, useCallback, useEffect, useState } from 'react';
import { Layers, Plus, Trash2 } from 'lucide-react';
import { Boton } from '../../autenticacion/componentes/ui/Boton';
import { Modal } from '../../autenticacion/componentes/ui/Modal';
import { CampoTexto, ESTILO_CAMPO } from '../../autenticacion/componentes/ui/CampoTexto';
import {
  actualizarComponenteRenglon,
  crearComponenteRenglon,
  eliminarComponenteRenglon,
  listarComponentesRenglon,
  listarItemsCatalogo,
} from '../servicios/catalogo.servicio';
import type { ComponenteRenglon, ItemCatalogoConSeccion } from '../servicios/catalogo.servicio';
import type { ItemCatalogo } from '../tipos/catalogo.tipos';
import { formatearQuetzales } from '../tipos/catalogo.tipos';

type ModalComponentesRenglonProps = {
  renglon: ItemCatalogo;
  abierto: boolean;
  onCerrar: () => void;
};

export function ModalComponentesRenglon({ renglon, abierto, onCerrar }: ModalComponentesRenglonProps) {
  const [componentes, setComponentes] = useState<ComponenteRenglon[]>([]);
  const [itemsDisponibles, setItemsDisponibles] = useState<ItemCatalogoConSeccion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [itemSeleccionado, setItemSeleccionado] = useState('');
  const [cantidad, setCantidad] = useState('1');
  const [enviando, setEnviando] = useState(false);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const [comps, materiales, mo, equipo] = await Promise.all([
        listarComponentesRenglon(renglon.id),
        listarItemsCatalogo('MATERIAL'),
        listarItemsCatalogo('MANO_OBRA'),
        listarItemsCatalogo('MAQUINARIA_EQUIPO'),
      ]);
      setComponentes(comps);
      setItemsDisponibles([...materiales, ...mo, ...equipo]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los componentes');
    } finally {
      setCargando(false);
    }
  }, [renglon.id]);

  useEffect(() => {
    if (abierto) {
      void cargar();
    }
  }, [abierto, cargar]);

  async function manejarAgregar(evento: FormEvent) {
    evento.preventDefault();
    if (!itemSeleccionado || !cantidad) return;

    setEnviando(true);
    setError(null);
    try {
      await crearComponenteRenglon(renglon.id, itemSeleccionado, Number(cantidad));
      setItemSeleccionado('');
      setCantidad('1');
      await cargar();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'No se pudo agregar el componente');
    } finally {
      setEnviando(false);
    }
  }

  async function manejarEliminar(id: string) {
    if (!window.confirm('¿Eliminar este componente?')) return;
    try {
      await eliminarComponenteRenglon(id);
      await cargar();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'No se pudo eliminar');
    }
  }

  async function manejarActualizarCantidad(id: string, nuevaCantidad: number) {
    try {
      await actualizarComponenteRenglon(id, nuevaCantidad);
      await cargar();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'No se pudo actualizar');
    }
  }

  const precioUnitarioRenglon = componentes.reduce(
    (total, comp) => total + Number(comp.cantidad) * Number(comp.componente.precioUnitario),
    0,
  );

  return (
    <Modal
      abierto={abierto}
      titulo={`Componentes de ${renglon.codigo}`}
      tamano="lg"
      onCerrar={onCerrar}
    >
      <p className="mb-4 text-sm text-gray-500">
        Define materiales, mano de obra y equipo por unidad de renglón. Al presupuestar, se
        expanden automáticamente.
      </p>

      {cargando ? <p className="text-sm text-gray-500">Cargando...</p> : null}
      {error ? <p className="mb-3 text-sm text-red-500">{error}</p> : null}

      {componentes.length > 0 ? (
        <ul className="mb-4 divide-y divide-gray-100 rounded-xl border border-gray-200">
          {componentes.map((comp) => (
            <li key={comp.id} className="flex items-center gap-3 px-4 py-3">
              <Layers className="h-4 w-4 shrink-0 text-violet-500" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {comp.componente.codigo} — {comp.componente.descripcion}
                </p>
                <p className="text-xs text-gray-500">
                  {comp.componente.seccion.tipo} · {formatearQuetzales(comp.componente.precioUnitario)}/
                  {comp.componente.unidad}
                </p>
              </div>
              <input
                type="number"
                min={0.0001}
                step="0.0001"
                className="w-20 rounded-lg border border-gray-300 px-2 py-1 text-sm"
                defaultValue={Number(comp.cantidad)}
                onBlur={(e) => {
                  const valor = Number(e.target.value);
                  if (valor > 0 && valor !== Number(comp.cantidad)) {
                    void manejarActualizarCantidad(comp.id, valor);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => void manejarEliminar(comp.id)}
                className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mb-4 text-sm text-gray-500">Sin componentes todavía.</p>
      )}

      <p className="mb-4 text-sm font-semibold text-gray-900">
        Precio calculado por unidad: {formatearQuetzales(precioUnitarioRenglon)}
      </p>

      <form className="space-y-3 border-t border-gray-100 pt-4" onSubmit={manejarAgregar}>
        <label className="grid gap-1.5">
          <span className="text-sm font-medium text-gray-700">Agregar componente</span>
          <select
            className={ESTILO_CAMPO}
            value={itemSeleccionado}
            onChange={(e) => setItemSeleccionado(e.target.value)}
            required
          >
            <option value="">Seleccionar ítem...</option>
            {itemsDisponibles.map((item) => (
              <option key={item.id} value={item.id}>
                [{item.seccion.tipo}] {item.codigo} — {item.descripcion}
              </option>
            ))}
          </select>
        </label>
        <CampoTexto
          etiqueta="Cantidad por unidad de renglón"
          name="cantidad"
          type="number"
          min={0.0001}
          step="0.0001"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          required
        />
        <div className="flex justify-end">
          <Boton type="submit" anchoCompleto={false} disabled={enviando}>
            <span className="inline-flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {enviando ? 'Agregando...' : 'Agregar componente'}
            </span>
          </Boton>
        </div>
      </form>
    </Modal>
  );
}
