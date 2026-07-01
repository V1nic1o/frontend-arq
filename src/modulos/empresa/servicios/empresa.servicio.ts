import { clienteApi } from '../../autenticacion/api/cliente-api';
import type {
  GuardarEmpresaEntrada,
  RespuestaApiEmpresa,
  RespuestaApiEmpresaGuardada,
} from '../tipos/empresa.tipos';

export async function obtenerEmpresa() {
  const { data } = await clienteApi.get<RespuestaApiEmpresa>('/empresa');
  return data.data;
}

export async function guardarEmpresa(entrada: GuardarEmpresaEntrada) {
  const { data } = await clienteApi.put<RespuestaApiEmpresaGuardada>(
    '/empresa',
    entrada,
  );

  return data.data;
}
