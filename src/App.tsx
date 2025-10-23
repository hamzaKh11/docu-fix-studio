import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Page Imports
import Index from "@/pages/Index";
import CVApp from "@/pages/CVApp";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/NotFound";
import OptimizeCVPage from "@/pages/OptimizeCVPage";
import GenerateMessagePage from "@/pages/GenerateMessagePage";

// Component Imports
import { PasswordResetModal } from "@/components/app/PasswordResetModal";
import AppHeader from "@/components/app/AppHeader";
import AppFooter from "@/components/app/AppFooter";

const AppLayout = () => (
  <div className="min-h-screen bg-background">
    <AppHeader />
    <Outlet />
    <AppFooter />
  </div>
);

const ProtectedRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
};

const PublicRoutes = () => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-primary" />
      </div>
    );
  }

  return user ? <Navigate to="/app/cv-builder" replace /> : <Outlet />;
};

const AppContent = () => {
  const { showPasswordReset, setShowPasswordReset } = useAuth();

  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route element={<PublicRoutes />}>
          <Route path="/auth" element={<Auth />} />
        </Route>
        {/*
          هذا هو الجزء المهم.
          لقد قمنا بتعريف المسارات الجديدة هنا.
        */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/app" element={<AppLayout />}>
            <Route path="cv-builder" element={<CVApp />} />
            <Route path="cv-optimizer" element={<OptimizeCVPage />} />
            <Route path="message-generator" element={<GenerateMessagePage />} />
            <Route index element={<Navigate to="/app/cv-builder" replace />} />
          </Route>
        </Route>
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
