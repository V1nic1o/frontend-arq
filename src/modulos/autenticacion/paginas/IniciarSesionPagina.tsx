import { FormEvent, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { PantallaCarga } from '../componentes/PantallaCarga';
import { useAutenticacion } from '../contexto/AutenticacionContexto';
import { Boton } from '../componentes/ui/Boton';
import { CampoTexto } from '../componentes/ui/CampoTexto';
import { Tarjeta } from '../componentes/ui/Tarjeta';

function FormularioIniciarSesion() {
  const { iniciarSesion } = useAutenticacion();
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError(null);
    setEnviando(true);

    try {
      await iniciarSesion(correo, contrasena);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión');
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
        autoComplete="email"
        value={correo}
        onChange={(evento) => setCorreo(evento.target.value)}
        required
      />
      <CampoTexto
        etiqueta="Contraseña"
        name="contrasena"
        type="password"
        autoComplete="current-password"
        value={contrasena}
        onChange={(evento) => setContrasena(evento.target.value)}
        required
      />
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      <Boton type="submit" disabled={enviando}>
        {enviando ? 'Ingresando...' : 'Iniciar sesión'}
      </Boton>
    </form>
  );
}

export function IniciarSesionPagina() {
  const { usuario, cargando } = useAutenticacion();

  if (cargando) {
    return <PantallaCarga />;
  }

  if (usuario) {
    return <Navigate to="/inicio" replace />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md lg:max-w-lg">
        <Tarjeta
          titulo="Iniciar sesión"
          descripcion="Accede con tu cuenta."
        >
          <FormularioIniciarSesion />
        </Tarjeta>
      </div>
    </main>
  );
}
