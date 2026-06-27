ALTER TABLE public.platforms
  ADD COLUMN IF NOT EXISTS users_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_activity_at timestamptz,
  ADD COLUMN IF NOT EXISTS last_release_at timestamptz,
  ADD COLUMN IF NOT EXISTS release_notes text,
  ADD COLUMN IF NOT EXISTS web_url text,
  ADD COLUMN IF NOT EXISTS ios_url text,
  ADD COLUMN IF NOT EXISTS android_url text;