import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { UserCV, Experience, Education, PersonalInfo, CVLanguage } from '@/types/database';
import { toast } from 'sonner';

export function useCV() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentCV, setCurrentCV] = useState<UserCV | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);

  const createCV = useCallback(async (title: string = 'Untitled CV', language: CVLanguage = 'en') => {
    if (!user) return null;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_cvs')
        .insert({
          user_id: user.id,
          title,
          language,
          status: 'draft'
        })
        .select()
        .single();

      if (error) throw error;
      setCurrentCV(data as UserCV);
      return data as UserCV;
    } catch (error) {
      console.error('Error creating CV:', error);
      toast.error('Failed to create CV');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const uploadFile = useCallback(async (file: File, cvId: string) => {
    if (!user) return null;

    setLoading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${cvId}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('cv-uploads')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('cv-uploads')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateCV = useCallback(async (cvId: string, updates: Partial<UserCV>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_cvs')
        .update(updates as any)
        .eq('id', cvId)
        .select()
        .single();

      if (error) throw error;
      setCurrentCV(data as UserCV);
      return data as UserCV;
    } catch (error) {
      console.error('Error updating CV:', error);
      toast.error('Failed to update CV');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const addExperience = useCallback(async (experience: Omit<Experience, 'id' | 'created_at'>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('experiences')
        .insert(experience)
        .select()
        .single();

      if (error) throw error;
      setExperiences(prev => [...prev, data]);
      return data;
    } catch (error) {
      console.error('Error adding experience:', error);
      toast.error('Failed to add experience');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const addEducation = useCallback(async (edu: Omit<Education, 'id' | 'created_at'>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('education')
        .insert(edu)
        .select()
        .single();

      if (error) throw error;
      setEducation(prev => [...prev, data]);
      return data;
    } catch (error) {
      console.error('Error adding education:', error);
      toast.error('Failed to add education');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteExperience = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('experiences')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setExperiences(prev => prev.filter(exp => exp.id !== id));
      toast.success('Experience deleted', {
        action: {
          label: 'Undo',
          onClick: () => toast.info('Undo not implemented yet')
        }
      });
    } catch (error) {
      console.error('Error deleting experience:', error);
      toast.error('Failed to delete experience');
    }
  }, []);

  const deleteEducation = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('education')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setEducation(prev => prev.filter(edu => edu.id !== id));
      toast.success('Education deleted', {
        action: {
          label: 'Undo',
          onClick: () => toast.info('Undo not implemented yet')
        }
      });
    } catch (error) {
      console.error('Error deleting education:', error);
      toast.error('Failed to delete education');
    }
  }, []);

  return {
    loading,
    currentCV,
    experiences,
    education,
    createCV,
    uploadFile,
    updateCV,
    addExperience,
    addEducation,
    deleteExperience,
    deleteEducation,
    setExperiences,
    setEducation
  };
}
