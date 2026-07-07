import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Boton } from '../../autenticacion/componentes/ui/Boton';
import { ESTILO_CAMPO } from '../../autenticacion/componentes/ui/CampoTexto';
import { LayoutCatalogo } from '../componentes/LayoutCatalogo';
import {
  calcularResumenVinculosApu,
  ResumenVinculosApu,
} from '../../presupuestos/componentes/ResumenVinculosApu';
import type { CategoriaApuZapata } from '../../presupuestos/tipos/presupuestos.tipos';
import {
  guardarVinculosApuZapata,
  listarItemsCatalogo,
  listarVinculosApuZapata,
  sugerirVinculosApuZapata,
  type ItemCatalogoConSeccion,
  type VinculoApuZapata,
} from '../servicios/catalogo.servicio';
import { formatearQuetzales } from '../tipos/catalogo.tipos';

const ETIQUETA_TIPO: Record<VinculoApuZapata['tipo'], string> = {
  MATERIAL: 'Material',
  MANO_OBRA: 'Mano de obra',
  MAQUINARIA_EQUIPO: 'Maquinaria y equipo',
  RENGLON: 'Renglón',
};

const TIPO_A_CATEGORIA: Record<VinculoApuZapata['tipo'], CategoriaApuZapata | null> = {
  MATERIAL: 'MATERIAL',
  MANO_OBRA: 'MANO_OBRA',
  MAQUINARIA_EQUIPO: 'MAQUINARIA_EQUIPO',
  RENGLON: null,
};

