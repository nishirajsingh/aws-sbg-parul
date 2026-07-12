-- Run in Supabase Dashboard → SQL Editor
-- Adds new columns for role_type, designation, linkedin_url

ALTER TABLE public.certifications
  ADD COLUMN IF NOT EXISTS role_type    text default 'student' check (role_type in ('student','faculty')),
  ADD COLUMN IF NOT EXISTS designation  text,
  ADD COLUMN IF NOT EXISTS linkedin_url text;
