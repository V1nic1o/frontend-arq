import { clienteApi } from '../../autenticacion/api/cliente-api';
import type { RespuestaApi } from '../../autenticacion/tipos/autenticacion.tipos';
import type {
  ItemCatalogo,
  SeccionCatalogo,
  TipoCatalogo,
} from '../tipos/catalogo.tipos';

type CrearSeccionEntrada = {
  tipo: TipoCatalogo;
  nombre: string;
};

type CrearItemEntrada = {
  codigo: string;
  descripcion: string;
  unidad: string;
  precioUnitario: number;
};

type ActualizarItemEntrada = Partial<CrearItemEntrada> & {
  activo?: boolean;
};

export async function listarSecciones(tipo: TipoCatalogo) {
  const { data } = await clienteApi.get<RespuestaApi<SeccionCatalogo[]>>(
    '/catalogo/secciones',
    { params: { tipo } },
  );

  return data.data;
}

export async function crearSeccion(entrada: CrearSeccionEntrada) {
  const { data } = await clienteApi.post<RespuestaApi<SeccionCatalogo>>(
    '/catalogo/secciones',
    entrada,
  );

  return data.data;
}

export async function actualizarSeccion(id: string, nombre: string) {
  const { data } = await clienteApi.patch<RespuestaApi<SeccionCatalogo>>(
    `/catalogo/secciones/${id}`,
    { nombre },
  );

  return data.data;
}

export async function eliminarSeccion(id: string) {
  await clienteApi.delete(`/catalogo/secciones/${id}`);
}

export async function listarItems(seccionId: string) {
  const { data } = await clienteApi.get<RespuestaApi<ItemCatalogo[]>>(
    `/catalogo/secciones/${seccionId}/items`,
  );

  return data.data;
}

export async function crearItem(seccionId: string, entrada: CrearItemEntrada) {
  const { data } = await clienteApi.post<RespuestaApi<ItemCatalogo>>(
    `/catalogo/secciones/${seccionId}/items`,
    entrada,
  );

  return data.data;
}

export async function actualizarItem(id: string, entrada: ActualizarItemEntrada) {
  const { data } = await clienteApi.patch<RespuestaApi<ItemCatalogo>>(
    `/catalogo/items/${id}`,
    entrada,
  );

  return data.data;
}

export async function eliminarItem(id: string) {
  await clienteApi.delete(`/catalogo/items/${id}`);
}

export async function obtenerSeccion(id: string) {
  const { data } = await clienteApi.get<RespuestaApi<SeccionCatalogo>>(
    `/catalogo/secciones/${id}`,
  );

  return data.data;
}

export async function listarItemsCatalogo(tipo?: TipoCatalogo) {
  const { data } = await clienteApi.get<RespuestaApi<ItemCatalogoConSeccion[]>>('/catalogo/items', {
    params: tipo ? { tipo } : undefined,
  });

  return data.data;
}

export type ItemCatalogoConSeccion = ItemCatalogo & {
  seccion: { id: string; nombre: string; tipo: TipoCatalogo };
};

export type ComponenteRenglon = {
  id: string;
  renglonId: string;
  itemCatalogoId: string;
  cantidad: number | string;
  componente: ItemCatalogoConSeccion;
};

export async function listarComponentesRenglon(renglonId: string) {
  const { data } = await clienteApi.get<RespuestaApi<ComponenteRenglon[]>>(
    `/catalogo/items/${renglonId}/componentes`,
  );

  return data.data;
}

export async function crearComponenteRenglon(
  renglonId: string,
  itemCatalogoId: string,
  cantidad: number,
) {
  const { data } = await clienteApi.post<RespuestaApi<ComponenteRenglon>>(
    `/catalogo/items/${renglonId}/componentes`,
    { itemCatalogoId, cantidad },
  );

  return data.data;
}

export async function actualizarComponenteRenglon(id: string, cantidad: number) {
  const { data } = await clienteApi.patch<RespuestaApi<ComponenteRenglon>>(
    `/catalogo/componentes/${id}`,
    { cantidad },
  );

  return data.data;
}

export async function eliminarComponenteRenglon(id: string) {
  await clienteApi.delete(`/catalogo/componentes/${id}`);
}