export function VincularApuZapataPagina() {
  const ubicacion = useLocation();
  const [vinculos, setVinculos] = useState<VinculoApuZapata[]>([]);
  const [itemsCatalogo, setItemsCatalogo] = useState<ItemCatalogoConSeccion[]>([]);
  const [seleccion, setSeleccion] = useState<Record<string, string>>({});
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [sugiriendo, setSugiriendo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const [listaVinculos, items] = await Promise.all([
        listarVinculosApuZapata(),
        listarItemsCatalogo(),
      ]);
      setVinculos(listaVinculos);
      setItemsCatalogo(items);
      setSeleccion(
        Object.fromEntries(
          listaVinculos.map((vinculo) => [vinculo.codigoApu, vinculo.itemCatalogoId ?? '']),
        ),
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los vínculos');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  const lineasApu = vinculos.filter((v) => v.codigoApu !== 'CFG-CI-ZAPATA');
  const configCi = vinculos.find((v) => v.codigoApu === 'CFG-CI-ZAPATA');

  const lineasResumen = useMemo(
    () =>
      lineasApu
        .map((vinculo) => {
          const categoria = TIPO_A_CATEGORIA[vinculo.tipo];
          if (!categoria) {
            return null;
          }

          return {
            categoria,
            desdeCatalogo: Boolean(seleccion[vinculo.codigoApu]),
          };
        })
        .filter((linea): linea is { categoria: CategoriaApuZapata; desdeCatalogo: boolean } =>
          Boolean(linea),
        ),
    [lineasApu, seleccion],
  );

  const resumenVinculos = useMemo(() => calcularResumenVinculosApu(lineasResumen), [lineasResumen]);

  useEffect(() => {
    if (!ubicacion.hash || cargando) {
      return;
    }

    const fila = document.getElementById(ubicacion.hash.slice(1));
    fila?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    fila?.classList.add('ring-2', 'ring-sky-300', 'bg-sky-50/50');

    const temporizador = window.setTimeout(() => {
      fila?.classList.remove('ring-2', 'ring-sky-300', 'bg-sky-50/50');
    }, 2500);

    return () => window.clearTimeout(temporizador);
  }, [ubicacion.hash, cargando, vinculos]);

  const itemsPorTipo = useMemo(
    () => ({
      MATERIAL: itemsCatalogo.filter((item) => item.seccion.tipo === 'MATERIAL'),
      MANO_OBRA: itemsCatalogo.filter((item) => item.seccion.tipo === 'MANO_OBRA'),
      MAQUINARIA_EQUIPO: itemsCatalogo.filter(
        (item) => item.seccion.tipo === 'MAQUINARIA_EQUIPO',
      ),
      RENGLON: itemsCatalogo.filter((item) => item.seccion.tipo === 'RENGLON'),
    }),
    [itemsCatalogo],
  );

  async function manejarSugerir() {
    setSugiriendo(true);
    setError(null);
    setMensaje(null);
    try {
      const resultado = await sugerirVinculosApuZapata();
      setVinculos(resultado.vinculos);
      setSeleccion(
        Object.fromEntries(
          resultado.vinculos.map((vinculo) => [vinculo.codigoApu, vinculo.itemCatalogoId ?? '']),
        ),
      );
      setMensaje(
        resultado.sugeridos > 0
          ? `Se vincularon automáticamente ${resultado.sugeridos} partida(s) según tus secciones (01-CEMENTOS, 02-ARENA, etc.).`
          : 'No se encontraron coincidencias nuevas. Revisa que cada sección tenga al menos un ítem con precio.',
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'No se pudieron sugerir vínculos');
    } finally {
      setSugiriendo(false);
    }
  }

  async function manejarGuardar() {
    setGuardando(true);
    setError(null);
    setMensaje(null);
    try {
      const actualizados = await guardarVinculosApuZapata(
        vinculos.map((vinculo) => ({
          codigoApu: vinculo.codigoApu,
          itemCatalogoId: seleccion[vinculo.codigoApu] || null,
        })),
      );
      setVinculos(actualizados);
      setMensaje('Vínculos guardados. Los precios del APU de zapata usarán tu catálogo.');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'No se pudieron guardar los vínculos');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <LayoutCatalogo
      volverA="/catalogo"
      etiquetaVolver="Catálogo"
      migas={[
        { etiqueta: 'Catálogo', ruta: '/catalogo' },
        { etiqueta: 'Vínculos APU zapata' },
      ]}
      titulo="Vínculos APU zapata"
      subtitulo="Conecta cada partida del análisis de precio con el ítem de tu catálogo. Usa tus códigos y secciones como 01-CEMENTOS."
    >
      <div className="rounded-2xl border border-sky-100 bg-sky-50/60 p-5">
        <p className="text-sm leading-relaxed text-gray-700">
          Fernando puede seguir creando secciones y códigos a su manera. Aquí solo eliges{' '}
          <strong>qué ítem de tu catálogo</strong> corresponde a cemento, arena, acero, etc. Si tus
          secciones se llaman <em>01-CEMENTOS</em>, <em>02-ARENA</em>, la app puede sugerir los
          vínculos sola.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Boton
            type="button"
            anchoCompleto={false}
            variante="secundario"
            disabled={sugiriendo || cargando}
            onClick={() => void manejarSugerir()}
          >
            {sugiriendo ? 'Detectando...' : 'Detectar desde mis secciones'}
          </Boton>
          <Boton
            type="button"
            anchoCompleto={false}
            disabled={guardando || cargando}
            onClick={() => void manejarGuardar()}
          >
            {guardando ? 'Guardando...' : 'Guardar vínculos'}
          </Boton>
        </div>
      </div>

      {mensaje ? (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{mensaje}</p>
      ) : null}
      {error ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      ) : null}
      {cargando ? <p className="text-sm text-gray-500">Cargando vínculos...</p> : null}

      {!cargando ? <ResumenVinculosApu lineas={lineasResumen} /> : null}

      {!cargando && resumenVinculos.sinVincular > 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600">
          <span className="font-medium text-gray-900">
            {resumenVinculos.vinculados} de {resumenVinculos.total} partidas vinculadas.
          </span>{' '}
          Crea secciones de mano de obra y maquinaria en tu catálogo si aún no las tienes, luego usa
          “Detectar desde mis secciones”.
        </div>
      ) : null}

      {!cargando ? (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[40rem] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <th className="px-4 py-3">Partida APU</th>
                  <th className="px-4 py-3">Tu ítem del catálogo</th>
                  <th className="px-4 py-3 text-right">Precio actual</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {lineasApu.map((vinculo) => {
                  const opciones = itemsPorTipo[vinculo.tipo] ?? [];
                  const itemId = seleccion[vinculo.codigoApu] ?? '';
                  const itemActual = opciones.find((item) => item.id === itemId);

                  return (
                    <tr key={vinculo.codigoApu} id={`vinculo-${vinculo.codigoApu}`}>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{vinculo.descripcionApu}</p>
                        <p className="text-xs text-gray-400">
                          {ETIQUETA_TIPO[vinculo.tipo]} · {vinculo.unidadApu}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          className={ESTILO_CAMPO}
                          value={itemId}
                          onChange={(evento) =>
                            setSeleccion((prev) => ({
                              ...prev,
                              [vinculo.codigoApu]: evento.target.value,
                            }))
                          }
                        >
                          <option value="">Sin vincular</option>
                          {opciones.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.seccion.nombre} → {item.codigo} — {item.descripcion}
                            </option>
                          ))}
                        </select>
                        {vinculo.origen === 'SUGERIDO' && itemId ? (
                          <p className="mt-1 text-xs text-emerald-600">Detectado automáticamente</p>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 text-right font-medium tabular-nums text-sky-700">
                        {itemActual ? formatearQuetzales(itemActual.precioUnitario) : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {configCi ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-gray-900">Costos indirectos (%)</h2>
          <p className="mt-1 text-sm text-gray-500">
            Opcional: vincula un ítem cuyo precio sea el porcentaje (ej. precio 43 = 43% de C.I.).
          </p>
          <div className="mt-3 max-w-xl">
            <select
              className={ESTILO_CAMPO}
              value={seleccion[configCi.codigoApu] ?? ''}
              onChange={(evento) =>
                setSeleccion((prev) => ({
                  ...prev,
                  [configCi.codigoApu]: evento.target.value,
                }))
              }
            >
              <option value="">Usar 43% por defecto</option>
              {(itemsPorTipo.MANO_OBRA ?? []).map((item) => (
                <option key={item.id} value={item.id}>
                  {item.seccion.nombre} → {item.codigo} — {item.descripcion}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : null}

      <p className="text-sm text-gray-500">
        ¿Faltan ítems en el listado?{' '}
        <Link to="/catalogo/materiales" className="font-medium text-sky-600 hover:text-sky-700">
          Agrégalos en tu catálogo
        </Link>{' '}
        y vuelve aquí, o usa “Detectar desde mis secciones”.
      </p>
    </LayoutCatalogo>
  );
}
