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
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Everything You Need to Land Your Dream Job
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful features designed to make your resume stand out from the crowd
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-6 rounded-2xl bg-card border border-border hover:border-accent/50 transition-all hover:shadow-lg hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-heading text-xl font-semibold mb-2 text-card-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
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
