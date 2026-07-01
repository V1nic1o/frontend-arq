import { clienteApi } from '../api/cliente-api';
import type {
  ActualizarPerfilEntrada,
  ActualizarUsuarioEntrada,
  CambiarContrasenaEntrada,
  IniciarSesionEntrada,
  RegistrarUsuarioEntrada,
  RespuestaApiAutenticacion,
  RespuestaApiPerfil,
  RespuestaApiUsuario,
  RespuestaApiUsuarioPublico,
  RespuestaApiUsuarios,
} from '../tipos/autenticacion.tipos';

export async function iniciarSesion(entrada: IniciarSesionEntrada) {
  const { data } = await clienteApi.post<RespuestaApiAutenticacion>(
    '/autenticacion/iniciar-sesion',
    entrada,
  );

  return data.data;
}

export async function obtenerPerfil() {
  const { data } = await clienteApi.get<RespuestaApiPerfil>(
    '/autenticacion/perfil',
  );

  return data.data;
}

export async function actualizarPerfil(entrada: ActualizarPerfilEntrada) {
  const { data } = await clienteApi.patch<RespuestaApiPerfil>(
    '/autenticacion/perfil',
    entrada,
  );

  return data.data;
}

export async function cambiarContrasena(entrada: CambiarContrasenaEntrada) {
  const { data } = await clienteApi.patch<{ data: { mensaje: string } }>(
    '/autenticacion/cambiar-contrasena',
    entrada,
  );

  return data.data;
}

export async function registrarUsuario(entrada: RegistrarUsuarioEntrada) {
  const { data } = await clienteApi.post<RespuestaApiUsuario>(
    '/autenticacion/registrar-usuario',
    entrada,
  );

  return data.data;
}

export async function listarUsuarios() {
  const { data } = await clienteApi.get<RespuestaApiUsuarios>(
    '/autenticacion/usuarios',
  );

  return data.data;
}

export async function actualizarUsuario(id: string, entrada: ActualizarUsuarioEntrada) {
  const { data } = await clienteApi.patch<RespuestaApiUsuarioPublico>(
    `/autenticacion/usuarios/${id}`,
    entrada,
  );

  return data.data;
}
