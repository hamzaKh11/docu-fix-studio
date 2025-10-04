import { Button } from "@/components/ui/button";
import { Download, Edit2 } from "lucide-react";
import { CVResponse } from "@/types/cv";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface ActionBarProps {
  cvResponse: CVResponse;
}

const ActionBar = ({ cvResponse }: ActionBarProps) => {
  const [newName, setNewName] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);

  const handleDownloadPDF = async () => {
    if (cvResponse.pdf_url) {
      // Track download event
      if (window.plausible) {
        window.plausible('pdf_downloaded');
      }
      
      window.open(cvResponse.pdf_url, '_blank');
    }
  };

  const handleRename = async () => {
    if (!newName.trim() || !cvResponse.doc_id) return;
    
    setIsRenaming(true);
    try {
      // TODO: Replace with actual API endpoint that calls n8n
      const response = await fetch('/api/rename', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doc_id: cvResponse.doc_id,
          new_name: newName,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to rename document');
      }

      alert('Document renamed successfully!');
      setNewName("");
    } catch (error) {
      console.error('Error renaming document:', error);
      alert('Failed to rename document. Please try again.');
    } finally {
      setIsRenaming(false);
    }
  };

  return (
    <div className="sticky top-20 z-40 border-b border-border bg-card/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-end gap-3">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Edit2 className="w-4 h-4 mr-2" />
              Rename
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rename Document</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Input
                placeholder="Enter new name..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <Button 
                onClick={handleRename}
                disabled={isRenaming || !newName.trim()}
                className="w-full"
              >
                {isRenaming ? "Renaming..." : "Rename Document"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Button 
          onClick={handleDownloadPDF}
          className="bg-gradient-to-r from-secondary to-accent hover:opacity-90 text-white"
          size="sm"
        >
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
      </div>
    </div>
  );
};

export default ActionBar;
