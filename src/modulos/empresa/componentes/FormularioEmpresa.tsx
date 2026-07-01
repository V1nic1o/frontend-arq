import { FormEvent, useRef, useState } from 'react';
import type { Empresa } from '../tipos/empresa.tipos';
import { Boton } from '../../autenticacion/componentes/ui/Boton';
import { CampoTexto } from '../../autenticacion/componentes/ui/CampoTexto';
import { guardarEmpresa } from '../servicios/empresa.servicio';

const TAMANO_MAXIMO_LOGO = 1_500_000;

type FormularioEmpresaProps = {
  empresaInicial: Empresa | null;
  onGuardado: (empresa: Empresa) => void;
  onCancelar: () => void;
};

async function archivoABase64(archivo: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.onload = () => resolve(lector.result as string);
    lector.onerror = () => reject(new Error('No se pudo leer el archivo'));
    lector.readAsDataURL(archivo);
  });
}

export function FormularioEmpresa({
  empresaInicial,
  onGuardado,
  onCancelar,
}: FormularioEmpresaProps) {
  const entradaLogoRef = useRef<HTMLInputElement>(null);
  const [nombre, setNombre] = useState(empresaInicial?.nombre ?? '');
  const [nit, setNit] = useState(empresaInicial?.nit ?? '');
  const [correo, setCorreo] = useState(empresaInicial?.correo ?? '');
  const [telefono, setTelefono] = useState(empresaInicial?.telefono ?? '');
  const [direccion, setDireccion] = useState(empresaInicial?.direccion ?? '');
  const [logoBase64, setLogoBase64] = useState<string | null>(
    empresaInicial?.logoBase64 ?? null,
  );
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function manejarLogo(evento: React.ChangeEvent<HTMLInputElement>) {
    const archivo = evento.target.files?.[0];

    if (!archivo) {
      return;
    }

    if (!archivo.type.startsWith('image/')) {
      setError('El logo debe ser una imagen');
      return;
    }

    if (archivo.size > TAMANO_MAXIMO_LOGO) {
      setError('El logo no debe superar 1.5 MB');
      return;
    }

    try {
      const base64 = await archivoABase64(archivo);
      setLogoBase64(base64);
      setError(null);
    } catch {
      setError('No se pudo cargar el logo');
    }
  }

  async function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError(null);
    setEnviando(true);

    try {
      const empresaGuardada = await guardarEmpresa({
        nombre,
        nit,
        correo,
        telefono,
        direccion,
        logoBase64: logoBase64 ?? undefined,
      });
      onGuardado(empresaGuardada);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar la empresa');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={manejarEnvio}>
      <div className="grid gap-2">
        <span className="text-sm font-medium text-gray-700">Logo de la empresa</span>
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
            {logoBase64 ? (
              <img
                src={logoBase64}
                alt="Vista previa del logo"
                className="h-full w-full object-contain p-1"
              />
            ) : (
              <span className="px-2 text-center text-xs text-gray-400">Sin logo</span>
            )}
          </div>
          <div className="grid gap-2">
            <input
              ref={entradaLogoRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={manejarLogo}
            />
            <Boton
              type="button"
              variante="secundario"
              anchoCompleto={false}
              className="w-full sm:w-auto"
              onClick={() => entradaLogoRef.current?.click()}
            >
              Seleccionar logo
            </Boton>
            {logoBase64 ? (
              <button
                type="button"
                onClick={() => setLogoBase64(null)}
                className="text-left text-sm text-red-500 hover:underline"
              >
                Quitar logo
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <CampoTexto
        etiqueta="Nombre de la empresa"
        name="nombre"
        value={nombre}
        onChange={(evento) => setNombre(evento.target.value)}
        required
        minLength={2}
      />
      <CampoTexto
        etiqueta="NIT"
        name="nit"
        value={nit}
        onChange={(evento) => setNit(evento.target.value)}
        required
      />
      <CampoTexto
        etiqueta="Correo"
        name="correo"
        type="email"
        value={correo}
        onChange={(evento) => setCorreo(evento.target.value)}
        required
      />
      <CampoTexto
        etiqueta="Teléfono"
        name="telefono"
        type="tel"
        value={telefono}
        onChange={(evento) => setTelefono(evento.target.value)}
        required
      />
      <CampoTexto
        etiqueta="Dirección"
        name="direccion"
        value={direccion}
        onChange={(evento) => setDireccion(evento.target.value)}
        required
      />

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      <div className="grid gap-3">
        <Boton type="submit" disabled={enviando}>
          {enviando ? 'Guardando...' : empresaInicial ? 'Actualizar empresa' : 'Registrar empresa'}
        </Boton>
        <Boton type="button" variante="secundario" onClick={onCancelar}>
          Cancelar
        </Boton>
      </div>
    </form>
  );
}
