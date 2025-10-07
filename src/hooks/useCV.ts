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

function handleSupabaseError(error: PostgrestError | null, context: string) {
  if (!error) return;
  console.error(`Error in ${context}:`, error);
  toast.error(`Failed during ${context}.`, {
    description: error.message,
  });
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
      handleSupabaseError(error as PostgrestError, "loading your CV");
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
        const { data: cvData, error: cvError } = await supabase
          .from("user_cvs")
          .update({
            title: formData.name || "My CV",
            target_role: formData.targetRole,
            language: formData.language,
            personal_info: {
              name: formData.name, email: formData.email, phone: formData.phone,
              linkedin: formData.linkedin, summary: formData.summary, skills: formData.skills,
              languages: formData.languages, certifications: formData.certifications,
            },
          })
          .eq("id", cvId)
          .select()
          .single();
        if (cvError) throw cvError;

        const experienceToUpsert: ExperienceInsert[] = formData.experience.map(exp => ({
            id: exp.id,
            cv_id: cvId,
            company: exp.company,
            position: exp.position,
            start_date: exp.start_date,
            end_date: exp.end_date || null,
            description: exp.description || null,
        }));
        await supabase.from("experiences").upsert(experienceToUpsert);
        
        const expIdsInForm = formData.experience.map(e => e.id);
        if (expIdsInForm.length > 0) {
            await supabase.from('experiences').delete().eq('cv_id', cvId).not('id', 'in', `(${expIdsInForm.map(id => `'${id}'`).join(',')})`);
        } else {
            await supabase.from('experiences').delete().eq('cv_id', cvId);
        }

        const educationToUpsert: EducationInsert[] = formData.education.map(edu => ({
            id: edu.id,
            cv_id: cvId,
            institution: edu.institution,
            degree: edu.degree,
            start_date: edu.start_date,
            end_date: edu.end_date || null,
        }));
        await supabase.from("education").upsert(educationToUpsert);
        
        const eduIdsInForm = formData.education.map(e => e.id);
        if (eduIdsInForm.length > 0) {
            await supabase.from('education').delete().eq('cv_id', cvId).not('id', 'in', `(${eduIdsInForm.map(id => `'${id}'`).join(',')})`);
        } else {
            await supabase.from('education').delete().eq('cv_id', cvId);
        }

        toast.success("Progress saved!");
        return cvData as UserCvRow;
      } catch (error) {
        handleSupabaseError(error as PostgrestError, "saving CV progress");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [user]
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
        handleSupabaseError(error as PostgrestError, "updating CV status");
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
        handleSupabaseError(error as PostgrestError, "file upload");
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
            // Delete the associated file from storage first
            if (cv.original_file_url) {
                const filePath = cv.original_file_url.substring(cv.original_file_url.indexOf(user.id));
                await supabase.storage.from('cv-uploads').remove([filePath]);
            }
            // This will reset the CV's data but keep the row for the user.
            await patchCV(cv.id, {
                title: "My CV",
                original_file_url: null,
                generated_doc_url: null,
                generated_pdf_url: null,
                ats_score: null,
                recommendations: null,
                status: 'draft',
                target_role: null,
                personal_info: null,
            });

            // Delete all associated experience and education records
            await supabase.from('experiences').delete().eq('cv_id', cv.id);
            await supabase.from('education').delete().eq('cv_id', cv.id);

            toast.success("CV data has been reset.");
            // Refetch the now-empty CV to update the UI
            const freshCV = await fetchOrCreateUserCV(); 
            if (freshCV) setCurrentCV(freshCV);

        } catch (error) {
            handleSupabaseError(error as PostgrestError, "deleting CV");
        } finally {
            setLoading(false);
        }
    }, [user, patchCV, fetchOrCreateUserCV, setCurrentCV]);


  return { loading, currentCV, setCurrentCV, fetchOrCreateUserCV, updateFullCV, patchCV, uploadCVFile, deleteCVData };
}