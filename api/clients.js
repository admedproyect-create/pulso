// api/clients.js — lista las cuentas conectadas de la agencia (sin exponer tokens)
import { query } from "../lib/db.js";

export default async function handler(req, res) {
  try {
    const r = await query(
      `SELECT id, ig_user_id, username, account_type, followers_count, media_count, created_at
       FROM clients ORDER BY created_at DESC`
    );
    res.status(200).json({ clients: r.rows });
  } catch (e) {
    res.status(500).json({ error: "No se pudieron cargar los clientes" });
  }
}
