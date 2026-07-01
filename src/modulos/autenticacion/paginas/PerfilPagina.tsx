import { useCallback, useEffect, useState } from 'react';
import { Building2, KeyRound, LogOut, Pencil, UserPlus } from 'lucide-react';
import { useAutenticacion } from '../contexto/AutenticacionContexto';
import { ETIQUETAS_ROL } from '../tipos/autenticacion.tipos';
import { FilaAccion } from '../componentes/FilaAccion';
import { FormularioCambiarContrasena } from '../componentes/FormularioCambiarContrasena';
import { FormularioEditarPerfil } from '../componentes/FormularioEditarPerfil';
import { Modal } from '../componentes/ui/Modal';
import { Tarjeta } from '../componentes/ui/Tarjeta';
import { TarjetaPerfil } from '../componentes/ui/TarjetaPerfil';
import { TarjetaEmpresa } from '../../empresa/componentes/TarjetaEmpresa';
import { FormularioEmpresa } from '../../empresa/componentes/FormularioEmpresa';
import { obtenerEmpresa } from '../../empresa/servicios/empresa.servicio';
import type { Empresa } from '../../empresa/tipos/empresa.tipos';

export function PerfilPagina() {
  const { usuario, cerrarSesion, esAdmin, actualizarUsuarioSesion } = useAutenticacion();
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [cargandoEmpresa, setCargandoEmpresa] = useState(true);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalContrasena, setModalContrasena] = useState(false);
  const [modalEmpresa, setModalEmpresa] = useState(false);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  const cargarEmpresa = useCallback(async (silencioso = false) => {
    if (!silencioso) {
      setCargandoEmpresa(true);
    }

    try {
      const datos = await obtenerEmpresa();
      setEmpresa(datos);
    } catch {
      setEmpresa(null);
    } finally {
      if (!silencioso) {
        setCargandoEmpresa(false);
      }
    }
  }, []);

  useEffect(() => {
    void cargarEmpresa();
  }, [cargarEmpresa]);

  if (!usuario) {
    return null;
  }

  function mostrarExito(mensaje: string) {
    setMensajeExito(mensaje);
    setTimeout(() => setMensajeExito(null), 3000);
  }

  const inicialUsuario = (usuario.nombre ?? usuario.correo).charAt(0).toUpperCase();

  return (
    <div className="grid gap-6 sm:gap-8">
      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Perfil</h1>

      {mensajeExito ? (
        <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 sm:text-base">
          {mensajeExito}
        </p>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
        <TarjetaPerfil
          etiqueta="Datos personales"
          avatar={
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-sky-600 text-2xl font-bold text-white sm:h-20 sm:w-20">
              {inicialUsuario}
            </div>
          }
          titulo={usuario.nombre ?? 'Sin nombre'}
          subtitulo={usuario.correo}
          insignia={ETIQUETAS_ROL[usuario.rol]}
        />

        <TarjetaEmpresa empresa={empresa} cargando={cargandoEmpresa} />
      </div>

      <Tarjeta titulo="Acciones">
        <div className="-mx-5 divide-y divide-gray-100 sm:-mx-6">
          <p className="px-4 pb-2 pt-1 text-xs font-semibold uppercase tracking-wide text-gray-400 sm:px-5">
            Mi cuenta
          </p>
          <FilaAccion
            icono={Pencil}
            titulo="Editar nombre"
            descripcion="Actualiza cómo aparece tu nombre"
            onClick={() => setModalEditar(true)}
          />
          <FilaAccion
            icono={KeyRound}
            titulo="Cambiar contraseña"
            descripcion="Modifica tu contraseña de acceso"
            onClick={() => setModalContrasena(true)}
          />

          {esAdmin ? (
            <>
              <p className="px-4 pb-2 pt-4 text-xs font-semibold uppercase tracking-wide text-gray-400 sm:px-5">
                Administración
              </p>
              <FilaAccion
                icono={UserPlus}
                titulo="Gestionar usuarios"
                descripcion="Registrar y editar cuentas del sistema"
                to="/perfil/usuarios"
                colorIcono="bg-sky-50 text-sky-600"
              />
              <FilaAccion
                icono={Building2}
                titulo={empresa ? 'Editar empresa' : 'Registrar empresa'}
                descripcion="Logo, NIT, contacto y dirección"
                onClick={() => setModalEmpresa(true)}
                colorIcono="bg-sky-50 text-sky-600"
              />
            </>
          ) : null}

          <div className="pt-2">
            <FilaAccion
              icono={LogOut}
              titulo="Cerrar sesión"
              descripcion="Salir de tu cuenta"
              onClick={cerrarSesion}
              colorIcono="bg-red-50 text-red-500"
            />
          </div>
        </div>
      </Tarjeta>

      <Modal abierto={modalEditar} titulo="Editar nombre" onCerrar={() => setModalEditar(false)}>
        <FormularioEditarPerfil
          nombreInicial={usuario.nombre ?? ''}
          onActualizado={(perfil) => {
            actualizarUsuarioSesion(perfil);
            setModalEditar(false);
            mostrarExito('Perfil actualizado correctamente.');
          }}
          onCancelar={() => setModalEditar(false)}
        />
      </Modal>

      <Modal
        abierto={modalContrasena}
        titulo="Cambiar contraseña"
        onCerrar={() => setModalContrasena(false)}
      >
        <FormularioCambiarContrasena
          onActualizado={() => {
            setModalContrasena(false);
            mostrarExito('Contraseña actualizada correctamente.');
          }}
          onCancelar={() => setModalContrasena(false)}
        />
      </Modal>

      <Modal
        abierto={modalEmpresa}
        titulo={empresa ? 'Editar empresa' : 'Registrar empresa'}
        onCerrar={() => setModalEmpresa(false)}
      >
        <FormularioEmpresa
          empresaInicial={empresa}
          onGuardado={(empresaGuardada) => {
            setModalEmpresa(false);
            setEmpresa(empresaGuardada);
            void cargarEmpresa(true);
            mostrarExito('Datos de la empresa guardados correctamente.');
          }}
          onCancelar={() => setModalEmpresa(false)}
        />
      </Modal>
    </div>
  );
}
