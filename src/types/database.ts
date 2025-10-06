export type CVLanguage = 'en' | 'fr' | 'ar';
export type CVStatus = 'draft' | 'processing' | 'completed' | 'failed';

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserCV {
  id: string;
  user_id: string;
  title: string;
  original_file_url: string | null;
  generated_doc_url: string | null;
  generated_pdf_url: string | null;
  ats_score: number | null;
  recommendations: any | null;
  status: CVStatus;
  language: CVLanguage;
  target_role: string | null;
  personal_info: PersonalInfo | null;
  created_at: string;
  updated_at: string;
}

export interface PersonalInfo {
  name?: string;
  phone?: string;
  email?: string;
  linkedin?: string;
  summary?: string;
  skills?: string[];
  languages?: string[];
  certifications?: string[];
}

export interface Experience {
  id: string;
  cv_id: string;
  company: string;
  position: string;
  location: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
  sort_order: number;
  created_at: string;
}

export interface Education {
  id: string;
  cv_id: string;
  institution: string;
  degree: string;
  field_of_study: string | null;
  location: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
  sort_order: number;
  created_at: string;
}

export interface Template {
  id: string;
  name: string;
  description: string | null;
  file_url: string;
  language: CVLanguage;
  is_default: boolean;
  created_at: string;
}

export interface N8NWebhookPayload {
  user_id: string;
  cv_id: string;
  cv_url?: string;
  form_fields?: {
    personal_info: PersonalInfo;
    experiences: Omit<Experience, 'id' | 'cv_id' | 'created_at'>[];
    education: Omit<Education, 'id' | 'cv_id' | 'created_at'>[];
    target_role: string;
    language: CVLanguage;
  };
}

export interface N8NWebhookResponse {
  success: boolean;
  ats_score?: number;
  recommendations?: string[];
  generated_doc_url?: string;
  generated_pdf_signed_url?: string;
  form_fields?: {
    personal_info: PersonalInfo;
    experiences: Omit<Experience, 'id' | 'cv_id' | 'created_at'>[];
    education: Omit<Education, 'id' | 'cv_id' | 'created_at'>[];
  };
  error?: string;
}
