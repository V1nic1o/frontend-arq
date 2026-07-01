import { FormEvent, useState, type ReactNode } from 'react';
import { Plus } from 'lucide-react';
import { Boton } from '../../autenticacion/componentes/ui/Boton';
import { CampoTexto, ESTILO_CAMPO } from '../../autenticacion/componentes/ui/CampoTexto';
import type { CuantificarZapataEntrada } from '../tipos/presupuestos.tipos';

type FormularioZapataProps = {
  onGuardado: () => void;
  onCancelar?: () => void;
  cuantificarZapata: (entrada: CuantificarZapataEntrada) => Promise<void>;
  compacto?: boolean;
  valoresIniciales?: CuantificarZapataEntrada;
  modo?: 'crear' | 'editar';
};

const DIAMETROS_ACERO = ['3/8"', '1/2"', '5/8"', '3/4"', '1"'];

const VALORES_DEFECTO: CuantificarZapataEntrada = {
  cantidad: 12,
  largo: 1.2,
  ancho: 1.2,
  espesor: 0.4,
  profundidad: 0.01,
  recubrimiento: 0.07,
  diametroAcero: '5/8"',
  espaciamientoVarillas: 0.12,
  ambosSentidos: true,
  resistenciaConcreto: 4000,
};

function valoresAString(v: CuantificarZapataEntrada) {
  return {
    cantidad: String(v.cantidad),
    largo: String(v.largo),
    ancho: String(v.ancho),
    espesor: String(v.espesor),
    profundidad: String(v.profundidad),
    recubrimiento: String(v.recubrimiento),
    diametroAcero: v.diametroAcero,
    espaciamientoVarillas: String(v.espaciamientoVarillas),
    ambosSentidos: v.ambosSentidos,
    resistenciaConcreto: String(v.resistenciaConcreto),
  };
}

function GrupoFormulario({
  titulo,
  children,
}: {
  titulo: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="grid gap-4">
      <legend className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {titulo}
      </legend>
      {children}
    </fieldset>
  );
}

