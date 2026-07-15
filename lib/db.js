// lib/db.js — conexión a Postgres (Neon, Supabase, etc.)
import pg from "pg";

let pool;
export function getPool() {
  if (!pool) {
    pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 3,
    });
  }
  return pool;
}

export async function query(text, params) {
  const res = await getPool().query(text, params);
  return res;
}
