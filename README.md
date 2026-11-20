# Catálogo de productos PERN (Unidad 4)

Aplicación para consultar, crear, editar y eliminar productos.
React (Vite) + Express + PostgreSQL. Datos ficticios.

## Requisitos
- Node.js 18+ y npm
- Docker Desktop

## Arranque (Jornada 1)

1. **Base de datos** (desde la raíz del proyecto):
   ```bash
   docker compose up -d
   ```
   PostgreSQL queda en `localhost:5433` y pgAdmin en http://localhost:8081.

2. **Backend**:
   ```bash
   cd backend
   cp .env.example .env      # en Windows: copy .env.example .env
   npm install
   npm run db:init           # crea la tabla products y 2 productos de ejemplo
   npm run dev               # API en http://localhost:5000
   ```

3. **Frontend** (otra terminal):
   ```bash
   cd frontend
   npm install
   npm run dev               # http://localhost:5173
   ```

## Variables de entorno (backend/.env)
| Variable | Descripción |
|---|---|
| PORT | Puerto de la API (5000) |
| DATABASE_URL | Cadena de conexión a PostgreSQL |
| CLIENT_URL | Origen de React permitido por CORS |

## Endpoints
| Método | Ruta | Respuesta |
|---|---|---|
| GET | /api/products | 200 `{ "success": true, "data": [ {id, name, price, image} ] }` |

## Pruebas
(Se agregan en la Jornada 2: Jest + Supertest.)
