import type { ReactNode } from 'react';

type PieAccionesFormularioProps = {
  children: ReactNode;
  className?: string;
};

export function PieAccionesFormulario({ children, className = '' }: PieAccionesFormularioProps) {
  return (
    <div
      className={[
        'grid grid-cols-1 gap-3 border-t border-gray-200/80 pt-4',
        'sm:[grid-template-columns:repeat(auto-fit,minmax(0,1fr))]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}
