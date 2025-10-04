import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-accent/20 to-secondary/20">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent-foreground mb-6 backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI-Powered Resume Optimization</span>
          </div>
          
          <h1 className="font-heading text-5xl md:text-7xl font-bold mb-6 text-primary-foreground leading-tight">
            Transform Your Resume into an{" "}
            <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
              ATS-Friendly
            </span>{" "}
            Masterpiece
          </h1>
          
          <p className="text-xl md:text-2xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto font-light">
            Convert messy CVs into professional Google Docs and downloadable PDFs. 
            Get past the bots, impress the humans.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              asChild
              size="lg"
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-heading font-semibold text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <Link to="/app">
                Get My CV Fixed <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            
            <Button 
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 font-heading font-semibold text-lg px-8 py-6 rounded-full backdrop-blur-sm"
            >
              <a href="#pricing">
                View Pricing
              </a>
            </Button>
          </div>
          
          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-primary-foreground/60">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
              <span>Free trial available</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
