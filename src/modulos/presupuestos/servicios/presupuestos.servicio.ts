import { clienteApi } from '../../autenticacion/api/cliente-api';
import type { RespuestaApi } from '../../autenticacion/tipos/autenticacion.tipos';
import type {
  CrearPresupuestoEntrada,
  CuantificarZapataEntrada,
  ElementoPresupuestoDetalle,
  LineasCostoRespuesta,
  PresupuestoDetalle,
  PresupuestoLista,
  RespuestaApiElementoPresupuesto,
  RespuestaApiPresupuesto,
  RespuestaApiPresupuestoDetalle,
  ApuZapata,
} from '../tipos/presupuestos.tipos';

export async function listarPresupuestos() {
  const { data } = await clienteApi.get<RespuestaApi<PresupuestoLista[]>>('/presupuestos');
  return data.data;
}

export async function crearPresupuesto(entrada: CrearPresupuestoEntrada) {
  const { data } = await clienteApi.post<RespuestaApiPresupuesto>('/presupuestos', entrada);
  return data.data;
}

export async function obtenerPresupuesto(id: string) {
  const { data } = await clienteApi.get<RespuestaApiPresupuestoDetalle>(`/presupuestos/${id}`);
  return data.data;
}

export async function actualizarPresupuesto(id: string, entrada: CrearPresupuestoEntrada) {
  const { data } = await clienteApi.patch<RespuestaApiPresupuesto>(`/presupuestos/${id}`, entrada);
  return data.data;
}

export async function eliminarPresupuesto(id: string) {
  await clienteApi.delete(`/presupuestos/${id}`);
}

export async function cuantificarZapata(presupuestoId: string, entrada: CuantificarZapataEntrada) {
  const { data } = await clienteApi.post<RespuestaApiElementoPresupuesto>(
    `/presupuestos/${presupuestoId}/zapatas`,
    entrada,
  );
  return data.data;
}

export async function previsualizarCuantificacionZapata(
  presupuestoId: string,
  entrada: CuantificarZapataEntrada,
) {
  const { data } = await clienteApi.post<RespuestaApi<{ apuZapata: ApuZapata }>>(
    `/presupuestos/${presupuestoId}/zapatas/vista-previa`,
    entrada,
  );
  return data.data.apuZapata;
}

export async function actualizarZapataElemento(
  elementoId: string,
  entrada: CuantificarZapataEntrada,
) {
  const { data } = await clienteApi.patch<RespuestaApi<ElementoPresupuestoDetalle>>(
    `/presupuestos/elementos/${elementoId}/zapata`,
    entrada,
  );
  return data.data;
}

export async function eliminarElemento(elementoId: string) {
  await clienteApi.delete(`/presupuestos/elementos/${elementoId}`);
}

export async function obtenerElemento(elementoId: string) {
  const { data } = await clienteApi.get<RespuestaApi<ElementoPresupuestoDetalle>>(
    `/presupuestos/elementos/${elementoId}`,
  );
  return data.data;
}

export async function listarLineasCosto(elementoId: string) {
  const { data } = await clienteApi.get<RespuestaApi<LineasCostoRespuesta>>(
    `/presupuestos/elementos/${elementoId}/lineas`,
  );
  return data.data;
}

export async function agregarLineaCosto(elementoId: string, itemCatalogoId: string, cantidad: number) {
  const { data } = await clienteApi.post<RespuestaApi<LineasCostoRespuesta>>(
    `/presupuestos/elementos/${elementoId}/lineas`,
    { itemCatalogoId, cantidad },
  );
  return data.data;
}

export async function actualizarLineaCosto(lineaId: string, cantidad: number) {
  const { data } = await clienteApi.patch<RespuestaApi<LineasCostoRespuesta>>(
    `/presupuestos/lineas/${lineaId}`,
    { cantidad },
  );
  return data.data;
}

export async function eliminarLineaCosto(lineaId: string) {
  const { data } = await clienteApi.delete<RespuestaApi<LineasCostoRespuesta>>(
    `/presupuestos/lineas/${lineaId}`,
  );
  return data.data;
}
