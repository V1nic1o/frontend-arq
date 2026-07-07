import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock3,
  ExternalLink,
  HardHat,
  Pencil,
  Ruler,
  Users,
  Wrench,
} from 'lucide-react';
import { formatearDecimal } from './ResultadoCalculadora';
import { ResumenVinculosApu } from './ResumenVinculosApu';
import {
  listarItemsCatalogo,
  type ItemCatalogoConSeccion,
} from '../../catalogo/servicios/catalogo.servicio';
import { slugCatalogoPorTipo } from '../../catalogo/tipos/catalogo.tipos';
import {
  ETIQUETAS_TIPO_LINEA,
  formatearMonto,
  type ApuZapata,
  type CategoriaApuZapata,
  type ContextoApuZapata,
  type LineaApuZapata,
  type ParametrosApuZapata,
} from '../tipos/presupuestos.tipos';

const ORDEN_CATEGORIAS: CategoriaApuZapata[] = ['MATERIAL', 'MANO_OBRA', 'MAQUINARIA_EQUIPO'];

type TablaApuZapataProps = {
  apu: ApuZapata;
  compacto?: boolean;
};

function filtrarPorCategoria(lineas: LineaApuZapata[], categoria: CategoriaApuZapata) {
  return lineas.filter((linea) => linea.categoria === categoria);
}

function AccionPrecioLinea({
  linea,
  itemCatalogo,
}: {
  linea: LineaApuZapata;
  itemCatalogo?: ItemCatalogoConSeccion;
}) {
  if (linea.tipoLineaEquipo === 'PORCENTAJE_MO') {
    return null;
  }

  if (linea.desdeCatalogo && linea.itemCatalogoId && itemCatalogo) {
    const slug = slugCatalogoPorTipo(itemCatalogo.seccion.tipo);
    if (!slug) {
      return null;
    }

    return (
      <Link
        to={`/catalogo/${slug}/${itemCatalogo.seccion.id}?editar=${linea.itemCatalogoId}`}
        className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 font-medium text-sky-700 ring-1 ring-sky-200 transition-colors hover:bg-sky-50 hover:text-sky-800"
      >
        <Pencil className="h-3 w-3" />
        Editar {itemCatalogo.codigo}
      </Link>
    );
  }

  return (
    <Link
      to={`/catalogo/apu-zapata/vinculos#vinculo-${linea.codigo}`}
      className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 font-medium text-amber-800 ring-1 ring-amber-200 transition-colors hover:bg-amber-100"
    >
      <ExternalLink className="h-3 w-3" />
      Vincular precio
    </Link>
  );
}

