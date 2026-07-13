-- Run in Supabase Dashboard → SQL Editor
-- Adds new columns for role_type, designation, linkedin_url


CREATE POLICY "Leader and social media can delete certs"
  ON public.certifications FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('leader', 'social_media'))
  );

ALTER TABLE public.certifications
  ADD COLUMN IF NOT EXISTS role_type    text default 'student' check (role_type in ('student','faculty')),
  ADD COLUMN IF NOT EXISTS designation  text,
  ADD COLUMN IF NOT EXISTS linkedin_url text;
