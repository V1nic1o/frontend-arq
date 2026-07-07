import type { RespuestaApi } from '../../autenticacion/tipos/autenticacion.tipos';
import { formatearQuetzales } from '../../catalogo/tipos/catalogo.tipos';

export type Presupuesto = {
  id: string;
  proyecto: string;
  cliente: string;
  ubicacion: string;
  municipio: string;
  departamento: string;
  nit: string;
  creadoEn: string;
  actualizadoEn: string;
};

export type PresupuestoLista = Presupuesto & {
  _count: { elementos: number };
  totalGeneral: number;
};

export type ZapataCuantificacion = {
  id: string;
  elementoId: string;
  cantidad: number;
  largo: number;
  ancho: number;
  espesor: number;
  profundidad: number;
  recubrimiento: number;
  diametroAcero: string;
  espaciamientoVarillas: number;
  ambosSentidos: boolean;
  resistenciaConcreto: number;
  volumenPorZapata: number;
  volumenTotal: number;
  concretoEstimado: number;
  volumenExcavacion: number;
  aceroLongitudTotal: number;
  aceroPesoTotal: number;
};

export type TipoLineaCosto = 'MATERIAL' | 'MANO_OBRA' | 'MAQUINARIA_EQUIPO' | 'RENGLON';

export type ResumenCostos = Record<TipoLineaCosto, number>;

export type LineaCosto = {
  id: string;
  elementoId: string;
  itemCatalogoId: string | null;
  tipo: TipoLineaCosto;
  codigo: string;
  descripcion: string;
  unidad: string;
  precioUnitario: number | string;
  cantidad: number | string;
  subtotal: number | string;
  renglonOrigen: string | null;
  creadoEn: string;
  actualizadoEn: string;
};

export type SugerenciaCuantificacion = {
  concepto:
    | 'CEMENTO'
    | 'HIERRO'
    | 'ARENA'
    | 'PIEDRIN'
    | 'MANO_OBRA'
    | 'MAQUINARIA_EQUIPO';
  descripcion: string;
  cantidad: number;
  unidad: string;
};

export type CategoriaApuZapata = 'MATERIAL' | 'MAQUINARIA_EQUIPO' | 'MANO_OBRA';

export type TipoLineaEquipo = 'CANTIDAD' | 'PORCENTAJE_MO';

export type LineaApuZapata = {
  categoria: CategoriaApuZapata;
  codigo: string;
  descripcion: string;
  cantidad: number;
  unidad: string;
  precioUnitario: number;
  subtotal: number;
  itemCatalogoId: string | null;
  desdeCatalogo: boolean;
  tipoLineaEquipo?: TipoLineaEquipo;
  baseCalculo?: number;
  baseCalculoEtiqueta?: string;
};

export type ContextoApuZapata = {
  titulo: string;
  unidadObra: string;
  cantidad: number;
  dimensiones: {
    largo: number;
    ancho: number;
    espesor: number;
    profundidad: number;
  };
  volumenFundicionM3: number;
  volumenFundicionPorZapataM3: number;
  volumenExcavacionM3: number;
  pesoAceroKg: number;
  resistenciaConcreto: number;
  diametroAcero: string;
};

export type ParametrosApuZapata = {
  rendimiento: number;
  rendimientoUnidad: string;
  rendimientoEtiqueta: string;
  cuadrilla: string;
  jornadaHoras: number;
  consumoManoObra: number;
  consumoManoObraUnidad: string;
  consumoManoObraEtiqueta: string;
};

export type ResumenApuZapata = {
  materiales: number;
  maquinariaEquipo: number;
  manoObra: number;
  costoDirecto: number;
  costosIndirectos: number;
  total: number;
  precioUnitario: number;
  porcentajeCostosIndirectos: number;
};

export type ApuZapata = {
  contexto?: ContextoApuZapata;
  parametros?: ParametrosApuZapata;
  lineas: LineaApuZapata[];
  resumen: ResumenApuZapata;
  supuestosTecnicos?: string[];
  sugerenciasCuantificacion: SugerenciaCuantificacion[];
};

export type ElementoPresupuesto = {
  id: string;
  tipo: 'ZAPATA';
  creadoEn: string;
  zapata: ZapataCuantificacion | null;
  lineasCosto?: LineaCosto[];
  resumenCostos?: ResumenCostos;
  totalElemento?: number;
  sugerenciasCuantificacion?: SugerenciaCuantificacion[];
  apuZapata?: ApuZapata | null;
};

export type PresupuestoDetalle = Presupuesto & {
  elementos: ElementoPresupuesto[];
  resumenCostos: ResumenCostos;
  totalGeneral: number;
};

export type ElementoPresupuestoDetalle = ElementoPresupuesto & {
  presupuestoId: string;
  presupuesto: Presupuesto;
  sugerenciasCuantificacion: SugerenciaCuantificacion[];
  apuZapata?: ApuZapata | null;
};

export type LineasCostoRespuesta = {
  lineas: LineaCosto[];
  resumenCostos: ResumenCostos;
  totalElemento: number;
  sugerenciasCuantificacion: SugerenciaCuantificacion[];
  apuZapata?: ApuZapata | null;
};

