import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { CVFormData, ExperienceEntry, EducationEntry } from "@/types/cv";
import { nanoid } from "nanoid";

interface FormSectionProps {
  formData: CVFormData;
  setFormData: (data: CVFormData) => void;
}

const FormSection = ({ formData, setFormData }: FormSectionProps) => {
  const updateField = (field: keyof CVFormData, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const addExperience = () => {
    const newExperience: ExperienceEntry = {
      id: nanoid(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
    };
    updateField("experience", [...formData.experience, newExperience]);
  };

  const removeExperience = (id: string) => {
    updateField("experience", formData.experience.filter(exp => exp.id !== id));
  };

  const updateExperience = (id: string, field: keyof ExperienceEntry, value: string) => {
    updateField("experience", formData.experience.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const addEducation = () => {
    const newEducation: EducationEntry = {
      id: nanoid(),
      institution: "",
      degree: "",
      startDate: "",
      endDate: "",
    };
    updateField("education", [...formData.education, newEducation]);
  };

  const removeEducation = (id: string) => {
    updateField("education", formData.education.filter(edu => edu.id !== id));
  };

  const updateEducation = (id: string, field: keyof EducationEntry, value: string) => {
    updateField("education", formData.education.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  return (
    <div className="space-y-6 p-6 rounded-xl border border-border bg-card shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-card-foreground">CV Information</h2>
        <Select value={formData.language} onValueChange={(value: 'en' | 'fr' | 'ar') => updateField("language", value)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="fr">Français</SelectItem>
            <SelectItem value="ar">العربية</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Basic Info */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input 
            id="name"
            value={formData.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="John Doe"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input 
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="john@example.com"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input 
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder="+1 234 567 8900"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="linkedin">LinkedIn Profile</Label>
          <Input 
            id="linkedin"
            value={formData.linkedin}
            onChange={(e) => updateField("linkedin", e.target.value)}
            placeholder="linkedin.com/in/johndoe"
          />
        </div>

        <div>
          <Label htmlFor="targetRole">Target Role</Label>
          <Input 
            id="targetRole"
            value={formData.targetRole}
            onChange={(e) => updateField("targetRole", e.target.value)}
            placeholder="e.g., Senior Software Engineer"
          />
        </div>

        <div>
          <Label htmlFor="summary">Professional Summary</Label>
          <Textarea 
            id="summary"
            value={formData.summary}
            onChange={(e) => updateField("summary", e.target.value)}
            placeholder="Brief summary of your professional background..."
            rows={4}
          />
        </div>
      </div>

      {/* Experience */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-card-foreground">Experience</h3>
          <Button type="button" onClick={addExperience} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>

        {formData.experience.map((exp) => (
          <div key={exp.id} className="p-4 rounded-lg border border-border space-y-3 relative">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => removeExperience(exp.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>

            <div className="grid sm:grid-cols-2 gap-3">
              <Input 
                placeholder="Company"
                value={exp.company}
                onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
              />
              <Input 
                placeholder="Position"
                value={exp.position}
                onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <Input 
                type="month"
                placeholder="Start Date"
                value={exp.startDate}
                onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
              />
              <Input 
                type="month"
                placeholder="End Date"
                value={exp.endDate}
                onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
              />
            </div>

            <Textarea 
              placeholder="Description & achievements..."
              value={exp.description}
              onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
              rows={3}
            />
          </div>
        ))}
      </div>

      {/* Education */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-card-foreground">Education</h3>
          <Button type="button" onClick={addEducation} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>

        {formData.education.map((edu) => (
          <div key={edu.id} className="p-4 rounded-lg border border-border space-y-3 relative">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => removeEducation(edu.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>

            <div className="grid sm:grid-cols-2 gap-3">
              <Input 
                placeholder="Institution"
                value={edu.institution}
                onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
              />
              <Input 
                placeholder="Degree"
                value={edu.degree}
                onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <Input 
                type="month"
                placeholder="Start Date"
                value={edu.startDate}
                onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
              />
              <Input 
                type="month"
                placeholder="End Date"
                value={edu.endDate}
                onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Skills, Languages, Certifications */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="skills">Skills (comma-separated)</Label>
          <Input 
            id="skills"
            value={formData.skills.join(", ")}
            onChange={(e) => updateField("skills", e.target.value.split(",").map(s => s.trim()))}
            placeholder="JavaScript, React, Node.js, ..."
          />
        </div>

        <div>
          <Label htmlFor="languages">Languages (comma-separated)</Label>
          <Input 
            id="languages"
            value={formData.languages.join(", ")}
            onChange={(e) => updateField("languages", e.target.value.split(",").map(l => l.trim()))}
            placeholder="English, French, Spanish, ..."
          />
        </div>

        <div>
          <Label htmlFor="certifications">Certifications (comma-separated)</Label>
          <Input 
            id="certifications"
            value={formData.certifications.join(", ")}
            onChange={(e) => updateField("certifications", e.target.value.split(",").map(c => c.trim()))}
            placeholder="AWS Certified, PMP, ..."
          />
        </div>
      </div>
    </div>
  );
};

export default FormSection;
