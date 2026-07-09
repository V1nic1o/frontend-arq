import { FormEvent, useMemo, useState, type ReactNode } from 'react';
import {
  Box,
  Calculator,
  Hammer,
  Layers3,
  Plus,
  Shovel,
  type LucideIcon,
} from 'lucide-react';
import { Boton } from '../../autenticacion/componentes/ui/Boton';
import { PieAccionesFormulario } from '../../autenticacion/componentes/ui/PieAccionesFormulario';
import { CampoSelect } from '../../autenticacion/componentes/ui/CampoSelect';
import { CampoTexto } from '../../autenticacion/componentes/ui/CampoTexto';
import { ModalVistaPreviaCuantificacionZapata } from './ModalVistaPreviaCuantificacionZapata';
import { TablaApuZapata } from './TablaApuZapata';
import { previsualizarCuantificacionZapata } from '../servicios/presupuestos.servicio';
import type {
  ApuZapata,
  CuantificarZapataEntrada,
  ElementoPresupuesto,
} from '../tipos/presupuestos.tipos';

type FormularioZapataProps = {
  onGuardado: (elemento: ElementoPresupuesto) => void;
  onCancelar?: () => void;
  cuantificarZapata: (entrada: CuantificarZapataEntrada) => Promise<ElementoPresupuesto>;
  presupuestoId?: string;
  abrirVistaPreviaTrasGuardar?: boolean;
  compacto?: boolean;
  mostrarApuAlGuardar?: boolean;
  valoresIniciales?: CuantificarZapataEntrada;
  modo?: 'crear' | 'editar';
};

const DIAMETROS_ACERO = ['3/8"', '1/2"', '5/8"', '3/4"', '1"'];

const OPCIONES_DIAMETRO = DIAMETROS_ACERO.map((diametro) => ({
  valor: diametro,
  etiqueta: diametro,
}));

const OPCIONES_AMBOS_SENTIDOS = [
  { valor: 'si', etiqueta: 'Sí' },
  { valor: 'no', etiqueta: 'No' },
];

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

