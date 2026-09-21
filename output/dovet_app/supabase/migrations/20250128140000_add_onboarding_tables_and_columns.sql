-- ============================================================
-- Migration: Add onboarding tables and extend schools table
-- ============================================================

-- 1. Add country and school_level columns to schools table
ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS country text;
ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS school_level text CHECK (school_level IN ('primary', 'secondary', 'both'));

-- 2. Create school_settings table
CREATE TABLE IF NOT EXISTS public.school_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL UNIQUE REFERENCES public.schools(id) ON DELETE CASCADE,
  year_group_labels jsonb NOT NULL DEFAULT '[]'::jsonb,
  grade_boundaries jsonb NOT NULL DEFAULT '{"A": 80, "B": 65, "C": 50, "D": 35}'::jsonb,
  result_visibility boolean NOT NULL DEFAULT true,
  academic_term text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_school_settings_school_id
  ON public.school_settings (school_id);

-- 3. Create subjects table
CREATE TABLE IF NOT EXISTS public.subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  name text NOT NULL,
  year_group text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (school_id, name, year_group)
);

CREATE INDEX IF NOT EXISTS idx_subjects_school_id
  ON public.subjects (school_id);

CREATE INDEX IF NOT EXISTS idx_subjects_school_year
  ON public.subjects (school_id, year_group);

-- 4. Create submissions table
CREATE TABLE IF NOT EXISTS public.submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  student_id uuid REFERENCES public.students(id) ON DELETE SET NULL,
  student_name text NOT NULL,
  admission_no text NOT NULL,
  class_name text NOT NULL,
  subject text NOT NULL,
  score numeric NOT NULL DEFAULT 0,
  total numeric NOT NULL DEFAULT 0,
  percentage numeric GENERATED ALWAYS AS (
    CASE WHEN total > 0 THEN (score / total) * 100 ELSE 0 END
  ) STORED,
  time_spent integer, -- seconds
  answers_json jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_submissions_school_id
  ON public.submissions (school_id);

CREATE INDEX IF NOT EXISTS idx_submissions_school_subject
  ON public.submissions (school_id, subject);

CREATE INDEX IF NOT EXISTS idx_submissions_school_class
  ON public.submissions (school_id, class_name);

CREATE INDEX IF NOT EXISTS idx_submissions_created_at
  ON public.submissions (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_submissions_student
  ON public.submissions (student_id);

-- ============================================================
-- Enable Row Level Security
-- ============================================================
ALTER TABLE public.school_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS Policies
-- Auth model: no_auth_controlled_write
-- All write access goes through edge functions using service_role.
-- ============================================================

-- school_settings: deny all direct access
CREATE POLICY "school_settings_no_anon_select"
  ON public.school_settings
  FOR SELECT
  TO anon, authenticated
  USING (false);

CREATE POLICY "school_settings_no_anon_insert"
  ON public.school_settings
  FOR INSERT
  TO anon
  WITH CHECK (false);

CREATE POLICY "school_settings_no_anon_update"
  ON public.school_settings
  FOR UPDATE
  TO anon
  USING (false);

CREATE POLICY "school_settings_no_anon_delete"
  ON public.school_settings
  FOR DELETE
  TO anon
  USING (false);

-- subjects: deny all direct access
CREATE POLICY "subjects_no_anon_select"
  ON public.subjects
  FOR SELECT
  TO anon, authenticated
  USING (false);

CREATE POLICY "subjects_no_anon_insert"
  ON public.subjects
  FOR INSERT
  TO anon
  WITH CHECK (false);

CREATE POLICY "subjects_no_anon_update"
  ON public.subjects
  FOR UPDATE
  TO anon
  USING (false);

CREATE POLICY "subjects_no_anon_delete"
  ON public.subjects
  FOR DELETE
  TO anon
  USING (false);

-- submissions: deny all direct access
CREATE POLICY "submissions_no_anon_select"
  ON public.submissions
  FOR SELECT
  TO anon, authenticated
  USING (false);

CREATE POLICY "submissions_no_anon_insert"
  ON public.submissions
  FOR INSERT
  TO anon
  WITH CHECK (false);

CREATE POLICY "submissions_no_anon_update"
  ON public.submissions
  FOR UPDATE
  TO anon
  USING (false);

CREATE POLICY "submissions_no_anon_delete"
  ON public.submissions
  FOR DELETE
  TO anon
  USING (false);
