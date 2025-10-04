export interface ExperienceEntry {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
}

export interface CVFormData {
  name: string;
  phone: string;
  email: string;
  linkedin: string;
  summary: string;
  targetRole: string;
  language: 'en' | 'fr' | 'ar';
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: string[];
  languages: string[];
  certifications: string[];
}

export interface CVResponse {
  doc_preview_url?: string;
  pdf_url?: string;
  doc_id?: string;
  html_preview?: string;
}
