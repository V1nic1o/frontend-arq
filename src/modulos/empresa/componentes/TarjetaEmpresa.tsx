import { Building2 } from 'lucide-react';
import type { Empresa } from '../tipos/empresa.tipos';
import {
  CampoTarjetaPerfil,
  TarjetaPerfil,
} from '../../autenticacion/componentes/ui/TarjetaPerfil';

type TarjetaEmpresaProps = {
  empresa: Empresa | null;
  cargando?: boolean;
};

function AvatarEmpresa({ empresa }: { empresa: Empresa | null }) {
  if (empresa?.logoBase64) {
    return (
      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm ring-2 ring-sky-100 sm:h-20 sm:w-20">
        <img
          src={empresa.logoBase64}
          alt={`Logo de ${empresa.nombre}`}
          className="h-full w-full object-contain p-1.5"
        />
      </div>
    );
  }

  return (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-sky-600 text-white sm:h-20 sm:w-20">
      <Building2 className="h-8 w-8 sm:h-9 sm:w-9" />
    </div>
  );
}

export function TarjetaEmpresa({ empresa, cargando }: TarjetaEmpresaProps) {
  if (cargando) {
    return (
      <TarjetaPerfil
        etiqueta="Datos de la empresa"
        avatar={<AvatarEmpresa empresa={null} />}
        titulo="Cargando..."
        subtitulo="Obteniendo información"
      />
    );
  }

  if (!empresa) {
    return (
      <TarjetaPerfil
        etiqueta="Datos de la empresa"
        avatar={<AvatarEmpresa empresa={null} />}
        titulo="Sin registrar"
        subtitulo="Completa los datos desde la sección de acciones"
        insignia="Pendiente"
      />
    );
  }

  return (
    <TarjetaPerfil
      etiqueta="Datos de la empresa"
      avatar={<AvatarEmpresa empresa={empresa} />}
      titulo={empresa.nombre}
      subtitulo={empresa.correo}
      insignia="Empresa"
    >
      <CampoTarjetaPerfil etiqueta="NIT" valor={empresa.nit} />
      <CampoTarjetaPerfil etiqueta="Teléfono" valor={empresa.telefono} />
      <CampoTarjetaPerfil etiqueta="Dirección" valor={empresa.direccion} />
    </TarjetaPerfil>
  );
}
