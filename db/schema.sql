-- db/schema.sql — ejecútalo una vez en tu base de datos (Neon / Supabase / Postgres)

-- Una agencia = tú (o cada usuario de tu SaaS a futuro).
CREATE TABLE IF NOT EXISTS agencies (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT,
  email       TEXT UNIQUE,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Cada cuenta de Instagram conectada por la agencia.
CREATE TABLE IF NOT EXISTS clients (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id         UUID REFERENCES agencies(id) ON DELETE CASCADE,
  ig_user_id        TEXT NOT NULL,
  username          TEXT NOT NULL,
  account_type      TEXT,
  followers_count   INTEGER,
  media_count       INTEGER,
  -- Guarda el token CIFRADO (ver nota en el README). Aquí el campo lo aloja.
  access_token      TEXT NOT NULL,
  token_expires_at  TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT now(),
  UNIQUE (agency_id, ig_user_id)
);

-- Calendario por cliente (lo que hoy vive en memoria en el prototipo).
CREATE TABLE IF NOT EXISTS scheduled_posts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id   UUID REFERENCES clients(id) ON DELETE CASCADE,
  day_of_week SMALLINT,        -- 0 = lunes ... 6 = domingo
  time_hhmm   TEXT,            -- "19:30"
  format      TEXT,            -- Reel | Carrusel | Historia | Post
  title       TEXT,
  caption     TEXT,
  media_url   TEXT,            -- URL pública de la imagen/video a publicar
  status      TEXT DEFAULT 'draft', -- draft | scheduled | published
  ig_media_id TEXT,            -- ID que devuelve Instagram al publicar
  published_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Migración para bases ya creadas (idempotente):
ALTER TABLE scheduled_posts ADD COLUMN IF NOT EXISTS media_url TEXT;
ALTER TABLE scheduled_posts ADD COLUMN IF NOT EXISTS ig_media_id TEXT;
ALTER TABLE scheduled_posts ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_clients_agency ON clients(agency_id);
CREATE INDEX IF NOT EXISTS idx_posts_client ON scheduled_posts(client_id);
