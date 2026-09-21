-- Create schools table for multi-tenant subdomain routing
CREATE TABLE IF NOT EXISTS public.schools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subdomain text NOT NULL UNIQUE,
  name text NOT NULL,
  logo_url text,
  brand_color text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Index on subdomain for fast lookups (already covered by UNIQUE constraint, but explicit for clarity)
CREATE INDEX IF NOT EXISTS idx_schools_subdomain ON public.schools (subdomain);

-- Enable Row Level Security
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;

-- RLS: Public read access (no_auth_public_read model per plan)
CREATE POLICY "schools_public_read"
  ON public.schools
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- RLS: Deny anon writes (only edge functions or service_role can modify)
CREATE POLICY "schools_no_anon_insert"
  ON public.schools
  FOR INSERT
  TO anon
  WITH CHECK (false);

CREATE POLICY "schools_no_anon_update"
  ON public.schools
  FOR UPDATE
  TO anon
  USING (false);

CREATE POLICY "schools_no_anon_delete"
  ON public.schools
  FOR DELETE
  TO anon
  USING (false);

-- Insert test/demo school records
INSERT INTO public.schools (subdomain, name, logo_url, brand_color)
VALUES
  ('demo', 'Demo Academy', NULL, '#2563eb'),
  ('greenfield', 'Greenfield International School', NULL, '#059669'),
  ('sunrise', 'Sunrise Preparatory', NULL, '#d97706')
ON CONFLICT (subdomain) DO NOTHING;
