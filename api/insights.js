// api/insights.js — métricas reales de una cuenta conectada.
// GET /api/insights?client_id=UUID
import { query } from "../lib/db.js";
import { decrypt } from "../lib/crypto.js";
import { getAccountInsights, getProfile } from "../lib/meta.js";

export default async function handler(req, res) {
  const { client_id } = req.query;
  if (!client_id) return res.status(400).json({ error: "Falta client_id" });
  try {
    const r = await query(`SELECT ig_user_id, access_token FROM clients WHERE id = $1`, [client_id]);
    if (!r.rows.length) return res.status(404).json({ error: "Cliente no encontrado" });

    const { ig_user_id } = r.rows[0];
    const token = decrypt(r.rows[0].access_token); // <-- descifrado sólo en memoria

    const [profile, insights] = await Promise.all([
      getProfile(token),
      getAccountInsights(ig_user_id, token).catch(() => null),
    ]);
    res.status(200).json({ profile, insights });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
