# Pulso — App completa (frontend + backend)

Todo en un solo proyecto listo para desplegar en **Vercel**: la interfaz (React)
y el backend (funciones en `/api`) que conecta cuentas reales de Instagram,
protege tu clave de IA y guarda a tus clientes.

```
pulso-app/
├── src/
│   ├── App.jsx              ← toda la interfaz (inicio, análisis, ideas, calendario)
│   └── main.jsx
├── api/
│   ├── generar.js          ← ideas con IA (protege tu clave de Anthropic)
│   ├── clients.js          ← lista de cuentas conectadas
│   ├── insights.js         ← métricas reales de una cuenta
│   ├── competitor.js       ← datos públicos de competencia (opcional)
│   └── instagram/
│       ├── login.js        ← inicia el login de Instagram
│       └── callback.js     ← guarda la cuenta + token tras autorizar
├── lib/  (meta.js, db.js)  ← ayudantes de Meta y base de datos
├── db/schema.sql           ← tablas de la base
├── index.html · vite.config.js · package.json
└── .env.example
```

## Qué funciona desde el minuto uno
- Toda la interfaz (con datos demo).
- El **generador de ideas con IA** (en cuanto pongas `ANTHROPIC_API_KEY`).

## Qué requiere aprobación de Meta (2–4 semanas)
- Conectar cuentas reales de Instagram y ver métricas en vivo.
- Hasta la aprobación puedes conectar 25 cuentas de prueba.

---

## Despliegue en 4 pasos

### 1. Base de datos
Crea una Postgres gratis en **Neon** (neon.tech) o **Supabase**. Copia su cadena
a `DATABASE_URL` y ejecuta `db/schema.sql` en su editor SQL.

### 2. Clave de IA
En console.anthropic.com crea una clave y ponla en `ANTHROPIC_API_KEY`.

### 3. App de Meta (para Instagram real)
1. developers.facebook.com → crea app **Business** → añade **Instagram** →
   **API setup with Instagram login**.
2. Registra la Redirect URI: `https://TU-DOMINIO.vercel.app/api/instagram/callback`
3. Copia **Instagram App ID** y **App Secret** al `.env`.
4. Permiso mínimo: `instagram_business_basic`.

### 4. Subir a Vercel
1. Sube esta carpeta a GitHub.
2. En Vercel: **Add New → Project**, elige el repo. Detecta Vite solo.
3. En **Settings → Environment Variables** pega todo lo del `.env.example`.
4. **Deploy**. En 2 min tienes tu app viva con dominio.

> El frontend llama a `/api/...` en el mismo dominio, así que no hay que
> configurar nada extra: Vercel sirve la interfaz y las funciones juntas.

---

## Probar en local
```bash
npm install
npm install -g vercel
vercel dev
```
Crea un `.env` (copia de `.env.example`) con tus claves. Usa `vercel dev`
(no `npm run dev`) para que las funciones de `/api` corran junto al frontend.

---

## Seguridad (ya implementada) 🔒

Esta versión incluye tres capas de seguridad listas:

**1. Tokens cifrados en reposo (AES-256-GCM).**
Los tokens de Instagram nunca se guardan en texto plano. `lib/crypto.js` los cifra
antes de escribirlos en la base y los descifra sólo en memoria al usarlos. Necesitas
una clave en `TOKEN_ENCRYPTION_KEY` — genérala con:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**2. Refresco automático de tokens (Vercel Cron).**
Los tokens largos duran ~60 días y no se renuevan solos. `api/cron/refresh-tokens.js`
corre a diario (ver `vercel.json`) y renueva los que expiran dentro de 10 días, así
ningún cliente se desconecta. El endpoint está protegido con `CRON_SECRET`.

**3. Protección anti-CSRF en el login.**
`login.js` firma un `state` en una cookie y `callback.js` lo valida al volver, para
que nadie pueda inyectar una conexión falsa.

> Genera también el secreto del cron:
> ```bash
> node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"
> ```
> y ponlo en `CRON_SECRET`. Vercel envía ese secreto automáticamente al cron.

