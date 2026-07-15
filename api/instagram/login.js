// api/instagram/login.js — inicia el flujo: manda al cliente a autorizar en Instagram
import { buildAuthUrl } from "../../lib/meta.js";
import crypto from "crypto";

export default function handler(req, res) {
  // "state" protege contra CSRF y te permite saber qué agencia conecta.
  // En producción, guárdalo en una cookie/sesión y valídalo en el callback.
  const state = crypto.randomBytes(16).toString("hex");
  const url = buildAuthUrl(state);
  res.setHeader("Set-Cookie", `pulso_oauth_state=${state}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600`);
  res.writeHead(302, { Location: url });
  res.end();
}
