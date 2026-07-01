import { FormEvent, useState } from 'react';
import { Boton } from './ui/Boton';
import { CampoTexto } from './ui/CampoTexto';
import { cambiarContrasena } from '../servicios/autenticacion.servicio';

type FormularioCambiarContrasenaProps = {
  onActualizado: () => void;
  onCancelar: () => void;
};

export function FormularioCambiarContrasena({
  onActualizado,
  onCancelar,
}: FormularioCambiarContrasenaProps) {
  const [contrasenaActual, setContrasenaActual] = useState('');
  const [contrasenaNueva, setContrasenaNueva] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError(null);

    if (contrasenaNueva !== confirmarContrasena) {
      setError('Las contraseñas nuevas no coinciden');
      return;
    }

    setEnviando(true);

    try {
      await cambiarContrasena({ contrasenaActual, contrasenaNueva });
      onActualizado();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'No se pudo cambiar la contraseña');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={manejarEnvio}>
      <CampoTexto
        etiqueta="Contraseña actual"
        name="contrasenaActual"
        type="password"
        value={contrasenaActual}
        onChange={(evento) => setContrasenaActual(evento.target.value)}
        required
      />
      <CampoTexto
        etiqueta="Nueva contraseña"
        name="contrasenaNueva"
        type="password"
        value={contrasenaNueva}
        onChange={(evento) => setContrasenaNueva(evento.target.value)}
        required
        minLength={6}
      />
      <CampoTexto
        etiqueta="Confirmar nueva contraseña"
        name="confirmarContrasena"
        type="password"
        value={confirmarContrasena}
        onChange={(evento) => setConfirmarContrasena(evento.target.value)}
        required
        minLength={6}
      />
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      <div className="grid gap-3">
        <Boton type="submit" disabled={enviando}>
          {enviando ? 'Actualizando...' : 'Cambiar contraseña'}
        </Boton>
        <Boton type="button" variante="secundario" onClick={onCancelar}>
          Cancelar
        </Boton>
      </div>
    </form>
  );
}
