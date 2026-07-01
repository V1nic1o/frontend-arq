import { FormEvent, useMemo, useState } from 'react';
import type { RolUsuario, UsuarioSesion } from '../tipos/autenticacion.tipos';
import { ETIQUETAS_ROL } from '../tipos/autenticacion.tipos';
import { Boton } from './ui/Boton';
import { CampoTexto, ESTILO_CAMPO } from './ui/CampoTexto';
import { useAutenticacion } from '../contexto/AutenticacionContexto';
import { registrarUsuario } from '../servicios/autenticacion.servicio';

type FormularioRegistrarUsuarioProps = {
  onRegistrado: (usuario: UsuarioSesion) => void;
  onCancelar?: () => void;
};

export function FormularioRegistrarUsuario({
  onRegistrado,
  onCancelar,
}: FormularioRegistrarUsuarioProps) {
  const { usuario: usuarioActual } = useAutenticacion();
  const rolesDisponibles = useMemo<RolUsuario[]>(() => {
    if (usuarioActual?.rol === 'SUPERADMIN') {
      return ['ADMIN', 'JEFE', 'TRABAJADOR'];
    }
    return ['JEFE', 'TRABAJADOR'];
  }, [usuarioActual?.rol]);
  const [correo, setCorreo] = useState('');
  const [nombre, setNombre] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [rol, setRol] = useState<RolUsuario>('TRABAJADOR');
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError(null);
    setEnviando(true);

    try {
      const usuario = await registrarUsuario({
        correo,
        contrasena,
        nombre: nombre.trim() || undefined,
        rol,
      });

      onRegistrado(usuario);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'No se pudo registrar el usuario');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={manejarEnvio}>
      <CampoTexto
        etiqueta="Correo"
        name="correo"
        type="email"
        value={correo}
        onChange={(evento) => setCorreo(evento.target.value)}
        required
      />
      <CampoTexto
        etiqueta="Nombre"
        name="nombre"
        value={nombre}
        onChange={(evento) => setNombre(evento.target.value)}
      />
      <CampoTexto
        etiqueta="Contraseña"
        name="contrasena"
        type="password"
        value={contrasena}
        onChange={(evento) => setContrasena(evento.target.value)}
        required
        minLength={6}
      />

      <label className="grid gap-1.5" htmlFor="rol">
        <span className="text-sm font-medium text-gray-700">Rol</span>
        <select
          id="rol"
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

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      <div className="grid gap-3 pt-1">
        <Boton type="submit" disabled={enviando}>
          {enviando ? 'Registrando...' : 'Registrar usuario'}
        </Boton>
        {onCancelar ? (
          <Boton type="button" variante="secundario" onClick={onCancelar}>
            Cancelar
          </Boton>
        ) : null}
      </div>
    </form>
  );
}
