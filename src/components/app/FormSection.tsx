import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { CVFormData } from "@/lib/validators";
import { nanoid } from "nanoid";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";

interface FormSectionProps {
  form: UseFormReturn<CVFormData>;
}

const FormSection = ({ form }: FormSectionProps) => {
  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    control: form.control,
    name: "experience",
  });

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control: form.control,
    name: "education",
  });

  return (
    <Form {...form}>
      <form className="space-y-6 p-6 rounded-xl border border-border bg-card shadow-soft mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-card-foreground">
            CV Information
          </h2>
          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Language" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name *</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="+1 234 567 8900"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="linkedin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn Profile</FormLabel>
                <FormControl>
                  <Input placeholder="linkedin.com/in/johndoe" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="targetRole"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Role *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Senior Software Engineer"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="summary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Professional Summary</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Brief summary of your professional background..."
                    rows={4}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-card-foreground">
              Experience
            </h3>
            <Button
              type="button"
              onClick={() =>
                appendExperience({
                  id: nanoid(),
                  company: "",
                  position: "",
                  start_date: "",
                  end_date: "",
                  description: "",
                })
              }
              size="sm"
              variant="outline"
            >
              <Plus className="w-4 h-4 mr-2" /> Add
            </Button>
          </div>
          {experienceFields.map((field, index) => (
            <div
              key={field.id}
              className="p-4 rounded-lg border border-border space-y-3 relative"
            >
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => removeExperience(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <div className="grid sm:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name={`experience.${index}.company`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Company" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`experience.${index}.position`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Position" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name={`experience.${index}.start_date`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="month"
                          placeholder="Start Date"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`experience.${index}.end_date`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="month" placeholder="End Date" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name={`experience.${index}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Description & achievements..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-card-foreground">
              Education
            </h3>
            <Button
              type="button"
              onClick={() =>
                appendEducation({
                  id: nanoid(),
                  institution: "",
                  degree: "",
                  start_date: "",
                  end_date: "",
                })
              }
              size="sm"
              variant="outline"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
          {educationFields.map((field, index) => (
            <div
              key={field.id}
              className="p-4 rounded-lg border border-border space-y-3 relative"
            >
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => removeEducation(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <div className="grid sm:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name={`education.${index}.institution`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Institution" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`education.${index}.degree`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Degree" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name={`education.${index}.start_date`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="month"
                          placeholder="Start Date"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`education.${index}.end_date`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="month" placeholder="End Date" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="skills"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Skills (comma-separated)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="JavaScript, React, Node.js, ..."
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value.split(",").map((s) => s.trim())
                      )
                    }
                    value={
                      Array.isArray(field.value) ? field.value.join(", ") : ""
                    }
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="languages"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Languages (comma-separated)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="English, French, Spanish, ..."
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value.split(",").map((s) => s.trim())
                      )
                    }
                    value={
                      Array.isArray(field.value) ? field.value.join(", ") : ""
                    }
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="certifications"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Certifications (comma-separated)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="AWS Certified, PMP, ..."
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value.split(",").map((s) => s.trim())
                      )
                    }
                    value={
                      Array.isArray(field.value) ? field.value.join(", ") : ""
                    }
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
};

export default FormSection;
