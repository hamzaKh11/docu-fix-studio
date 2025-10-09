import { Upload, X, FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface UploadSectionProps {
  uploadedFile: File | null;
  setUploadedFile: (file: File | null) => void;
  cvUrl: string | null | undefined;
  onDelete: () => void;
}

const shortenMiddle = (name: string, max = 32) => {
  if (name.length <= max) return name;
  const part = Math.floor((max - 3) / 2);
  return `${name.slice(0, part)}...${name.slice(name.length - part)}`;
};

const UploadSection = ({
  uploadedFile,
  setUploadedFile,
  cvUrl,
  onDelete,
}: UploadSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        // 10MB
        alert("File size must be less than 10MB");
        return;
      }
      setUploadedFile(file);
      if (window.plausible) {
        window.plausible("cv_uploaded");
      }
    }
  };

  const getFileName = () => {
    if (uploadedFile) return uploadedFile.name;
    if (cvUrl) {
      try {
        const pathParts = cvUrl.split("/");
        const encodedName = pathParts[pathParts.length - 1];
        // Decode the file name which might contain encoded characters
        const decodedName = decodeURIComponent(encodedName);
        // Return the part after the user_id/cv_id/
        const nameParts = decodedName.split("/");
        return nameParts[nameParts.length - 1];
      } catch {
        return "Uploaded CV";
      }
    }
    return "";
  };

  const showUploadedState = uploadedFile || cvUrl;

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

      {!showUploadedState ? (
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
        </label>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p
                className="font-medium text-card-foreground truncate"
                title={getFileName()}
              >
                {shortenMiddle(getFileName(), 20)}
              </p>
              {uploadedFile && (
                <p className="text-sm text-muted-foreground">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              )}
            </div>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertCircle className="text-destructive" />
                  Are you sure?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently remove your uploaded CV and reset all
                  associated form data. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDelete}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Yes, remove it
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center mt-4">
        Optional: You can also fill the form manually below
      </p>
    </div>
  );
};

declare global {
  interface Window {
    plausible?: (event: string, options?: unknown) => void;
  }
}

export default UploadSection;