## Lo que aún puedes añadir más adelante
- **Autenticación de tu agencia** (hoy usa una agencia demo única) para que cada
  usuario de tu SaaS vea sólo sus clientes.
- Caché de métricas para no exceder el límite de llamadas de Meta.

## Publicación automática (ya implementada) 📤

Puedes guardar el calendario en la base y publicar en Instagram por la API.

**Endpoints:**
- `api/calendar.js` — GET / POST / DELETE de las publicaciones de un cliente
  (tabla `scheduled_posts`).
- `api/publish.js` — publica una publicación (`{ post_id }`) o una directa
  (`{ client_id, format, caption, media_urls }`).

**Cómo publica (modelo de contenedores de Meta):**
1. Crea un contenedor (`/{ig-id}/media`).
2. Espera a que el estado sea `FINISHED` (los videos se procesan en segundos-minutos).
3. Publica (`/{ig-id}/media_publish`).
Los carruseles crean un contenedor por imagen y luego uno padre.

**Requisitos y límites importantes:**
- La media (imagen/video) **debe estar en una URL pública** — Meta la descarga; no
  hay subida directa de archivos en el flujo estándar. Súbela antes a un bucket
  (S3, Cloudflare R2, Supabase Storage) y pasa la URL.
- Permiso necesario: `instagram_business_content_publish` (revisión aparte de Meta).
- Reels: 9:16, 5–90 s, MP4 (H.264/HEVC).
- Máximo **100 publicaciones por cuenta cada 24 h** (el carrusel cuenta como una).
- Las **Historias** no se automatizan en esta versión (el botón las bloquea).
- Los Reels pueden tardar en procesarse; `publish.js` usa `maxDuration: 60`
  (plan Pro de Vercel). Para videos grandes, conviene un job en segundo plano.

**En la interfaz:** al editar una publicación del calendario puedes añadir el
caption, **subir la imagen/video** (o pegar una URL), y pulsar "Publicar ahora".
Sin backend, simula; con backend desplegado, publica de verdad.

## Almacenamiento de media (ya implementado) 🗂️

Como Instagram descarga la media desde una **URL pública**, Pulso sube los archivos
a un bucket compatible con S3 y usa esa URL al publicar. Así no tienes que pegar
URLs a mano.

- `lib/storage.js` + `api/upload-url.js` — generan una **URL firmada** para que el
  navegador suba el archivo **directo al bucket** (los videos no pasan por la
  función serverless, evitando su límite de tamaño).
- En el modal de edición, el campo "Media" sube el archivo y rellena la URL solo.

**Configurar (recomendado: Cloudflare R2, con egreso gratis):**
1. Crea un bucket en Cloudflare R2 (o AWS S3 / Supabase Storage).
2. Hazlo público o ponle un dominio/CDN, y copia esa base a `S3_PUBLIC_BASE_URL`.
3. Crea una API key S3 y llena `S3_ENDPOINT`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`,
   `S3_SECRET_ACCESS_KEY` en las variables de entorno.
4. Configura CORS del bucket para permitir PUT desde tu dominio.

### Configurar CORS (archivo `cors.json` incluido)

El navegador sube el archivo directo al bucket, así que el bucket debe permitir
peticiones `PUT` desde tu dominio. El archivo `cors.json` en la raíz ya está listo
— solo cambia los dominios por los tuyos (deja los `localhost` para desarrollo).

**Cloudflare R2:**
- Panel: bucket → *Settings* → *CORS Policy* → *Edit* → pega el contenido de `cors.json`.
- O por CLI (Wrangler): `wrangler r2 bucket cors put pulso-media --rules ./cors.json`

**AWS S3:**
- Consola: bucket → *Permissions* → *Cross-origin resource sharing (CORS)* → pega `cors.json`.
- O por CLI: `aws s3api put-bucket-cors --bucket pulso-media --cors-configuration file://cors.json`

> Sin este paso, la subida del archivo falla con un error de CORS en el navegador.

## Lo que aún puedes añadir más adelante
- **Autenticación de tu agencia** (hoy usa una agencia demo única) para que cada
  usuario de tu SaaS vea sólo sus clientes.
- Caché de métricas para no exceder el límite de llamadas de Meta.
