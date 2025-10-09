import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  // Helper function to handle smooth scrolling
  const handleScroll = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[linear-gradient(180deg,_hsl(0_0%_100%)_0%,_hsl(232_100%_97%)_100%)]">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              AI-Powered Resume Optimization
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-accent leading-tight tracking-tight">
            Transform Your Resume into an{" "}
            <span className="bg-[linear-gradient(90deg,_hsl(232_98%_68%),_hsl(253_95%_67%))] bg-clip-text text-transparent">
              ATS-Friendly
            </span>{" "}
            Masterpiece
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Effortlessly convert any CV into a polished, professional document
            that gets past the bots and impresses hiring managers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="bg-[linear-gradient(90deg,_hsl(232_98%_68%),_hsl(253_95%_67%))] hover:opacity-90 text-white font-semibold text-lg px-8 py-6 rounded-xl shadow-soft-lg transition-all hover:scale-[1.02]"
            >
              <Link to="/app">
                Optimize My CV Now <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>

            {/* MODIFICATION: Changed from an anchor tag to a button with an onClick handler */}
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-border text-foreground hover:bg-secondary font-semibold text-lg px-8 py-6 rounded-xl transition-all"
              onClick={() => handleScroll("pricing")}
            >
              View Pricing
            </Button>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span>No credit card required to start</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span>Free plan available</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
