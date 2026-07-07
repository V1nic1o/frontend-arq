import { Link } from 'react-router-dom';
import { ChevronRight, Link2 } from 'lucide-react';
import { LayoutCatalogo } from '../componentes/LayoutCatalogo';
import { CATALOGOS_CONFIG } from '../tipos/catalogo.tipos';

export function CatalogoPagina() {
  return (
    <LayoutCatalogo
      volverA="/inicio"
      etiquetaVolver="Inicio"
      migas={[{ etiqueta: 'Catálogo' }]}
      titulo="Catálogo"
      subtitulo="Administra precios y códigos por tipo de recurso."
    >
      <Link
        to="/catalogo/apu-zapata/vinculos"
        className="group flex items-start gap-4 rounded-2xl border border-sky-200 bg-sky-50/70 p-5 shadow-sm transition-all hover:border-sky-300 hover:shadow-md"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-sky-600 shadow-sm">
          <Link2 className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold text-gray-900 group-hover:text-sky-700">
            Vínculos APU zapata
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-gray-600">
            Conecta tu catálogo (01-CEMENTOS, 02-ARENA, tus códigos…) con el análisis de precio de
            zapatas. La app detecta coincidencias por nombre de sección o puedes elegir cada ítem
            manualmente.
          </p>
        </div>
        <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-sky-300 transition-colors group-hover:text-sky-500" />
      </Link>

      <div className="grid gap-4 sm:grid-cols-2">
        {CATALOGOS_CONFIG.map((catalogo) => (
          <Link
            key={catalogo.id}
            to={`/catalogo/${catalogo.slug}`}
            className="group flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-sky-200 hover:shadow-md"
          >
            <div className={`shrink-0 rounded-xl p-3 ${catalogo.colorIcono}`}>
              <catalogo.icono className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-semibold text-gray-900 group-hover:text-sky-700">
                {catalogo.titulo}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-gray-500">{catalogo.descripcion}</p>
            </div>
            <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-gray-300 transition-colors group-hover:text-sky-500" />
          </Link>
        ))}
      </div>

      <p className="text-center text-xs text-gray-400">
        Código · Descripción · Unidad · Precio unitario (Q)
      </p>
    </LayoutCatalogo>
  );
}