export type CrearPresupuestoEntrada = {
  proyecto: string;
  cliente: string;
  ubicacion: string;
  municipio: string;
  departamento: string;
  nit: string;
};

export type CuantificarZapataEntrada = {
  cantidad: number;
  largo: number;
  ancho: number;
  espesor: number;
  profundidad: number;
  recubrimiento: number;
  diametroAcero: string;
  espaciamientoVarillas: number;
  ambosSentidos: boolean;
  resistenciaConcreto: number;
};

export type RespuestaApiPresupuesto = RespuestaApi<Presupuesto>;
export type RespuestaApiPresupuestoDetalle = RespuestaApi<PresupuestoDetalle>;
export type RespuestaApiElementoPresupuesto = RespuestaApi<ElementoPresupuesto>;

export type TipoElementoPresupuesto = 'ZAPATA' | 'COLUMNA' | 'VIGA' | 'LOSA';

export type DefinicionElementoPresupuesto = {
  id: TipoElementoPresupuesto;
  titulo: string;
  descripcion: string;
  ruta: string;
  disponible: boolean;
};

export const ELEMENTOS_PRESUPUESTO: DefinicionElementoPresupuesto[] = [
  {
    id: 'ZAPATA',
    titulo: 'Zapatas',
    descripcion: 'Dimensiones, concreto y acero de zapatas.',
    ruta: 'zapatas',
    disponible: true,
  },
  {
    id: 'COLUMNA',
    titulo: 'Columnas',
    descripcion: 'Altura, sección y refuerzo de columnas.',
    ruta: 'columnas',
    disponible: false,
  },
  {
    id: 'VIGA',
    titulo: 'Vigas',
    descripcion: 'Luces, sección y acero de vigas.',
    ruta: 'vigas',
    disponible: false,
  },
  {
    id: 'LOSA',
    titulo: 'Losas',
    descripcion: 'Espesor, refuerzo y área de losas.',
    ruta: 'losas',
    disponible: false,
  },
];

export function obtenerDefinicionElemento(tipo: TipoElementoPresupuesto) {
  return ELEMENTOS_PRESUPUESTO.find((elemento) => elemento.id === tipo);
}

export function rutaCuantificarElemento(presupuestoId: string, tipo: TipoElementoPresupuesto) {
  const definicion = obtenerDefinicionElemento(tipo);
  if (!definicion) {
    return rutaElementosPresupuesto(presupuestoId);
  }
  return `/presupuestos/${presupuestoId}/${definicion.ruta}`;
}

export function rutaPresupuesto(presupuestoId: string) {
  return `/presupuestos/${presupuestoId}`;
}

export function rutaElementosPresupuesto(presupuestoId: string) {
  return `/presupuestos/${presupuestoId}/elementos`;
}

export function rutaZapatasPresupuesto(presupuestoId: string) {
  return `/presupuestos/${presupuestoId}/zapatas`;
}

export function rutaPresupuestarElemento(presupuestoId: string, elementoId: string) {
  return `/presupuestos/${presupuestoId}/elementos/${elementoId}`;
}

export function rutaCostoDesglosadoElemento(presupuestoId: string, elementoId: string) {
  return `/presupuestos/${presupuestoId}/elementos/${elementoId}/costo-desglosado`;
}

export const ETIQUETAS_TIPO_LINEA: Record<TipoLineaCosto, string> = {
  MATERIAL: 'Materiales',
  MANO_OBRA: 'Mano de obra',
  MAQUINARIA_EQUIPO: 'Maquinaria y equipo',
  RENGLON: 'Renglones',
};

export function formatearMonto(valor: number | string) {
  return formatearQuetzales(valor);
}

export function descripcionElementoPresupuesto(elemento: ElementoPresupuesto): string {
  if (elemento.tipo === 'ZAPATA') {
    return 'Zapata';
  }

  return elemento.tipo;
}

export function detalleTecnicoElementoPresupuesto(elemento: ElementoPresupuesto): string | null {
  if (!elemento.zapata) {
    return null;
  }

  const zapata = elemento.zapata;
  return `${Number(zapata.largo).toFixed(2)} × ${Number(zapata.ancho).toFixed(2)} × ${Number(zapata.espesor).toFixed(2)} m · f'c ${zapata.resistenciaConcreto} PSI · ${zapata.diametroAcero}`;
}

export function cantidadElementoPresupuesto(elemento: ElementoPresupuesto): number | null {
  if (elemento.zapata) {
    return elemento.zapata.cantidad;
  }

  return null;
}

export function unidadElementoPresupuesto(elemento: ElementoPresupuesto): string {
  if (elemento.tipo === 'ZAPATA') {
    return 'und';
  }

  return 'und';
}

export function subtotalElementoPresupuesto(elemento: ElementoPresupuesto): number {
  if (elemento.apuZapata?.resumen?.total != null) {
    return elemento.apuZapata.resumen.total;
  }

  return Number(elemento.totalElemento ?? 0);
}
