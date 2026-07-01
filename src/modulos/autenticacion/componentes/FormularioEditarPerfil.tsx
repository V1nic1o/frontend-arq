import { FormEvent, useState } from 'react';
import { Boton } from './ui/Boton';
import { CampoTexto } from './ui/CampoTexto';
import { actualizarPerfil } from '../servicios/autenticacion.servicio';
import type { UsuarioSesion } from '../tipos/autenticacion.tipos';

type FormularioEditarPerfilProps = {
  nombreInicial: string;
  onActualizado: (usuario: UsuarioSesion) => void;
  onCancelar: () => void;
};

export function FormularioEditarPerfil({
  nombreInicial,
  onActualizado,
  onCancelar,
}: FormularioEditarPerfilProps) {
  const [nombre, setNombre] = useState(nombreInicial);
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError(null);
    setEnviando(true);

    try {
      const usuario = await actualizarPerfil({
        nombre: nombre.trim() || undefined,
      });
      onActualizado(usuario);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'No se pudo actualizar el perfil');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={manejarEnvio}>
      <CampoTexto
        etiqueta="Nombre"
        name="nombre"
        value={nombre}
        onChange={(evento) => setNombre(evento.target.value)}
        minLength={2}
      />
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
