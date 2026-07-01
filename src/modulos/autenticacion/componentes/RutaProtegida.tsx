import { Navigate, Outlet } from 'react-router-dom';
import { PantallaCarga } from './PantallaCarga';
import { useAutenticacion } from '../contexto/AutenticacionContexto';

export function RutaProtegida() {
  const { usuario, cargando } = useAutenticacion();

  if (cargando) {
    return <PantallaCarga mensaje="Cargando sesión..." />;
  }

  if (!usuario) {
    return <Navigate to="/iniciar-sesion" replace />;
  }

  return <Outlet />;
}
