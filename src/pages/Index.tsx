import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/ui/navigation";
import { HeroSection } from "@/components/ui/hero-section";
import { FeaturesSection } from "@/components/ui/features-section";
import { useAuthStore } from "@/stores/auth-store";

const Index = () => {
  const { user, loading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      // Redirect authenticated users to dashboard
      // For now, redirect to customer dashboard by default
      // In production, you'd check user metadata to determine dashboard type
      const userType = user.user_metadata?.user_type || "customer";
      const dashboardPath = userType === "photographer" 
        ? "/photographer-dashboard" 
        : "/user-dashboard";
      navigate(dashboardPath);
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="p-3 bg-gradient-primary rounded-lg inline-block mb-4">
              <div className="h-8 w-8 bg-primary-foreground rounded"></div>
            </div>
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Only show landing page for non-authenticated users
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
    </div>
  );
};

export default Index;