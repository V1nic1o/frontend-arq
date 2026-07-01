import axios from 'axios';
import type { ErrorApi } from '../tipos/autenticacion.tipos';

const CLAVE_TOKEN = 'token_acceso';

export const clienteApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

clienteApi.interceptors.request.use((config) => {
  const token = localStorage.getItem(CLAVE_TOKEN);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

clienteApi.interceptors.response.use(
  (respuesta) => respuesta,
  (error: unknown) => {
    if (axios.isAxiosError<ErrorApi>(error)) {
      const mensaje =
        error.response?.data?.error?.mensaje ??
        error.message ??
        'Error inesperado';

      return Promise.reject(new Error(mensaje));
    }

    return Promise.reject(
      error instanceof Error ? error : new Error('Error inesperado'),
    );
  },
);

export function guardarToken(token: string) {
  localStorage.setItem(CLAVE_TOKEN, token);
}

export function obtenerToken() {
  return localStorage.getItem(CLAVE_TOKEN);
}

export function eliminarToken() {
  localStorage.removeItem(CLAVE_TOKEN);
}
