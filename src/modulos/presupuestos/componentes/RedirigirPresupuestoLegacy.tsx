import { Navigate, useParams } from 'react-router-dom';

type RedirigirPresupuestoLegacyProps = {
  destino: 'elementos' | 'zapatas';
};

export function RedirigirPresupuestoLegacy({ destino }: RedirigirPresupuestoLegacyProps) {
  const { presupuestoId } = useParams<{ presupuestoId: string }>();

  if (!presupuestoId) {
    return <Navigate to="/presupuestos" replace />;
  }

  return <Navigate to={`/presupuestos/${presupuestoId}/${destino}`} replace />;
}
