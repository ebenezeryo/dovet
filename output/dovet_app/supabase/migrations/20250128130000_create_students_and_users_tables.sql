-- ============================================================
-- Students table (for student authentication via admission number + surname)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  admission_number text NOT NULL,
  surname text NOT NULL,
  first_name text,
  other_names text,
  date_of_birth date,
  grade text,
  stream text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  -- Each student can only have one record per school per admission number
  UNIQUE (school_id, admission_number)
);

-- Index for fast auth lookups
CREATE INDEX IF NOT EXISTS idx_students_school_admission
  ON public.students (school_id, UPPER(admission_number));

-- ============================================================
-- Users table (for staff authentication via email + password)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  email text NOT NULL,
  password_hash text NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'teacher' CHECK (role IN ('teacher', 'admin', 'exams_officer', 'principal')),
  is_active boolean NOT NULL DEFAULT true,
  last_login_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  -- Each staff member can only have one account per school per email
  UNIQUE (school_id, email)
);

-- Index for fast auth lookups
CREATE INDEX IF NOT EXISTS idx_users_school_email
  ON public.users (school_id, email);

-- ============================================================
-- Enable Row Level Security
-- ============================================================
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS Policies
-- Auth model: no_auth_controlled_write
-- All access goes through edge functions using service_role.
-- Deny all direct anon/authenticated access to protect sensitive data.
-- ============================================================

-- Students: deny all direct access
CREATE POLICY "students_no_anon_select"
  ON public.students
  FOR SELECT
  TO anon, authenticated
  USING (false);

CREATE POLICY "students_no_anon_insert"
  ON public.students
  FOR INSERT
  TO anon
  WITH CHECK (false);

CREATE POLICY "students_no_anon_update"
  ON public.students
  FOR UPDATE
  TO anon
  USING (false);

CREATE POLICY "students_no_anon_delete"
  ON public.students
  FOR DELETE
  TO anon
  USING (false);

-- Users: deny all direct access (password_hash must never be exposed)
CREATE POLICY "users_no_anon_select"
  ON public.users
  FOR SELECT
  TO anon, authenticated
  USING (false);

CREATE POLICY "users_no_anon_insert"
  ON public.users
  FOR INSERT
  TO anon
  WITH CHECK (false);

CREATE POLICY "users_no_anon_update"
  ON public.users
  FOR UPDATE
  TO anon
  USING (false);

CREATE POLICY "users_no_anon_delete"
  ON public.users
  FOR DELETE
  TO anon
  USING (false);

-- ============================================================
-- Seed test data
-- ============================================================

-- Get the demo school id for seeding
DO $$
DECLARE
  demo_school_id uuid;
  greenfield_school_id uuid;
BEGIN
  SELECT id INTO demo_school_id FROM public.schools WHERE subdomain = 'demo' LIMIT 1;
  SELECT id INTO greenfield_school_id FROM public.schools WHERE subdomain = 'greenfield' LIMIT 1;

  -- Seed students for demo school
  IF demo_school_id IS NOT NULL THEN
    INSERT INTO public.students (school_id, admission_number, surname, first_name, grade, stream)
    VALUES
      (demo_school_id, 'ADM001', 'Mwangi', 'Jane', 'Form 4', 'East'),
      (demo_school_id, 'ADM002', 'Ochieng', 'Peter', 'Form 3', 'West'),
      (demo_school_id, 'ADM003', 'Kamau', 'Grace', 'Form 4', 'East')
    ON CONFLICT (school_id, admission_number) DO NOTHING;
  END IF;

  -- Seed students for greenfield school
  IF greenfield_school_id IS NOT NULL THEN
    INSERT INTO public.students (school_id, admission_number, surname, first_name, grade, stream)
    VALUES
      (greenfield_school_id, 'GFS001', 'Adebayo', 'Chidinma', 'Grade 12', 'Science'),
      (greenfield_school_id, 'GFS002', 'Mensah', 'Kwame', 'Grade 11', 'Arts')
    ON CONFLICT (school_id, admission_number) DO NOTHING;
  END IF;

  -- Seed staff users (password: "Password123" hashed with bcrypt)
  -- bcrypt hash for "Password123" with 10 rounds
  IF demo_school_id IS NOT NULL THEN
    INSERT INTO public.users (school_id, email, password_hash, full_name, role)
    VALUES
      (demo_school_id, 'admin@demoacademy.ac.ke',
       '$2b$10$8MlA4QzI7JA4mHpOcAm3yOMdHZWAU28UMRNvNR6ITCRmG9u6wRWO6',
       'John Admin', 'admin'),
      (demo_school_id, 'teacher@demoacademy.ac.ke',
       '$2b$10$8MlA4QzI7JA4mHpOcAm3yOMdHZWAU28UMRNvNR6ITCRmG9u6wRWO6',
       'Mary Teacher', 'teacher')
    ON CONFLICT (school_id, email) DO NOTHING;
  END IF;

  IF greenfield_school_id IS NOT NULL THEN
    INSERT INTO public.users (school_id, email, password_hash, full_name, role)
    VALUES
      (greenfield_school_id, 'admin@greenfield.ac.ke',
       '$2b$10$8MlA4QzI7JA4mHpOcAm3yOMdHZWAU28UMRNvNR6ITCRmG9u6wRWO6',
       'Sarah Principal', 'principal')
    ON CONFLICT (school_id, email) DO NOTHING;
  END IF;
END $$;
