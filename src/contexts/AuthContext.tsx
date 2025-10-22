import { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  showPasswordReset: boolean;
  setShowPasswordReset: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  // Start with loading as true until we have definitively checked for a session.
  const [loading, setLoading] = useState(true);
  const [showPasswordReset, setShowPasswordReset] = useState(false);

  useEffect(() => {
    // This function checks for an existing session and then sets up the listener.
    const initializeAuth = async () => {
      // 1. Check for an active session when the component mounts.
      // This gets the user state immediately, preventing the "flicker".
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      // 2. Now that we have the initial state, we can set loading to false.
      setLoading(false);

      // 3. Set up the subscription to listen for FUTURE auth changes.
      // E.g., user logs in, logs out, or token is refreshed.
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, newSession) => {
        // When the auth state changes, update the user state.
        setUser(newSession?.user ?? null);
      });

      // The cleanup function will run when the component unmounts.
      return () => {
        subscription.unsubscribe();
      };
    };

    initializeAuth();
  }, []); // The empty dependency array ensures this runs only once.

  const signOut = async () => {
    await supabase.auth.signOut();
    // The onAuthStateChange listener will handle setting the user to null.
  };

  const value = {
    user,
    loading,
    signOut,
    showPasswordReset,
    setShowPasswordReset,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
