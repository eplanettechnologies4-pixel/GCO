-- ============================================================
-- GCO Foundation Pakistan - Supabase Database & Storage Schema
-- ============================================================

-- 1. Enable pgcrypto for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  goal_amount NUMERIC(12, 2) DEFAULT 0,
  raised_amount NUMERIC(12, 2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'ongoing' CHECK (status IN ('ongoing', 'completed')),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. MESSAGES TABLE (Contact form submissions)
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. ADMINS TABLE
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TRIGGER FOR projects.updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 6. ROW LEVEL SECURITY (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Projects: Public SELECT
DROP POLICY IF EXISTS "Public projects are viewable by everyone" ON projects;
CREATE POLICY "Public projects are viewable by everyone"
ON projects FOR SELECT
USING (true);

-- Messages: Public INSERT
DROP POLICY IF EXISTS "Anyone can submit a contact message" ON messages;
CREATE POLICY "Anyone can submit a contact message"
ON messages FOR INSERT
WITH CHECK (true);

-- Note: All admin operations (POST/PUT/DELETE on projects, SELECT/PATCH/DELETE on messages,
-- and SELECT on admins) are performed server-side using the SUPABASE_SERVICE_ROLE_KEY,
-- which safely bypasses RLS.

-- 7. STORAGE BUCKET: uploads (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Allow public read access to uploaded objects
DROP POLICY IF EXISTS "Public read access to uploads bucket" ON storage.objects;
CREATE POLICY "Public read access to uploads bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'uploads');

-- 8. INITIAL ADMIN USER SEED
-- Default Username: admin
-- Default Password: AdminPassword123!
-- Verified Bcrypt Hash (rounds=10) for 'AdminPassword123!':
INSERT INTO admins (username, password)
VALUES ('admin', '$2b$10$h8oNDPgfV5fluU5JcDSDS.muIIeQamFZp.nlnt89rWv5sgdUehgdq')
ON CONFLICT (username) DO NOTHING;

-- (To generate your own custom admin password hash, run: node scripts/seed-admin.js <username> <password>)
