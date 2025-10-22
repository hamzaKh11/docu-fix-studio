import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Starter",
    price: "$0",
    period: "forever",
    description: "Test the magic — create your first AI-optimized CV free.",
    features: [
      "1 CV transformation from any format",
      "PDF export",
      "Basic ATS optimization",
      "No access to AI job-match tools",
      "Email support",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "per month",
    description: "For serious job seekers ready to land interviews faster.",
    features: [
      "Unlimited CV transformations (any format)",
      "Full ATS keyword optimization for every job",
      "AI-generated LinkedIn & Email outreach messages",
      "Custom Cover Letter generator",
      "Google Docs & PDF export",
      "Unlimited re-edits & reworks",
      "Priority support (24h reply)",
      "Bonus: Portfolio Website + Tutorials ($200 value)",
    ],
    cta: "Upgrade Now",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    description: "For recruitment agencies & universities.",
    features: [
      "Everything in Pro",
      "Multi-user team dashboard",
      "Custom branding",
      "API access",
      "Dedicated account manager",
      "Private onboarding & integrations",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const Pricing = () => {
  return (
    <section className="py-24 bg-background" id="pricing">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-accent">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose the plan that's right for you. Upgrade or cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative p-8 rounded-xl border transition-all hover:shadow-soft-lg animate-fade-in ${
                plan.popular
                  ? "border-primary bg-card shadow-soft-lg"
                  : "border-border bg-card hover:border-primary/30"
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[linear-gradient(90deg,_hsl(232_98%_68%),_hsl(253_95%_67%))] text-white text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2 text-card-foreground">
                  {plan.name}
                </h3>
                <div className="mb-2">
                  <span className="text-4xl font-bold text-foreground">
                    {plan.price}
                  </span>
                  {plan.period !== "contact us" && (
                    <span className="text-muted-foreground ml-2">
                      / {plan.period}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-card-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                className={`w-full font-semibold shadow-soft transition-all hover:scale-[1.02] ${
                  plan.popular
                    ? "bg-[linear-gradient(90deg,_hsl(232_98%_68%),_hsl(253_95%_67%))] hover:opacity-90 text-white"
                    : "bg-primary hover:bg-primary/90"
                }`}
              >
                <Link to="/app">{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
