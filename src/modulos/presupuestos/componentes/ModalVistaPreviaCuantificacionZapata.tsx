import { Modal } from '../../autenticacion/componentes/ui/Modal';
import { TablaApuZapata } from './TablaApuZapata';
import { formatearMonto, type ApuZapata } from '../tipos/presupuestos.tipos';

type ModalVistaPreviaCuantificacionZapataProps = {
  abierto: boolean;
  apu: ApuZapata | null;
  cargando?: boolean;
  error?: string | null;
  subtitulo?: string;
  onCerrar: () => void;
};

export function ModalVistaPreviaCuantificacionZapata({
  abierto,
  apu,
  cargando = false,
  error = null,
  subtitulo,
  onCerrar,
}: ModalVistaPreviaCuantificacionZapataProps) {
  return (
    <Modal
      abierto={abierto}
      titulo="Vista previa de cuantificación"
      tamano="xl"
      onCerrar={onCerrar}
    >
      <div className="grid gap-4">
        {subtitulo ? <p className="text-sm text-gray-500">{subtitulo}</p> : null}

        {cargando ? (
          <p className="rounded-xl bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
            Calculando materiales, mano de obra y equipo...
          </p>
        ) : null}

        {error ? (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
        ) : null}

        {apu && !cargando ? (
          <div className="grid gap-4">
            <div className="grid gap-3 rounded-2xl border border-sky-100 bg-sky-50/70 p-4 sm:grid-cols-3">
              <ResumenDato etiqueta="Total" valor={formatearMonto(apu.resumen.total)} destacado />
              <ResumenDato
                etiqueta="Precio / zapata"
                valor={formatearMonto(apu.resumen.precioUnitario)}
              />
              <ResumenDato
                etiqueta="Costo directo"
                valor={formatearMonto(apu.resumen.costoDirecto)}
              />
            </div>

            <TablaApuZapata apu={apu} compacto />
          </div>
        ) : null}
      </div>
    </Modal>
  );
}

function ResumenDato({
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
      <p className="text-[10px] font-semibold uppercase tracking-wide text-sky-700/70">{etiqueta}</p>
      <p
        className={[
          'mt-1 text-lg font-bold tabular-nums',
          destacado ? 'text-sky-800' : 'text-sky-900',
        ].join(' ')}
      >
        {valor}
      </p>
    </div>
  );
}
