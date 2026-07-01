export type RespuestaApi<T> = {
  data: T;
};

export type ErrorApi = {
  error: {
    mensaje: string;
    codigoEstado: number;
  };
};

export type RolUsuario = 'SUPERADMIN' | 'ADMIN' | 'JEFE' | 'TRABAJADOR';

export const ETIQUETAS_ROL: Record<RolUsuario, string> = {
  SUPERADMIN: 'Superadministrador',
  ADMIN: 'Administrador',
  JEFE: 'Jefe',
  TRABAJADOR: 'Trabajador',
};

export type UsuarioSesion = {
  id: string;
  correo: string;
  nombre: string | null;
  rol: RolUsuario;
};

export type RespuestaAutenticacion = {
  tokenAcceso: string;
  usuario: UsuarioSesion;
};

export type UsuarioPublico = UsuarioSesion & {
  activo: boolean;
  creadoEn: string;
};

export type IniciarSesionEntrada = {
  correo: string;
  contrasena: string;
};

export type RegistrarUsuarioEntrada = {
  correo: string;
  contrasena: string;
  nombre?: string;
  rol: RolUsuario;
};

export type ActualizarPerfilEntrada = {
  nombre?: string;
};

export type CambiarContrasenaEntrada = {
  contrasenaActual: string;
  contrasenaNueva: string;
};

export type ActualizarUsuarioEntrada = {
  nombre?: string;
  rol?: RolUsuario;
  activo?: boolean;
};

export type RespuestaApiAutenticacion = RespuestaApi<RespuestaAutenticacion>;
export type RespuestaApiPerfil = RespuestaApi<UsuarioSesion>;
export type RespuestaApiUsuarios = RespuestaApi<UsuarioPublico[]>;
export type RespuestaApiUsuario = RespuestaApi<UsuarioSesion>;
export type RespuestaApiUsuarioPublico = RespuestaApi<UsuarioPublico>;
