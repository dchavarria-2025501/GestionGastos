# GestionGastos

Sistema de autenticacion JWT con control de roles (admin / user), construido como monorepo:

- `apps/backend`: API REST (Node.js + Express + TypeScript + JWT + bcrypt).
- `apps/frontend`: Aplicacion Angular (standalone components).

## Requisitos

- Node.js 18+
- pnpm (o npm/yarn, ajustando los comandos)

## 1. Backend

```bash
cd apps/backend
pnpm install       # o npm install
cp .env.example .env
pnpm run seed       # crea el usuario admin@gestiongastos.com / Admin123!
pnpm run dev         # levanta la API en http://localhost:3000
```

Endpoints principales:

| Metodo | Ruta                  | Descripcion                          | Protegido |
|--------|-----------------------|---------------------------------------|-----------|
| POST   | /api/auth/register    | Registro de usuario (rol "user")     | No        |
| POST   | /api/auth/login       | Login, devuelve JWT                  | No        |
| GET    | /api/auth/profile     | Datos del usuario autenticado         | Si        |
| GET    | /api/users            | Listar usuarios                       | Si (admin)|
| PUT    | /api/users/:id        | Editar usuario                        | Si (admin)|
| DELETE | /api/users/:id        | Eliminar usuario                      | Si (admin)|

El payload del JWT incluye `userId`, `email` y `role`.

## 2. Frontend

```bash
cd apps/frontend
pnpm install       # o npm install
pnpm start          # levanta Angular en http://localhost:4200
```

Rutas disponibles: `/login`, `/register`, `/dashboard`, `/profile`, `/admin/dashboard`.

- `AuthGuard` protege las rutas privadas.
- `RoleGuard` restringe `/admin/dashboard` solo a usuarios con rol `admin`.
- Un `HttpInterceptor` adjunta automaticamente el token JWT en cada peticion.
- El navbar cambia dinamicamente segun el estado de sesion y el rol.

## 3. Usuario administrador de prueba

Tras correr `pnpm run seed` en el backend:

- Email: `admin@gestiongastos.com`
- Password: `Admin123!`

## 4. Notas

- La base de datos usa `lowdb` (archivo JSON en `apps/backend/data/db.json`) para simplificar la ejecucion local. Puede sustituirse por MongoDB/PostgreSQL/MySQL manteniendo la misma interfaz de controladores.
- Las contraseñas se almacenan con hash `bcrypt`.
