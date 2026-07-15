// api/competitor.js — datos PÚBLICOS de una cuenta ajena (Business Discovery).
// GET /api/competitor?username=lacompetencia
// Requiere AGENCY_IG_ID + AGENCY_FB_TOKEN (flujo Graph API con página de Facebook).
import { businessDiscovery } from "../lib/meta.js";

export default async function handler(req, res) {
  const { username } = req.query;
  if (!username) return res.status(400).json({ error: "Falta username" });
  if (!process.env.AGENCY_IG_ID || !process.env.AGENCY_FB_TOKEN) {
    return res.status(501).json({ error: "Business Discovery no configurado. Añade AGENCY_IG_ID y AGENCY_FB_TOKEN." });
  }
  try {
    const data = await businessDiscovery(username.replace(/^@/, ""));
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
