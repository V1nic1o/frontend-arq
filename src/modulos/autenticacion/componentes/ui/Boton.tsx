import { type ButtonHTMLAttributes } from 'react';

type BotonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variante?: 'primario' | 'secundario' | 'peligro';
  anchoCompleto?: boolean;
};

const ESTILOS_VARIANTE = {
  primario:
    'bg-sky-600 text-white hover:bg-sky-500 focus-visible:ring-sky-500',
  secundario:
    'border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 focus-visible:ring-gray-400',
  peligro:
    'bg-red-500 text-white hover:bg-red-400 focus-visible:ring-red-400',
} as const;

export function Boton({
  variante = 'primario',
  anchoCompleto = true,
  className = '',
  children,
  ...props
}: BotonProps) {
  return (
    <button
      className={[
        'rounded-xl px-4 py-3 text-sm font-semibold transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
        'disabled:cursor-not-allowed disabled:opacity-60',
        anchoCompleto ? 'w-full' : '',
        ESTILOS_VARIANTE[variante],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}
