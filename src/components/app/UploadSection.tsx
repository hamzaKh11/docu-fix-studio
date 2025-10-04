import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

interface UploadSectionProps {
  uploadedFile: File | null;
  setUploadedFile: (file: File | null) => void;
}

const UploadSection = ({ uploadedFile, setUploadedFile }: UploadSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/png', 'image/jpeg'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a PDF, DOCX, or image file');
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      
      setUploadedFile(file);
      
      // Track upload event
      if (window.plausible) {
        window.plausible('cv_uploaded');
      }
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="p-6 rounded-xl border-2 border-dashed border-border bg-card hover:border-primary/30 transition-colors shadow-soft">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.png,.jpg,.jpeg"
        onChange={handleFileSelect}
        className="hidden"
        id="cv-upload"
      />
      
      {!uploadedFile ? (
        <label 
          htmlFor="cv-upload"
          className="flex flex-col items-center justify-center cursor-pointer py-8"
        >
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-card-foreground">
            Upload Your Current CV
          </h3>
          <p className="text-sm text-muted-foreground text-center mb-4">
            PDF, DOCX, or Image (Max 10MB)
          </p>
          <Button type="button" variant="outline">
            Choose File
          </Button>
        </label>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-medium text-card-foreground">{uploadedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemoveFile}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
      
      <p className="text-xs text-muted-foreground text-center mt-4">
        Optional: You can also fill the form manually below
      </p>
    </div>
  );
};

// Extend Window interface for Plausible
declare global {
  interface Window {
    plausible?: (event: string, options?: any) => void;
  }
}

export default UploadSection;
