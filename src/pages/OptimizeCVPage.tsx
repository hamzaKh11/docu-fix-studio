import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  FileText,
  Briefcase,
  Sparkles,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { UserCv } from "@/types/database";

type CVResponse = {
  doc_id: string;
};

const OptimizeCVPage = () => {
  const { user } = useAuth();
  const [cvs, setCvs] = useState<UserCv[]>([]);
  const [selectedCv, setSelectedCv] = useState<UserCv | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cvResponse, setCvResponse] = useState<CVResponse | null>(null);

  useEffect(() => {
    const fetchUserCVs = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("user_cvs")
          .select("*")
          .not("generated_doc_url", "is", null) // Fetch only CVs with a Google Doc link
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false });

        if (error) throw error;
        setCvs(data || []);
      } catch (error) {
        toast.error("Failed to fetch your CVs.");
        console.error("Error fetching CVs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserCVs();
  }, [user]);

  const handleOptimize = async () => {
    if (!selectedCv || !jobDescription.trim()) {
      toast.error("Please select a CV and provide a job description.");
      return;
    }

    if (!selectedCv.generated_doc_url) {
      toast.error(
        "The selected CV does not have a Google Doc URL to optimize."
      );
      return;
    }

    setIsProcessing(true);

    // Set the preview immediately
    const docId = selectedCv.generated_doc_url.split("/d/")[1]?.split("/")[0];
    if (docId) {
      setCvResponse({ doc_id: docId });
    } else {
      toast.error("Invalid Google Doc URL format.");
      setIsProcessing(false);
      return;
    }

    try {
      const webhookUrl = import.meta.env.VITE_N8N_OPTIMIZE_WEBHOOK_URL;
      if (!webhookUrl)
        throw new Error("Optimization webhook URL is not configured.");

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user?.id,
          cv_id: selectedCv.id,
          cv_doc_url: selectedCv.generated_doc_url,
          job_description: jobDescription,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "The server responded with an error.");
      }

      toast.success("CV optimization started!", {
        description: "You'll see the changes in the preview in real-time.",
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "An unknown error occurred.";
      toast.error("Optimization Failed", { description: message });
    } finally {
      // Set a timeout to turn off processing indicator after a while
      setTimeout(() => setIsProcessing(false), 5000);
    }
  };

  const handleSelectCv = (cv: UserCv) => {
    setSelectedCv(cv);
    if (cv.generated_doc_url) {
      const docId = cv.generated_doc_url.split("/d/")[1]?.split("/")[0];
      if (docId) {
        setCvResponse({ doc_id: docId });
      } else {
        setCvResponse(null);
        toast.warning("Could not extract document ID from the URL.");
      }
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-10 space-y-2 sm:space-y-3">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent tracking-tight">
            CV Optimizer
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto px-4">
            Tailor your CV to match any job description
          </p>
        </div>

        {/* Progress Steps */}
        <div className="max-w-3xl mx-auto mb-6 sm:mb-8">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 flex-1">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  selectedCv
                    ? "bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg"
                    : "bg-slate-200"
                }`}
              >
                {selectedCv ? (
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                ) : (
                  <span className="text-xs sm:text-sm font-medium text-slate-600">
                    1
                  </span>
                )}
              </div>
              <span
                className={`text-xs sm:text-sm font-medium hidden sm:block ${
                  selectedCv ? "text-slate-900" : "text-slate-500"
                }`}
              >
                Select CV
              </span>
            </div>

            <div className="h-0.5 flex-1 bg-slate-200 max-w-[60px] sm:max-w-[100px]">
              <div
                className={`h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ${
                  jobDescription.trim() ? "w-full" : "w-0"
                }`}
              />
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-1">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  jobDescription.trim()
                    ? "bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg"
                    : "bg-slate-200"
                }`}
              >
                {jobDescription.trim() ? (
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                ) : (
                  <span className="text-xs sm:text-sm font-medium text-slate-600">
                    2
                  </span>
                )}
              </div>
              <span
                className={`text-xs sm:text-sm font-medium hidden sm:block ${
                  jobDescription.trim() ? "text-slate-900" : "text-slate-500"
                }`}
              >
                Job Details
              </span>
            </div>

            <div className="h-0.5 flex-1 bg-slate-200 max-w-[60px] sm:max-w-[100px]">
              <div
                className={`h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ${
                  isProcessing ? "w-full animate-pulse" : "w-0"
                }`}
              />
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-1">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isProcessing
                    ? "bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg"
                    : "bg-slate-200"
                }`}
              >
                {isProcessing ? (
                  <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span className="text-xs sm:text-sm font-medium text-slate-600">
                    3
                  </span>
                )}
              </div>
              <span
                className={`text-xs sm:text-sm font-medium hidden sm:block ${
                  isProcessing ? "text-slate-900" : "text-slate-500"
                }`}
              >
                Optimize
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-5 gap-4 sm:gap-6 max-w-7xl mx-auto">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {/* CV Selection */}
            <div className="bg-white/70 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-slate-200/60 shadow-xl p-5 sm:p-6 transition-all duration-300 hover:shadow-2xl hover:border-slate-300/60">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-indigo-600" />
                </div>
                <label className="text-slate-900 text-sm sm:text-base font-semibold">
                  Your CVs
                </label>
              </div>

              <div className="space-y-2">
                {isLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-14 bg-slate-100 rounded-xl animate-pulse"
                      />
                    ))}
                  </div>
                ) : cvs.length > 0 ? (
                  cvs.map((cv) => (
                    <button
                      key={cv.id}
                      onClick={() => handleSelectCv(cv)}
                      disabled={isProcessing}
                      className={`w-full p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                        selectedCv?.id === cv.id
                          ? "bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-400 shadow-md"
                          : "bg-white/50 border-slate-200/50 hover:border-slate-300 hover:shadow-sm"
                      } disabled:opacity-50`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p
                            className={`font-medium text-sm truncate ${
                              selectedCv?.id === cv.id
                                ? "text-slate-900"
                                : "text-slate-700"
                            }`}
                          >
                            {cv.title || "Untitled CV"}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Updated{" "}
                            {new Date(cv.updated_at).toLocaleDateString()}
                          </p>
                        </div>
                        {selectedCv?.id === cv.id && (
                          <CheckCircle2 className="w-5 h-5 text-indigo-600 ml-2 flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500 text-sm">
                    No optimizable CVs found.
                  </div>
                )}
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white/70 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-slate-200/60 shadow-xl p-5 sm:p-6 transition-all duration-300 hover:shadow-2xl hover:border-slate-300/60">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-purple-600" />
                </div>
                <label className="text-slate-900 text-sm sm:text-base font-semibold">
                  Job Description
                </label>
              </div>

              <Textarea
                placeholder="Paste the job description here..."
                className="min-h-[160px] sm:min-h-[200px] text-sm sm:text-base resize-none border-slate-200/50 rounded-xl sm:rounded-2xl bg-white/50 backdrop-blur focus:bg-white transition-all duration-300 focus:ring-2 focus:ring-indigo-500/20 placeholder:text-slate-400"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                disabled={isProcessing}
              />
            </div>

            {/* Optimize Button */}
            <Button
              onClick={handleOptimize}
              disabled={
                isLoading ||
                isProcessing ||
                !selectedCv ||
                !jobDescription.trim()
              }
              className="w-full h-12 sm:h-14 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium text-sm sm:text-base rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Optimizing...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 sm:gap-3">
                  <Sparkles className="w-4 h-4" />
                  <span>Optimize with AI</span>
                </div>
              )}
            </Button>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-3 lg:sticky lg:top-8 h-fit">
            <div className="bg-white/70 backdrop-blur-2xl rounded-2xl sm:rounded-3xl border border-slate-200/60 shadow-xl p-5 sm:p-6 transition-all duration-300 hover:shadow-2xl hover:border-slate-300/60">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                  Live Preview
                </h3>
                {isProcessing && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200">
                    <Clock className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                    <span className="text-xs font-medium text-indigo-700">
                      Updating
                    </span>
                  </div>
                )}
              </div>

              <div className="rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-50/80 to-white border border-slate-200/50 overflow-hidden">
                {cvResponse ? (
                  <div
                    className="relative w-full"
                    style={{ paddingBottom: "141.4%" }}
                  >
                    <iframe
                      src={`https://docs.google.com/document/d/${cvResponse.doc_id}/preview`}
                      className="absolute inset-0 w-full h-full"
                      title="CV Preview"
                      style={{ border: "none" }}
                    />
                    {isProcessing && (
                      <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center">
                        <div className="bg-white rounded-2xl shadow-2xl p-6 flex flex-col items-center gap-3">
                          <div className="relative w-16 h-16">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 animate-ping" />
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-30 animate-pulse" />
                            <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center">
                              <Sparkles className="w-6 h-6 text-indigo-600 animate-pulse" />
                            </div>
                          </div>
                          <p className="text-sm font-medium text-slate-900">
                            Optimizing your CV
                          </p>
                          <p className="text-xs text-slate-500">
                            This may take a moment...
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 sm:py-32 px-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-4">
                      <FileText className="w-7 h-7 sm:w-9 sm:h-9 text-slate-400" />
                    </div>
                    <p className="text-slate-400 text-sm sm:text-base text-center">
                      Select a CV to preview
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default OptimizeCVPage;
