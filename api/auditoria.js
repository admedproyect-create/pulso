// api/auditoria.js — auditoría instantánea SIN conectar cuenta.
// Recibe lo que la persona nos cuenta de su cuenta y devuelve un diagnóstico real
// hecho por IA: puntaje, errores probables y acciones concretas para esta semana.
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });

  const { handle, nicho, frecuencia, formato, objetivo } = req.body || {};
  if (!nicho) return res.status(400).json({ error: "Falta el nicho" });

  const prompt = `Eres un auditor senior de cuentas de Instagram. Haz un diagnóstico honesto y accionable de esta cuenta a partir de lo que su dueño reporta:

- Cuenta: @${handle || "sin especificar"}
- Nicho: ${nicho}
- Frecuencia de publicación: ${frecuencia || "no especificada"}
- Formato que más usa: ${formato || "no especificado"}
- Objetivo principal: ${objetivo || "crecer"}

Basándote en benchmarks reales del sector y en los patrones típicos de cuentas con este perfil, identifica qué es lo MÁS probable que esté frenando su crecimiento.

Responde ÚNICAMENTE con un objeto JSON válido, sin markdown ni backticks. Estructura exacta:
{"puntaje":75,"veredicto":"3-5 palabras contundentes, ej: 'Buen contenido, mal horario'","diagnostico":"2 frases directas explicando el estado general de la cuenta","errores":[{"titulo":"error concreto en 4-7 palabras","detalle":"1 frase explicando por qué le está costando alcance","impacto":"alto"}],"acciones":[{"accion":"acción específica y ejecutable esta semana","resultado":"qué ganaría, con cifra estimada realista"}],"mejor_momento":{"dia":"día de la semana","franja":"ej: 7:00 - 9:00 PM","razon":"1 frase corta"},"quick_win":"la ÚNICA cosa que debería cambiar mañana mismo, 1 frase potente"}

Reglas:
- "puntaje" entre 35 y 88, coherente con lo reportado (menos frecuencia = menos puntaje; formato de bajo rendimiento = menos puntaje).
- Exactamente 3 errores, ordenados de mayor a menor impacto. El campo "impacto" solo puede ser "alto", "medio" o "bajo".
- Exactamente 3 acciones, concretas y específicas del nicho (nada de consejos genéricos tipo "publica contenido de valor").
- Sé directo y honesto, como un consultor que cobra caro. Nada de halagos vacíos.
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
        max_tokens: 1400,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await r.json();
    if (data.error) return res.status(502).json({ error: data.error.message || "Error de la API" });

    let text = (data.content || []).map((b) => (b.type === "text" ? b.text : "")).join("");
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(text);
    if (!parsed.errores || !parsed.acciones) return res.status(502).json({ error: "Respuesta incompleta" });

    return res.status(200).json(parsed);
  } catch (e) {
    return res.status(500).json({ error: "No se pudo completar la auditoría." });
  }
}
