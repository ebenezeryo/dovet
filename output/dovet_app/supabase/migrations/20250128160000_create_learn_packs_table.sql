-- Durable, school-scoped records for formative weekly learning packs.
CREATE TABLE IF NOT EXISTS public.learn_packs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  created_by uuid REFERENCES public.users(id) ON DELETE SET NULL,
  title text NOT NULL,
  subject text NOT NULL,
  topic text NOT NULL,
  year_group text NOT NULL,
  curriculum text,
  difficulty text NOT NULL DEFAULT 'Mixed',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  duration_days integer NOT NULL DEFAULT 5 CHECK (duration_days > 0),
  assigned_count integer NOT NULL DEFAULT 0 CHECK (assigned_count >= 0),
  completions numeric NOT NULL DEFAULT 0 CHECK (completions >= 0 AND completions <= 100),
  generation_config jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_learn_packs_school_created
  ON public.learn_packs (school_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_learn_packs_school_status
  ON public.learn_packs (school_id, status);

ALTER TABLE public.learn_packs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "learn_packs_no_direct_select" ON public.learn_packs
  FOR SELECT TO anon, authenticated USING (false);
CREATE POLICY "learn_packs_no_direct_insert" ON public.learn_packs
  FOR INSERT TO anon, authenticated WITH CHECK (false);
CREATE POLICY "learn_packs_no_direct_update" ON public.learn_packs
  FOR UPDATE TO anon, authenticated USING (false);
CREATE POLICY "learn_packs_no_direct_delete" ON public.learn_packs
  FOR DELETE TO anon, authenticated USING (false);
