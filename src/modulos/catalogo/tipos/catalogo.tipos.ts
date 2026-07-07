import type { LucideIcon } from 'lucide-react';
import { HardHat, Layers, Package, Truck } from 'lucide-react';

export type TipoCatalogo = 'MATERIAL' | 'MANO_OBRA' | 'MAQUINARIA_EQUIPO' | 'RENGLON';

export type CatalogoConfig = {
  id: string;
  slug: string;
  tipo: TipoCatalogo;
  titulo: string;
  descripcion: string;
  etiquetaSeccion: string;
  etiquetaItem: string;
  icono: LucideIcon;
  colorIcono: string;
  colorAcento: string;
};

export const CATALOGOS_CONFIG: CatalogoConfig[] = [
  {
    id: 'materiales',
    slug: 'materiales',
    tipo: 'MATERIAL',
    titulo: 'Materiales',
    descripcion:
      'Organiza por secciones (cementos, arena, hierro…) y define códigos con unidad y precio en quetzales.',
    etiquetaSeccion: 'Sección de material',
    etiquetaItem: 'Código de material',
    icono: Package,
    colorIcono: 'bg-amber-50 text-amber-600',
    colorAcento: 'from-amber-50 to-white border-amber-100',
  },
  {
    id: 'renglones',
    slug: 'renglones',
    tipo: 'RENGLON',
    titulo: 'Renglones',
    descripcion:
      'Agrupa partidas de obra con códigos propios para reutilizarlas al presupuestar.',
    etiquetaSeccion: 'Sección de renglón',
    etiquetaItem: 'Código de renglón',
    icono: Layers,
    colorIcono: 'bg-violet-50 text-violet-600',
    colorAcento: 'from-violet-50 to-white border-violet-100',
  },
  {
    id: 'mano-de-obra',
    slug: 'mano-de-obra',
    tipo: 'MANO_OBRA',
    titulo: 'Mano de obra',
    descripcion:
      'Clasifica oficios y actividades por sección, con códigos, unidad y costo en quetzales.',
    etiquetaSeccion: 'Sección de mano de obra',
    etiquetaItem: 'Código de mano de obra',
    icono: HardHat,
    colorIcono: 'bg-orange-50 text-orange-600',
    colorAcento: 'from-orange-50 to-white border-orange-100',
  },
  {
    id: 'maquinaria-equipo',
    slug: 'maquinaria-equipo',
    tipo: 'MAQUINARIA_EQUIPO',
    titulo: 'Maquinaria y equipo',
    descripcion:
      'Registra rentas, herramientas y equipo por sección con códigos y tarifas en quetzales.',
    etiquetaSeccion: 'Sección de equipo',
    etiquetaItem: 'Código de equipo',
    icono: Truck,
    colorIcono: 'bg-emerald-50 text-emerald-600',
    colorAcento: 'from-emerald-50 to-white border-emerald-100',
  },
];

export type SeccionCatalogo = {
  id: string;
  tipo: TipoCatalogo;
  nombre: string;
  activo: boolean;
  creadoEn: string;
  actualizadoEn: string;
  _count: { items: number };
};

export type ItemCatalogo = {
  id: string;
  seccionId: string;
  codigo: string;
  descripcion: string;
  unidad: string;
  precioUnitario: number | string;
  activo: boolean;
  creadoEn: string;
  actualizadoEn: string;
};

export function obtenerCatalogoPorSlug(slug: string) {
  return CATALOGOS_CONFIG.find((catalogo) => catalogo.slug === slug);
}

export function slugCatalogoPorTipo(tipo: TipoCatalogo) {
  return CATALOGOS_CONFIG.find((catalogo) => catalogo.tipo === tipo)?.slug;
}

export function formatearQuetzales(valor: number | string) {
  return new Intl.NumberFormat('es-GT', {
    style: 'currency',
    currency: 'GTQ',
    minimumFractionDigits: 2,
  }).format(Number(valor));
}
