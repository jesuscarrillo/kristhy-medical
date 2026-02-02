-- Enable RLS on tables that are missing it
-- Migration: enable_rls_on_public_tables
-- Created: 2026-02-01

-- Enable RLS on ultrasound_images
ALTER TABLE public.ultrasound_images ENABLE ROW LEVEL SECURITY;

-- Enable RLS on ultrasound_reports  
ALTER TABLE public.ultrasound_reports ENABLE ROW LEVEL SECURITY;

-- Enable RLS on gynecological_profiles
ALTER TABLE public.gynecological_profiles ENABLE ROW LEVEL SECURITY;

-- Enable RLS on medical_certificates
ALTER TABLE public.medical_certificates ENABLE ROW LEVEL SECURITY;

-- Create policies for ultrasound_images
CREATE POLICY "Doctors can view all ultrasound images"
  ON public.ultrasound_images
  FOR SELECT
  TO authenticated
  USING (auth.role() = 'authenticated');

CREATE POLICY "Doctors can insert ultrasound images"
  ON public.ultrasound_images
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Doctors can update ultrasound images"
  ON public.ultrasound_images
  FOR UPDATE
  TO authenticated
  USING (auth.role() = 'authenticated');

CREATE POLICY "Doctors can delete ultrasound images"
  ON public.ultrasound_images
  FOR DELETE
  TO authenticated
  USING (auth.role() = 'authenticated');

-- Create policies for ultrasound_reports
CREATE POLICY "Doctors can view all ultrasound reports"
  ON public.ultrasound_reports
  FOR SELECT
  TO authenticated
  USING (auth.role() = 'authenticated');

CREATE POLICY "Doctors can insert ultrasound reports"
  ON public.ultrasound_reports
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Doctors can update ultrasound reports"
  ON public.ultrasound_reports
  FOR UPDATE
  TO authenticated
  USING (auth.role() = 'authenticated');

CREATE POLICY "Doctors can delete ultrasound reports"
  ON public.ultrasound_reports
  FOR DELETE
  TO authenticated
  USING (auth.role() = 'authenticated');

-- Create policies for gynecological_profiles
CREATE POLICY "Doctors can view all gynecological profiles"
  ON public.gynecological_profiles
  FOR SELECT
  TO authenticated
  USING (auth.role() = 'authenticated');

CREATE POLICY "Doctors can insert gynecological profiles"
  ON public.gynecological_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Doctors can update gynecological profiles"
  ON public.gynecological_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.role() = 'authenticated');

CREATE POLICY "Doctors can delete gynecological profiles"
  ON public.gynecological_profiles
  FOR DELETE
  TO authenticated
  USING (auth.role() = 'authenticated');

-- Create policies for medical_certificates
CREATE POLICY "Doctors can view all medical certificates"
  ON public.medical_certificates
  FOR SELECT
  TO authenticated
  USING (auth.role() = 'authenticated');

CREATE POLICY "Doctors can insert medical certificates"
  ON public.medical_certificates
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Doctors can update medical certificates"
  ON public.medical_certificates
  FOR UPDATE
  TO authenticated
  USING (auth.role() = 'authenticated');

CREATE POLICY "Doctors can delete medical certificates"
  ON public.medical_certificates
  FOR DELETE
  TO authenticated
  USING (auth.role() = 'authenticated');
