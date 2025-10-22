import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
// أضفنا CheckCircle2
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const structuredData = {
  // ... (بيانات JSON-LD تبقى كما هي)
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ATSmooth — AI Resume Optimizer",
  url: "https://yourdomain.com",
  description:
    "AI-powered resume optimization that transforms any CV into an ATS-friendly, recruiter-approved version. Get instant feedback and actionable suggestions.",
  applicationCategory: "BusinessApplication",
  operatingSystem: "All",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    url: "https://yourdomain.com/pricing",
  },
};

const Hero: React.FC = () => {
  // لم نعد بحاجة لـ handleScroll
  // const handleScroll = (id: string) => { ... };

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden flex items-center justify-center bg-[linear-gradient(180deg,hsl(0_0%_100%)_0%,hsl(232_100%_97%)_100%)]"
    >
      {/* SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Subtle background blobs */}
      <div className="absolute -left-32 -top-32 w-[480px] h-[480px] rounded-full bg-[linear-gradient(135deg,hsl(232_98%_90%)_0%,transparent_100%)] blur-3xl opacity-70 pointer-events-none" />
      <div className="absolute -right-40 -bottom-40 w-[520px] h-[520px] rounded-full bg-[linear-gradient(135deg,hsl(253_95%_90%)_0%,transparent_100%)] blur-3xl opacity-70 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 w-full container mx-auto px-6 py-20 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-4xl"
        >
          {/* Highlight Chip (IMPROVED PADDING) */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full border border-border bg-gradient-to-r from-[hsl(232_98%_98%)] to-[hsl(253_95%_98%)]">
            <Sparkles className="w-4 h-4 text-[hsl(253_95%_67%)]" />
            <span className="text-sm font-medium text-foreground">
              AI-Powered Resume Optimization
            </span>
          </div>

          {/* Main heading (Improved Readability) */}
          <h1
            id="hero-heading"
            // (تعديل طفيف على leading لسهولة القراءة)
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-foreground"
          >
            Transform your CV into an{" "}
            <span className="bg-clip-text text-transparent bg-[linear-gradient(90deg,hsl(232_98%_68%),hsl(253_95%_67%))]">
              ATS-Friendly
            </span>{" "}
            Masterpiece
          </h1>

          {/* Subheading (IMPROVED COPY: Benefit-focused) */}
          <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Stop guessing. Get instant, AI-driven feedback to optimize your CV,
            pass any ATS, and get seen by recruiters.
          </p>

          {/* CTA Buttons (IMPROVED STYLING & SEMANTICS) */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg" // (استخدام الحجم القياسي)
              className="inline-flex items-center gap-3 px-8 rounded-xl bg-[linear-gradient(90deg,hsl(232_98%_68%),hsl(253_95%_67%))] text-white font-semibold shadow-lg transition-colors"
              // (إزالة py-5 و hover:scale)
              aria-label="Optimize my CV instantly"
            >
              <Link to="/app">
                Optimize My CV <ArrowRight className="w-5 h-5" />
                {/* (نص أقصر) */}
              </Link>
            </Button>

            {/* IMPROVED Secondary Button: Changed to <a> tag for semantics */}
            <Button
              asChild // (استخدام asChild لتمرير الـ styles إلى <a>)
              variant="outline"
              size="lg"
              className="px-8 rounded-xl border-border text-foreground bg-white hover:bg-slate-700 transition-colors"
              // (إزالة border-2 وتغيير حالة الـ hover)
              aria-label="See pricing plans"
            >
              <a href="#pricing">View Pricing</a>
            </Button>
          </div>

          {/* Trust signals (IMPROVED WITH ICONS) */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[hsl(253_95%_67%)]" />
              <span>Loved by recruiters & hiring teams</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[hsl(253_95%_67%)]" />
              <span>No credit card required — Free trial</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Foreground Soft Fade */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-white/70" />
    </section>
  );
};

export default Hero;
