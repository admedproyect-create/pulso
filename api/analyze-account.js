// api/analyze-account.js — lee el perfil y las publicaciones REALES de una cuenta
// conectada y deduce con IA su nicho, tono, audiencia y temas recurrentes.
// GET /api/analyze-account?client_id=UUID
import { query } from "../lib/db.js";
import { decrypt } from "../lib/crypto.js";
import { getProfileRich, getRecentMedia } from "../lib/meta.js";

export const config = { maxDuration: 30 };

export default async function handler(req, res) {
  const { client_id } = req.query;
  if (!client_id) return res.status(400).json({ error: "Falta client_id" });

  try {
    // 1) Token de la cuenta (descifrado sólo en memoria)
    const r = await query(`SELECT access_token, username FROM clients WHERE id = $1`, [client_id]);
    if (!r.rows.length) return res.status(404).json({ error: "Cuenta no encontrada" });
    const token = decrypt(r.rows[0].access_token);

    // 2) Datos reales de Instagram
    const profile = await getProfileRich(token);
    let media = [];
    try { media = await getRecentMedia(token, 12); } catch (_) { /* sin media: seguimos con el perfil */ }

    // 3) Resumimos lo que se le manda a la IA (captions recortadas)
    const captions = media
      .map((m) => (m.caption || "").replace(/\s+/g, " ").slice(0, 220))
      .filter(Boolean)
      .slice(0, 10);

    const formatos = media.reduce((acc, m) => {
      const t = m.media_type === "VIDEO" ? "Reel/Video" : m.media_type === "CAROUSEL_ALBUM" ? "Carrusel" : "Imagen";
      acc[t] = (acc[t] || 0) + 1;
      return acc;
    }, {});

    const resumen = `
Cuenta: @${profile.username}
Nombre: ${profile.name || "(sin nombre)"}
Biografía: ${profile.biography || "(sin biografía)"}
Sitio web: ${profile.website || "(ninguno)"}
Seguidores: ${profile.followers_count ?? "n/d"} · Publicaciones: ${profile.media_count ?? "n/d"}
Formatos usados recientemente: ${JSON.stringify(formatos)}
Textos de sus últimas publicaciones:
${captions.length ? captions.map((c, i) => `${i + 1}. ${c}`).join("\n") : "(no hay textos disponibles)"}
`.trim();

    // 4) La IA deduce el perfil de la cuenta
    const prompt = `Analiza esta cuenta real de Instagram y deduce su perfil de contenido.

${resumen}

Responde ÚNICAMENTE con un objeto JSON válido, sin markdown ni backticks. Estructura exacta:
{"nicho":"el nicho específico en 2-4 palabras","categoria":"una de: Fitness, Gastronomía, Moda, Inmobiliaria, Belleza, Finanzas personales, Viajes, Marca personal, Tecnología, Salud y bienestar, Otro","audiencia":"a quién le habla, 1 frase corta","tono":"el tono de comunicación en 2-3 palabras","temas":["tema1","tema2","tema3"],"resumen":"1 frase describiendo de qué trata la cuenta"}

Sé específico y basate SOLO en la evidencia mostrada. Si la información es escasa, deduce lo más probable a partir del nombre y la biografía. Todo en español.`;

    const air = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 700,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await air.json();
    if (data.error) return res.status(502).json({ error: data.error.message });

    let text = (data.content || []).map((b) => (b.type === "text" ? b.text : "")).join("");
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const perfil = JSON.parse(text);

    // 5) Guardamos el nicho detectado para no re-analizar en cada visita
    try {
      await query(`UPDATE clients SET niche = $2 WHERE id = $1`, [client_id, perfil.categoria || null]);
    } catch (_) { /* la columna puede no existir aún; no es crítico */ }

    res.status(200).json({
      cuenta: {
        username: profile.username,
        followers: profile.followers_count ?? null,
        media_count: profile.media_count ?? null,
        biography: profile.biography || null,
      },
      perfil,
      posts_analizados: captions.length,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
