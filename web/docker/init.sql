-- ============================================================
-- Schemas
-- ============================================================
CREATE SCHEMA IF NOT EXISTS api;
CREATE SCHEMA IF NOT EXISTS streamer;

-- ============================================================
-- API schema tables
-- ============================================================
CREATE TABLE IF NOT EXISTS api.users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       VARCHAR(255) NOT NULL UNIQUE,
  name        VARCHAR(255),
  password    VARCHAR(255),
  google_id   VARCHAR(255) UNIQUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS api.credentials (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform    VARCHAR(50) NOT NULL,
  type        VARCHAR(20) NOT NULL DEFAULT 'manual',
  rtmp_url    VARCHAR(512),
  stream_key  VARCHAR(512),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS api.livestream_sessions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id       VARCHAR(255) NOT NULL,
  s3_key           VARCHAR(512) NOT NULL,
  status           VARCHAR(20) NOT NULL DEFAULT 'pending',
  platform_targets JSONB NOT NULL DEFAULT '[]',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Streamer schema tables
-- ============================================================
CREATE TABLE IF NOT EXISTS streamer.stream_jobs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id  VARCHAR(255) NOT NULL,
  platform    VARCHAR(50) NOT NULL,
  status      VARCHAR(20) NOT NULL DEFAULT 'pending',
  started_at  TIMESTAMPTZ,
  ended_at    TIMESTAMPTZ,
  error       VARCHAR(1024),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Seed data
-- ============================================================

-- Demo user  (password: "password123" bcrypt-hashed, cost 10)
INSERT INTO api.users (id, email, name, password) VALUES
  ('00000000-0000-0000-0000-000000000001', 'demo@example.com', 'Demo User',
   '$2a$10$02TBpkse9IfRKCHSpz6BdOwVx5UkctbxMdbIVeKFjCR/Xhc/.ZyOG')
ON CONFLICT (email) DO NOTHING;

-- Demo platform credentials
INSERT INTO api.credentials (id, platform, type, rtmp_url, stream_key) VALUES
  ('00000000-0000-0000-0000-000000000010', 'youtube',  'manual', 'rtmp://a.rtmp.youtube.com/live2',              'demo-yt-key'),
  ('00000000-0000-0000-0000-000000000011', 'tiktok',   'manual', 'rtmp://push.tiktokcdn.com/live',               'demo-tt-key'),
  ('00000000-0000-0000-0000-000000000012', 'facebook', 'manual', 'rtmps://live-api-s.facebook.com:443/rtmp',     'demo-fb-key')
ON CONFLICT DO NOTHING;

-- Demo livestream session
INSERT INTO api.livestream_sessions (id, product_id, s3_key, status, platform_targets) VALUES
  ('00000000-0000-0000-0000-000000000020', 'product-001', 'videos/demo.mp4', 'stopped', '["youtube","tiktok"]')
ON CONFLICT DO NOTHING;
