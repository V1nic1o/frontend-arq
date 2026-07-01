import { formatearMonto, ETIQUETAS_TIPO_LINEA, type ResumenCostos } from '../tipos/presupuestos.tipos';

type ResumenCostosPanelProps = {
  resumen: ResumenCostos;
  total: number;
  titulo?: string;
};

export function ResumenCostosPanel({ resumen, total, titulo = 'Resumen' }: ResumenCostosPanelProps) {
  const tipos = Object.keys(ETIQUETAS_TIPO_LINEA) as (keyof typeof ETIQUETAS_TIPO_LINEA)[];

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:p-5">
      <h3 className="text-sm font-semibold text-gray-900">{titulo}</h3>
      <dl className="mt-3 space-y-2">
        {tipos.map((tipo) =>
          resumen[tipo] > 0 ? (
            <div key={tipo} className="flex items-center justify-between text-sm">
              <dt className="text-gray-600">{ETIQUETAS_TIPO_LINEA[tipo]}</dt>
              <dd className="font-medium text-gray-900">{formatearMonto(resumen[tipo])}</dd>
            </div>
          ) : null,
        )}
      </dl>
      <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
        <span className="text-sm font-semibold text-gray-900">Total</span>
        <span className="text-lg font-bold text-sky-700">{formatearMonto(total)}</span>
      </div>
    </div>
  );
}
