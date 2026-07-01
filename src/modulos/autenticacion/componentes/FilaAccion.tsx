import { ChevronRight, type LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

type FilaAccionProps = {
  icono: LucideIcon;
  titulo: string;
  descripcion?: string;
  onClick?: () => void;
  to?: string;
  colorIcono?: string;
};

export function FilaAccion({
  icono: Icono,
  titulo,
  descripcion,
  onClick,
  to,
  colorIcono = 'bg-gray-100 text-gray-600',
}: FilaAccionProps) {
  const contenido = (
    <>
      <div className={`rounded-xl p-2.5 ${colorIcono}`}>
        <Icono className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-gray-900">{titulo}</p>
        {descripcion ? <p className="text-sm text-gray-500">{descripcion}</p> : null}
      </div>
      {to ? <ChevronRight className="h-5 w-5 shrink-0 text-gray-400" /> : null}
    </>
  );

  const clases =
    'flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-gray-50 sm:px-5';

  if (to) {
    return (
      <Link to={to} className={clases}>
        {contenido}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={clases}>
      {contenido}
    </button>
  );
}
