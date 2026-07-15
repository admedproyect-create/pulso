// lib/meta.js — helpers para la API oficial de Instagram (Instagram Login)
// Docs: https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login

const IG_AUTH = "https://api.instagram.com/oauth/authorize";
const IG_TOKEN = "https://api.instagram.com/oauth/access_token";
const IG_GRAPH = "https://graph.instagram.com";

// Permisos mínimos. Añade "instagram_business_content_publish" para publicar,
// y activa insights en el panel de la app si quieres métricas de alcance/perfil.
const SCOPES = ["instagram_business_basic"];

// 1) URL a la que enviamos al cliente para que autorice
export function buildAuthUrl(state) {
  const params = new URLSearchParams({
    client_id: process.env.INSTAGRAM_APP_ID,
    redirect_uri: process.env.INSTAGRAM_REDIRECT_URI,
    response_type: "code",
    scope: SCOPES.join(","),
    state,
  });
  return `${IG_AUTH}?${params.toString()}`;
}

// 2) Cambiar el "code" por un token corto (+ user_id)
export async function exchangeCodeForToken(code) {
  const body = new URLSearchParams({
    client_id: process.env.INSTAGRAM_APP_ID,
    client_secret: process.env.INSTAGRAM_APP_SECRET,
    grant_type: "authorization_code",
    redirect_uri: process.env.INSTAGRAM_REDIRECT_URI,
    code,
  });
  const r = await fetch(IG_TOKEN, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const data = await r.json();
  if (data.error_type || data.error) throw new Error(data.error_message || "Fallo al obtener token");
  return data; // { access_token, user_id, permissions }
}

// 3) Cambiar el token corto por uno largo (60 días)
export async function getLongLivedToken(shortToken) {
  const params = new URLSearchParams({
    grant_type: "ig_exchange_token",
    client_secret: process.env.INSTAGRAM_APP_SECRET,
    access_token: shortToken,
  });
  const r = await fetch(`${IG_GRAPH}/access_token?${params.toString()}`);
  const data = await r.json();
  if (data.error) throw new Error(data.error.message);
  return data; // { access_token, token_type, expires_in }
}

// 4) Refrescar un token largo antes de que expire (córrelo cada ~50 días)
export async function refreshLongLivedToken(longToken) {
  const params = new URLSearchParams({ grant_type: "ig_refresh_token", access_token: longToken });
  const r = await fetch(`${IG_GRAPH}/refresh_access_token?${params.toString()}`);
  const data = await r.json();
  if (data.error) throw new Error(data.error.message);
  return data;
}

// 5) Perfil básico de la cuenta conectada
export async function getProfile(token) {
  const fields = "user_id,username,account_type,followers_count,media_count,profile_picture_url";
  const r = await fetch(`${IG_GRAPH}/me?fields=${fields}&access_token=${token}`);
  const data = await r.json();
  if (data.error) throw new Error(data.error.message);
  return data;
}

// 6) Insights de la cuenta (requiere permiso de insights habilitado)
export async function getAccountInsights(igUserId, token) {
  const metric = "reach,profile_views";
  const r = await fetch(`${IG_GRAPH}/${igUserId}/insights?metric=${metric}&period=day&access_token=${token}`);
  const data = await r.json();
  if (data.error) throw new Error(data.error.message);
  return data;
}

// 7) Competencia — datos PÚBLICOS de otra cuenta profesional (Business Discovery).
// Nota: Business Discovery vive en la Graph API de Facebook (graph.facebook.com) y
// requiere tu propia cuenta IG Business vinculada a una página. Es un flujo aparte;
// aquí queda como referencia. Rellena AGENCY_IG_ID y AGENCY_FB_TOKEN si lo usas.
export async function businessDiscovery(competitorUsername) {
  const ver = process.env.GRAPH_API_VERSION || "v25.0";
  const fields = `business_discovery.username(${competitorUsername}){username,followers_count,media_count,media.limit(6){caption,like_count,comments_count,media_type,timestamp}}`;
  const url = `https://graph.facebook.com/${ver}/${process.env.AGENCY_IG_ID}?fields=${encodeURIComponent(fields)}&access_token=${process.env.AGENCY_FB_TOKEN}`;
  const r = await fetch(url);
  const data = await r.json();
  if (data.error) throw new Error(data.error.message);
  return data.business_discovery;
}

// ============================================================
//  PUBLICACIÓN DE CONTENIDO (Content Publishing)
//  Flujo: crear contenedor -> esperar status FINISHED -> publicar.
//  La media (imagen/video) DEBE estar en una URL pública: Meta la descarga.
// ============================================================
const GRAPH_VER = process.env.GRAPH_API_VERSION || "v25.0";
const IG_PUB = `https://graph.instagram.com/${GRAPH_VER}`;

async function post(url, params) {
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(params),
  });
  const data = await r.json();
  if (data.error) throw new Error(data.error.message);
  return data;
}

