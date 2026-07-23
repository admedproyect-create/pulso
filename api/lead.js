// api/lead.js — guarda los datos de quien descarga su plan de 8 días.
// POST { nombre, email, handle, nicho, puntaje, origen }
// GET  ?key=CRON_SECRET  -> devuelve la lista de leads (solo para ti)
import { query } from "../lib/db.js";

export default async function handler(req, res) {
  // --- Consultar tus leads (protegido con CRON_SECRET) ---
  if (req.method === "GET") {
    const { key } = req.query;
    if (!process.env.CRON_SECRET || key !== process.env.CRON_SECRET) {
      return res.status(401).json({ error: "No autorizado" });
    }
    try {
      const r = await query(
        `SELECT nombre, email, ig_handle, nicho, puntaje, origen, created_at
         FROM leads ORDER BY created_at DESC LIMIT 500`
      );
      return res.status(200).json({ total: r.rows.length, leads: r.rows });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });

  const { nombre, email, handle, nicho, puntaje, origen } = req.body || {};
  if (!email || !String(email).includes("@")) {
    return res.status(400).json({ error: "Correo no válido" });
  }

  try {
    await query(
      `INSERT INTO leads (nombre, email, ig_handle, nicho, puntaje, origen)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [
        (nombre || "").slice(0, 120) || null,
        String(email).toLowerCase().slice(0, 160),
        (handle || "").replace(/^@/, "").slice(0, 80) || null,
        (nicho || "").slice(0, 80) || null,
        Number.isFinite(Number(puntaje)) ? Number(puntaje) : null,
        (origen || "plan-8-dias").slice(0, 60),
      ]
    );
    return res.status(201).json({ ok: true });
  } catch (e) {
    // Si la tabla aún no existe, no bloqueamos la descarga del usuario.
    console.error("lead error:", e.message);
    return res.status(200).json({ ok: false });
  }
}
