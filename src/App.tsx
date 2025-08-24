import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
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
    <ProtectedRoute requiredRole="customer">
      <UserDashboard defaultTab="chat" conversationId={conversationId} />
    </ProtectedRoute>
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
        <Routes>
          <Route path="/" element={<Index />} />
          <Route 
            path="/user-dashboard" 
            element={
              <ProtectedRoute requiredRole="customer">
                <UserDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/photographer-dashboard" 
            element={
              <ProtectedRoute requiredRole="photographer">
                <PhotographerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <AccountDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/profile/:type/:id" element={<ProfilePage />} />
          <Route path="/chat/:conversationId?" element={<ChatWrapper />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
