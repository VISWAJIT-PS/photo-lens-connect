import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/ui/navigation";
import { HeroSection } from "@/components/ui/hero-section";
import { FeaturesSection } from "@/components/ui/features-section";
import { useAuthStore } from "@/stores/auth-store";
import { LoadingPage } from "@/components/ui/loading-animations";

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
      <LoadingPage 
        message="Welcome to PhotoLens" 
        showLogo={true}
      />
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