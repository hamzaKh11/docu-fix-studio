import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // TODO: Integrate Lovable Cloud Auth or Supabase
      // const { data, error } = await supabase.auth.signInWithPassword({
      //   email,
      //   password,
      // });
      
      console.log("Sign in attempt:", { email });
      
      // Track signup event
      if (window.plausible) {
        window.plausible('signin_completed');
      }
    } catch (error) {
      console.error("Sign in error:", error);
      alert("Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // TODO: Integrate Lovable Cloud Auth or Supabase
      // const { data, error } = await supabase.auth.signUp({
      //   email,
      //   password,
      //   options: {
      //     emailRedirectTo: `${window.location.origin}/app`,
      //   },
      // });
      
      console.log("Sign up attempt:", { email });
      
      // Track signup event
      if (window.plausible) {
        window.plausible('signup_completed');
      }
    } catch (error) {
      console.error("Sign up error:", error);
      alert("Failed to sign up. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-accent/20 to-secondary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild className="text-primary-foreground">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        <div className="bg-card rounded-2xl border border-border p-8 shadow-xl">
          <div className="text-center mb-8">
            <h1 className="font-heading text-3xl font-bold mb-2 text-card-foreground">
              Welcome to CVCraft
            </h1>
            <p className="text-muted-foreground">
              Sign in to access your professional CVs
            </p>
          </div>

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-secondary to-accent hover:opacity-90 text-white font-heading font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Minimum 8 characters
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-secondary to-accent hover:opacity-90 text-white font-heading font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>By continuing, you agree to our</p>
            <div className="flex items-center justify-center gap-2 mt-1">
              <a href="#" className="text-accent hover:underline">Terms of Service</a>
              <span>and</span>
              <a href="#" className="text-accent hover:underline">Privacy Policy</a>
            </div>
          </div>
        </div>

        {/* TODO: Add Stripe billing integration skeleton */}
        <div className="mt-6 text-center">
          <p className="text-sm text-primary-foreground/60">
            Secure authentication powered by Lovable Cloud
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
