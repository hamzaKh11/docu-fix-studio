import { z } from "zod";

/**
 * Schema for a single experience entry.
 * NOTE: We use snake_case to match the Supabase database columns.
 */
export const experienceSchema = z.object({
  id: z.string(),
  company: z.string().min(1, "Company name is required."),
  position: z.string().min(1, "Position is required."),
  start_date: z.string().min(1, "Start date is required."),
  end_date: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
});

/**
 * Schema for a single education entry.
 * NOTE: We use snake_case to match the Supabase database columns.
 */
export const educationSchema = z.object({
  id: z.string(),
  institution: z.string().min(1, "Institution name is required."),
  degree: z.string().min(1, "Degree is required."),
  start_date: z.string().min(1, "Start date is required."),
  end_date: z.string().optional().nullable(),
});

/**
 * The main schema for the entire CV form.
 * This will be used with react-hook-form for validation.
 */
export const cvFormSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().optional(),
  linkedin: z.string().optional(),
  summary: z.string().optional(),
  targetRole: z.string().min(1, "Target role is required."),
  language: z.enum(["en", "fr", "ar"]),
  experience: z.array(experienceSchema),
  education: z.array(educationSchema),
  skills: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  certifications: z.array(z.string()).optional(),
});

// This creates a TypeScript type from the Zod schema
export type CVFormData = z.infer<typeof cvFormSchema>;