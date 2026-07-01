export function ResultadoCalculadora({
  etiqueta,
  valor,
  unidad,
  destacado = false,
}: {
  etiqueta: string;
  valor: string;
  unidad: string;
  destacado?: boolean;
}) {
  return (
    <div
      className={[
        'rounded-xl border px-4 py-3',
        destacado
          ? 'border-sky-100 bg-sky-50'
          : 'border-gray-200 bg-gray-50',
      ].join(' ')}
    >
      <p
        className={[
          'text-xs font-semibold uppercase tracking-wide',
          destacado ? 'text-sky-600' : 'text-gray-400',
        ].join(' ')}
      >
        {etiqueta}
      </p>
      <p
        className={[
          'mt-1 text-lg font-semibold',
          destacado ? 'text-sky-700' : 'text-gray-900',
        ].join(' ')}
      >
        {valor}{' '}
        <span className="text-sm font-medium text-gray-500">{unidad}</span>
      </p>
    </div>
  );
}

export function formatearDecimal(valor: number | string) {
  return Number(valor).toFixed(2);
}
