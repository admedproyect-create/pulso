// lib/crypto.js — cifra/descifra los tokens de Instagram antes de guardarlos.
// Usa AES-256-GCM (cifrado autenticado). La clave vive en TOKEN_ENCRYPTION_KEY.
//
// Genera tu clave una vez con:
//   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
// y pégala en TOKEN_ENCRYPTION_KEY (64 caracteres hex).

import crypto from "crypto";

const ALGO = "aes-256-gcm";

function getKey() {
  const raw = process.env.TOKEN_ENCRYPTION_KEY || "";
  const key = Buffer.from(raw, "hex");
  if (key.length !== 32) {
    throw new Error("TOKEN_ENCRYPTION_KEY debe ser 32 bytes en hex (64 caracteres).");
  }
  return key;
}

// Devuelve "iv:authTag:ciphertext" en base64. Guarda ESTA cadena en la base.
export function encrypt(plainText) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, getKey(), iv);
  const ct = Buffer.concat([cipher.update(String(plainText), "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv.toString("base64"), tag.toString("base64"), ct.toString("base64")].join(":");
}

export function decrypt(payload) {
  const [ivB64, tagB64, ctB64] = String(payload).split(":");
  if (!ivB64 || !tagB64 || !ctB64) throw new Error("Token cifrado con formato inválido.");
  const decipher = crypto.createDecipheriv(ALGO, getKey(), Buffer.from(ivB64, "base64"));
  decipher.setAuthTag(Buffer.from(tagB64, "base64"));
  const pt = Buffer.concat([decipher.update(Buffer.from(ctB64, "base64")), decipher.final()]);
  return pt.toString("utf8");
}