function SeccionFormulario({
  titulo,
  descripcion,
  icono: Icono,
  children,
  className = '',
  compacto = false,
}: {
  titulo: string;
  descripcion?: string;
  icono: LucideIcon;
  children: ReactNode;
  className?: string;
  compacto?: boolean;
}) {
  return (
    <section
      className={[
        'rounded-2xl border border-gray-200/80 bg-white shadow-sm',
        compacto ? 'p-3 sm:p-4' : 'p-4 sm:p-5',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={['flex items-start gap-3', compacto ? 'mb-3' : 'mb-4'].join(' ')}>
        <div
          className={[
            'flex shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600 ring-1 ring-sky-100',
            compacto ? 'h-9 w-9' : 'h-10 w-10',
          ].join(' ')}
        >
          <Icono className="h-4 w-4" aria-hidden />
        </div>
        <div className="min-w-0 pt-0.5">
          <h3 className="text-sm font-semibold text-gray-900">{titulo}</h3>
          {descripcion && !compacto ? (
            <p className="mt-0.5 text-xs leading-relaxed text-gray-500">{descripcion}</p>
          ) : null}
        </div>
      </div>
      {children}
    </section>
  );
}

function formatearMedida(valor: string) {
  const numero = Number(valor);
  return Number.isFinite(numero) ? numero.toFixed(2) : valor;
}

export function FormularioZapata({
  onGuardado,
  onCancelar,
  cuantificarZapata,
  presupuestoId,
  abrirVistaPreviaTrasGuardar = true,
  compacto = false,
  mostrarApuAlGuardar = false,
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
  const [ultimaCuantificacion, setUltimaCuantificacion] = useState<ElementoPresupuesto | null>(
    null,
  );
  const [modalVistaPreviaAbierto, setModalVistaPreviaAbierto] = useState(false);
  const [apuVistaPrevia, setApuVistaPrevia] = useState<ApuZapata | null>(null);
  const [cargandoVistaPrevia, setCargandoVistaPrevia] = useState(false);
  const [errorVistaPrevia, setErrorVistaPrevia] = useState<string | null>(null);

  const resumenMedidas = useMemo(() => {
    const unidades = Number(cantidad);
    const medidas = [largo, ancho, espesor].every((valor) => valor.trim() !== '');

    if (!medidas) {
      return null;
    }

    const textoUnidades = Number.isFinite(unidades) && unidades > 0 ? `${unidades} und` : '— und';
    return `${textoUnidades} · ${formatearMedida(largo)} × ${formatearMedida(ancho)} × ${formatearMedida(espesor)} m · f'c ${resistenciaConcreto} PSI · ${diametroAcero}`;
  }, [ancho, cantidad, diametroAcero, espesor, largo, resistenciaConcreto]);

  function obtenerEntradaDesdeForm(): CuantificarZapataEntrada {
    return {
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
    };
  }

  function abrirModalVistaPrevia(apu: ApuZapata) {
    setApuVistaPrevia(apu);
    setErrorVistaPrevia(null);
    setModalVistaPreviaAbierto(true);
  }

  async function manejarVerCuantificacion() {
    if (!presupuestoId) {
      return;
    }

    setCargandoVistaPrevia(true);
    setErrorVistaPrevia(null);
    setModalVistaPreviaAbierto(true);
    setApuVistaPrevia(null);

    try {
      const apu = await previsualizarCuantificacionZapata(presupuestoId, obtenerEntradaDesdeForm());
      if (!apu) {
        throw new Error('No se pudo calcular la cuantificación');
      }
      setApuVistaPrevia(apu);
    } catch (err: unknown) {
      setErrorVistaPrevia(
        err instanceof Error ? err.message : 'No se pudo calcular la vista previa',
      );
    } finally {
      setCargandoVistaPrevia(false);
    }
  }

  async function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError(null);
    setEnviando(true);
    setUltimaCuantificacion(null);

    try {
      const elemento = await cuantificarZapata(obtenerEntradaDesdeForm());
      setUltimaCuantificacion(elemento);
      onGuardado(elemento);

      if (
        abrirVistaPreviaTrasGuardar &&
        presupuestoId &&
        modo === 'crear' &&
        elemento.apuZapata
      ) {
        abrirModalVistaPrevia(elemento.apuZapata);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'No se pudo cuantificar la zapata');
    } finally {
      setEnviando(false);
    }
  }

  const grillaDimensiones = compacto
    ? 'grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4'
    : 'grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-5';
  const grillaTecnica = compacto
    ? 'grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4'
    : 'grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4';
  const grillaInferior = compacto
    ? 'grid gap-4'
    : 'grid gap-4 lg:grid-cols-2 xl:grid-cols-12';
  const grillaExcavacion = compacto
    ? 'grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4'
    : 'grid grid-cols-2 gap-3 sm:gap-4';

  const puedeVerCuantificacion = Boolean(presupuestoId) && modo === 'crear';

  return (
    <>
    <form className="grid gap-4" onSubmit={manejarEnvio}>
      {resumenMedidas && modo === 'crear' ? (
        <div className="flex flex-col gap-2 rounded-2xl border border-sky-100 bg-sky-50/70 px-4 py-3 sm:flex-row sm:items-center sm:gap-3">
          <div className="flex items-center gap-2 text-sky-700">
            <Layers3 className="h-4 w-4 shrink-0" aria-hidden />
            <p className="text-[11px] font-semibold uppercase tracking-wide text-sky-700/80">
              Medidas ingresadas
            </p>
          </div>
          <p className="min-w-0 text-sm font-medium text-sky-900 sm:flex-1">{resumenMedidas}</p>
        </div>
      ) : null}

      <SeccionFormulario
        compacto={compacto}
        icono={Box}
        titulo="Dimensiones"
        descripcion="Cantidad y medidas de la zapata en metros."
      >
        <div className={grillaDimensiones}>
          <CampoTexto
            etiqueta="Cantidad"
            name="cantidad"
            type="number"
            min={1}
            inputMode="numeric"
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
            inputMode="decimal"
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
            inputMode="decimal"
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
            inputMode="decimal"
            value={espesor}
            onChange={(evento) => setEspesor(evento.target.value)}
            required
          />
        </div>
      </SeccionFormulario>

      <div className={grillaInferior}>
        <SeccionFormulario
          className={compacto ? undefined : 'xl:col-span-4'}
          compacto={compacto}
          icono={Shovel}
          titulo="Excavación"
          descripcion="Profundidad de corte y recubrimiento del acero."
        >
          <div className={grillaExcavacion}>
            <CampoTexto
              etiqueta="Profundidad (m)"
              name="profundidad"
              type="number"
              min={0}
              step="0.01"
              inputMode="decimal"
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
              inputMode="decimal"
              value={recubrimiento}
              onChange={(evento) => setRecubrimiento(evento.target.value)}
              required
            />
          </div>
        </SeccionFormulario>

        <SeccionFormulario
          className={compacto ? undefined : 'xl:col-span-8'}
          compacto={compacto}
          icono={Hammer}
          titulo="Acero y concreto"
          descripcion="Refuerzo y resistencia del concreto."
        >
          <div className={grillaTecnica}>
            <CampoSelect
              etiqueta="Diámetro"
              name="diametroAcero"
              value={diametroAcero}
              onChange={(evento) => setDiametroAcero(evento.target.value)}
              opciones={OPCIONES_DIAMETRO}
              required
            />
            <CampoTexto
              etiqueta="Espaciamiento (m)"
              name="espaciamientoVarillas"
              type="number"
              min={0}
              step="0.01"
              inputMode="decimal"
              value={espaciamientoVarillas}
              onChange={(evento) => setEspaciamientoVarillas(evento.target.value)}
              required
            />
            <CampoSelect
              etiqueta="Ambos sentidos"
              name="ambosSentidos"
              value={ambosSentidos ? 'si' : 'no'}
              onChange={(evento) => setAmbosSentidos(evento.target.value === 'si')}
              opciones={OPCIONES_AMBOS_SENTIDOS}
              placeholder="Seleccionar"
              required
            />
            <CampoTexto
              etiqueta="Resistencia f'c (PSI)"
              name="resistenciaConcreto"
              type="number"
              min={1000}
              step={100}
              inputMode="numeric"
              value={resistenciaConcreto}
              onChange={(evento) => setResistenciaConcreto(evento.target.value)}
              required
            />
          </div>
        </SeccionFormulario>
      </div>

      {error ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      ) : null}

      {mostrarApuAlGuardar && ultimaCuantificacion?.apuZapata ? (
        <div className="rounded-2xl border border-sky-100 bg-sky-50/50 p-4">
          <p className="mb-3 text-sm font-semibold text-sky-800">Análisis de precio unitario</p>
          <TablaApuZapata apu={ultimaCuantificacion.apuZapata} compacto />
        </div>
      ) : null}

      <PieAccionesFormulario>
        {onCancelar ? (
          <Boton type="button" variante="secundario" onClick={onCancelar}>
            Cancelar
          </Boton>
        ) : null}
        {puedeVerCuantificacion ? (
          <Boton
            type="button"
            variante="secundario"
            disabled={enviando || cargandoVistaPrevia}
            onClick={() => void manejarVerCuantificacion()}
          >
            <span className="inline-flex items-center justify-center gap-2">
              <Calculator className="h-4 w-4" />
              {cargandoVistaPrevia ? 'Calculando...' : 'Ver cuantificación'}
            </span>
          </Boton>
        ) : null}
        <Boton type="submit" disabled={enviando}>
          <span className="inline-flex items-center justify-center gap-2">
            {modo === 'editar' ? null : <Plus className="h-4 w-4" />}
            {enviando
              ? 'Calculando...'
              : modo === 'editar'
                ? 'Guardar cambios'
                : 'Agregar zapata'}
          </span>
        </Boton>
      </PieAccionesFormulario>
    </form>

    <ModalVistaPreviaCuantificacionZapata
      abierto={modalVistaPreviaAbierto}
      apu={apuVistaPrevia}
      cargando={cargandoVistaPrevia}
      error={errorVistaPrevia}
      subtitulo="Cemento, hierro, arena, piedrín, mano de obra y equipo según las medidas ingresadas."
      onCerrar={() => setModalVistaPreviaAbierto(false)}
    />
    </>
  );
}
