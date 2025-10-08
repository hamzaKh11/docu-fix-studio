import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Database } from "@/integrations/supabase/types";
import { CVFormData } from "@/lib/validators";
import { toast } from "sonner";
import { PostgrestError } from "@supabase/supabase-js";

// Deriving types directly from Supabase's generated types for consistency.
type UserCvRow = Database['public']['Tables']['user_cvs']['Row'];
type ExperienceRow = Database['public']['Tables']['experiences']['Row'];
type EducationRow = Database['public']['Tables']['education']['Row'];
type ExperienceInsert = Database['public']['Tables']['experiences']['Insert'];
type EducationInsert = Database['public']['Tables']['education']['Insert'];

export type FullCV = UserCvRow & {
  experiences: ExperienceRow[];
  education: EducationRow[];
};

// FIX: Update the function to accept 'unknown' type for broader error compatibility.
function handleSupabaseError(error: unknown, context: string) {
  if (!error) return;

  // Type guard to check if the error has a message property
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const errorMessage = (error as { message: string }).message;
    console.error(`Error in ${context}:`, error);
    toast.error(`Failed during ${context}.`, {
      description: errorMessage,
    });
  } else {
    // Fallback for unknown error types
    console.error(`An unknown error occurred in ${context}:`, error);
    toast.error(`An unknown error occurred during ${context}.`);
  }
}

export function useCV() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentCV, setCurrentCV] = useState<FullCV | null>(null);

  const fetchOrCreateUserCV = useCallback(async () => {
    if (!user) return null;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("user_cvs")
        .select(`*, experiences(*), education(*)`)
        .eq("user_id", user.id)
        .maybeSingle(); 

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        return data as unknown as FullCV;
      }

      toast.info("Creating your CV workspace...");
      const { data: newData, error: newCvError } = await supabase
        .from("user_cvs")
        .insert({ user_id: user.id, title: "My CV", status: "draft", language: "en" })
        .select(`*, experiences(*), education(*)`)
        .single();
      
      if (newCvError) throw newCvError;
      
      toast.success("Welcome! Your CV workspace is ready.");
      return newData as unknown as FullCV;

    } catch (error) {
      handleSupabaseError(error, "loading your CV");
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);
  
  const updateFullCV = useCallback(
    async (cvId: string, formData: CVFormData) => {
      if (!user) return null;
      setLoading(true);
      try {
        await supabase.from("user_cvs").update({
            title: formData.name || "My CV",
            target_role: formData.targetRole,
            language: formData.language,
            personal_info: {
              name: formData.name, email: formData.email, phone: formData.phone,
              linkedin: formData.linkedin, summary: formData.summary, skills: formData.skills,
              languages: formData.languages, certifications: formData.certifications,
            },
        }).eq("id", cvId);

        const experienceToUpsert: ExperienceInsert[] = formData.experience.map(exp => ({
            id: exp.id, cv_id: cvId, company: exp.company, position: exp.position,
            start_date: exp.start_date, end_date: exp.end_date || null, description: exp.description || null,
        }));
        await supabase.from("experiences").upsert(experienceToUpsert, { onConflict: 'id' });
        
        if (currentCV?.experiences) {
            const expIdsInForm = formData.experience.map(e => e.id);
            const idsToDelete = currentCV.experiences.filter(e => !expIdsInForm.includes(e.id)).map(e => e.id);
            if (idsToDelete.length > 0) {
                await supabase.from('experiences').delete().in('id', idsToDelete);
            }
        }

        const educationToUpsert: EducationInsert[] = formData.education.map(edu => ({
            id: edu.id, cv_id: cvId, institution: edu.institution, degree: edu.degree,
            start_date: edu.start_date, end_date: edu.end_date || null,
        }));
        await supabase.from("education").upsert(educationToUpsert, { onConflict: 'id' });
        
        if (currentCV?.education) {
            const eduIdsInForm = formData.education.map(e => e.id);
            const idsToDelete = currentCV.education.filter(e => !eduIdsInForm.includes(e.id)).map(e => e.id);
            if (idsToDelete.length > 0) {
                await supabase.from('education').delete().in('id', idsToDelete);
            }
        }

        toast.success("Progress saved!");
        const updatedFullCV = await fetchOrCreateUserCV(); 
        if(updatedFullCV) setCurrentCV(updatedFullCV);
        return updatedFullCV;
      } catch (error) {
        handleSupabaseError(error, "saving CV progress");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [user, fetchOrCreateUserCV, setCurrentCV, currentCV]
  );
  
  const patchCV = useCallback(async (cvId: string, updates: Partial<UserCvRow>) => {
    setLoading(true);
    try {
        const { data, error } = await supabase
            .from('user_cvs')
            .update(updates)
            .eq('id', cvId)
            .select(`*, experiences(*), education(*)`)
            .single();
        if (error) throw error;
        const updatedCV = data as unknown as FullCV;
        setCurrentCV(updatedCV);
        return updatedCV;
    } catch (error) {
        handleSupabaseError(error, "updating CV status");
        return null;
    } finally {
        setLoading(false);
    }
  }, [setCurrentCV]);

  const uploadCVFile = useCallback(
    async (file: File, cvId: string) => {
      if (!user) return null;
      setLoading(true);
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/${cvId}.${fileExt}`;

      try {
        const { error: uploadError } = await supabase.storage
          .from("cv-uploads")
          .upload(filePath, file, { upsert: true });
        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("cv-uploads").getPublicUrl(filePath);
        await patchCV(cvId, { original_file_url: data.publicUrl });
        return data.publicUrl;
      } catch (error) {
        handleSupabaseError(error, "file upload");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [user, patchCV]
  );

    const deleteCVData = useCallback(async (cv: FullCV) => {
        if (!user || !cv) return;
        setLoading(true);
        try {
            if (cv.original_file_url) {
                const filePath = cv.original_file_url.substring(cv.original_file_url.indexOf(user.id));
                const { error: storageError } = await supabase.storage.from('cv-uploads').remove([filePath]);
                // FIX: Check the error message for "Not found" instead of statusCode
                if (storageError && !storageError.message.includes('Not found')) {
                    throw storageError;
                }
            }
            await patchCV(cv.id, {
                title: "My CV", original_file_url: null, generated_doc_url: null,
                generated_pdf_url: null, ats_score: null, recommendations: null,
                status: 'draft', target_role: null, personal_info: null,
            });

            await supabase.from('experiences').delete().eq('cv_id', cv.id);
            await supabase.from('education').delete().eq('cv_id', cv.id);

            toast.success("CV data has been reset.");
            setCurrentCV(null);
        } catch (error) {
            handleSupabaseError(error, "deleting CV");
        } finally {
            setLoading(false);
        }
    }, [user, patchCV, setCurrentCV]);


  return { loading, currentCV, setCurrentCV, fetchOrCreateUserCV, updateFullCV, patchCV, uploadCVFile, deleteCVData };
}