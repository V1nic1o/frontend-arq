# frontend-arq

Frontend de gestión de obras (React + Vite + Tailwind).

## Desarrollo local

```bash
npm install
npm run dev
```

El proxy de Vite envía `/api` a `http://localhost:3000`.

## Deploy en Vercel

1. Importá este repositorio en [Vercel](https://vercel.com/new).
2. Framework: **Vite** (detectado automáticamente).
3. Agregá la variable de entorno en **Production**:

   | Nombre | Valor |
   |--------|-------|
   | `VITE_API_URL` | `https://backend-arq-904288589125.us-central1.run.app/api` |

4. Deploy.

5. En **Google Cloud Run** (`backend-arq`), actualizá `CORS_ORIGIN` con la URL de Vercel, por ejemplo:

   ```
   https://tu-app.vercel.app,http://localhost:5173
   ```

## Build local

```bash
npm run build
npm run preview
```
