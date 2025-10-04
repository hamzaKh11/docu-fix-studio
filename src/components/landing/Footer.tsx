import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-heading text-2xl font-bold mb-4">CVCraft</h3>
            <p className="text-primary-foreground/70 text-sm">
              Transform your resume into an ATS-friendly masterpiece.
            </p>
          </div>
          
          <div>
            <h4 className="font-heading font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">Features</a></li>
              <li><a href="#pricing" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">Pricing</a></li>
              <li><Link to="/app" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">Get Started</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">About</a></li>
              <li><a href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">Blog</a></li>
              <li><a href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">Careers</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-primary-foreground/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/70">
            © 2025 CVCraft. All rights reserved.
          </p>
          
          <div className="flex gap-4">
            <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
