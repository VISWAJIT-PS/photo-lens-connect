import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useParams, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/stores/auth-store";
import { useEffect } from "react";
import Index from "./pages/Index";
import CustomerDashboard from "./pages/CustomerDashboard";
import PhotographerDashboard from "./pages/PhotographerDashboard";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import AccountDashboard from "./pages/AccountDashboard";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import UserDashboard from "./pages/UserDashboard";
import { PageTransition } from "@/components/ui/motion-wrappers";

const AuthRefreshHandler = () => {
  const refreshSession = useAuthStore((state) => state.refreshSession);
  
  useEffect(() => {
    refreshSession();
  }, [refreshSession]);
  
  return null;
};

interface ChatWrapperProps {}

const ChatWrapper = ({}: ChatWrapperProps) => {
  const { conversationId } = useParams<{ conversationId?: string }>();
  return (
    <PageTransition>
      <ProtectedRoute requiredRole="customer">
        <UserDashboard defaultTab="chat" conversationId={conversationId} />
      </ProtectedRoute>
    </PageTransition>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PageTransition>
            <Index />
          </PageTransition>
        } />
        <Route 
          path="/user-dashboard" 
          element={
            <PageTransition>
              <ProtectedRoute requiredRole="customer">
                <UserDashboard />
              </ProtectedRoute>
            </PageTransition>
          } 
        />
        <Route 
          path="/photographer-dashboard" 
          element={
            <PageTransition>
              <ProtectedRoute requiredRole="photographer">
                <PhotographerDashboard />
              </ProtectedRoute>
            </PageTransition>
          } 
        />
        <Route
          path="/account"
          element={
            <PageTransition>
              <ProtectedRoute>
                <AccountDashboard />
              </ProtectedRoute>
            </PageTransition>
          }
        />
        <Route path="/profile/:type/:id" element={
          <PageTransition>
            <ProfilePage />
          </PageTransition>
        } />
        <Route path="/chat/:conversationId?" element={<ChatWrapper />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={
          <PageTransition>
            <NotFound />
          </PageTransition>
        } />
      </Routes>
    </AnimatePresence>
  );
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthRefreshHandler />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
