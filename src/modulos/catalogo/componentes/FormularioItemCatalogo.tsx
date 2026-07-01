import { FormEvent, useEffect, useState } from 'react';
import { Plus, Save } from 'lucide-react';
import { Boton } from '../../autenticacion/componentes/ui/Boton';
import { CampoTexto } from '../../autenticacion/componentes/ui/CampoTexto';
import type { ItemCatalogo } from '../tipos/catalogo.tipos';

export type DatosItemCatalogo = {
  codigo: string;
  descripcion: string;
  unidad: string;
  precioUnitario: number;
};

type FormularioItemCatalogoProps = {
  onGuardar: (datos: DatosItemCatalogo) => Promise<void>;
  itemInicial?: ItemCatalogo | null;
  onCancelar?: () => void;
};

export function FormularioItemCatalogo({
  onGuardar,
  itemInicial,
  onCancelar,
}: FormularioItemCatalogoProps) {
  const [codigo, setCodigo] = useState(itemInicial?.codigo ?? '');
  const [descripcion, setDescripcion] = useState(itemInicial?.descripcion ?? '');
  const [unidad, setUnidad] = useState(itemInicial?.unidad ?? '');
  const [precioUnitario, setPrecioUnitario] = useState(
    itemInicial ? String(itemInicial.precioUnitario) : '',
  );
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    setCodigo(itemInicial?.codigo ?? '');
    setDescripcion(itemInicial?.descripcion ?? '');
    setUnidad(itemInicial?.unidad ?? '');
    setPrecioUnitario(itemInicial ? String(itemInicial.precioUnitario) : '');
    setError(null);
  }, [itemInicial]);

  async function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError(null);
    setEnviando(true);

    try {
      await onGuardar({
        codigo: codigo.trim().toUpperCase(),
        descripcion: descripcion.trim(),
        unidad: unidad.trim(),
        precioUnitario: Number(precioUnitario),
      });

      if (!itemInicial) {
        setCodigo('');
        setDescripcion('');
        setUnidad('');
        setPrecioUnitario('');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={manejarEnvio}>
      <CampoTexto
        etiqueta="Código"
        name="codigo"
        value={codigo}
        onChange={(evento) => setCodigo(evento.target.value.toUpperCase())}
        placeholder="CEM-01"
        required
        minLength={2}
        disabled={Boolean(itemInicial)}
        autoFocus={!itemInicial}
      />
      <CampoTexto
        etiqueta="Descripción"
        name="descripcion"
        value={descripcion}
        onChange={(evento) => setDescripcion(evento.target.value)}
        placeholder="Cemento tipo I, excavación manual, etc."
        required
        minLength={2}
        autoFocus={Boolean(itemInicial)}
      />
      <CampoTexto
        etiqueta="Unidad"
        name="unidad"
        value={unidad}
        onChange={(evento) => setUnidad(evento.target.value)}
        placeholder="saco, m³, día, hora"
        required
      />
      <CampoTexto
        etiqueta="Precio unitario (Q)"
        name="precioUnitario"
        type="number"
        min={0.01}
        step="0.01"
        value={precioUnitario}
        onChange={(evento) => setPrecioUnitario(evento.target.value)}
        required
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
            {itemInicial ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {enviando ? 'Guardando...' : itemInicial ? 'Actualizar' : 'Agregar'}
          </span>
        </Boton>
      </div>
    </form>
  );
}
