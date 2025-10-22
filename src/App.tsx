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
} from "react-router-dom"; // <-- Import Navigate
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Page Imports
import Index from "./pages/Index";
import CVApp from "./pages/CVApp";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import OptimizeCVPage from "./pages/OptimizeCVPage";
import GenerateMessagePage from "./pages/GenerateMessagePage";

// Component Imports
import { PasswordResetModal } from "./components/app/PasswordResetModal";
import AppHeader from "./components/app/AppHeader";
import AppFooter from "./components/app/AppFooter";

// --- REFACTORED ROUTING LOGIC ---

/**
 * A layout component for the main application pages that includes the header.
 * The <Outlet /> component renders the specific child page (CV Builder, Optimize CV, etc.).
 */
const AppLayout = () => (
  <div className="min-h-screen bg-background">
    <AppHeader />
    <main>
      <Outlet />
    </main>
    <AppFooter />
  </div>
);

/**
 * This component now acts as a gatekeeper for all protected routes.
 * It checks for authentication and either redirects to the login page
 * or allows access to the nested routes via <Outlet />.
 */
const ProtectedRoutes = () => {
  const { user, loading } = useAuth();

  // Show a full-page loader while the auth state is being determined
  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-primary" />
      </div>
    );
  }

  // If the user is not authenticated, redirect them to the /auth page.
  // The `replace` prop prevents them from using the browser's back button
  // to return to the protected page.
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If the user is authenticated, render the child routes.
  return <Outlet />;
};

/**
 * This component protects public routes (like login/signup) from authenticated users.
 * If a logged-in user tries to visit /auth, they will be redirected to the main app.
 */
const PublicRoutes = () => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-primary" />
      </div>
    );
  }

  return user ? <Navigate to="/app" replace /> : <Outlet />;
};

// Main App content component that has access to the AuthContext
const AppContent = () => {
  const { showPasswordReset, setShowPasswordReset } = useAuth();

  return (
    <>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<Index />} />

        {/* Public Authentication Routes (Login, Signup) */}
        <Route element={<PublicRoutes />}>
          <Route path="/auth" element={<Auth />} />
        </Route>

        {/* --- All protected application routes are nested here --- */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<CVApp />} />
            <Route path="optimize-cv" element={<OptimizeCVPage />} />
            <Route path="generate-message" element={<GenerateMessagePage />} />
          </Route>
        </Route>

        {/* 404 Not Found Page */}
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
