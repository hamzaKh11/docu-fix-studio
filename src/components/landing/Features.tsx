import { FileText, Zap, Download, Globe, Shield, Sparkles } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Upload Anything",
    description:
      "Start with any format—PDF, DOCX, or even an image. Our AI intelligently extracts and organizes your data.",
  },
  {
    icon: Zap,
    title: "Beat the Bots",
    description:
      "Your CV is automatically structured to pass through Applicant Tracking Systems (ATS) used by top companies.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Writing",
    description:
      "Receive intelligent suggestions to enhance your descriptions, making your experience shine.",
  },
  {
    icon: Download,
    title: "Export & Edit Anywhere",
    description:
      "Instantly download a professional PDF or get a link to edit your new CV directly in Google Docs.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description:
      "Generate your CV in English, French, or Arabic to confidently apply for jobs anywhere in the world.",
  },
  {
    icon: Shield,
    title: "Private & Secure",
    description:
      "Your data is encrypted and belongs to you. We never share it, and you can delete it anytime.",
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-background" id="features">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-accent">
            The Smartest Way to Build a Winning Resume
          </h2>
          <p className="text-lg text-muted-foreground">
            CVCraft provides everything you need to stand out and get hired
            faster.
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
