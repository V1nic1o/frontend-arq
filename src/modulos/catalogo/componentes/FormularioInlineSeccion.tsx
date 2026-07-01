import { FormEvent, useEffect, useState } from 'react';
import { Plus, Save } from 'lucide-react';
import { Boton } from '../../autenticacion/componentes/ui/Boton';
import { CampoTexto } from '../../autenticacion/componentes/ui/CampoTexto';

type FormularioInlineSeccionProps = {
  modo?: 'crear' | 'editar';
  nombreInicial?: string;
  onCrear?: (nombre: string) => Promise<void>;
  onGuardar?: (nombre: string) => Promise<void>;
  onCancelar?: () => void;
};

export function FormularioInlineSeccion({
  modo = 'crear',
  nombreInicial = '',
  onCrear,
  onGuardar,
  onCancelar,
}: FormularioInlineSeccionProps) {
  const [nombre, setNombre] = useState(nombreInicial);
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    setNombre(nombreInicial);
  }, [nombreInicial, modo]);

  async function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (!nombre.trim()) {
      return;
    }

    setError(null);
    setEnviando(true);

    try {
      if (modo === 'editar' && onGuardar) {
        await onGuardar(nombre.trim());
      } else if (onCrear) {
        await onCrear(nombre.trim());
        setNombre('');
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : modo === 'editar'
            ? 'No se pudo actualizar la sección'
            : 'No se pudo crear la sección',
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={manejarEnvio}>
      <CampoTexto
        etiqueta="Nombre"
        name="nombre"
        value={nombre}
        onChange={(evento) => setNombre(evento.target.value)}
        placeholder="Ej. Cementos, Arena, Hierro"
        required
        minLength={2}
        autoFocus
      />
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        {onCancelar ? (
          <Boton type="button" variante="secundario" anchoCompleto={false} onClick={onCancelar}>
            Cancelar
          </Boton>
        ) : null}
        <Boton type="submit" anchoCompleto={false} disabled={enviando} className="sm:min-w-[9rem]">
          <span className="inline-flex items-center justify-center gap-2">
            {modo === 'editar' ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {enviando ? 'Guardando...' : modo === 'editar' ? 'Guardar' : 'Crear'}
          </span>
        </Boton>
      </div>
    </form>
  );
}
