// api/publish.js — publica una publicación en Instagram (Reel, carrusel o imagen).
// POST { post_id }                      -> publica una publicación guardada del calendario
//   ó  { client_id, format, caption, media_urls:[...] }  -> publicación directa
//
// Nota: las Historias no se automatizan aquí. La media debe estar en URLs públicas.
import { query } from "../lib/db.js";
import { decrypt } from "../lib/crypto.js";
import { publishPost } from "../lib/meta.js";

// Los Reels pueden tardar en procesarse: pide más tiempo de ejecución (plan Pro).
export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });
  const b = req.body || {};

  try {
    let clientId = b.client_id, format = b.format, caption = b.caption;
    let mediaUrls = b.media_urls || [];
    let postId = b.post_id || null;

    // Si viene post_id, cargamos la publicación guardada.
    if (postId) {
      const p = await query(`SELECT * FROM scheduled_posts WHERE id = $1`, [postId]);
      if (!p.rows.length) return res.status(404).json({ error: "Publicación no encontrada" });
      const post = p.rows[0];
      clientId = post.client_id; format = post.format; caption = post.caption;
      mediaUrls = post.media_url ? [post.media_url] : [];
    }

    if (!clientId) return res.status(400).json({ error: "Falta client_id" });
    if (!mediaUrls.length) return res.status(400).json({ error: "Faltan las URLs de media (públicas)" });

    // Token de la cuenta (descifrado en memoria).
    const c = await query(`SELECT ig_user_id, access_token FROM clients WHERE id = $1`, [clientId]);
    if (!c.rows.length) return res.status(404).json({ error: "Cliente no encontrado" });
    const igId = c.rows[0].ig_user_id;
    const token = decrypt(c.rows[0].access_token);

    const result = await publishPost(igId, token, { format, caption, mediaUrls });

    // Marca la publicación como publicada.
    if (postId) {
      await query(
        `UPDATE scheduled_posts SET status='published', ig_media_id=$2, published_at=now() WHERE id=$1`,
        [postId, result.id]
      );
    }
    res.status(200).json({ published: true, ig_media_id: result.id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
