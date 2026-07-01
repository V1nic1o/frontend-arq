import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  eliminarToken,
  guardarToken,
  obtenerToken,
} from '../api/cliente-api';
import {
  iniciarSesion as iniciarSesionApi,
  obtenerPerfil,
} from '../servicios/autenticacion.servicio';
import type { RolUsuario, UsuarioSesion } from '../tipos/autenticacion.tipos';

type AutenticacionContextoValor = {
  usuario: UsuarioSesion | null;
  cargando: boolean;
  esAdmin: boolean;
  iniciarSesion: (correo: string, contrasena: string) => Promise<void>;
  cerrarSesion: () => void;
  actualizarUsuarioSesion: (usuario: UsuarioSesion) => void;
  tieneRol: (roles: RolUsuario[]) => boolean;
};

const AutenticacionContexto = createContext<AutenticacionContextoValor | null>(
  null,
);

export function AutenticacionProveedor({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioSesion | null>(null);
  const [cargando, setCargando] = useState(true);

  const restaurarSesion = useCallback(async () => {
    const token = obtenerToken();

    if (!token) {
      setCargando(false);
      return;
    }

    try {
      const perfil = await obtenerPerfil();
      setUsuario(perfil);
    } catch {
      eliminarToken();
      setUsuario(null);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void restaurarSesion();
  }, [restaurarSesion]);

  const iniciarSesion = useCallback(async (correo: string, contrasena: string) => {
    const respuesta = await iniciarSesionApi({ correo, contrasena });
    guardarToken(respuesta.tokenAcceso);
    setUsuario(respuesta.usuario);
  }, []);

  const cerrarSesion = useCallback(() => {
    eliminarToken();
    setUsuario(null);
  }, []);

  const actualizarUsuarioSesion = useCallback((usuarioActualizado: UsuarioSesion) => {
    setUsuario(usuarioActualizado);
  }, []);

  const tieneRol = useCallback(
    (roles: RolUsuario[]) => {
      if (!usuario) {
        return false;
      }

      return roles.includes(usuario.rol);
    },
    [usuario],
  );

  const valor = useMemo(
    () => ({
      usuario,
      cargando,
      esAdmin: usuario?.rol === 'SUPERADMIN' || usuario?.rol === 'ADMIN',
      iniciarSesion,
      cerrarSesion,
      actualizarUsuarioSesion,
      tieneRol,
    }),
    [usuario, cargando, iniciarSesion, cerrarSesion, actualizarUsuarioSesion, tieneRol],
  );

  return (
    <AutenticacionContexto.Provider value={valor}>
      {children}
    </AutenticacionContexto.Provider>
  );
}

export function useAutenticacion() {
  const contexto = useContext(AutenticacionContexto);

  if (!contexto) {
    throw new Error('useAutenticacion debe usarse dentro de AutenticacionProveedor');
  }

  return contexto;
}
