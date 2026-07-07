import { formatearDecimal, ResultadoCalculadora } from './ResultadoCalculadora';
import type { SugerenciaCuantificacion } from '../tipos/presupuestos.tipos';

const ETIQUETAS: Record<SugerenciaCuantificacion['concepto'], string> = {
  CEMENTO: 'Cemento',
  HIERRO: 'Hierro',
  ARENA: 'Arena',
  PIEDRIN: 'Piedrín',
  MANO_OBRA: 'Mano de obra',
  MAQUINARIA_EQUIPO: 'Maquinaria y equipo',
};

type ResumenMaterialesZapataProps = {
  sugerencias: SugerenciaCuantificacion[];
  compacto?: boolean;
};

export function ResumenMaterialesZapata({
  sugerencias,
  compacto = false,
}: ResumenMaterialesZapataProps) {
  if (sugerencias.length === 0) {
    return null;
  }

  return (
    <div
      className={[
        'grid gap-3',
        compacto ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
      ].join(' ')}
    >
      {sugerencias.map((sugerencia, indice) => (
        <ResultadoCalculadora
          key={sugerencia.concepto}
          etiqueta={ETIQUETAS[sugerencia.concepto]}
          valor={formatearDecimal(sugerencia.cantidad)}
          unidad={sugerencia.unidad}
          destacado={indice === 0}
        />
      ))}
    </div>
  );
}

export function sumarSugerenciasZapatas(
  sugerenciasPorElemento: SugerenciaCuantificacion[][],
): SugerenciaCuantificacion[] {
  const totales = new Map<SugerenciaCuantificacion['concepto'], SugerenciaCuantificacion>();

  for (const sugerencias of sugerenciasPorElemento) {
    for (const sugerencia of sugerencias) {
      const existente = totales.get(sugerencia.concepto);
      if (existente) {
        existente.cantidad += sugerencia.cantidad;
      } else {
        totales.set(sugerencia.concepto, { ...sugerencia });
      }
    }
  }

  const orden: SugerenciaCuantificacion['concepto'][] = [
    'CEMENTO',
    'HIERRO',
    'ARENA',
    'PIEDRIN',
    'MANO_OBRA',
    'MAQUINARIA_EQUIPO',
  ];

  return orden
    .map((concepto) => totales.get(concepto))
    .filter((sugerencia): sugerencia is SugerenciaCuantificacion => sugerencia !== undefined)
    .map((sugerencia) => ({
      ...sugerencia,
      cantidad: Math.round(sugerencia.cantidad * 10000) / 10000,
    }));
}
