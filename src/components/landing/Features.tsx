import { FileText, Zap, Download, Globe, Shield, Sparkles } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Smart CV Parsing",
    description: "Upload any CV format - PDF, DOCX, or image. Our AI extracts and structures your information perfectly.",
  },
  {
    icon: Zap,
    title: "ATS Optimization",
    description: "Automatically format your CV to pass Applicant Tracking Systems used by 99% of companies.",
  },
  {
    icon: Download,
    title: "Instant Export",
    description: "Download as PDF or get a shareable Google Docs link. Edit anytime, anywhere.",
  },
  {
    icon: Globe,
    title: "Multi-Language Support",
    description: "Create CVs in English, French, or Arabic. Perfect for international job applications.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your data is encrypted and never shared. Delete your CV anytime with one click.",
  },
  {
    icon: Sparkles,
    title: "AI Enhancement",
    description: "Get intelligent suggestions to improve your resume content and impact.",
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-background" id="features">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-accent">
            Everything You Need to Land Your Dream Job
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful features designed to make your resume stand out from the crowd
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all hover:shadow-soft-lg animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-card-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
