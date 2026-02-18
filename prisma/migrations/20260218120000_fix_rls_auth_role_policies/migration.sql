-- Recreate RLS policies using (select auth.role()) to avoid re-evaluating auth() per row
-- Fix for Supabase performance advisor warning: "auth.role() re-evaluated per row"

-- Ensure RLS is enabled on all 4 tables (idempotent - safe to run even if already enabled)
ALTER TABLE public.ultrasound_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ultrasound_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gynecological_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_certificates ENABLE ROW LEVEL SECURITY;

-- Drop old policies for ultrasound_images
DROP POLICY IF EXISTS "Doctors can view all ultrasound images" ON public.ultrasound_images;
DROP POLICY IF EXISTS "Doctors can insert ultrasound images" ON public.ultrasound_images;
DROP POLICY IF EXISTS "Doctors can update ultrasound images" ON public.ultrasound_images;
DROP POLICY IF EXISTS "Doctors can delete ultrasound images" ON public.ultrasound_images;

-- Drop old policies for ultrasound_reports
DROP POLICY IF EXISTS "Doctors can view all ultrasound reports" ON public.ultrasound_reports;
DROP POLICY IF EXISTS "Doctors can insert ultrasound reports" ON public.ultrasound_reports;
DROP POLICY IF EXISTS "Doctors can update ultrasound reports" ON public.ultrasound_reports;
DROP POLICY IF EXISTS "Doctors can delete ultrasound reports" ON public.ultrasound_reports;

-- Drop old policies for gynecological_profiles
DROP POLICY IF EXISTS "Doctors can view all gynecological profiles" ON public.gynecological_profiles;
DROP POLICY IF EXISTS "Doctors can insert gynecological profiles" ON public.gynecological_profiles;
DROP POLICY IF EXISTS "Doctors can update gynecological profiles" ON public.gynecological_profiles;
DROP POLICY IF EXISTS "Doctors can delete gynecological profiles" ON public.gynecological_profiles;

-- Drop old policies for medical_certificates
DROP POLICY IF EXISTS "Doctors can view all medical certificates" ON public.medical_certificates;
DROP POLICY IF EXISTS "Doctors can insert medical certificates" ON public.medical_certificates;
DROP POLICY IF EXISTS "Doctors can update medical certificates" ON public.medical_certificates;
DROP POLICY IF EXISTS "Doctors can delete medical certificates" ON public.medical_certificates;

-- Recreate policies for ultrasound_images using (select auth.role()) for performance
CREATE POLICY "Doctors can view all ultrasound images"
  ON public.ultrasound_images
  FOR SELECT
  TO authenticated
  USING ((select auth.role()) = 'authenticated');

CREATE POLICY "Doctors can insert ultrasound images"
  ON public.ultrasound_images
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.role()) = 'authenticated');

CREATE POLICY "Doctors can update ultrasound images"
  ON public.ultrasound_images
  FOR UPDATE
  TO authenticated
  USING ((select auth.role()) = 'authenticated');

CREATE POLICY "Doctors can delete ultrasound images"
  ON public.ultrasound_images
  FOR DELETE
  TO authenticated
  USING ((select auth.role()) = 'authenticated');

-- Recreate policies for ultrasound_reports
CREATE POLICY "Doctors can view all ultrasound reports"
  ON public.ultrasound_reports
  FOR SELECT
  TO authenticated
  USING ((select auth.role()) = 'authenticated');

CREATE POLICY "Doctors can insert ultrasound reports"
  ON public.ultrasound_reports
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.role()) = 'authenticated');

CREATE POLICY "Doctors can update ultrasound reports"
  ON public.ultrasound_reports
  FOR UPDATE
  TO authenticated
  USING ((select auth.role()) = 'authenticated');

CREATE POLICY "Doctors can delete ultrasound reports"
  ON public.ultrasound_reports
  FOR DELETE
  TO authenticated
  USING ((select auth.role()) = 'authenticated');

-- Recreate policies for gynecological_profiles
CREATE POLICY "Doctors can view all gynecological profiles"
  ON public.gynecological_profiles
  FOR SELECT
  TO authenticated
  USING ((select auth.role()) = 'authenticated');

CREATE POLICY "Doctors can insert gynecological profiles"
  ON public.gynecological_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.role()) = 'authenticated');

CREATE POLICY "Doctors can update gynecological profiles"
  ON public.gynecological_profiles
  FOR UPDATE
  TO authenticated
  USING ((select auth.role()) = 'authenticated');

CREATE POLICY "Doctors can delete gynecological profiles"
  ON public.gynecological_profiles
  FOR DELETE
  TO authenticated
  USING ((select auth.role()) = 'authenticated');

-- Recreate policies for medical_certificates
CREATE POLICY "Doctors can view all medical certificates"
  ON public.medical_certificates
  FOR SELECT
  TO authenticated
  USING ((select auth.role()) = 'authenticated');

CREATE POLICY "Doctors can insert medical certificates"
  ON public.medical_certificates
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.role()) = 'authenticated');

CREATE POLICY "Doctors can update medical certificates"
  ON public.medical_certificates
  FOR UPDATE
  TO authenticated
  USING ((select auth.role()) = 'authenticated');

CREATE POLICY "Doctors can delete medical certificates"
  ON public.medical_certificates
  FOR DELETE
  TO authenticated
  USING ((select auth.role()) = 'authenticated');
