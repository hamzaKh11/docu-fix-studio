import { CVResponse } from "@/types/cv";
import { CVFormData } from "@/lib/validators";
import {
  FileText,
  LoaderCircle,
  Download,
  FilePenLine,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

interface PreviewSectionProps {
  cvResponse: CVResponse | null;
  formData: CVFormData;
  isLoading: boolean;
}

const PreviewSection = ({ cvResponse, isLoading }: PreviewSectionProps) => {
  // --- Handler for PDF Download ---
  const handleDownloadPDF = () => {
    if (cvResponse?.pdf_url) {
      window.open(cvResponse.pdf_url, "_blank");
      toast.success("Download started!");
    } else {
      toast.error("PDF not available yet.");
    }
  };

  // --- New Handler for DOCX Download ---
  const handleDownloadDOCS = () => {
    if (cvResponse?.doc_id) {
      // This URL directly exports the Google Doc as a .docx file
      const docxUrl = `https://docs.google.com/document/d/${cvResponse.doc_id}/export?format=docx`;
      window.open(docxUrl, "_blank");
      toast.success("DOCX download started!");
    } else {
      toast.error("Document not available yet.");
    }
  };

  const handleMakeCopy = () => {
    if (cvResponse?.doc_id) {
      const copyUrl = `https://docs.google.com/document/d/${cvResponse.doc_id}/copy`;
      window.open(copyUrl, "_blank");
    } else {
      toast.error("Document not available yet.");
    }
  };

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

  if (cvResponse?.doc_id) {
    const docPreviewUrl = `https://docs.google.com/document/d/${cvResponse.doc_id}/preview?rm=minimal`;
    return (
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-soft">
        <div className="p-4 border-b border-border bg-secondary/50 flex items-center justify-between">
          <h3 className="text-lg font-bold text-card-foreground">
            Google Docs Preview
          </h3>
          <div className="flex items-center gap-2">
            <Dialog>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <FilePenLine className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit a copy</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Your CV</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                  You will now have your own copy to edit. When you're finished,
                  click <strong>File &gt; Download &gt; .pdf</strong>.
                </p>
                <DialogFooter>
                  <Button onClick={handleMakeCopy}>Open</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <TooltipProvider>
              {/* --- New Download Dropdown --- */}
              <DropdownMenu>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                        <ChevronDown className="w-4 h-4 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Export Options</p>
                  </TooltipContent>
                </Tooltip>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={handleDownloadPDF}
                    disabled={!cvResponse.pdf_url}
                  >
                    Download as PDF (.pdf)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDownloadDOCS}>
                    Download as Word (.docx)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TooltipProvider>
          </div>
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
