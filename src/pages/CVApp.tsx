import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import { Link } from "react-router-dom";
import UploadSection from "@/components/app/UploadSection";
import FormSection from "@/components/app/FormSection";
import PreviewSection from "@/components/app/PreviewSection";
import ActionBar from "@/components/app/ActionBar";
import { CVFormData, cvFormSchema } from "@/lib/validators";
import { CVResponse } from "@/types/cv";
import { useAuth } from "@/contexts/AuthContext";
import { useCV } from "@/hooks/useCV";
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

  useEffect(() => {
    if (user && isInitialLoad.current) {
      const loadCV = async () => {
        const cv = await fetchOrCreateUserCV();
        if (cv) setCurrentCV(cv);
      };
      loadCV();
      isInitialLoad.current = false;
    }
  }, [user, fetchOrCreateUserCV, setCurrentCV]);

  useEffect(() => {
    if (currentCV) {
      const personalInfo: Partial<PersonalInfo> =
        typeof currentCV.personal_info === "object" &&
        currentCV.personal_info !== null &&
        !Array.isArray(currentCV.personal_info)
          ? (currentCV.personal_info as PersonalInfo)
          : {};

      form.reset({
        name: personalInfo.name || "",
        email: personalInfo.email || user?.email || "",
        phone: personalInfo.phone || "",
        linkedin: personalInfo.linkedin || "",
        summary: personalInfo.summary || "",
        targetRole: currentCV.target_role || "",
        language: currentCV.language || "en",
        experience:
          currentCV.experiences?.map((e) => ({
            ...e,
            description: e.description ?? "",
            end_date: e.end_date ?? "",
          })) || [],
        education:
          currentCV.education?.map((e) => ({
            ...e,
            end_date: e.end_date ?? "",
          })) || [],
        skills: personalInfo.skills || [],
        languages: personalInfo.languages || [],
        certifications: personalInfo.certifications || [],
      });

      setCvResponse({
        doc_id: currentCV.generated_doc_url?.split("/d/")[1]?.split("/")[0],
        pdf_url: currentCV.generated_pdf_url,
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
  }, [currentCV, form, user?.email]);

  const handleDeleteCV = async () => {
    if (!currentCV) return;
    await deleteCVData(currentCV);
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
    await updateFullCV(currentCV.id, formData);
    await patchCV(currentCV.id, { status: "processing" });
    try {
      let cvUrl = currentCV.original_file_url;
      if (uploadedFile) {
        cvUrl = await uploadCVFile(uploadedFile, currentCV.id);
        if (!cvUrl) throw new Error("File upload failed.");
      }
      const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
      if (!webhookUrl) throw new Error("Webhook URL is not configured.");

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user?.id,
          cv_id: currentCV.id,
          cv_url: cvUrl,
          form_fields: formData,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "The server responded with an error.");
      }
      const result: CVResponse = await response.json();
      setCvResponse(result);
      if (result.doc_id && result.pdf_url) {
        await patchCV(currentCV.id, {
          status: "completed",
          generated_doc_url: `https://docs.google.com/document/d/${result.doc_id}/edit`,
          generated_pdf_url: result.pdf_url,
        });
      }
      toast.success("CV Generation Complete!");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred.";
      toast.error("CV Generation Failed", { description: message });
      if (currentCV) await patchCV(currentCV.id, { status: "failed" });
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

      {cvResponse?.doc_id && <ActionBar cvResponse={cvResponse} />}

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
