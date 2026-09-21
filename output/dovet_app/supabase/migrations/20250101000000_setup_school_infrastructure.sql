-- =============================================================
-- School Infrastructure: Tables, Storage Bucket, RLS Policies
-- =============================================================

-- 1. School Settings table
CREATE TABLE IF NOT EXISTS public.school_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT '',
  subdomain TEXT UNIQUE,
  logo_url TEXT,
  brand_color TEXT NOT NULL DEFAULT '#2563eb',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. School Branding table (can also be used as extension of settings)
CREATE TABLE IF NOT EXISTS public.school_branding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subdomain TEXT,
  name TEXT NOT NULL DEFAULT '',
  brand_color TEXT NOT NULL DEFAULT '#2563eb',
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_school_branding_subdomain ON public.school_branding(subdomain);

-- 3. Students table
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_subdomain TEXT,
  first_name TEXT NOT NULL,
  middle_name TEXT DEFAULT '',
  last_name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  admission_number TEXT,
  grade TEXT,
  class_name TEXT DEFAULT '',
  sex TEXT,
  parents_contact TEXT DEFAULT '',
  address TEXT DEFAULT '',
  country TEXT DEFAULT 'Nigeria',
  state TEXT DEFAULT '',
  lga TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_students_subdomain ON public.students(school_subdomain);
CREATE INDEX IF NOT EXISTS idx_students_admission ON public.students(admission_number);

-- 4. Exams table
CREATE TABLE IF NOT EXISTS public.exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_subdomain TEXT,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  total_marks INTEGER NOT NULL DEFAULT 100,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  instructions TEXT DEFAULT '',
  year_group TEXT DEFAULT '',
  class_name TEXT DEFAULT '',
  exam_type TEXT DEFAULT 'formative',
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_exams_subdomain ON public.exams(school_subdomain);

-- =============================================================
-- Storage Bucket for school assets (logos, etc.)
-- =============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('school-assets', 'school-assets', true, 5242880, ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml'])
ON CONFLICT (id) DO NOTHING;

-- =============================================================
-- Row Level Security (RLS) Policies
-- =============================================================

-- Enable RLS on all tables
ALTER TABLE public.school_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_branding ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;

-- School Settings: public read, anon/edge-function write
DROP POLICY IF EXISTS "Allow public read school_settings" ON public.school_settings;
CREATE POLICY "Allow public read school_settings"
  ON public.school_settings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow insert school_settings" ON public.school_settings;
CREATE POLICY "Allow insert school_settings"
  ON public.school_settings FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update school_settings" ON public.school_settings;
CREATE POLICY "Allow update school_settings"
  ON public.school_settings FOR UPDATE
  USING (true);

-- School Branding: public read, anon/edge-function write
DROP POLICY IF EXISTS "Allow public read school_branding" ON public.school_branding;
CREATE POLICY "Allow public read school_branding"
  ON public.school_branding FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow insert school_branding" ON public.school_branding;
CREATE POLICY "Allow insert school_branding"
  ON public.school_branding FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update school_branding" ON public.school_branding;
CREATE POLICY "Allow update school_branding"
  ON public.school_branding FOR UPDATE
  USING (true);

-- Students: public read (for dashboard), anon/edge-function write
DROP POLICY IF EXISTS "Allow public read students" ON public.students;
CREATE POLICY "Allow public read students"
  ON public.students FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow insert students" ON public.students;
CREATE POLICY "Allow insert students"
  ON public.students FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update students" ON public.students;
CREATE POLICY "Allow update students"
  ON public.students FOR UPDATE
  USING (true);

-- Exams: public read, anon/edge-function write
DROP POLICY IF EXISTS "Allow public read exams" ON public.exams;
CREATE POLICY "Allow public read exams"
  ON public.exams FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow insert exams" ON public.exams;
CREATE POLICY "Allow insert exams"
  ON public.exams FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update exams" ON public.exams;
CREATE POLICY "Allow update exams"
  ON public.exams FOR UPDATE
  USING (true);

-- =============================================================
-- Storage Policies: Allow public read & anon upload for school-assets
-- =============================================================
DROP POLICY IF EXISTS "Public read access for school-assets" ON storage.objects;
CREATE POLICY "Public read access for school-assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'school-assets');

DROP POLICY IF EXISTS "Allow upload to school-assets" ON storage.objects;
CREATE POLICY "Allow upload to school-assets"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'school-assets');

DROP POLICY IF EXISTS "Allow update in school-assets" ON storage.objects;
CREATE POLICY "Allow update in school-assets"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'school-assets');
