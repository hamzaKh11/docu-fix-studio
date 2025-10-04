import { CVFormData, CVResponse } from "@/types/cv";
import { FileText } from "lucide-react";

interface PreviewSectionProps {
  cvResponse: CVResponse | null;
  formData: CVFormData;
}

const PreviewSection = ({ cvResponse, formData }: PreviewSectionProps) => {
  if (!cvResponse && !formData.name) {
    return (
      <div className="p-12 rounded-2xl border-2 border-dashed border-border bg-card flex flex-col items-center justify-center min-h-[600px]">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
          <FileText className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="font-heading text-xl font-semibold mb-2 text-card-foreground">
          Preview Your CV
        </h3>
        <p className="text-sm text-muted-foreground text-center max-w-sm">
          Upload a CV or fill out the form to see a live preview of your ATS-optimized resume
        </p>
      </div>
    );
  }

  // If we have a Google Docs ID, embed the viewer
  if (cvResponse?.doc_id) {
    return (
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30">
          <h3 className="font-heading text-lg font-semibold text-card-foreground">
            Google Docs Preview
          </h3>
        </div>
        <iframe
          src={`https://docs.google.com/document/d/${cvResponse.doc_id}/preview`}
          className="w-full h-[800px]"
          title="CV Preview"
        />
      </div>
    );
  }

  // If we have HTML preview
  if (cvResponse?.html_preview) {
    return (
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30">
          <h3 className="font-heading text-lg font-semibold text-card-foreground">
            Preview
          </h3>
        </div>
        <div 
          className="p-8 prose max-w-none"
          dangerouslySetInnerHTML={{ __html: cvResponse.html_preview }}
        />
      </div>
    );
  }

  // Fallback: Show a simple preview based on form data
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="p-4 border-b border-border bg-muted/30">
        <h3 className="font-heading text-lg font-semibold text-card-foreground">
          Live Preview
        </h3>
      </div>
      <div className="p-8 space-y-6">
        {formData.name && (
          <div>
            <h1 className="font-heading text-3xl font-bold text-card-foreground mb-2">
              {formData.name}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {formData.email && <span>{formData.email}</span>}
              {formData.phone && <span>{formData.phone}</span>}
              {formData.linkedin && <span>{formData.linkedin}</span>}
            </div>
          </div>
        )}

        {formData.targetRole && (
          <div>
            <h2 className="font-heading text-lg font-semibold text-card-foreground mb-2">
              Target Role
            </h2>
            <p className="text-foreground">{formData.targetRole}</p>
          </div>
        )}

        {formData.summary && (
          <div>
            <h2 className="font-heading text-lg font-semibold text-card-foreground mb-2">
              Professional Summary
            </h2>
            <p className="text-foreground">{formData.summary}</p>
          </div>
        )}

        {formData.experience.length > 0 && (
          <div>
            <h2 className="font-heading text-lg font-semibold text-card-foreground mb-3">
              Experience
            </h2>
            <div className="space-y-4">
              {formData.experience.map((exp) => (
                <div key={exp.id}>
                  <h3 className="font-semibold text-card-foreground">{exp.position}</h3>
                  <p className="text-sm text-muted-foreground">{exp.company}</p>
                  <p className="text-xs text-muted-foreground mb-2">
                    {exp.startDate} - {exp.endDate || "Present"}
                  </p>
                  <p className="text-sm text-foreground">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {formData.education.length > 0 && (
          <div>
            <h2 className="font-heading text-lg font-semibold text-card-foreground mb-3">
              Education
            </h2>
            <div className="space-y-3">
              {formData.education.map((edu) => (
                <div key={edu.id}>
                  <h3 className="font-semibold text-card-foreground">{edu.degree}</h3>
                  <p className="text-sm text-muted-foreground">{edu.institution}</p>
                  <p className="text-xs text-muted-foreground">
                    {edu.startDate} - {edu.endDate || "Present"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {formData.skills.length > 0 && formData.skills[0] !== "" && (
          <div>
            <h2 className="font-heading text-lg font-semibold text-card-foreground mb-2">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, idx) => (
                <span 
                  key={idx}
                  className="px-3 py-1 rounded-full bg-accent/10 text-accent text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewSection;
