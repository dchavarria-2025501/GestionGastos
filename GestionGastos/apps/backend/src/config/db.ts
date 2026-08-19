import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

function obtenerVariableObligatoria(nombre: string): string {
  const valor = process.env[nombre];
  if (!valor) {
    throw new Error(
      `Falta la variable de entorno "${nombre}". Revisa tu archivo .env (usa .env.example como base).`
    );
  }
  return valor;
}

export const pool = new Pool({
  host: obtenerVariableObligatoria('DB_HOST'),
  port: Number(process.env.DB_PORT || 5432),
  database: obtenerVariableObligatoria('DB_NAME'),
  user: obtenerVariableObligatoria('DB_USER'),
  password: obtenerVariableObligatoria('DB_PASSWORD'),
});

/**
 * Crea el esquema (tabla usuarios) si todavia no existe.
 * La base de datos "gestor_gastos_db" en si debe existir previamente
 * en PostgreSQL/pgAdmin4 (ver src/db/schema.sql y el README).
 */
export async function ensureSchema(): Promise<void> {
  const schemaPath = path.join(__dirname, '../db/schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
  await pool.query(schemaSql);
}

export async function verificarConexion(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query('SELECT 1');
  } finally {
    client.release();
  }
}
