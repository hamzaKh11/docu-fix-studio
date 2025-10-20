export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type PersonalInfo = {
  name?: string
  email?: string
  phone?: string
  linkedin?: string
  summary?: string
  skills?: string[]
  languages?: string[]
  certifications?: string[]
}

export interface Database {
  public: {
    Tables: {
      education: {
        Row: {
          created_at: string
          cv_id: string
          degree: string
          description: string | null
          end_date: string | null
          field_of_study: string | null
          id: string
          institution: string
          is_current: boolean | null
          location: string | null
          sort_order: number
          start_date: string
        }
        Insert: {
          created_at?: string
          cv_id: string
          degree: string
          description?: string | null
          end_date?: string | null
          field_of_study?: string | null
          id?: string
          institution: string
          is_current?: boolean | null
          location?: string | null
          sort_order?: number
          start_date: string
        }
        Update: {
          created_at?: string
          cv_id?: string
          degree?: string
          description?: string | null
          end_date?: string | null
          field_of_study?: string | null
          id?: string
          institution?: string
          is_current?: boolean | null
          location?: string | null
          sort_order?: number
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "education_cv_id_fkey"
            columns: ["cv_id"]
            referencedRelation: "user_cvs"
            referencedColumns: ["id"]
          },
        ]
      }
      experiences: {
        Row: {
          company: string
          created_at: string
          cv_id: string
          description: string | null
          end_date: string | null
          id: string
          is_current: boolean | null
          location: string | null
          position: string
          sort_order: number
          start_date: string
        }
        Insert: {
          company: string
          created_at?: string
          cv_id: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          location?: string | null
          position: string
          sort_order?: number
          start_date: string
        }
        Update: {
          company?: string
          created_at?: string
          cv_id?: string
          description?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean | null
          location?: string | null
          position?: string
          sort_order?: number
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "experiences_cv_id_fkey"
            columns: ["cv_id"]
            referencedRelation: "user_cvs"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      templates: {
        Row: {
          created_at: string
          description: string | null
          file_url: string
          id: string
          is_default: boolean | null
          language: Database["public"]["Enums"]["cv_language"]
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_url: string
          id?: string
          is_default?: boolean | null
          language: Database["public"]["Enums"]["cv_language"]
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          file_url?: string
          id?: string
          is_default?: boolean | null
          language?: Database["public"]["Enums"]["cv_language"]
          name?: string
        }
        Relationships: []
      }
      user_cvs: {
        Row: {
          ats_score: number | null
          created_at: string
          generated_doc_url: string | null
          generated_pdf_url: string | null
          id: string
          language: Database["public"]["Enums"]["cv_language"]
          original_file_url: string | null
          personal_info: Json | null
          recommendations: Json | null
          status: Database["public"]["Enums"]["cv_status"]
          target_role: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ats_score?: number | null
          created_at?: string
          generated_doc_url?: string | null
          generated_pdf_url?: string | null
          id?: string
          language?: Database["public"]["Enums"]["cv_language"]
          original_file_url?: string | null
          personal_info?: Json | null
          recommendations?: Json | null
          status?: Database["public"]["Enums"]["cv_status"]
          target_role?: string | null
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ats_score?: number | null
          created_at?: string
          generated_doc_url?: string | null
          generated_pdf_url?: string | null
          id?: string
          language?: Database["public"]["Enums"]["cv_language"]
          original_file_url?: string | null
          personal_info?: Json | null
          recommendations?: Json | null
          status?: Database["public"]["Enums"]["cv_status"]
          target_role?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_cvs_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      cv_language: "en" | "fr" | "ar"
      cv_status: "draft" | "processing" | "completed" | "failed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
