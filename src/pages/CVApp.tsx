import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import { Link } from "react-router-dom";
import UploadSection from "@/components/app/UploadSection";
import FormSection from "@/components/app/FormSection";
import PreviewSection from "@/components/app/PreviewSection";
import { CVFormData, cvFormSchema } from "@/lib/validators";
import { CVResponse } from "@/types/cv";
import { useAuth } from "@/contexts/AuthContext";
import { useCV, FullCV } from "@/hooks/useCV";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { PersonalInfo } from "@/types/database";

const CVApp = () => {
  const { user, signOut } = useAuth();
  const {
    loading,
    currentCV,
    setCurrentCV,
    fetchOrCreateUserCV,
    updateFullCV,
    patchCV,
    uploadCVFile,
    deleteCVData,
  } = useCV();

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [cvResponse, setCvResponse] = useState<CVResponse | null>(null);
  const isInitialLoad = useRef(true);

  const form = useForm<CVFormData>({
    resolver: zodResolver(cvFormSchema),
    defaultValues: {
      name: "",
      email: user?.email || "",
      phone: "",
      linkedin: "",
      summary: "",
      targetRole: "",
      language: "en",
      experience: [],
      education: [],
      skills: [],
      languages: [],
      certifications: [],
    },
  });

  const resetFormWithCV = useCallback(
    (cv: FullCV | null) => {
      if (cv) {
        const personalInfo: Partial<PersonalInfo> =
          typeof cv.personal_info === "object" &&
          cv.personal_info !== null &&
          !Array.isArray(cv.personal_info)
            ? (cv.personal_info as PersonalInfo)
            : {};

        form.reset({
          name: personalInfo.name || "",
          email: personalInfo.email || user?.email || "",
          phone: personalInfo.phone || "",
          linkedin: personalInfo.linkedin || "",
          summary: personalInfo.summary || "",
          targetRole: cv.target_role || "",
          language: cv.language || "en",
          experience:
            cv.experiences?.map((e) => ({
              ...e,
              description: e.description ?? "",
              end_date: e.end_date ?? "",
            })) || [],
          education:
            cv.education?.map((e) => ({ ...e, end_date: e.end_date ?? "" })) ||
            [],
          skills: personalInfo.skills || [],
          languages: personalInfo.languages || [],
          certifications: personalInfo.certifications || [],
        });
        setCvResponse({
          doc_id: cv.generated_doc_url?.split("/d/")[1]?.split("/")[0],
          pdf_url: cv.generated_pdf_url,
        });
      } else {
        form.reset({
          name: "",
          email: user?.email || "",
          phone: "",
          linkedin: "",
          summary: "",
          targetRole: "",
          language: "en",
          experience: [],
          education: [],
          skills: [],
          languages: [],
          certifications: [],
        });
        setCvResponse(null);
        setUploadedFile(null);
      }
    },
    [form, user?.email]
  );

  useEffect(() => {
    if (user && isInitialLoad.current) {
      isInitialLoad.current = false;
      const loadCV = async () => {
        const cv = await fetchOrCreateUserCV();
        if (cv) {
          setCurrentCV(cv);
          resetFormWithCV(cv);
        }
      };
      loadCV();
    }
  }, [user, fetchOrCreateUserCV, setCurrentCV, resetFormWithCV]);

  const handleDeleteCV = async () => {
    if (!currentCV) return;
    await deleteCVData(currentCV);
    resetFormWithCV(null); // Explicitly reset form after deletion
  };

  const handleSaveProgress = async () => {
    if (!currentCV) return;
    await updateFullCV(currentCV.id, form.getValues());
  };

  const onSubmit = async (formData: CVFormData) => {
    if (!currentCV) {
      toast.error("CV workspace not found. Please refresh the page.");
      return;
    }

    // Step 1: Save all data first and get the fully updated CV object back.
    const updatedCVAfterSave = await updateFullCV(currentCV.id, formData);
    if (!updatedCVAfterSave) {
      toast.error(
        "Failed to save CV data before generation. Please try again."
      );
      return;
    }

    // Step 2: Now proceed with the generation process using the guaranteed fresh data.
    await patchCV(updatedCVAfterSave.id, { status: "processing" });
    try {
      let cvUrl = updatedCVAfterSave.original_file_url;
      if (uploadedFile) {
        cvUrl = await uploadCVFile(uploadedFile, updatedCVAfterSave.id);
        if (!cvUrl) throw new Error("File upload failed.");
      }
      const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
      if (!webhookUrl) throw new Error("Webhook URL is not configured.");

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user?.id,
          cv_id: updatedCVAfterSave.id,
          cv_url: cvUrl,
          form_fields: formData,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "The server responded with an error.");
      }
      const result: CVResponse = await response.json();
      const finalCv = await patchCV(updatedCVAfterSave.id, {
        status: "completed",
        generated_doc_url: `https://docs.google.com/document/d/${result.doc_id}/edit`,
        generated_pdf_url: result.pdf_url,
      });
      if (finalCv) {
        resetFormWithCV(finalCv); // Final reset with generated URLs
      }
      toast.success("CV Generation Complete!");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred.";
      toast.error("CV Generation Failed", { description: message });
      if (updatedCVAfterSave)
        await patchCV(updatedCVAfterSave.id, { status: "failed" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background sticky top-0 z-50 shadow-soft">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Link>
            </Button>
            <h1 className="text-2xl font-bold text-accent">CVCraft</h1>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground hidden sm:block">
              {user?.email}
            </p>
            <Button variant="outline" size="sm" onClick={signOut}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <UploadSection
              uploadedFile={uploadedFile}
              setUploadedFile={setUploadedFile}
              cvUrl={currentCV?.original_file_url}
              onDelete={handleDeleteCV}
            />
            <FormSection form={form} />
            <div className="mt-6 flex gap-4">
              <Button
                onClick={handleSaveProgress}
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading && currentCV?.status !== "processing"
                  ? "Saving..."
                  : "Save Progress"}
              </Button>
              <Button
                onClick={form.handleSubmit(onSubmit)}
                disabled={loading}
                className="w-full bg-[linear-gradient(90deg,_hsl(232_98%_68%),_hsl(253_95%_67%))] hover:opacity-90 text-white font-semibold text-lg py-6 shadow-soft-lg transition-all hover:scale-[1.02]"
              >
                {currentCV?.status === "processing" || loading
                  ? "Processing..."
                  : "Generate ATS-Friendly CV"}
              </Button>
            </div>
          </div>
          <div className="lg:sticky lg:top-36 h-fit">
            <PreviewSection
              cvResponse={cvResponse}
              formData={form.watch()}
              isLoading={currentCV?.status === "processing"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVApp;
