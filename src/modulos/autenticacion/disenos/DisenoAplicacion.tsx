import { Outlet } from 'react-router-dom';
import { NavegacionInferior } from '../componentes/NavegacionInferior';

const CONTENEDOR =
  'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8';

export function DisenoAplicacion() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <main className={`${CONTENEDOR} min-h-screen pb-24 pt-6 sm:pt-8`}>
        <Outlet />
      </main>
      <NavegacionInferior />
    </div>
  );
}
