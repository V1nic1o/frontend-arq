import { type ReactNode } from 'react';

type TarjetaPerfilProps = {
  etiqueta: string;
  avatar: ReactNode;
  titulo: string;
  subtitulo: string;
  insignia?: string;
  children?: ReactNode;
  className?: string;
};

export function TarjetaPerfil({
  etiqueta,
  avatar,
  titulo,
  subtitulo,
  insignia,
  children,
  className = '',
}: TarjetaPerfilProps) {
  return (
    <section
      className={[
        'w-full rounded-2xl border border-gray-200 bg-gradient-to-br from-sky-50 to-white p-5 shadow-sm sm:p-6',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{etiqueta}</p>

      <div className="mt-4 flex items-center gap-4 sm:gap-5">
        {avatar}
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-lg font-bold text-gray-900 sm:text-xl">{titulo}</h2>
          <p className="mt-1 truncate text-sm text-gray-500 sm:text-base">{subtitulo}</p>
          {insignia ? (
            <span className="mt-2 inline-flex rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 sm:text-sm">
              {insignia}
            </span>
          ) : null}
        </div>
      </div>

      {children ? <div className="mt-5 space-y-4">{children}</div> : null}
    </section>
  );
}

export function CampoTarjetaPerfil({
  etiqueta,
  valor,
  destacado = false,
}: {
  etiqueta: string;
  valor: string;
  destacado?: boolean;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{etiqueta}</p>
      <p
        className={[
          'mt-1 text-base text-gray-900',
          destacado ? 'font-semibold' : 'font-normal',
        ].join(' ')}
      >
        {valor}
      </p>
    </div>
  );
}
