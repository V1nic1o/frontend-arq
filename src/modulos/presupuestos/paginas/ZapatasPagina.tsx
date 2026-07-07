import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { FormularioZapata } from '../componentes/FormularioZapata';
import { ColaElementosIndicador } from '../componentes/ColaElementos';
import { LayoutPresupuesto, PanelPresupuesto } from '../componentes/LayoutPresupuesto';
import { PasosFlujoPresupuesto } from '../componentes/PasosFlujoPresupuesto';
import { PieFlujoCuantificacion } from '../componentes/PieFlujoCuantificacion';
import {
  cuantificarZapata,
  obtenerPresupuesto,
} from '../servicios/presupuestos.servicio';
import {
  rutaElementosPresupuesto,
  rutaPresupuesto,
  type ElementoPresupuesto,
  type PresupuestoDetalle,
} from '../tipos/presupuestos.tipos';

export function ZapatasPagina() {
  const { presupuestoId } = useParams<{ presupuestoId: string }>();
  const [presupuesto, setPresupuesto] = useState<PresupuestoDetalle | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  const cargarPresupuesto = useCallback(async (silencioso = false) => {
    if (!presupuestoId) {
      return;
    }

    if (!silencioso) {
      setCargando(true);
    }
    setError(null);

    try {
      const datos = await obtenerPresupuesto(presupuestoId);
      setPresupuesto(datos);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar el presupuesto');
    } finally {
      if (!silencioso) {
        setCargando(false);
      }
    }
  }, [presupuestoId]);

  useEffect(() => {
    void cargarPresupuesto();
  }, [cargarPresupuesto]);

  if (!presupuestoId) {
    return null;
  }

  const zapatas = (presupuesto?.elementos ?? []).filter(
    (elemento): elemento is ElementoPresupuesto & { zapata: NonNullable<ElementoPresupuesto['zapata']> } =>
      elemento.tipo === 'ZAPATA' && elemento.zapata !== null,
  );

  function mostrarExito(mensaje: string) {
    setMensajeExito(mensaje);
    setTimeout(() => setMensajeExito(null), 4000);
  }

  function manejarZapataAgregada() {
    void cargarPresupuesto(true);
    mostrarExito('Zapata agregada correctamente.');
  }

  const contadorZapatas =
    zapatas.length > 0 ? (
      <span className="inline-flex items-center rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-100">
        {zapatas.length} {zapatas.length === 1 ? 'zapata' : 'zapatas'}
      </span>
    ) : null;

  return (
    <LayoutPresupuesto
      volverA={rutaElementosPresupuesto(presupuestoId)}
      etiquetaVolver="Elementos"
      migas={[
        { etiqueta: 'Presupuestos', ruta: '/presupuestos' },
        { etiqueta: presupuesto?.proyecto ?? '...', ruta: rutaPresupuesto(presupuestoId) },
        { etiqueta: 'Elementos', ruta: rutaElementosPresupuesto(presupuestoId) },
        { etiqueta: 'Zapatas' },
      ]}
      titulo="Agregar zapatas"
      subtitulo="Completa las medidas y agrega cada tipo de zapata. Los costos los revisas después en el presupuesto."
      accion={contadorZapatas}
    >
      <PasosFlujoPresupuesto pasoActivo={2} />
      <ColaElementosIndicador presupuestoId={presupuestoId} tipoActual="ZAPATA" />

      {mensajeExito ? (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
          <span>{mensajeExito}</span>
        </div>
      ) : null}

      {cargando ? <p className="text-sm text-gray-500">Cargando...</p> : null}
      {error ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      ) : null}

      {presupuesto ? (
        <div className="grid w-full gap-5 pb-28 sm:pb-10">
          <PanelPresupuesto titulo="Nueva zapata">
            <div className="bg-gray-50/60 p-4 sm:p-6">
              <FormularioZapata
                presupuestoId={presupuestoId}
                cuantificarZapata={(entrada) => cuantificarZapata(presupuestoId, entrada)}
                onGuardado={manejarZapataAgregada}
              />
            </div>
          </PanelPresupuesto>

          <PieFlujoCuantificacion
            presupuestoId={presupuestoId}
            tipoActual="ZAPATA"
            cantidadRegistros={zapatas.length}
            etiquetaRegistro={zapatas.length === 1 ? 'zapata agregada' : 'zapatas agregadas'}
          />
        </div>
      ) : null}
    </LayoutPresupuesto>
  );
}
