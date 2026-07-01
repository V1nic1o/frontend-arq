import { NavLink } from 'react-router-dom';
import { BookOpen, FileText, Home, User } from 'lucide-react';

const ENLACE_BASE =
  'flex min-w-[3.75rem] flex-col items-center gap-1 rounded-xl px-2 py-2 text-[0.65rem] font-medium transition-colors sm:min-w-[5rem] sm:px-3 sm:text-xs md:min-w-[5.5rem] md:text-sm';

export function NavegacionInferior() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur-sm pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex w-full max-w-7xl items-stretch justify-around px-1 sm:justify-center sm:gap-6 md:gap-10 lg:gap-16">
        <NavLink
          to="/inicio"
          className={({ isActive }) =>
            [
              ENLACE_BASE,
              isActive
                ? 'text-sky-600'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800',
            ].join(' ')
          }
        >
          <Home className="h-6 w-6 sm:h-7 sm:w-7" />
          <span>Panel de control</span>
        </NavLink>

        <NavLink
          to="/presupuestos"
          className={({ isActive }) =>
            [
              ENLACE_BASE,
              isActive
                ? 'text-sky-600'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800',
            ].join(' ')
          }
        >
          <FileText className="h-6 w-6 sm:h-7 sm:w-7" />
          <span>Presupuestos</span>
        </NavLink>

        <NavLink
          to="/catalogo"
          className={({ isActive }) =>
            [
              ENLACE_BASE,
              isActive
                ? 'text-sky-600'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800',
            ].join(' ')
          }
        >
          <BookOpen className="h-6 w-6 sm:h-7 sm:w-7" />
          <span>Catálogo</span>
        </NavLink>

        <NavLink
          to="/perfil"
          className={({ isActive }) =>
            [
              ENLACE_BASE,
              isActive
                ? 'text-sky-600'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800',
            ].join(' ')
          }
        >
          <User className="h-6 w-6 sm:h-7 sm:w-7" />
          <span>Perfil</span>
        </NavLink>
      </div>
    </nav>
  );
}
