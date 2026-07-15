// api/generar.js — genera ideas de contenido con IA. Protege tu clave de Anthropic.
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });
  const { niche, audience, goal } = req.body || {};
  if (!niche) return res.status(400).json({ error: "Falta el nicho" });

  const prompt = `Eres un estratega de contenido senior para redes sociales. Genera 4 ideas de contenido para una cuenta del nicho "${niche}"${audience ? `, dirigida a: ${audience}` : ""}. Objetivo principal: ${goal || "crecer"}.

Responde ÚNICAMENTE con un objeto JSON válido, sin texto adicional, sin markdown, sin backticks. Estructura exacta:
{"ideas":[{"titulo":"...","formato":"Reel|Carrusel|Historia|Post","gancho":"un hook de apertura potente de 1 frase","caption":"caption lista para publicar con saltos de línea \\n y 1-2 emojis","hashtags":["#tag1","#tag2","#tag3","#tag4","#tag5"],"plataformas":["Instagram","TikTok","YouTube Shorts","Facebook","LinkedIn"],"por_que_funciona":"1 frase explicando el principio psicológico o de algoritmo"}]}

Las ideas deben ser específicas y accionables, no genéricas. Varía los formatos. Adapta plataformas según el tipo de contenido. Todo en español.`;

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1500,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const data = await r.json();
    if (data.error) return res.status(502).json({ error: data.error.message || "Error de la API" });
    let text = (data.content || []).map((b) => (b.type === "text" ? b.text : "")).join("");
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(text);
    if (!parsed.ideas || !parsed.ideas.length) return res.status(502).json({ error: "Respuesta vacía" });
    return res.status(200).json(parsed);
  } catch (e) {
    return res.status(500).json({ error: "No se pudieron generar las ideas." });
  }
}
