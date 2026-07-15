// api/upload-url.js — pide una URL firmada para subir un archivo de media.
// POST { filename, contentType } -> { uploadUrl, publicUrl }
// El navegador hace luego un PUT del archivo a uploadUrl, y usa publicUrl al publicar.
import { createUploadUrl, isConfigured } from "../lib/storage.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });
  if (!isConfigured()) return res.status(501).json({ error: "Almacenamiento no configurado (faltan variables S3_*)" });

  const { filename, contentType } = req.body || {};
  if (!filename || !contentType) return res.status(400).json({ error: "Falta filename o contentType" });

  const safe = String(filename).replace(/[^a-zA-Z0-9._-]/g, "_").slice(-80);
  const key = `media/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safe}`;

  try {
    const out = await createUploadUrl({ key, contentType });
    res.status(200).json(out);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
