import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import CvShowcase from "@/components/landing/CvShowcase"; // <-- 1. قم باستيراد المكون الجديد
import Testimonials from "@/components/landing/Testimonials";
import Pricing from "@/components/landing/Pricing";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <CvShowcase /> {/* <-- 2. أضف المكون هنا */}
      <Testimonials />
      <Pricing />
      <Footer />
    </main>
  );
};

export default Index;
