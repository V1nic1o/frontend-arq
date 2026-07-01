import type { TipoElementoPresupuesto } from '../tipos/presupuestos.tipos';

const CLAVE_BASE = 'presupuesto-elementos-seleccionados';

function clave(presupuestoId: string) {
  return `${CLAVE_BASE}:${presupuestoId}`;
}

export function guardarElementosSeleccionados(
  presupuestoId: string,
  tipos: TipoElementoPresupuesto[],
) {
  sessionStorage.setItem(clave(presupuestoId), JSON.stringify(tipos));
}

export function leerElementosSeleccionados(
  presupuestoId: string,
): TipoElementoPresupuesto[] | null {
  const raw = sessionStorage.getItem(clave(presupuestoId));
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as TipoElementoPresupuesto[]) : null;
  } catch {
    return null;
  }
}

export function indiceElementoEnCola(
  presupuestoId: string,
  tipo: TipoElementoPresupuesto,
): number {
  const cola = leerElementosSeleccionados(presupuestoId);
  if (!cola) return 0;
  const indice = cola.indexOf(tipo);
  return indice >= 0 ? indice : 0;
}

export function siguienteElementoEnCola(
  presupuestoId: string,
  tipoActual: TipoElementoPresupuesto,
): TipoElementoPresupuesto | null {
  const cola = leerElementosSeleccionados(presupuestoId);
  if (!cola) return null;

  const indice = cola.indexOf(tipoActual);
  if (indice < 0 || indice >= cola.length - 1) return null;

  return cola[indice + 1];
}

export function limpiarElementosSeleccionados(presupuestoId: string) {
  sessionStorage.removeItem(clave(presupuestoId));
}
