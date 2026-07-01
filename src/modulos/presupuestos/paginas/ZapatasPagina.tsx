import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Calculator, ChevronDown, ChevronUp } from 'lucide-react';
import { FormularioZapata } from '../componentes/FormularioZapata';
import { ColaElementosIndicador } from '../componentes/ColaElementos';
import { LayoutPresupuesto, PanelPresupuesto } from '../componentes/LayoutPresupuesto';
import { PasosFlujoPresupuesto } from '../componentes/PasosFlujoPresupuesto';
import { PieFlujoCuantificacion } from '../componentes/PieFlujoCuantificacion';
import { formatearDecimal } from '../componentes/ResultadoCalculadora';
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
  const [formularioAbierto, setFormularioAbierto] = useState(true);

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

  const totales = zapatas.reduce(
    (acum, elemento) => ({
      concreto: acum.concreto + Number(elemento.zapata.concretoEstimado),
      acero: acum.acero + Number(elemento.zapata.aceroPesoTotal),
    }),
    { concreto: 0, acero: 0 },
  );

  function mostrarExito(mensaje: string) {
    setMensajeExito(mensaje);
    setTimeout(() => setMensajeExito(null), 3000);
  }

  function manejarZapataAgregada() {
    void cargarPresupuesto(true);
    setFormularioAbierto(false);
    mostrarExito('Zapata agregada al listado.');
  }

  const resumenPie =
    zapatas.length > 0
      ? `${formatearDecimal(totales.concreto)} m³ concreto · ${formatearDecimal(totales.acero)} kg acero`
      : undefined;

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
      titulo="Cuantificar zapatas"
      subtitulo="Agrega cada zapata con sus medidas. Al terminar, continúas al paso de presupuestar costos."
    >
      <PasosFlujoPresupuesto pasoActivo={2} />
      <ColaElementosIndicador presupuestoId={presupuestoId} tipoActual="ZAPATA" />

      {mensajeExito ? (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{mensajeExito}</p>
      ) : null}

      {cargando ? <p className="text-sm text-gray-500">Cargando...</p> : null}
      {error ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      ) : null}

      {presupuesto ? (
        <div className="grid gap-6">
          {zapatas.length > 0 ? (
            <PanelPresupuesto titulo={`Listado (${zapatas.length})`}>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[36rem] text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/80 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      <th className="px-4 py-3 sm:px-6">#</th>
                      <th className="px-4 py-3">Cantidad</th>
                      <th className="px-4 py-3">Dimensiones</th>
                      <th className="px-4 py-3">Concreto</th>
                      <th className="px-4 py-3 sm:pr-6">Acero</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {zapatas.map((elemento, indice) => (
                      <tr key={elemento.id} className="text-gray-700">
                        <td className="px-4 py-3.5 font-semibold text-gray-900 sm:px-6">
                          {indice + 1}
                        </td>
                        <td className="px-4 py-3.5">{elemento.zapata.cantidad} u</td>
                        <td className="px-4 py-3.5">
                          {formatearDecimal(elemento.zapata.largo)} ×{' '}
                          {formatearDecimal(elemento.zapata.ancho)} ×{' '}
                          {formatearDecimal(elemento.zapata.espesor)} m
                          <span className="mt-0.5 block text-xs text-gray-400">
                            f'c {elemento.zapata.resistenciaConcreto} PSI
                          </span>
                        </td>
                        <td className="px-4 py-3.5 font-medium text-sky-700">
                          {formatearDecimal(elemento.zapata.concretoEstimado)} m³
                        </td>
                        <td className="px-4 py-3.5 font-medium sm:pr-6">
                          {formatearDecimal(elemento.zapata.aceroPesoTotal)} kg
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-gray-200 bg-gray-50/50 font-semibold text-gray-900">
                      <td className="px-4 py-3 sm:px-6" colSpan={3}>
                        Totales
                      </td>
                      <td className="px-4 py-3 text-sky-700">
                        {formatearDecimal(totales.concreto)} m³
                      </td>
                      <td className="px-4 py-3 sm:pr-6">
                        {formatearDecimal(totales.acero)} kg
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </PanelPresupuesto>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-gray-400 shadow-sm">
                <Calculator className="h-6 w-6" />
              </div>
              <p className="mt-4 text-sm font-medium text-gray-900">Sin zapatas todavía</p>
              <p className="mt-1 text-sm text-gray-500">
                Completa el formulario de abajo para agregar la primera.
              </p>
            </div>
          )}

          <PanelPresupuesto>
            <button
              type="button"
              onClick={() => setFormularioAbierto((abierto) => !abierto)}
              className="flex w-full items-center justify-between px-4 py-4 text-left sm:px-6"
            >
              <div>
                <h2 className="text-sm font-semibold text-gray-900">
                  {zapatas.length > 0 ? 'Agregar otra zapata' : 'Datos de la zapata'}
                </h2>
                <p className="mt-0.5 text-xs text-gray-500">
                  Dimensiones, acero y resistencia del concreto
                </p>
              </div>
              {formularioAbierto ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </button>

            {formularioAbierto ? (
              <div className="border-t border-gray-100 px-4 pb-4 sm:px-6 sm:pb-6">
                <FormularioZapata
                  compacto={zapatas.length > 0}
                  cuantificarZapata={async (entrada) => {
                    await cuantificarZapata(presupuestoId, entrada);
                  }}
                  onGuardado={manejarZapataAgregada}
                />
              </div>
            ) : null}
          </PanelPresupuesto>

          <PieFlujoCuantificacion
            presupuestoId={presupuestoId}
            tipoActual="ZAPATA"
            cantidadRegistros={zapatas.length}
            etiquetaRegistro={zapatas.length === 1 ? 'zapata' : 'zapatas'}
            resumen={resumenPie}
            onAgregarOtro={() => setFormularioAbierto(true)}
          />
        </div>
      ) : null}
    </LayoutPresupuesto>
  );
}
