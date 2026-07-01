import { Navigate, Outlet } from 'react-router-dom';
import { PantallaCarga } from './PantallaCarga';
import { useAutenticacion } from '../contexto/AutenticacionContexto';

export function RutaSoloAdmin() {
  const { usuario, cargando } = useAutenticacion();

  if (cargando) {
    return <PantallaCarga mensaje="Cargando sesión..." />;
  }

  if (!usuario) {
    return <Navigate to="/iniciar-sesion" replace />;
  }

  if (usuario.rol !== 'SUPERADMIN' && usuario.rol !== 'ADMIN') {
    return <Navigate to="/perfil" replace />;
  }

  return <Outlet />;
}