function EncabezadoParametros({
  contexto,
  parametros,
}: {
  contexto?: ContextoApuZapata;
  parametros?: ParametrosApuZapata;
}) {
  if (!contexto || !parametros) {
    return null;
  }

  const tarjetas = [
    {
      icono: Ruler,
      etiqueta: parametros.rendimientoEtiqueta,
      valor: `${formatearDecimal(parametros.rendimiento)} ${parametros.rendimientoUnidad}`,
    },
    {
      icono: Users,
      etiqueta: 'Cuadrilla',
      valor: parametros.cuadrilla,
    },
    {
      icono: Clock3,
      etiqueta: 'Jornada',
      valor: `${parametros.jornadaHoras} horas`,
    },
    {
      icono: HardHat,
      etiqueta: parametros.consumoManoObraEtiqueta,
      valor: `${formatearMonto(parametros.consumoManoObra)} / ${contexto.unidadObra}`,
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 via-white to-white">
      <div className="border-b border-sky-100 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
          Análisis de precio unitario
        </p>
        <h3 className="mt-1 text-lg font-semibold text-gray-900">{contexto.titulo}</h3>
        <p className="mt-1 text-sm text-gray-600">
          {contexto.cantidad} {contexto.unidadObra}
          {contexto.cantidad === 1 ? '' : 's'} · {contexto.dimensiones.largo} ×{' '}
          {contexto.dimensiones.ancho} × {contexto.dimensiones.espesor} m · f'c{' '}
          {contexto.resistenciaConcreto} PSI · {contexto.diametroAcero}
        </p>
      </div>
      <div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-4">
        {tarjetas.map((tarjeta) => (
          <div
            key={tarjeta.etiqueta}
            className="rounded-xl border border-white/80 bg-white/90 p-4 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-sky-100 p-2 text-sky-700">
                <tarjeta.icono className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {tarjeta.etiqueta}
                </p>
                <p className="mt-1 text-sm font-semibold leading-snug text-gray-900">
                  {tarjeta.valor}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TablaCategoria({
  titulo,
  lineas,
  subtotal,
  mapaItems,
  esEquipo = false,
}: {
  titulo: string;
  lineas: LineaApuZapata[];
  subtotal: number;
  mapaItems: Map<string, ItemCatalogoConSeccion>;
  esEquipo?: boolean;
}) {
  if (lineas.length === 0) {
    return null;
  }

  const lineasPorcentaje = lineas.filter((linea) => linea.tipoLineaEquipo === 'PORCENTAJE_MO');
  const lineasCantidad = lineas.filter((linea) => linea.tipoLineaEquipo !== 'PORCENTAJE_MO');

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-2.5">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-600">{titulo}</h3>
      </div>

      {lineasCantidad.length > 0 ? (
        <div className="overflow-x-auto border-b border-gray-100">
          <table className="w-full min-w-xl text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-400">
                <th className="px-4 py-2.5">Descripción</th>
                <th className="px-4 py-2.5 text-right">Cantidad</th>
                <th className="px-4 py-2.5">Und.</th>
                <th className="px-4 py-2.5 text-right">P.U.</th>
                <th className="px-4 py-2.5 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {lineasCantidad.map((linea) => (
                <FilaLineaApu key={linea.codigo} linea={linea} mapaItems={mapaItems} />
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {esEquipo && lineasPorcentaje.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-xl text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-400">
                <th className="px-4 py-2.5">Descripción</th>
                <th className="px-4 py-2.5">Und.</th>
                <th className="px-4 py-2.5 text-right">Base</th>
                <th className="px-4 py-2.5 text-right">%</th>
                <th className="px-4 py-2.5 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {lineasPorcentaje.map((linea) => (
                <tr key={linea.codigo} className="text-gray-700">
                  <td className="px-4 py-2.5">
                    <div>{linea.descripcion}</div>
                    <p className="mt-0.5 text-xs text-gray-400">
                      {linea.baseCalculoEtiqueta ?? 'Base de cálculo'}
                    </p>
                  </td>
                  <td className="px-4 py-2.5 text-gray-500">%</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">
                    {formatearMonto(linea.baseCalculo ?? 0)}
                  </td>
                  <td className="px-4 py-2.5 text-right font-medium tabular-nums">
                    {Math.round(linea.cantidad * 100)}%
                  </td>
                  <td className="px-4 py-2.5 text-right font-medium tabular-nums">
                    {formatearMonto(linea.subtotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50/80 px-4 py-3 text-sm font-semibold text-gray-900">
        <span>Subtotal {titulo.toLowerCase()}</span>
        <span className="text-sky-700">{formatearMonto(subtotal)}</span>
      </div>
    </div>
  );
}

function FilaLineaApu({
  linea,
  mapaItems,
}: {
  linea: LineaApuZapata;
  mapaItems: Map<string, ItemCatalogoConSeccion>;
}) {
  return (
    <tr className="text-gray-700">
      <td className="px-4 py-2.5">
        <div>{linea.descripcion}</div>
        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-gray-400">
          <span>{linea.codigo}</span>
          {linea.desdeCatalogo ? (
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700">
              Tu catálogo
            </span>
          ) : (
            <span className="rounded-full bg-amber-50 px-2 py-0.5 font-medium text-amber-700">
              Precio referencia
            </span>
          )}
          <AccionPrecioLinea
            linea={linea}
            itemCatalogo={
              linea.itemCatalogoId ? mapaItems.get(linea.itemCatalogoId) : undefined
            }
          />
        </div>
      </td>
      <td className="px-4 py-2.5 text-right font-medium tabular-nums">
        {formatearDecimal(linea.cantidad)}
      </td>
      <td className="px-4 py-2.5 text-gray-500">{linea.unidad}</td>
      <td className="px-4 py-2.5 text-right tabular-nums">{formatearMonto(linea.precioUnitario)}</td>
      <td className="px-4 py-2.5 text-right font-medium tabular-nums">
        {formatearMonto(linea.subtotal)}
      </td>
    </tr>
  );
}

function SupuestosTecnicos({ supuestos }: { supuestos?: string[] }) {
  if (!supuestos?.length) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex items-center gap-2">
        <Wrench className="h-4 w-4 text-gray-500" />
        <h3 className="text-sm font-semibold text-gray-900">Supuestos técnicos</h3>
      </div>
      <ul className="mt-3 grid gap-2 text-sm leading-relaxed text-gray-600">
        {supuestos.map((supuesto) => (
          <li key={supuesto} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" />
            <span>{supuesto}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TablaApuZapata({ apu, compacto = false }: TablaApuZapataProps) {
  const { lineas, resumen, contexto, parametros, supuestosTecnicos } = apu;
  const [itemsCatalogo, setItemsCatalogo] = useState<ItemCatalogoConSeccion[]>([]);

  const necesitaCatalogo = useMemo(
    () => lineas.some((linea) => linea.itemCatalogoId),
    [lineas],
  );

  useEffect(() => {
    if (!necesitaCatalogo) {
      setItemsCatalogo([]);
      return;
    }

    let activo = true;

    void listarItemsCatalogo()
      .then((items) => {
        if (activo) {
          setItemsCatalogo(items);
        }
      })
      .catch(() => {
        if (activo) {
          setItemsCatalogo([]);
        }
      });

    return () => {
      activo = false;
    };
  }, [necesitaCatalogo]);

  const mapaItems = useMemo(
    () => new Map(itemsCatalogo.map((item) => [item.id, item])),
    [itemsCatalogo],
  );

  const unidadEtiqueta = contexto?.unidadObra ?? 'zapata';

  return (
    <div className={compacto ? 'grid gap-4' : 'grid gap-5'}>
      {!compacto ? <EncabezadoParametros contexto={contexto} parametros={parametros} /> : null}

      <ResumenVinculosApu lineas={lineas} compacto={compacto} />

      {ORDEN_CATEGORIAS.map((categoria) => (
        <TablaCategoria
          key={categoria}
          titulo={ETIQUETAS_TIPO_LINEA[categoria]}
          lineas={filtrarPorCategoria(lineas, categoria)}
          subtotal={
            categoria === 'MATERIAL'
              ? resumen.materiales
              : categoria === 'MANO_OBRA'
                ? resumen.manoObra
                : resumen.maquinariaEquipo
          }
          mapaItems={mapaItems}
          esEquipo={categoria === 'MAQUINARIA_EQUIPO'}
        />
      ))}

      <div className="overflow-hidden rounded-2xl border border-sky-300 bg-sky-600 text-white shadow-sm">
        <div className="grid gap-4 px-5 py-5 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-100">
              Costo directo total
            </p>
            <p className="mt-2 text-3xl font-bold tabular-nums">{formatearMonto(resumen.costoDirecto)}</p>
            <p className="mt-2 text-sm text-sky-100">
              Materiales + mano de obra + equipo y herramienta
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <TotalApu
              etiqueta={`C.I. (${Math.round(resumen.porcentajeCostosIndirectos * 100)}%)`}
              valor={resumen.costosIndirectos}
            />
            <TotalApu etiqueta="Total" valor={resumen.total} destacado />
            <TotalApu
              etiqueta={`Precio unitario / ${unidadEtiqueta}`}
              valor={resumen.precioUnitario}
              destacado
            />
          </div>
        </div>
        <p className="border-t border-sky-500/50 px-5 py-2 text-xs text-sky-100">
          Incluye costos indirectos del APU. No incluye utilidad ni impuestos adicionales.
        </p>
      </div>

      {!compacto ? <SupuestosTecnicos supuestos={supuestosTecnicos} /> : null}
    </div>
  );
}

function TotalApu({
  etiqueta,
  valor,
  destacado = false,
}: {
  etiqueta: string;
  valor: number;
  destacado?: boolean;
}) {
  return (
    <div className="rounded-xl bg-white/10 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-sky-100">{etiqueta}</p>
      <p className={['mt-1 text-lg font-semibold tabular-nums', destacado ? 'text-white' : 'text-sky-50'].join(' ')}>
        {formatearMonto(valor)}
      </p>
    </div>
  );
}

export function combinarApuZapatas(
  apus: ApuZapata[],
  cantidadZapatas = apus.length,
): ApuZapata | null {
  if (apus.length === 0) {
    return null;
  }

  const lineasPorCodigo = new Map<string, LineaApuZapata>();

  for (const apu of apus) {
    for (const linea of apu.lineas) {
      const existente = lineasPorCodigo.get(linea.codigo);
      if (existente) {
        existente.cantidad += linea.cantidad;
        existente.subtotal += linea.subtotal;
        existente.desdeCatalogo = existente.desdeCatalogo || linea.desdeCatalogo;
        if (linea.baseCalculo != null) {
          existente.baseCalculo = (existente.baseCalculo ?? 0) + linea.baseCalculo;
        }
      } else {
        lineasPorCodigo.set(linea.codigo, { ...linea });
      }
    }
  }

  const lineas = Array.from(lineasPorCodigo.values()).map((linea) => {
    if (linea.tipoLineaEquipo === 'PORCENTAJE_MO' && linea.baseCalculo != null) {
      return {
        ...linea,
        precioUnitario: linea.baseCalculo,
        subtotal: Math.round(linea.baseCalculo * linea.cantidad * 100) / 100,
      };
    }

    return {
      ...linea,
      cantidad: Math.round(linea.cantidad * 10000) / 10000,
      subtotal: Math.round(linea.subtotal * 100) / 100,
    };
  });

  const materiales = lineas
    .filter((linea) => linea.categoria === 'MATERIAL')
    .reduce((total, linea) => total + linea.subtotal, 0);
  const maquinariaEquipo = lineas
    .filter((linea) => linea.categoria === 'MAQUINARIA_EQUIPO')
    .reduce((total, linea) => total + linea.subtotal, 0);
  const manoObra = lineas
    .filter((linea) => linea.categoria === 'MANO_OBRA')
    .reduce((total, linea) => total + linea.subtotal, 0);
  const costoDirecto = Math.round((materiales + maquinariaEquipo + manoObra) * 100) / 100;
  const porcentaje = apus[0]?.resumen.porcentajeCostosIndirectos ?? 0.43;
  const costosIndirectos = Math.round(costoDirecto * porcentaje * 100) / 100;
  const total = Math.round((costoDirecto + costosIndirectos) * 100) / 100;

  const contextoBase = apus[0]?.contexto;
  const parametrosBase = apus[0]?.parametros;

  return {
    contexto: contextoBase
      ? {
          ...contextoBase,
          titulo: 'ZAPATAS CONSOLIDADAS',
          cantidad: cantidadZapatas,
        }
      : undefined,
    parametros: parametrosBase
      ? {
          ...parametrosBase,
          consumoManoObra: Math.round((manoObra / Math.max(cantidadZapatas, 1)) * 100) / 100,
        }
      : undefined,
    lineas,
    resumen: {
      materiales: Math.round(materiales * 100) / 100,
      maquinariaEquipo: Math.round(maquinariaEquipo * 100) / 100,
      manoObra: Math.round(manoObra * 100) / 100,
      costoDirecto,
      costosIndirectos,
      total,
      precioUnitario: Math.round((total / Math.max(cantidadZapatas, 1)) * 100) / 100,
      porcentajeCostosIndirectos: porcentaje,
    },
    supuestosTecnicos: apus[0]?.supuestosTecnicos,
    sugerenciasCuantificacion: [],
  };
}
