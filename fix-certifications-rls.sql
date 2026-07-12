-- Run in Supabase Dashboard → SQL Editor
-- Fixes: leader and social_media cannot delete certifications

-- 1. Add delete policy for certifications
CREATE POLICY "Leader and social media can delete certs"
  ON public.certifications FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('leader', 'social_media')
    )
  );

-- 2. Also add the new columns if not already added
ALTER TABLE public.certifications
  ADD COLUMN IF NOT EXISTS role_type    text DEFAULT 'student' CHECK (role_type IN ('student', 'faculty')),
  ADD COLUMN IF NOT EXISTS designation  text,
  ADD COLUMN IF NOT EXISTS linkedin_url text;
