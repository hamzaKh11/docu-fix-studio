import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import CVApp from "./pages/CVApp";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { PasswordResetModal } from "./components/app/PasswordResetModal"; // Import the new modal

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-primary" />
      </div>
    );
  }
  return user ? children : <Auth />;
};

const PublicRoute = ({ children }: { children: React.ReactElement }) => {
  const { user, loading } = useAuth();
  // Show a loader while checking auth state to prevent flash of content
  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-primary" />
      </div>
    );
  }
  return user ? <CVApp /> : children;
};

// Main App content component that has access to the AuthContext
const AppContent = () => {
  const { showPasswordReset, setShowPasswordReset } = useAuth();

  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <CVApp />
            </ProtectedRoute>
          }
        />
        <Route
          path="/auth"
          element={
            <PublicRoute>
              <Auth />
            </PublicRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <PasswordResetModal
        isOpen={showPasswordReset}
        setIsOpen={setShowPasswordReset}
      />
    </>
  );
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
