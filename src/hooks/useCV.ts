import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Database } from "@/integrations/supabase/types";
import { CVFormData } from "@/lib/validators";
import { toast } from "sonner";

// Deriving types directly from Supabase's generated types for consistency.
type UserCvRow = Database['public']['Tables']['user_cvs']['Row'];
type ExperienceRow = Database['public']['Tables']['experiences']['Row'];
type EducationRow = Database['public']['Tables']['education']['Row'];

export type FullCV = UserCvRow & {
  experiences: ExperienceRow[];
  education: EducationRow[];
};

function handleSupabaseError(error: unknown, context: string) {
  if (!error) return;

  let errorMessage = "An unknown error occurred.";
  if (typeof error === 'object' && error !== null && 'message' in error) {
    errorMessage = (error as { message: string }).message;
  }
  
  console.error(`Error in ${context}:`, error);
  toast.error(`Failed during ${context}.`, {
    description: errorMessage,
  });
}

const formatDateForSupabase = (dateStr: string | null | undefined): string | null => {
    if (!dateStr) return null;
    if (dateStr.length === 7 && dateStr.includes('-')) {
        return `${dateStr}-01`;
    }
    return dateStr;
};

export function useCV() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentCV, setCurrentCV] = useState<FullCV | null>(null);

  useEffect(() => {
    if (!user || !currentCV?.id) return;

    const channel = supabase
      .channel(`public:user_cvs:id=eq.${currentCV.id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'user_cvs', filter: `id=eq.${currentCV.id}` },
        (payload) => {
          const updatedCv = payload.new as FullCV;
          setCurrentCV(prev => ({ ...prev, ...updatedCv }));

          if (updatedCv.status === 'completed') {
            toast.success("CV Generation Complete!");
          } else if (updatedCv.status === 'failed') {
            toast.error("CV Generation Failed. Please try again.");
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, currentCV?.id]);

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
        // Step 1: Update personal_info in user_cvs table
        const { error: userCvError } = await supabase.from("user_cvs").update({
            title: formData.name || "My CV",
            target_role: formData.targetRole,
            language: formData.language,
            personal_info: {
              name: formData.name, email: formData.email, phone: formData.phone,
              linkedin: formData.linkedin, summary: formData.summary, skills: formData.skills,
              languages: formData.languages, certifications: formData.certifications,
            },
        }).eq("id", cvId);

        if (userCvError) {
          throw userCvError;
        }

        // Step 2: Delete old experience and education records
        const { error: deleteExpError } = await supabase.from('experiences').delete().eq('cv_id', cvId);
        if (deleteExpError) handleSupabaseError(deleteExpError, "clearing old experience");

        const { error: deleteEduError } = await supabase.from('education').delete().eq('cv_id', cvId);
        if (deleteEduError) handleSupabaseError(deleteEduError, "clearing old education");


        // Step 3: Insert new experience records
        if (formData.experience && formData.experience.length > 0) {
            const experiencesToInsert = formData.experience.map(exp => ({
                cv_id: cvId, // Add cv_id here
                company: exp.company,
                position: exp.position,
                start_date: formatDateForSupabase(exp.start_date)!,
                end_date: formatDateForSupabase(exp.end_date),
                description: exp.description || null,
            }));
            const { error: insertExpError } = await supabase.from("experiences").insert(experiencesToInsert);
            if (insertExpError) handleSupabaseError(insertExpError, "inserting new experience");
        }

        // Step 4: Insert new education records
        if (formData.education && formData.education.length > 0) {
            const educationToInsert = formData.education.map(edu => ({
                cv_id: cvId, // Add cv_id here
                institution: edu.institution,
                degree: edu.degree,
                start_date: formatDateForSupabase(edu.start_date)!,
                end_date: formatDateForSupabase(edu.end_date),
            }));
            const { error: insertEduError } = await supabase.from("education").insert(educationToInsert);
            if (insertEduError) handleSupabaseError(insertEduError, "inserting new education");
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
    [user, fetchOrCreateUserCV]
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