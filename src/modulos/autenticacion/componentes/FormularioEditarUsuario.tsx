import { FormEvent, useMemo, useState } from 'react';
import type { RolUsuario, UsuarioPublico } from '../tipos/autenticacion.tipos';
import { ETIQUETAS_ROL } from '../tipos/autenticacion.tipos';
import { Boton } from './ui/Boton';
import { CampoTexto, ESTILO_CAMPO } from './ui/CampoTexto';
import { useAutenticacion } from '../contexto/AutenticacionContexto';
import { actualizarUsuario } from '../servicios/autenticacion.servicio';

type FormularioEditarUsuarioProps = {
  usuario: UsuarioPublico;
  esPropioUsuario: boolean;
  onActualizado: (usuario: UsuarioPublico) => void;
  onCancelar: () => void;
};

export function FormularioEditarUsuario({
  usuario,
  esPropioUsuario,
  onActualizado,
  onCancelar,
}: FormularioEditarUsuarioProps) {
  const { usuario: usuarioActual } = useAutenticacion();
  const rolesDisponibles = useMemo<RolUsuario[]>(() => {
    if (usuario.rol === 'SUPERADMIN') {
      return ['SUPERADMIN'];
    }
    if (usuarioActual?.rol === 'SUPERADMIN') {
      return ['ADMIN', 'JEFE', 'TRABAJADOR'];
    }
    return ['JEFE', 'TRABAJADOR'];
  }, [usuario.rol, usuarioActual?.rol]);
  const [nombre, setNombre] = useState(usuario.nombre ?? '');
  const [rol, setRol] = useState<RolUsuario>(usuario.rol);
  const [activo, setActivo] = useState(usuario.activo);
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError(null);
    setEnviando(true);

    try {
      const usuarioActualizado = await actualizarUsuario(usuario.id, {
        nombre: nombre.trim() || undefined,
        ...(!esPropioUsuario && { rol, activo }),
      });
      onActualizado(usuarioActualizado);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'No se pudo actualizar el usuario');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={manejarEnvio}>
      <CampoTexto etiqueta="Correo" name="correo" value={usuario.correo} disabled />

      <CampoTexto
        etiqueta="Nombre"
        name="nombre"
        value={nombre}
        onChange={(evento) => setNombre(evento.target.value)}
        minLength={2}
      />

      {!esPropioUsuario && usuario.rol !== 'SUPERADMIN' ? (
        <>
          <label className="grid gap-1.5" htmlFor="rol-editar">
            <span className="text-sm font-medium text-gray-700">Rol</span>
            <select
              id="rol-editar"
              className={ESTILO_CAMPO}
              value={rol}
              onChange={(evento) => setRol(evento.target.value as RolUsuario)}
            >
              {rolesDisponibles.map((opcion) => (
                <option key={opcion} value={opcion}>
                  {ETIQUETAS_ROL[opcion]}
                </option>
              ))}
            </select>
          </label>

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 px-4 py-3">
            <input
              type="checkbox"
              checked={activo}
              onChange={(evento) => setActivo(evento.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
            />
            <span className="text-sm font-medium text-gray-700">Usuario activo</span>
          </label>
        </>
      ) : esPropioUsuario ? (
        <p className="text-sm text-gray-500">
          No puedes cambiar tu propio rol ni desactivar tu cuenta desde aquí.
        </p>
      ) : (
        <p className="text-sm text-gray-500">
          El superadministrador de la empresa no se edita desde aquí.
        </p>
      )}

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      <div className="grid gap-3">
        <Boton type="submit" disabled={enviando}>
          {enviando ? 'Guardando...' : 'Guardar cambios'}
        </Boton>
        <Boton type="button" variante="secundario" onClick={onCancelar}>
          Cancelar
        </Boton>
      </div>
    </form>
  );
}
