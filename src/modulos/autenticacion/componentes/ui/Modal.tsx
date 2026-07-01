import { type ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

type ModalProps = {
  abierto: boolean;
  titulo: string;
  onCerrar: () => void;
  children: ReactNode;
  tamano?: 'md' | 'lg';
};

const TAMANOS_MODAL = {
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
} as const;

export function Modal({ abierto, titulo, onCerrar, children, tamano = 'md' }: ModalProps) {
  useEffect(() => {
    if (!abierto) {
      return;
    }

    const manejarTecla = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') {
        onCerrar();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', manejarTecla);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', manejarTecla);
    };
  }, [abierto, onCerrar]);

  if (!abierto) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
      onClick={onCerrar}
      role="presentation"
    >
      <div
        className={[
          'relative flex w-full min-w-0 flex-col overflow-hidden bg-white shadow-xl',
          'max-h-[92dvh] sm:max-h-[calc(100dvh-2rem)]',
          'rounded-t-2xl sm:rounded-2xl sm:border sm:border-gray-200',
          TAMANOS_MODAL[tamano],
        ].join(' ')}
        onClick={(evento) => evento.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-titulo"
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-gray-100 px-4 py-3 sm:px-5 sm:py-4">
          <h2 id="modal-titulo" className="text-base font-semibold text-gray-900">
            {titulo}
          </h2>
          <button
            type="button"
            onClick={onCerrar}
            className="shrink-0 rounded-lg p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="min-h-0 overflow-y-auto overflow-x-hidden px-4 py-4 sm:px-5 sm:py-4">
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
