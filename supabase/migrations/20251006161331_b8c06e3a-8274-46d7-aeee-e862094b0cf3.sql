-- Create enum for CV languages
CREATE TYPE cv_language AS ENUM ('en', 'fr', 'ar');

-- Create enum for CV status
CREATE TYPE cv_status AS ENUM ('draft', 'processing', 'completed', 'failed');

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create user_cvs table
CREATE TABLE public.user_cvs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Untitled CV',
  original_file_url TEXT,
  generated_doc_url TEXT,
  generated_pdf_url TEXT,
  ats_score INTEGER,
  recommendations JSONB,
  status cv_status NOT NULL DEFAULT 'draft',
  language cv_language NOT NULL DEFAULT 'en',
  target_role TEXT,
  personal_info JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.user_cvs ENABLE ROW LEVEL SECURITY;

-- CV policies
CREATE POLICY "Users can view their own CVs"
  ON public.user_cvs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own CVs"
  ON public.user_cvs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own CVs"
  ON public.user_cvs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own CVs"
  ON public.user_cvs FOR DELETE
  USING (auth.uid() = user_id);

-- Create experiences table
CREATE TABLE public.experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cv_id UUID NOT NULL REFERENCES public.user_cvs(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  location TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;

-- Experience policies (via cv ownership)
CREATE POLICY "Users can view experiences for their CVs"
  ON public.experiences FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_cvs
      WHERE user_cvs.id = experiences.cv_id
      AND user_cvs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create experiences for their CVs"
  ON public.experiences FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_cvs
      WHERE user_cvs.id = experiences.cv_id
      AND user_cvs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update experiences for their CVs"
  ON public.experiences FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_cvs
      WHERE user_cvs.id = experiences.cv_id
      AND user_cvs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete experiences for their CVs"
  ON public.experiences FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_cvs
      WHERE user_cvs.id = experiences.cv_id
      AND user_cvs.user_id = auth.uid()
    )
  );

-- Create education table
CREATE TABLE public.education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cv_id UUID NOT NULL REFERENCES public.user_cvs(id) ON DELETE CASCADE,
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field_of_study TEXT,
  location TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;

-- Education policies (via cv ownership)
CREATE POLICY "Users can view education for their CVs"
  ON public.education FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_cvs
      WHERE user_cvs.id = education.cv_id
      AND user_cvs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create education for their CVs"
  ON public.education FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_cvs
      WHERE user_cvs.id = education.cv_id
      AND user_cvs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update education for their CVs"
  ON public.education FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_cvs
      WHERE user_cvs.id = education.cv_id
      AND user_cvs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete education for their CVs"
  ON public.education FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_cvs
      WHERE user_cvs.id = education.cv_id
      AND user_cvs.user_id = auth.uid()
    )
  );

-- Create templates table (for model CVs)
CREATE TABLE public.templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  language cv_language NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- Templates are publicly readable
CREATE POLICY "Templates are viewable by authenticated users"
  ON public.templates FOR SELECT
  TO authenticated
  USING (true);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('cv-uploads', 'cv-uploads', false, 10485760, ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/png', 'image/jpeg']),
  ('cv-generated', 'cv-generated', false, 52428800, ARRAY['application/pdf']),
  ('cv-templates', 'cv-templates', false, 52428800, ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']);

-- Storage policies for cv-uploads (users can upload their own files)
CREATE POLICY "Users can upload their own CV files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'cv-uploads'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own uploaded CVs"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'cv-uploads'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own uploaded CVs"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'cv-uploads'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for cv-generated (users can view their generated files)
CREATE POLICY "Users can view their generated CVs"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'cv-generated'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for cv-templates (authenticated users can view templates)
CREATE POLICY "Authenticated users can view templates"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'cv-templates');

-- Trigger for updating updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_user_cvs_updated_at
  BEFORE UPDATE ON public.user_cvs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();