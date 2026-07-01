import { useCallback, useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Boton } from '../../autenticacion/componentes/ui/Boton';
import { Modal } from '../../autenticacion/componentes/ui/Modal';
import {
  EstadoVacioCatalogo,
  LayoutCatalogo,
  PanelCatalogo,
} from '../componentes/LayoutCatalogo';
import { FilaSeccionCatalogo } from '../componentes/FilaSeccionCatalogo';
import { FormularioInlineSeccion } from '../componentes/FormularioInlineSeccion';
import {
  actualizarSeccion,
  crearSeccion,
  eliminarSeccion,
  listarSecciones,
} from '../servicios/catalogo.servicio';
import {
  obtenerCatalogoPorSlug,
  type SeccionCatalogo,
} from '../tipos/catalogo.tipos';

export function SeccionesCatalogoPagina() {
  const { slug } = useParams<{ slug: string }>();
  const catalogo = slug ? obtenerCatalogoPorSlug(slug) : undefined;
  const [secciones, setSecciones] = useState<SeccionCatalogo[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalCrearAbierto, setModalCrearAbierto] = useState(false);
  const [seccionEditar, setSeccionEditar] = useState<SeccionCatalogo | null>(null);

  const cargarSecciones = useCallback(async () => {
    if (!catalogo) {
      return;
    }

    setCargando(true);
    setError(null);

    try {
      const lista = await listarSecciones(catalogo.tipo);
      setSecciones(lista);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'No se pudieron cargar las secciones');
    } finally {
      setCargando(false);
    }
  }, [catalogo]);

  useEffect(() => {
    void cargarSecciones();
  }, [cargarSecciones]);

  if (!catalogo) {
    return <Navigate to="/catalogo" replace />;
  }

  async function manejarEliminar(seccion: SeccionCatalogo) {
    const mensaje =
      seccion._count.items > 0
        ? `¿Eliminar "${seccion.nombre}" y sus ${seccion._count.items} código(s)? Esta acción no se puede deshacer.`
        : `¿Eliminar la sección "${seccion.nombre}"?`;

    if (!window.confirm(mensaje)) {
      return;
    }

    try {
      await eliminarSeccion(seccion.id);
      if (seccionEditar?.id === seccion.id) {
        setSeccionEditar(null);
      }
      await cargarSecciones();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'No se pudo eliminar la sección');
    }
  }

  return (
    <LayoutCatalogo
      volverA="/catalogo"
      etiquetaVolver="Catálogo"
      migas={[
        { etiqueta: 'Catálogo', ruta: '/catalogo' },
        { etiqueta: catalogo.titulo },
      ]}
      titulo={catalogo.titulo}
      subtitulo={`${secciones.length} sección${secciones.length === 1 ? '' : 'es'}`}
      accion={
        <Boton anchoCompleto={false} onClick={() => setModalCrearAbierto(true)}>
          <span className="inline-flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nueva sección
          </span>
        </Boton>
      }
    >
      <PanelCatalogo titulo="Secciones">
        {cargando ? (
          <EstadoVacioCatalogo mensaje="Cargando secciones..." />
        ) : null}

        {error ? (
          <div className="px-4 py-6 text-center text-sm text-red-500 sm:px-6">{error}</div>
        ) : null}

        {!cargando && !error && secciones.length === 0 ? (
          <EstadoVacioCatalogo
            mensaje='Aún no hay secciones. Crea la primera, por ejemplo "Cementos".'
            accion={
              <Boton anchoCompleto={false} onClick={() => setModalCrearAbierto(true)}>
                <span className="inline-flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Nueva sección
                </span>
              </Boton>
            }
          />
        ) : null}

        {!cargando && !error && secciones.length > 0 ? (
          <div className="divide-y divide-gray-100 lg:grid lg:grid-cols-2 lg:gap-4 lg:divide-y-0 lg:p-4">
            {secciones.map((seccion) => (
              <FilaSeccionCatalogo
                key={seccion.id}
                seccion={seccion}
                ruta={`/catalogo/${catalogo.slug}/${seccion.id}`}
                colorIcono={catalogo.colorIcono}
                onEditar={setSeccionEditar}
                onEliminar={manejarEliminar}
              />
            ))}
          </div>
        ) : null}
      </PanelCatalogo>

      <Modal
        abierto={modalCrearAbierto}
        titulo="Nueva sección"
        onCerrar={() => setModalCrearAbierto(false)}
      >
        <FormularioInlineSeccion
          onCrear={async (nombre) => {
            await crearSeccion({ tipo: catalogo.tipo, nombre });
            setModalCrearAbierto(false);
            await cargarSecciones();
          }}
          onCancelar={() => setModalCrearAbierto(false)}
        />
      </Modal>

      <Modal
        abierto={Boolean(seccionEditar)}
        titulo="Editar sección"
        onCerrar={() => setSeccionEditar(null)}
      >
        {seccionEditar ? (
          <FormularioInlineSeccion
            modo="editar"
            nombreInicial={seccionEditar.nombre}
            onGuardar={async (nombre) => {
              await actualizarSeccion(seccionEditar.id, nombre);
              setSeccionEditar(null);
              await cargarSecciones();
            }}
            onCancelar={() => setSeccionEditar(null)}
          />
        ) : null}
      </Modal>
    </LayoutCatalogo>
  );
}
