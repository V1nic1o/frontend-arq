import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Pencil, UserPlus } from 'lucide-react';
import type { RolUsuario, UsuarioPublico } from '../tipos/autenticacion.tipos';
import { ETIQUETAS_ROL } from '../tipos/autenticacion.tipos';
import { useAutenticacion } from '../contexto/AutenticacionContexto';
import { FormularioEditarUsuario } from '../componentes/FormularioEditarUsuario';
import { FormularioRegistrarUsuario } from '../componentes/FormularioRegistrarUsuario';
import { Boton } from '../componentes/ui/Boton';
import { Modal } from '../componentes/ui/Modal';
import { listarUsuarios } from '../servicios/autenticacion.servicio';

const ESTILOS_INSIGNIA: Record<RolUsuario, string> = {
  SUPERADMIN: 'bg-violet-100 text-violet-700',
  ADMIN: 'bg-sky-100 text-sky-700',
  JEFE: 'bg-amber-100 text-amber-700',
  TRABAJADOR: 'bg-green-100 text-green-700',
};

type TarjetaUsuarioProps = {
  usuario: UsuarioPublico;
  onEditar: (usuario: UsuarioPublico) => void;
};

function TarjetaUsuario({ usuario, onEditar }: TarjetaUsuarioProps) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-gray-900 sm:text-lg">
            {usuario.nombre ?? 'Sin nombre'}
          </p>
          <p className="mt-1 truncate text-sm text-gray-500">{usuario.correo}</p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold sm:text-sm ${ESTILOS_INSIGNIA[usuario.rol]}`}
        >
          {ETIQUETAS_ROL[usuario.rol]}
        </span>
      </div>
      <div className="mt-auto flex items-center justify-between gap-3 pt-4">
        <p className="text-sm text-gray-500">
          Estado:{' '}
          <span
            className={
              usuario.activo ? 'font-medium text-green-600' : 'font-medium text-red-500'
            }
          >
            {usuario.activo ? 'Activo' : 'Inactivo'}
          </span>
        </p>
        <button
          type="button"
          onClick={() => onEditar(usuario)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          <Pencil className="h-3.5 w-3.5" />
          Editar
        </button>
      </div>
    </article>
  );
}

export function GestionarUsuariosPagina() {
  const { usuario: usuarioSesion, actualizarUsuarioSesion } = useAutenticacion();
  const [usuarios, setUsuarios] = useState<UsuarioPublico[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalRegistrar, setModalRegistrar] = useState(false);
  const [usuarioEditar, setUsuarioEditar] = useState<UsuarioPublico | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  const cargarUsuarios = useCallback(async (silencioso = false) => {
    if (!silencioso) {
      setCargando(true);
    }
    setError(null);

    try {
      const lista = await listarUsuarios();
      setUsuarios(lista);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar los usuarios');
    } finally {
      if (!silencioso) {
        setCargando(false);
      }
    }
  }, []);

  useEffect(() => {
    void cargarUsuarios();
  }, [cargarUsuarios]);

  function mostrarExito(mensaje: string) {
    setMensajeExito(mensaje);
    setTimeout(() => setMensajeExito(null), 3000);
  }

  function agregarUsuario(usuario: UsuarioPublico) {
    setUsuarios((listaActual) => [...listaActual, usuario]);
  }

  function actualizarUsuarioEnLista(usuarioActualizado: UsuarioPublico) {
    setUsuarios((listaActual) =>
      listaActual.map((usuario) =>
        usuario.id === usuarioActualizado.id ? usuarioActualizado : usuario,
      ),
    );

    if (usuarioSesion?.id === usuarioActualizado.id) {
      actualizarUsuarioSesion({
        id: usuarioActualizado.id,
        correo: usuarioActualizado.correo,
        nombre: usuarioActualizado.nombre,
        rol: usuarioActualizado.rol,
      });
    }
  }

  return (
    <div className="grid gap-5 sm:gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/perfil"
            className="rounded-xl border border-gray-200 p-2 text-gray-600 transition-colors hover:bg-gray-50"
            aria-label="Volver al perfil"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">
            Gestionar usuarios
          </h1>
        </div>

        <Boton
          anchoCompleto={false}
          className="w-full sm:w-auto sm:min-w-[12rem]"
          onClick={() => setModalRegistrar(true)}
        >
          <span className="inline-flex items-center justify-center gap-2">
            <UserPlus className="h-4 w-4" />
            Nuevo usuario
          </span>
        </Boton>
      </div>

      {mensajeExito ? (
        <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 sm:text-base">
          {mensajeExito}
        </p>
      ) : null}

      <section className="grid gap-4">
        <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
          Usuarios registrados
          {!cargando && !error ? (
            <span className="ml-2 font-normal text-gray-500">({usuarios.length})</span>
          ) : null}
        </h2>

        {cargando ? <p className="text-sm text-gray-500">Cargando usuarios...</p> : null}
        {error ? <p className="text-sm text-red-500">{error}</p> : null}

        {!cargando && !error && usuarios.length === 0 ? (
          <p className="text-sm text-gray-500">No hay usuarios registrados.</p>
        ) : null}

        {!cargando && !error ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {usuarios.map((usuario) => (
              <TarjetaUsuario
                key={usuario.id}
                usuario={usuario}
                onEditar={setUsuarioEditar}
              />
            ))}
          </div>
        ) : null}
      </section>

      <Modal
        abierto={modalRegistrar}
        titulo="Registrar usuario"
        onCerrar={() => setModalRegistrar(false)}
      >
        <FormularioRegistrarUsuario
          onRegistrado={(usuario) => {
            setModalRegistrar(false);
            agregarUsuario({
              ...usuario,
              activo: true,
              creadoEn: new Date().toISOString(),
            });
            void cargarUsuarios(true);
            mostrarExito('Usuario registrado correctamente.');
          }}
          onCancelar={() => setModalRegistrar(false)}
        />
      </Modal>

      <Modal
        abierto={usuarioEditar !== null}
        titulo="Editar usuario"
        onCerrar={() => setUsuarioEditar(null)}
      >
        {usuarioEditar ? (
          <FormularioEditarUsuario
            usuario={usuarioEditar}
            esPropioUsuario={usuarioEditar.id === usuarioSesion?.id}
            onActualizado={(usuarioActualizado) => {
              setUsuarioEditar(null);
              actualizarUsuarioEnLista(usuarioActualizado);
              mostrarExito('Usuario actualizado correctamente.');
            }}
            onCancelar={() => setUsuarioEditar(null)}
          />
        ) : null}
      </Modal>
    </div>
  );
}
