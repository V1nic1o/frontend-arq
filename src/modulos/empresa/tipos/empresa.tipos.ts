import type { RespuestaApi } from '../../autenticacion/tipos/autenticacion.tipos';

export type Empresa = {
  id: string;
  nombre: string;
  nit: string;
  correo: string;
  telefono: string;
  direccion: string;
  logoBase64: string | null;
  creadoEn: string;
  actualizadoEn: string;
};

export type GuardarEmpresaEntrada = {
  nombre: string;
  nit: string;
  correo: string;
  telefono: string;
  direccion: string;
  logoBase64?: string;
};

export type RespuestaApiEmpresa = RespuestaApi<Empresa | null>;
export type RespuestaApiEmpresaGuardada = RespuestaApi<Empresa>;
