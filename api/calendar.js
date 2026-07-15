// api/calendar.js — guarda y lee el calendario de un cliente en la base.
// GET    /api/calendar?client_id=UUID           -> lista las publicaciones
// POST   /api/calendar   { ...post }             -> crea o actualiza una publicación
// DELETE /api/calendar?id=UUID                   -> elimina una publicación
import { query } from "../lib/db.js";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const { client_id } = req.query;
      if (!client_id) return res.status(400).json({ error: "Falta client_id" });
      const r = await query(
        `SELECT id, day_of_week, time_hhmm, format, title, caption, media_url, status, ig_media_id, published_at
         FROM scheduled_posts WHERE client_id = $1 ORDER BY day_of_week, time_hhmm`,
        [client_id]
      );
      return res.status(200).json({ posts: r.rows });
    }

    if (req.method === "POST") {
      const b = req.body || {};
      if (!b.client_id) return res.status(400).json({ error: "Falta client_id" });
      if (b.id) {
        const r = await query(
          `UPDATE scheduled_posts
           SET day_of_week=$2, time_hhmm=$3, format=$4, title=$5, caption=$6, media_url=$7
           WHERE id=$1 RETURNING *`,
          [b.id, b.day_of_week, b.time_hhmm, b.format, b.title, b.caption || null, b.media_url || null]
        );
        return res.status(200).json({ post: r.rows[0] });
      }
      const r = await query(
        `INSERT INTO scheduled_posts (client_id, day_of_week, time_hhmm, format, title, caption, media_url)
         VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
        [b.client_id, b.day_of_week, b.time_hhmm, b.format, b.title, b.caption || null, b.media_url || null]
      );
      return res.status(201).json({ post: r.rows[0] });
    }

    if (req.method === "DELETE") {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: "Falta id" });
      await query(`DELETE FROM scheduled_posts WHERE id = $1`, [id]);
      return res.status(200).json({ deleted: true });
    }

    res.status(405).json({ error: "Método no permitido" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
