import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Building2, Hash, MapPin, MapPinned, UserRound } from 'lucide-react';
import { Boton } from '../../autenticacion/componentes/ui/Boton';
import { PieAccionesFormulario } from '../../autenticacion/componentes/ui/PieAccionesFormulario';
import { CampoSelect } from '../../autenticacion/componentes/ui/CampoSelect';
import { CampoTexto } from '../../autenticacion/componentes/ui/CampoTexto';
import {
  DEPARTAMENTOS_GUATEMALA,
  obtenerMunicipiosPorDepartamento,
  resolverDepartamentoGuardado,
  resolverMunicipioGuardado,
} from '../../../nucleo/datos/guatemala-ubicaciones';
import type { CrearPresupuestoEntrada } from '../tipos/presupuestos.tipos';

type FormularioDatosClienteProps = {
  modo?: 'crear' | 'editar';
  valoresIniciales?: CrearPresupuestoEntrada;
  onCreado?: (presupuestoId: string) => void;
  onGuardado?: () => void;
  onCancelar: () => void;
  crearPresupuesto?: (entrada: CrearPresupuestoEntrada) => Promise<{ id: string }>;
  actualizarPresupuesto?: (entrada: CrearPresupuestoEntrada) => Promise<void>;
};

export function FormularioDatosCliente({
  modo = 'crear',
  valoresIniciales,
  onCreado,
  onGuardado,
  onCancelar,
  crearPresupuesto,
  actualizarPresupuesto,
}: FormularioDatosClienteProps) {
  const [proyecto, setProyecto] = useState(valoresIniciales?.proyecto ?? '');
  const [cliente, setCliente] = useState(valoresIniciales?.cliente ?? '');
  const [ubicacion, setUbicacion] = useState(valoresIniciales?.ubicacion ?? '');
  const [departamento, setDepartamento] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [nit, setNit] = useState(valoresIniciales?.nit ?? '');
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const municipiosDisponibles = useMemo(
    () => obtenerMunicipiosPorDepartamento(departamento),
    [departamento],
  );

  const opcionesDepartamentos = useMemo(
    () => DEPARTAMENTOS_GUATEMALA.map((nombre) => ({ valor: nombre, etiqueta: nombre })),
    [],
  );

  const opcionesMunicipios = useMemo(
    () => municipiosDisponibles.map((nombre) => ({ valor: nombre, etiqueta: nombre })),
    [municipiosDisponibles],
  );

  useEffect(() => {
    if (!valoresIniciales) {
      return;
    }

    setProyecto(valoresIniciales.proyecto);
    setCliente(valoresIniciales.cliente);
    setUbicacion(valoresIniciales.ubicacion);
    setNit(valoresIniciales.nit);

    const departamentoResuelto = resolverDepartamentoGuardado(
      valoresIniciales.departamento,
      valoresIniciales.municipio,
    );
    setDepartamento(departamentoResuelto);
    setMunicipio(
      resolverMunicipioGuardado(departamentoResuelto, valoresIniciales.municipio),
    );
  }, [valoresIniciales]);

  function manejarCambioDepartamento(nuevoDepartamento: string) {
    setDepartamento(nuevoDepartamento);
    setMunicipio('');
  }

  async function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError(null);
    setEnviando(true);

    const entrada: CrearPresupuestoEntrada = {
      proyecto,
      cliente,
      ubicacion,
      municipio,
      departamento,
      nit,
    };

    try {
      if (modo === 'editar' && actualizarPresupuesto) {
        await actualizarPresupuesto(entrada);
        onGuardado?.();
      } else if (crearPresupuesto) {
        const presupuesto = await crearPresupuesto(entrada);
        onCreado?.(presupuesto.id);
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : modo === 'editar'
            ? 'No se pudo actualizar el presupuesto'
            : 'No se pudo crear el presupuesto',
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="grid min-w-0 gap-4" onSubmit={manejarEnvio}>
      <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
        <CampoTexto
          etiqueta="Proyecto"
          icono={Building2}
          name="proyecto"
          value={proyecto}
          onChange={(evento) => setProyecto(evento.target.value)}
          placeholder="Residencial Los Pinos"
          required
          minLength={2}
          autoFocus
        />
        <CampoTexto
          etiqueta="Cliente"
          icono={UserRound}
          name="cliente"
          value={cliente}
          onChange={(evento) => setCliente(evento.target.value)}
          placeholder="Constructora Maya S.A."
          required
          minLength={2}
        />
        <CampoTexto
          etiqueta="Ubicación"
          icono={MapPin}
          name="ubicacion"
          value={ubicacion}
          onChange={(evento) => setUbicacion(evento.target.value)}
          placeholder="Km 12 carretera a Antigua"
          required
          minLength={2}
          className="sm:col-span-2"
        />
        <CampoSelect
          etiqueta="Departamento"
          icono={MapPinned}
          name="departamento"
          value={departamento}
          onChange={(evento) => manejarCambioDepartamento(evento.target.value)}
          opciones={opcionesDepartamentos}
          placeholder="Seleccionar"
          required
        />
        <CampoSelect
          etiqueta="Municipio"
          icono={MapPinned}
          name="municipio"
          value={municipio}
          onChange={(evento) => setMunicipio(evento.target.value)}
          opciones={opcionesMunicipios}
          placeholder={departamento ? 'Seleccionar' : 'Depto. primero'}
          disabled={!departamento}
          required
        />
        <CampoTexto
          etiqueta="NIT"
          icono={Hash}
          name="nit"
          value={nit}
          onChange={(evento) => setNit(evento.target.value)}
          placeholder="1234567-8"
          required
          minLength={3}
          className="sm:col-span-2"
        />
      </div>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      <PieAccionesFormulario className="border-gray-100">
        <Boton type="button" variante="secundario" onClick={onCancelar}>
          Cancelar
        </Boton>
        <Boton type="submit" disabled={enviando}>
          {enviando ? 'Guardando...' : modo === 'editar' ? 'Guardar cambios' : 'Continuar'}
        </Boton>
      </PieAccionesFormulario>
    </form>
  );
}
