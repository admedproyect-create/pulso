// api/cron/refresh-tokens.js — renueva los tokens de Instagram antes de que expiren.
// Vercel Cron lo llama en el horario definido en vercel.json.
// Los tokens largos duran ~60 días y NO se renuevan solos: hay que refrescarlos
// mientras siguen válidos. Aquí refrescamos los que expiran dentro de 10 días.
import { query } from "../../lib/db.js";
import { encrypt, decrypt } from "../../lib/crypto.js";
import { refreshLongLivedToken } from "../../lib/meta.js";

export default async function handler(req, res) {
  // Seguridad: sólo Vercel Cron (o quien tenga el secreto) puede ejecutarlo.
  const auth = req.headers.authorization || "";
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "No autorizado" });
  }

  try {
    const r = await query(
      `SELECT id, access_token FROM clients
       WHERE token_expires_at IS NULL OR token_expires_at < now() + interval '10 days'`
    );

    let ok = 0, fail = 0;
    for (const row of r.rows) {
      try {
        const current = decrypt(row.access_token);
        const refreshed = await refreshLongLivedToken(current); // { access_token, expires_in }
        const newExp = new Date(Date.now() + (refreshed.expires_in || 5184000) * 1000);
        await query(
          `UPDATE clients SET access_token = $1, token_expires_at = $2 WHERE id = $3`,
          [encrypt(refreshed.access_token), newExp, row.id]
        );
        ok++;
      } catch (e) {
        console.error("refresh fallo cliente", row.id, e.message);
        fail++;
      }
    }
    res.status(200).json({ refreshed: ok, failed: fail, checked: r.rows.length });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
