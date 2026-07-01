import { Link } from 'react-router-dom';
import { ChevronRight, Folder, Pencil, Trash2 } from 'lucide-react';
import type { SeccionCatalogo } from '../tipos/catalogo.tipos';

type FilaSeccionCatalogoProps = {
  seccion: SeccionCatalogo;
  ruta: string;
  colorIcono: string;
  onEditar: (seccion: SeccionCatalogo) => void;
  onEliminar: (seccion: SeccionCatalogo) => void;
};

export function FilaSeccionCatalogo({
  seccion,
  ruta,
  colorIcono,
  onEditar,
  onEliminar,
}: FilaSeccionCatalogoProps) {
  return (
    <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3 last:border-b-0 sm:gap-3 sm:px-6 lg:border lg:rounded-xl lg:border-gray-200 lg:last:border">
      <Link
        to={ruta}
        className="flex min-w-0 flex-1 items-center gap-3 rounded-xl px-1 py-1 transition-colors hover:bg-gray-50"
      >
        <div className={`shrink-0 rounded-lg p-2 ${colorIcono}`}>
          <Folder className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-gray-900">{seccion.nombre}</p>
          <p className="text-sm text-gray-500">
            {seccion._count.items} código{seccion._count.items === 1 ? '' : 's'}
          </p>
        </div>
        <ChevronRight className="hidden h-5 w-5 shrink-0 text-gray-300 sm:block" />
      </Link>

      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={() => onEditar(seccion)}
          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
          aria-label={`Editar ${seccion.nombre}`}
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onEliminar(seccion)}
          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
          aria-label={`Eliminar ${seccion.nombre}`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
