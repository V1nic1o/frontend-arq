import { type InputHTMLAttributes } from 'react';
import type { LucideIcon } from 'lucide-react';

type CampoTextoProps = InputHTMLAttributes<HTMLInputElement> & {
  etiqueta: string;
  error?: string;
  icono?: LucideIcon;
  tamano?: 'md' | 'lg';
};

const ESTILO_CAMPO_BASE =
  'w-full min-w-0 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 transition-colors focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20';

const ESTILOS_TAMANO = {
  md: 'px-3 py-2.5 text-sm',
  lg: 'px-3.5 py-3 text-sm',
} as const;

export function CampoTexto({
  etiqueta,
  error,
  icono: Icono,
  tamano = 'md',
  id,
  className = '',
  required,
  ...props
}: CampoTextoProps) {
  const campoId = id ?? props.name;

  return (
    <label className={`grid min-w-0 gap-1.5 ${className}`.trim()} htmlFor={campoId}>
      <span className="text-sm font-medium text-gray-700">
        {etiqueta}
        {required ? <span className="text-red-500"> *</span> : null}
      </span>
      <div className="relative">
        {Icono ? (
          <Icono
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            aria-hidden
          />
        ) : null}
        <input
          id={campoId}
          className={[
            ESTILO_CAMPO_BASE,
            ESTILOS_TAMANO[tamano],
            Icono ? 'pl-9' : '',
          ].join(' ')}
          required={required}
          {...props}
        />
      </div>
      {error ? <span className="text-xs text-red-500">{error}</span> : null}
    </label>
  );
}

export const ESTILO_CAMPO = `${ESTILO_CAMPO_BASE} px-3 py-2.5 text-sm`;
export { ESTILO_CAMPO_BASE };
