import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin } from "lucide-react";
import React from "react"; // Import React for event type

const Footer = () => {
  // Helper function to handle smooth scrolling while preventing URL change
  const handleScroll = (
    event: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    event.preventDefault();
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-neutral-dark text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">ATSmooth</h3>
            <p className="text-white/70 text-sm">
              Transform your resume into an ATS-friendly masterpiece.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              {/* MODIFICATION: Added onClick handlers */}
              <li>
                <a
                  href="#features"
                  onClick={(e) => handleScroll(e, "features")}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  onClick={(e) => handleScroll(e, "pricing")}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Pricing
                </a>
              </li>
              <li>
                <Link
                  to="/app"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Get Started
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/70">
            © 2025 ATSmooth. All rights reserved.
          </p>

          <div className="flex gap-4">
            <a
              href="#"
              className="text-white/70 hover:text-white transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-white/70 hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-white/70 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
