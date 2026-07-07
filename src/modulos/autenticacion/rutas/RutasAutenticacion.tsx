import { Navigate, Route, Routes } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import { RutaProtegida } from '../componentes/RutaProtegida';
import { RutaSoloAdmin } from '../componentes/RutaSoloAdmin';
import { AutenticacionProveedor } from '../contexto/AutenticacionContexto';
import { DisenoAplicacion } from '../disenos/DisenoAplicacion';
import { GestionarUsuariosPagina } from '../paginas/GestionarUsuariosPagina';
import { IniciarSesionPagina } from '../paginas/IniciarSesionPagina';
import { InicioPagina } from '../paginas/InicioPagina';
import { PerfilPagina } from '../paginas/PerfilPagina';
import { CatalogoPagina } from '../../catalogo/paginas/CatalogoPagina';
import { VincularApuZapataPagina } from '../../catalogo/paginas/VincularApuZapataPagina';
import { CodigosSeccionPagina } from '../../catalogo/paginas/CodigosSeccionPagina';
import { SeccionesCatalogoPagina } from '../../catalogo/paginas/SeccionesCatalogoPagina';
import { RedirigirPresupuestoLegacy } from '../../presupuestos/componentes/RedirigirPresupuestoLegacy';
import { CrearPresupuestosPagina } from '../../presupuestos/paginas/CrearPresupuestosPagina';
import { CuantificarPagina } from '../../presupuestos/paginas/CuantificarPagina';
import { DetallePresupuestoPagina } from '../../presupuestos/paginas/DetallePresupuestoPagina';
import { CostoDesglosadoElementoPagina } from '../../presupuestos/paginas/CostoDesglosadoElementoPagina';
import { PresupuestarElementoPagina } from '../../presupuestos/paginas/PresupuestarElementoPagina';
import { SeleccionarElementoPagina } from '../../presupuestos/paginas/SeleccionarElementoPagina';
import { ZapatasPagina } from '../../presupuestos/paginas/ZapatasPagina';

export function RutasAutenticacion() {
  return (
    <BrowserRouter>
      <AutenticacionProveedor>
        <Routes>
          <Route path="/iniciar-sesion" element={<IniciarSesionPagina />} />

          <Route element={<RutaProtegida />}>
            <Route element={<DisenoAplicacion />}>
              <Route index element={<Navigate to="/inicio" replace />} />
              <Route path="/inicio" element={<InicioPagina />} />
              <Route path="/presupuestos" element={<CrearPresupuestosPagina />} />
              <Route path="/catalogo" element={<CatalogoPagina />} />
              <Route path="/catalogo/apu-zapata/vinculos" element={<VincularApuZapataPagina />} />
              <Route path="/catalogo/:slug" element={<SeccionesCatalogoPagina />} />
              <Route
                path="/catalogo/:slug/:seccionId"
                element={<CodigosSeccionPagina />}
              />
              <Route path="/presupuestos/cuantificar" element={<CuantificarPagina />} />
              <Route
                path="/presupuestos/cuantificar/:presupuestoId/elementos"
                element={<RedirigirPresupuestoLegacy destino="elementos" />}
              />
              <Route
                path="/presupuestos/cuantificar/:presupuestoId/zapatas"
                element={<RedirigirPresupuestoLegacy destino="zapatas" />}
              />
              <Route
                path="/presupuestos/:presupuestoId/elementos/:elementoId/costo-desglosado"
                element={<CostoDesglosadoElementoPagina />}
              />
              <Route
                path="/presupuestos/:presupuestoId/elementos/:elementoId"
                element={<PresupuestarElementoPagina />}
              />
              <Route
                path="/presupuestos/:presupuestoId/zapatas"
                element={<ZapatasPagina />}
              />
              <Route
                path="/presupuestos/:presupuestoId/elementos"
                element={<SeleccionarElementoPagina />}
              />
              <Route path="/presupuestos/:presupuestoId" element={<DetallePresupuestoPagina />} />
              <Route path="/perfil" element={<PerfilPagina />} />
              <Route element={<RutaSoloAdmin />}>
                <Route path="/perfil/usuarios" element={<GestionarUsuariosPagina />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/iniciar-sesion" replace />} />
        </Routes>
      </AutenticacionProveedor>
    </BrowserRouter>
  );
}
