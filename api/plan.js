// api/plan.js — genera un plan de contenido de 8 días a partir de la auditoría.
// Es el "imán": la persona lo ve en pantalla y deja su correo para descargarlo.
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });

  const { handle, nicho, frecuencia, formato, objetivo, diagnostico } = req.body || {};
  if (!nicho) return res.status(400).json({ error: "Falta el nicho" });

  const prompt = `Eres un estratega de contenido senior. Diseña un plan de contenido de 8 días para esta cuenta de Instagram:

- Cuenta: @${handle || "sin especificar"}
- Nicho: ${nicho}
- Publica actualmente: ${frecuencia || "no especificado"}
- Formato que más usa: ${formato || "no especificado"}
- Objetivo: ${objetivo || "crecer"}
${diagnostico ? `- Diagnóstico previo: ${diagnostico}` : ""}

Responde ÚNICAMENTE con un objeto JSON válido, sin markdown ni backticks. Estructura exacta:
{"resumen":"1 frase sobre la lógica del plan","dias":[{"dia":1,"nombre":"Lunes","formato":"Reel|Carrusel|Historia|Post","hora":"7:00 PM","titulo":"tema concreto de la publicación","gancho":"primera frase que detiene el scroll","idea":"1-2 frases de qué mostrar exactamente","hashtags":["#tag1","#tag2","#tag3"]}]}

Reglas:
- Exactamente 8 días, numerados del 1 al 8, empezando en Lunes.
- Varía los formatos con criterio: los Reels en las horas de mayor actividad, los carruseles educativos al mediodía, las historias en la mañana.
- Las horas deben ser realistas y coherentes con el nicho.
- Cada idea debe ser ESPECÍFICA del nicho, ejecutable sin equipo profesional. Nada de consejos vagos como "publica contenido de valor".
- Los ganchos deben ser potentes y concretos.
- Todo en español.`;

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
        max_tokens: 2600,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await r.json();
    if (data.error) return res.status(502).json({ error: data.error.message || "Error de la API" });

    let text = (data.content || []).map((b) => (b.type === "text" ? b.text : "")).join("");
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(text);
    if (!parsed.dias || !parsed.dias.length) return res.status(502).json({ error: "Respuesta incompleta" });

    return res.status(200).json(parsed);
  } catch (e) {
    return res.status(500).json({ error: "No se pudo generar el plan." });
  }
}
