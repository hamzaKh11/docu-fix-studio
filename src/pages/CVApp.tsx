import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
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
import { Sparkles } from "lucide-react";

const CVApp = () => {
  const { user } = useAuth();
  // console.log("Current user:", user); // هذا سيطبع كثيرًا وهو طبيعي
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
          pdf_url: cv.generated_pdf_url ?? undefined,
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
        console.log("Fetching or creating CV...");
        const cv = await fetchOrCreateUserCV();
        if (cv) {
          console.log("CV loaded:", cv);
          setCurrentCV(cv);
          // لا نستدعي resetFormWithCV هنا، الـ effect التالي سيفعل
        } else {
          console.error("Failed to load CV.");
        }
      };
      loadCV();
    }
  }, [user, fetchOrCreateUserCV, setCurrentCV]);

  // هذا الـ effect مخصص فقط لمزامنة currentCV مع الفورم
  useEffect(() => {
    console.log("CV state changed, resetting form.", currentCV);
    resetFormWithCV(currentCV);
  }, [currentCV, resetFormWithCV]);

  const handleDeleteCV = async () => {
    if (!currentCV) return;
    await deleteCVData(currentCV);
    // سيتم تعيين currentCV إلى null داخل deleteCVData، مما سيشغل الـ effect أعلاه
  };

  const handleSaveProgress = async () => {
    if (!currentCV) return;
    const isValid = await form.trigger();
    if (!isValid) {
      toast.error("Please fill out all required fields before saving.");
      return;
    }
    const formData = form.getValues();
    if (uploadedFile) {
      const newCvUrl = await uploadCVFile(uploadedFile, currentCV.id);
      if (newCvUrl) {
        await updateFullCV(currentCV.id, formData);
        setUploadedFile(null); // امسح الملف بعد الرفع
      } else {
        toast.error("Failed to upload the new CV. Please try again.");
        return;
      }
    } else {
      await updateFullCV(currentCV.id, formData);
    }
  };

  const onSubmit = async (formData: CVFormData) => {
    if (!currentCV) {
      toast.error("CV workspace not found. Please refresh the page.");
      return;
    }

    // 1. احفظ البيانات أولاً
    const updatedCVAfterSave = await updateFullCV(currentCV.id, formData);
    if (!updatedCVAfterSave) {
      toast.error(
        "Failed to save CV data before generation. Please try again."
      );
      return;
    }

    // 2. قم بتعيين الحالة إلى "processing". هذا سيُشغل loading = true
    await patchCV(updatedCVAfterSave.id, { status: "processing" });

    try {
      let cvUrl = updatedCVAfterSave.original_file_url;
      // 3. قم برفع الملف إذا كان هناك ملف جديد
      if (uploadedFile) {
        const newUrl = await uploadCVFile(uploadedFile, updatedCVAfterSave.id);
        if (!newUrl) throw new Error("File upload failed after save.");
        cvUrl = newUrl;
        setUploadedFile(null); // امسح الملف بعد الرفع
      }

      // 4. تأكد من وجود رابط ملف
      if (!cvUrl) {
        throw new Error("CV file is missing. Please upload your CV first.");
      }

      // 5. قم بتشغيل n8n
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

      // هذا هو الـ toast الذي تراه
      toast.info("CV generation has started!", {
        description: "You will be notified when it's complete.",
      });
      // لا نوقف التحميل. مستمع Realtime سيفعل ذلك.
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred.";
      toast.error("CV Generation Failed", { description: message });
      // إذا فشل، أعد الحالة إلى "failed".
      // المستمع سيستقبل هذا التحديث ويوقف التحميل.
      if (updatedCVAfterSave)
        await patchCV(updatedCVAfterSave.id, { status: "failed" });
    }
  };

  // === هذا هو المنطق الصحيح 100% ===
  const isProcessing = loading || currentCV?.status === "processing";

  return (
    <div className="min-h-screen bg-background">
      {/* <header className="border-b border-border bg-background sticky top-0 z-50 shadow-soft">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Link>
            </Button>
            <h1 className="text-2xl font-bold text-accent">ATSmooth</h1>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground hidden sm:block">
              {user?.user_metadata.full_name || user?.email}
            </p>
            <Button variant="outline" size="sm" onClick={signOut}>
              Logout
            </Button>
          </div>
        </div>
      </header> */}

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <UploadSection
              uploadedFile={uploadedFile}
              setUploadedFile={setUploadedFile}
              cvUrl={currentCV?.original_file_url}
              onDelete={handleDeleteCV}
            />
            <FormSection form={form} />
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleSaveProgress}
                disabled={isProcessing}
                variant="outline"
                className="h-12 px-6 rounded-xl border-slate-200/60 bg-white hover:bg-slate-700 text-slate-700 font-medium transition-all duration-300 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading && currentCV?.status !== "processing" ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Progress
                  </>
                )}
              </Button>

              <Button
                onClick={form.handleSubmit(onSubmit)}
                disabled={isProcessing}
                className="flex-1 h-12 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating your CV
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate CV
                  </>
                )}
              </Button>
            </div>
          </div>
          <div className="lg:sticky lg:top-36 h-fit">
            <PreviewSection
              cvResponse={cvResponse}
              formData={form.watch()}
              isLoading={currentCV?.status === "processing"} // <--- هذا صحيح
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CVApp;
