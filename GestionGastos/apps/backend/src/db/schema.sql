-- Script de creacion de esquema para GestionGastos
-- Motor: PostgreSQL (probado con pgAdmin4)
--
-- Antes de ejecutar este script:
--   1. Crea la base de datos "gestor_gastos_db" desde pgAdmin4
--      (clic derecho en "Databases" -> Create -> Database... -> Name: gestor_gastos_db)
--   2. Conectate a esa base de datos y abre el "Query Tool"
--   3. Pega y ejecuta este script completo
--
-- Nota: el backend tambien crea esta tabla automaticamente al arrancar
-- (CREATE TABLE IF NOT EXISTS), asi que ejecutar este script a mano es
-- opcional, pero se deja disponible para revision academica y para crear
-- la base de datos manualmente desde pgAdmin4.

-- Necesaria para generar UUID con gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS usuarios (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre         VARCHAR(150) NOT NULL,
  email          VARCHAR(150) NOT NULL UNIQUE,
  password_hash  VARCHAR(255) NOT NULL,
  role           VARCHAR(20)  NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios (email);