export function FormularioZapata({
  onGuardado,
  onCancelar,
  cuantificarZapata,
  compacto = false,
  valoresIniciales,
  modo = 'crear',
}: FormularioZapataProps) {
  const iniciales = valoresAString(valoresIniciales ?? VALORES_DEFECTO);
  const [cantidad, setCantidad] = useState(iniciales.cantidad);
  const [largo, setLargo] = useState(iniciales.largo);
  const [ancho, setAncho] = useState(iniciales.ancho);
  const [espesor, setEspesor] = useState(iniciales.espesor);
  const [profundidad, setProfundidad] = useState(iniciales.profundidad);
  const [recubrimiento, setRecubrimiento] = useState(iniciales.recubrimiento);
  const [diametroAcero, setDiametroAcero] = useState(iniciales.diametroAcero);
  const [espaciamientoVarillas, setEspaciamientoVarillas] = useState(iniciales.espaciamientoVarillas);
  const [ambosSentidos, setAmbosSentidos] = useState(iniciales.ambosSentidos);
  const [resistenciaConcreto, setResistenciaConcreto] = useState(iniciales.resistenciaConcreto);
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError(null);
    setEnviando(true);

    try {
      await cuantificarZapata({
        cantidad: Number(cantidad),
        largo: Number(largo),
        ancho: Number(ancho),
        espesor: Number(espesor),
        profundidad: Number(profundidad),
        recubrimiento: Number(recubrimiento),
        diametroAcero,
        espaciamientoVarillas: Number(espaciamientoVarillas),
        ambosSentidos,
        resistenciaConcreto: Number(resistenciaConcreto),
      });
      onGuardado();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'No se pudo cuantificar la zapata');
    } finally {
      setEnviando(false);
    }
  }

  const columnas = compacto ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-2 lg:grid-cols-3';

  return (
    <form className="grid gap-6" onSubmit={manejarEnvio}>
      <GrupoFormulario titulo="Dimensiones">
        <div className={`grid gap-4 ${columnas}`}>
          <CampoTexto
            etiqueta="Cantidad"
            name="cantidad"
            type="number"
            min={1}
            value={cantidad}
            onChange={(evento) => setCantidad(evento.target.value)}
            required
          />
          <CampoTexto
            etiqueta="Largo (m)"
            name="largo"
            type="number"
            min={0}
            step="0.01"
            value={largo}
            onChange={(evento) => setLargo(evento.target.value)}
            required
          />
          <CampoTexto
            etiqueta="Ancho (m)"
            name="ancho"
            type="number"
            min={0}
            step="0.01"
            value={ancho}
            onChange={(evento) => setAncho(evento.target.value)}
            required
          />
          <CampoTexto
            etiqueta="Espesor (m)"
            name="espesor"
            type="number"
            min={0}
            step="0.01"
            value={espesor}
            onChange={(evento) => setEspesor(evento.target.value)}
            required
          />
        </div>
      </GrupoFormulario>

      <GrupoFormulario titulo="Excavación">
        <div className="grid gap-4 sm:grid-cols-2">
          <CampoTexto
            etiqueta="Profundidad (m)"
            name="profundidad"
            type="number"
            min={0}
            step="0.01"
            value={profundidad}
            onChange={(evento) => setProfundidad(evento.target.value)}
            required
          />
          <CampoTexto
            etiqueta="Recubrimiento (m)"
            name="recubrimiento"
            type="number"
            min={0}
            step="0.01"
            value={recubrimiento}
            onChange={(evento) => setRecubrimiento(evento.target.value)}
            required
          />
        </div>
      </GrupoFormulario>

      <GrupoFormulario titulo="Acero de refuerzo">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <label className="grid gap-1.5" htmlFor="diametro-acero">
            <span className="text-sm font-medium text-gray-700">Diámetro</span>
            <select
              id="diametro-acero"
              className={ESTILO_CAMPO}
              value={diametroAcero}
              onChange={(evento) => setDiametroAcero(evento.target.value)}
            >
              {DIAMETROS_ACERO.map((opcion) => (
                <option key={opcion} value={opcion}>
                  {opcion}
                </option>
              ))}
            </select>
          </label>
          <CampoTexto
            etiqueta="Espaciamiento (m)"
            name="espaciamientoVarillas"
            type="number"
            min={0}
            step="0.01"
            value={espaciamientoVarillas}
            onChange={(evento) => setEspaciamientoVarillas(evento.target.value)}
            required
          />
          <label className="grid gap-1.5" htmlFor="ambos-sentidos">
            <span className="text-sm font-medium text-gray-700">En ambos sentidos</span>
            <select
              id="ambos-sentidos"
              className={ESTILO_CAMPO}
              value={ambosSentidos ? 'si' : 'no'}
              onChange={(evento) => setAmbosSentidos(evento.target.value === 'si')}
            >
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </label>
        </div>
      </GrupoFormulario>

      <GrupoFormulario titulo="Concreto">
        <div className="max-w-xs">
          <CampoTexto
            etiqueta="Resistencia f'c (PSI)"
            name="resistenciaConcreto"
            type="number"
            min={1000}
            step={100}
            value={resistenciaConcreto}
            onChange={(evento) => setResistenciaConcreto(evento.target.value)}
            required
          />
        </div>
      </GrupoFormulario>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
        {onCancelar ? (
          <Boton type="button" variante="secundario" anchoCompleto={false} onClick={onCancelar}>
            Cancelar
          </Boton>
        ) : null}
        <Boton type="submit" anchoCompleto={false} disabled={enviando}>
          <span className="inline-flex items-center gap-2">
            {modo === 'editar' ? null : <Plus className="h-4 w-4" />}
            {enviando
              ? 'Calculando...'
              : modo === 'editar'
                ? 'Guardar cambios'
                : 'Agregar zapata'}
          </span>
        </Boton>
      </div>
    </form>
  );
}
