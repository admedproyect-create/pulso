// api/instagram/callback.js — Instagram devuelve aquí el "code" tras autorizar.
// code -> token corto -> token largo -> perfil -> guardamos el cliente (token CIFRADO).
import { exchangeCodeForToken, getLongLivedToken, getProfile } from "../../lib/meta.js";
import { encrypt } from "../../lib/crypto.js";
import { query } from "../../lib/db.js";

export default async function handler(req, res) {
  const { code, error, state } = req.query;
  const APP_URL = process.env.FRONTEND_URL || "/";

  if (error) return redirect(res, `${APP_URL}?connected=cancel`);
  if (!code) return redirect(res, `${APP_URL}?connected=error`);

  // Anti-CSRF: el "state" debe coincidir con la cookie que puso login.js
  const cookieState = readCookie(req, "pulso_oauth_state");
  if (!state || !cookieState || state !== cookieState) {
    return redirect(res, `${APP_URL}?connected=error&reason=state`);
  }

  try {
    const short = await exchangeCodeForToken(code);            // { access_token, user_id }
    const long = await getLongLivedToken(short.access_token);  // { access_token, expires_in }
    const profile = await getProfile(long.access_token);       // { username, account_type, ... }

    const expiresAt = new Date(Date.now() + (long.expires_in || 5184000) * 1000);
    const encToken = encrypt(long.access_token);               // <-- cifrado en reposo
    const agencyId = await ensureDemoAgency();

    await query(
      `INSERT INTO clients (agency_id, ig_user_id, username, account_type, followers_count, media_count, access_token, token_expires_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       ON CONFLICT (agency_id, ig_user_id)
       DO UPDATE SET username=$3, account_type=$4, followers_count=$5, media_count=$6, access_token=$7, token_expires_at=$8`,
      [agencyId, profile.user_id, profile.username, profile.account_type,
       profile.followers_count || null, profile.media_count || null, encToken, expiresAt]
    );

    // Limpia la cookie de state
    res.setHeader("Set-Cookie", "pulso_oauth_state=; Path=/; Max-Age=0");
    return redirect(res, `${APP_URL}?connected=ok&user=${encodeURIComponent(profile.username)}`);
  } catch (e) {
    console.error("callback error:", e.message);
    return redirect(res, `${APP_URL}?connected=error`);
  }
}

async function ensureDemoAgency() {
  const r = await query(
    `INSERT INTO agencies (name, email) VALUES ('Demo', 'demo@pulso.app')
     ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name RETURNING id`
  );
  return r.rows[0].id;
}

function readCookie(req, name) {
  const raw = req.headers.cookie || "";
  const found = raw.split(";").map((c) => c.trim()).find((c) => c.startsWith(name + "="));
  return found ? decodeURIComponent(found.split("=")[1]) : null;
}

function redirect(res, url) { res.writeHead(302, { Location: url }); res.end(); }
