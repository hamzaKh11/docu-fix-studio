import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Software Engineer",
    company: "Google",
    content: "CVCraft helped me land my dream job at Google. The ATS optimization made all the difference!",
    rating: 5,
    avatar: "SJ",
  },
  {
    name: "Michael Chen",
    role: "Product Manager",
    company: "Amazon",
    content: "I got 3x more interview calls after using CVCraft. The formatting is clean and professional.",
    rating: 5,
    avatar: "MC",
  },
  {
    name: "Aisha Mohammed",
    role: "Data Scientist",
    company: "Microsoft",
    content: "The multi-language support is fantastic. I created CVs in English and Arabic effortlessly.",
    rating: 5,
    avatar: "AM",
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-muted/30" id="testimonials">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Loved by Job Seekers Worldwide
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands who've landed their dream jobs with CVCraft
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="p-6 rounded-2xl bg-card border border-border hover:border-accent/50 transition-all hover:shadow-lg animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>
              
              <p className="text-card-foreground mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center text-white font-heading font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-heading font-semibold text-card-foreground">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
