import { type ReactNode } from 'react';

type TarjetaProps = {
  titulo?: string;
  descripcion?: string;
  children: ReactNode;
  className?: string;
};

export function Tarjeta({
  titulo,
  descripcion,
  children,
  className = '',
}: TarjetaProps) {
  return (
    <section
      className={[
        'w-full rounded-2xl border border-gray-200 bg-white p-5 shadow-sm',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {titulo ? (
        <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">{titulo}</h2>
      ) : null}
      {descripcion ? (
        <p className="mt-1.5 text-sm leading-relaxed text-gray-500 sm:text-base">
          {descripcion}
        </p>
      ) : null}
      <div className={titulo || descripcion ? 'mt-4' : ''}>{children}</div>
    </section>
  );
}