// Crea un contenedor de imagen (o hijo de carrusel con isCarouselItem=true)
export async function createImageContainer(igId, token, { imageUrl, caption, isCarouselItem, altText }) {
  const p = { image_url: imageUrl, access_token: token };
  if (caption) p.caption = caption;
  if (isCarouselItem) p.is_carousel_item = "true";
  if (altText) p.alt_text = altText;
  return post(`${IG_PUB}/${igId}/media`, p); // { id }
}

// Crea un contenedor de Reel (video en URL pública)
export async function createReelContainer(igId, token, { videoUrl, caption, coverUrl, shareToFeed = true, isCarouselItem }) {
  const p = { media_type: "REELS", video_url: videoUrl, access_token: token, share_to_feed: String(shareToFeed) };
  if (caption) p.caption = caption;
  if (coverUrl) p.cover_url = coverUrl;
  if (isCarouselItem) p.is_carousel_item = "true";
  return post(`${IG_PUB}/${igId}/media`, p);
}

// Crea el contenedor padre del carrusel a partir de los IDs de los hijos
export async function createCarouselContainer(igId, token, { childIds, caption }) {
  const p = { media_type: "CAROUSEL", children: childIds.join(","), access_token: token };
  if (caption) p.caption = caption;
  return post(`${IG_PUB}/${igId}/media`, p);
}

// Consulta el estado de un contenedor
export async function getContainerStatus(containerId, token) {
  const r = await fetch(`${IG_PUB}/${containerId}?fields=status_code&access_token=${token}`);
  const data = await r.json();
  if (data.error) throw new Error(data.error.message);
  return data.status_code; // IN_PROGRESS | FINISHED | ERROR | EXPIRED
}

// Espera a que el contenedor termine de procesarse (video/carrusel)
export async function waitForContainer(containerId, token, { tries = 20, intervalMs = 3000 } = {}) {
  for (let i = 0; i < tries; i++) {
    const status = await getContainerStatus(containerId, token);
    if (status === "FINISHED") return true;
    if (status === "ERROR" || status === "EXPIRED") throw new Error(`Contenedor ${status}`);
    await new Promise((res) => setTimeout(res, intervalMs));
  }
  throw new Error("El contenedor no terminó a tiempo (video muy pesado o lento).");
}

// Publica un contenedor ya procesado
export async function publishContainer(igId, token, creationId) {
  return post(`${IG_PUB}/${igId}/media_publish`, { creation_id: creationId, access_token: token }); // { id }
}

// Orquestador de alto nivel: recibe el formato + media y publica.
// mediaUrls: array de URLs públicas. Para Reel/imagen usa la primera.
export async function publishPost(igId, token, { format, caption, mediaUrls = [] }) {
  if (!mediaUrls.length) throw new Error("Faltan las URLs de la media a publicar.");

  if (format === "Reel") {
    const c = await createReelContainer(igId, token, { videoUrl: mediaUrls[0], caption });
    await waitForContainer(c.id, token);
    return publishContainer(igId, token, c.id);
  }

  if (format === "Carrusel") {
    const children = [];
    for (const url of mediaUrls) {
      const child = await createImageContainer(igId, token, { imageUrl: url, isCarouselItem: true });
      children.push(child.id);
    }
    const parent = await createCarouselContainer(igId, token, { childIds: children, caption });
    await waitForContainer(parent.id, token);
    return publishContainer(igId, token, parent.id);
  }

  // Imagen / Post simple
  const c = await createImageContainer(igId, token, { imageUrl: mediaUrls[0], caption });
  await waitForContainer(c.id, token, { tries: 6, intervalMs: 2000 });
  return publishContainer(igId, token, c.id);
}
