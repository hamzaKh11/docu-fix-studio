import { CVResponse } from "@/types/cv";
import { CVFormData } from "@/lib/validators";
import { FileText, LoaderCircle } from "lucide-react";

interface PreviewSectionProps {
  cvResponse: CVResponse | null;
  formData: CVFormData;
  isLoading: boolean;
}

const PreviewSection = ({
  cvResponse,
  formData,
  isLoading,
}: PreviewSectionProps) => {
  if (isLoading) {
    return (
      <div className="p-12 rounded-xl border-2 border-dashed border-border bg-card flex flex-col items-center justify-center min-h-[600px] shadow-soft">
        <LoaderCircle className="w-10 h-10 text-primary animate-spin mb-4" />
        <h3 className="text-xl font-bold mb-2 text-card-foreground">
          Generating your CV...
        </h3>
        <p className="text-sm text-muted-foreground text-center max-w-sm">
          Our AI is working its magic. This may take a moment.
        </p>
      </div>
    );
  }

  // If we have a Google Docs ID, embed the viewer
  if (cvResponse?.doc_id) {
    // rm=minimal cleans up the Google Docs UI for a better embedded experience
    const docPreviewUrl = `https://docs.google.com/document/d/${cvResponse.doc_id}/preview?rm=minimal`;
    return (
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-soft">
        <div className="p-4 border-b border-border bg-secondary">
          <h3 className="text-lg font-bold text-card-foreground">
            Google Docs Preview
          </h3>
        </div>
        <iframe
          src={docPreviewUrl}
          className="w-full h-[800px] border-0"
          title="CV Preview"
          allow="fullscreen"
        />
      </div>
    );
  }

  // Fallback if no response yet
  return (
    <div className="p-12 rounded-xl border-2 border-dashed border-border bg-card flex flex-col items-center justify-center min-h-[600px] shadow-soft">
      <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
        <FileText className="w-10 h-10 text-primary" />
      </div>
      <h3 className="text-xl font-bold mb-2 text-card-foreground">
        Preview Your CV
      </h3>
      <p className="text-sm text-muted-foreground text-center max-w-sm">
        Fill out the form and click "Generate" to see a live preview of your
        ATS-optimized resume.
      </p>
    </div>
  );
};

export default PreviewSection;
