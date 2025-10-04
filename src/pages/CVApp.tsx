import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import UploadSection from "@/components/app/UploadSection";
import FormSection from "@/components/app/FormSection";
import PreviewSection from "@/components/app/PreviewSection";
import ActionBar from "@/components/app/ActionBar";
import { CVFormData, CVResponse } from "@/types/cv";

const CVApp = () => {
  const [formData, setFormData] = useState<CVFormData>({
    name: "",
    phone: "",
    email: "",
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
  
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [cvResponse, setCvResponse] = useState<CVResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Create FormData for multipart/form-data submission
      const formDataToSend = new FormData();
      
      if (uploadedFile) {
        formDataToSend.append("file", uploadedFile);
      }
      
      // Add all form fields as JSON
      formDataToSend.append("data", JSON.stringify(formData));
      
      // TODO: Replace with actual n8n webhook URL
      const webhookUrl = "https://YOUR_N8N/webhook/cvcrafter";
      
      const response = await fetch(webhookUrl, {
        method: "POST",
        body: formDataToSend,
      });
      
      if (!response.ok) {
        throw new Error("Failed to process CV");
      }
      
      const result: CVResponse = await response.json();
      setCvResponse(result);
      
      // Track event (Plausible/GA4 integration)
      if (window.plausible) {
        window.plausible("cv_generated");
      }
    } catch (error) {
      console.error("Error processing CV:", error);
      // TODO: Integrate Sentry for error reporting
      alert("Failed to process CV. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background sticky top-0 z-50 shadow-soft">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Link>
            </Button>
            <h1 className="text-2xl font-bold text-accent">CVCraft</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Action Bar */}
      {cvResponse && <ActionBar cvResponse={cvResponse} />}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Pane: Upload + Form */}
          <div className="space-y-6">
            <UploadSection 
              uploadedFile={uploadedFile}
              setUploadedFile={setUploadedFile}
            />
            
            <FormSection 
              formData={formData}
              setFormData={setFormData}
            />
            
            <Button 
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-[linear-gradient(90deg,_hsl(232_98%_68%),_hsl(253_95%_67%))] hover:opacity-90 text-white font-semibold text-lg py-6 shadow-soft-lg transition-all hover:scale-[1.02]"
            >
              {isLoading ? "Processing..." : "Generate ATS-Friendly CV"}
            </Button>
          </div>

          {/* Right Pane: Preview */}
          <div className="lg:sticky lg:top-24 h-fit">
            <PreviewSection cvResponse={cvResponse} formData={formData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVApp;
