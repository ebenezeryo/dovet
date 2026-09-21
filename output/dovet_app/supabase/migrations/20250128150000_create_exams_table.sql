-- ============================================================
-- Migration: Create exams table for assessment management
-- ============================================================

CREATE TABLE IF NOT EXISTS public.exams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  created_by uuid REFERENCES public.users(id) ON DELETE SET NULL,
  title text NOT NULL,
  subject text NOT NULL,
  total_marks numeric NOT NULL DEFAULT 100,
  duration_minutes integer,
  instructions text,
  year_group text,
  class_name text,
  exam_type text CHECK (exam_type IN ('formative', 'summative', 'quiz', 'midterm', 'final')) DEFAULT 'formative',
  scheduled_at timestamptz,
  is_published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_exams_school_id
  ON public.exams (school_id);

CREATE INDEX IF NOT EXISTS idx_exams_school_subject
  ON public.exams (school_id, subject);

CREATE INDEX IF NOT EXISTS idx_exams_school_year
  ON public.exams (school_id, year_group);

CREATE INDEX IF NOT EXISTS idx_exams_scheduled
  ON public.exams (scheduled_at DESC);

CREATE INDEX IF NOT EXISTS idx_exams_published
  ON public.exams (school_id, is_published);

-- ============================================================
-- Enable Row Level Security
-- ============================================================
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS Policies
-- Auth model: no_auth_controlled_write
-- All access goes through edge functions using service_role.
-- ============================================================

CREATE POLICY "exams_no_anon_select"
  ON public.exams
  FOR SELECT
  TO anon, authenticated
  USING (false);

CREATE POLICY "exams_no_anon_insert"
  ON public.exams
  FOR INSERT
  TO anon
  WITH CHECK (false);

CREATE POLICY "exams_no_anon_update"
  ON public.exams
  FOR UPDATE
  TO anon
  USING (false);

CREATE POLICY "exams_no_anon_delete"
  ON public.exams
  FOR DELETE
  TO anon
  USING (false);
