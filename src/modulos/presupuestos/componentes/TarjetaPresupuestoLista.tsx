import { Link } from 'react-router-dom';
import {
  Building2,
  Calendar,
  ChevronRight,
  Layers,
  MapPin,
  Pencil,
  Trash2,
  User,
} from 'lucide-react';
import { formatearMonto, type PresupuestoLista } from '../tipos/presupuestos.tipos';

type TarjetaPresupuestoListaProps = {
  presupuesto: PresupuestoLista;
  onEditar: () => void;
  onEliminar: () => void;
};

function formatearFechaCorta(fecha: string) {
  return new Intl.DateTimeFormat('es-GT', { dateStyle: 'medium' }).format(new Date(fecha));
}

export function TarjetaPresupuestoLista({
  presupuesto,
  onEditar,
  onEliminar,
}: TarjetaPresupuestoListaProps) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:border-sky-200 hover:shadow-md">
      <Link
        to={`/presupuestos/${presupuesto.id}`}
        className="flex flex-1 flex-col p-5 sm:p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="shrink-0 rounded-xl bg-sky-50 p-2.5 text-sky-600">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-base font-semibold text-gray-900 group-hover:text-sky-700 sm:text-lg">
                {presupuesto.proyecto}
              </h2>
              <p className="mt-0.5 flex items-center gap-1.5 truncate text-sm text-gray-500">
                <User className="h-3.5 w-3.5 shrink-0" />
                {presupuesto.cliente}
              </p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-gray-300 transition-colors group-hover:text-sky-500" />
        </div>

        <div className="mt-4 space-y-2 text-sm text-gray-500">
          <p className="flex items-center gap-2 truncate">
            <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
            {presupuesto.municipio}, {presupuesto.departamento}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
              <Layers className="h-3.5 w-3.5" />
              {presupuesto._count.elementos} elemento
              {presupuesto._count.elementos === 1 ? '' : 's'}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
              <Calendar className="h-3.5 w-3.5" />
              {formatearFechaCorta(presupuesto.creadoEn)}
            </span>
          </div>
        </div>

        <div className="mt-5 border-t border-gray-100 pt-4">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Total estimado</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-sky-700">
            {formatearMonto(presupuesto.totalGeneral)}
          </p>
        </div>
      </Link>

      <div className="flex border-t border-gray-100 bg-gray-50/80">
        <button
          type="button"
          onClick={onEditar}
          className="flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
        >
          <Pencil className="h-4 w-4" />
          Editar
        </button>
        <div className="w-px bg-gray-200" />
        <button
          type="button"
          onClick={onEliminar}
          className="flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
          Eliminar
        </button>
      </div>
    </article>
  );
}
