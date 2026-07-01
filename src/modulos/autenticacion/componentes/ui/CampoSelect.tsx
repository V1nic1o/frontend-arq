import { ChevronDown, type LucideIcon } from 'lucide-react';
import { type SelectHTMLAttributes } from 'react';
import { ESTILO_CAMPO } from './CampoTexto';

type OpcionSelect = {
  valor: string;
  etiqueta: string;
};

type CampoSelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> & {
  etiqueta: string;
  error?: string;
  icono?: LucideIcon;
  opciones: readonly OpcionSelect[];
  placeholder?: string;
};

export function CampoSelect({
  etiqueta,
  error,
  icono: Icono,
  opciones,
  placeholder = 'Seleccionar',
  id,
  className = '',
  required,
  value,
  disabled,
  ...props
}: CampoSelectProps) {
  const campoId = id ?? props.name;
  const sinValor = !value;

  return (
    <label className={`grid min-w-0 gap-1.5 ${className}`.trim()} htmlFor={campoId}>
      <span className="text-sm font-medium text-gray-700">
        {etiqueta}
        {required ? <span className="text-red-500"> *</span> : null}
      </span>
      <div className="relative">
        {Icono ? (
          <Icono
            className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-gray-400"
            aria-hidden
          />
        ) : null}
        <select
          id={campoId}
          className={[
            ESTILO_CAMPO,
            'appearance-none pr-9',
            Icono ? 'pl-9' : '',
            sinValor ? 'text-gray-400' : 'text-gray-900',
            disabled ? 'cursor-not-allowed bg-gray-50 text-gray-400' : 'bg-white',
          ].join(' ')}
          required={required}
          value={value}
          disabled={disabled}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {opciones.map((opcion) => (
            <option key={opcion.valor} value={opcion.valor} className="text-gray-900">
              {opcion.etiqueta}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
          aria-hidden
        />
      </div>
      {error ? <span className="text-xs text-red-500">{error}</span> : null}
    </label>
  );
}
