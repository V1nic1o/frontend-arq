import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { CategoriaApuZapata } from '../tipos/presupuestos.tipos';

export function calcularResumenVinculosApu(lineas: {
  desdeCatalogo: boolean;
  categoria: CategoriaApuZapata;
}[]) {
  const total = lineas.length;
  const vinculados = lineas.filter((linea) => linea.desdeCatalogo).length;
  const sinVincular = total - vinculados;

  return {
    total,
    vinculados,
    sinVincular,
    porCategoria: {
      MATERIAL: lineas.filter((l) => !l.desdeCatalogo && l.categoria === 'MATERIAL').length,
      MANO_OBRA: lineas.filter((l) => !l.desdeCatalogo && l.categoria === 'MANO_OBRA').length,
      MAQUINARIA_EQUIPO: lineas.filter(
        (l) => !l.desdeCatalogo && l.categoria === 'MAQUINARIA_EQUIPO',
      ).length,
    },
  };
}

const ETIQUETAS_CATEGORIA: Record<CategoriaApuZapata, string> = {
  MATERIAL: 'materiales',
  MANO_OBRA: 'mano de obra',
  MAQUINARIA_EQUIPO: 'maquinaria',
};

function textoFaltantes(porCategoria: ReturnType<typeof calcularResumenVinculosApu>['porCategoria']) {
  const partes = (Object.entries(porCategoria) as [CategoriaApuZapata, number][])
    .filter(([, cantidad]) => cantidad > 0)
    .map(([categoria, cantidad]) => `${cantidad} ${ETIQUETAS_CATEGORIA[categoria]}`);

  return partes.join(', ');
}

type ResumenVinculosApuProps = {
  lineas: { desdeCatalogo: boolean; categoria: CategoriaApuZapata }[];
  compacto?: boolean;
};

export function ResumenVinculosApu({ lineas, compacto = false }: ResumenVinculosApuProps) {
  const resumen = calcularResumenVinculosApu(lineas);

  if (resumen.total === 0) {
    return null;
  }

  if (resumen.sinVincular === 0) {
    return (
      <div className="flex flex-wrap items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-800">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          Las {resumen.total} partidas del APU usan precios de tu catálogo.{' '}
          {!compacto ? (
            <Link
              to="/catalogo/apu-zapata/vinculos"
              className="font-medium underline decoration-emerald-300 underline-offset-2 hover:text-emerald-900"
            >
              Revisar vínculos
            </Link>
          ) : null}
        </p>
      </div>
    );
  }

  const detalle = textoFaltantes(resumen.porCategoria);

  return (
    <div className="flex flex-wrap items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm text-amber-900">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="font-medium">
          Te faltan {resumen.sinVincular} de {resumen.total} vínculos con tu catálogo
          {detalle ? ` (${detalle})` : ''}.
        </p>
        <p className="mt-1 text-amber-800/90">
          Esas partidas usan precio referencia. El total del presupuesto puede no coincidir con tu
          Excel hasta que las vincules.
        </p>
        <Link
          to="/catalogo/apu-zapata/vinculos"
          className="mt-2 inline-flex font-medium text-amber-950 underline decoration-amber-300 underline-offset-2 hover:text-amber-900"
        >
          Ir a vínculos APU zapata →
        </Link>
      </div>
    </div>
  );
}
