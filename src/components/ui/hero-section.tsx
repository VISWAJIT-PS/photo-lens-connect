import { Button } from "./button";
import { Search, MapPin, Calendar, Star } from "lucide-react";
import { Input } from "./input";
import { AuthModal } from "./auth-modal";
import { OnboardingPopup } from "@/components/OnboardingPopup";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth-store";
import { useWebsiteStats } from "@/hooks/use-website-stats";
import heroImage from "@/assets/hero-photographer.jpg";

export const HeroSection = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data: stats, isLoading } = useWebsiteStats();

  const handleOnboardingComplete = (data: any) => {
    setShowOnboarding(false);
    if (!user) {
      // Store onboarding data and redirect to auth
      localStorage.setItem('pendingOnboardingData', JSON.stringify(data));
      // Show auth modal or navigate to auth page
    } else {
      // User is logged in, process the data and navigate to dashboard
      navigate('/user-dashboard', { state: { onboardingData: data } });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Professional photographer at work"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Text Content */}
          <div className="text-white space-y-8 animate-fade-in-up lg:pr-8 xl:pr-12">
            <div className="space-y-4 text-left">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Capture Perfect
                <span className="block bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                  Moments
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 font-medium max-w-2xl">
                Connect with professional photographers for weddings, events, and special occasions. 
                Book equipment, find stunning locations, and create memories that last forever.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 py-6 max-w-md">
              <div className="text-left">
                <div className="text-2xl md:text-3xl font-bold text-primary">
                  {isLoading ? "..." : `${stats?.photographers_count || 500}+`}
                </div>
                <div className="text-sm text-gray-300">Photographers</div>
              </div>
              <div className="text-left">
                <div className="text-2xl md:text-3xl font-bold text-primary">
                  {isLoading ? "..." : `${stats?.events_count || 1000}+`}
                </div>
                <div className="text-sm text-gray-300">Events Captured</div>
              </div>
              <div className="text-left">
                <div className="text-2xl md:text-3xl font-bold text-primary">
                  {isLoading ? "..." : `${stats?.average_rating || 4.9}★`}
                </div>
                <div className="text-sm text-gray-300">Average Rating</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <AuthModal defaultTab="register">
                <Button size="lg" className="btn-hero text-lg px-8 py-4 bg-primary hover:bg-primary/90 text-white">
                  Hire a Photographer
                </Button>
              </AuthModal>
              <AuthModal defaultTab="register">
                <Button size="lg" variant="outline" className="btn-outline-hero border-white text-white bg-white/20 backdrop-blur-md hover:bg-white hover:text-gray-900 transition-all duration-200">
                  Join as Photographer
                </Button>
              </AuthModal>
            </div>
          </div>

          {/* Right Column - Quick Start */}
          <div className="lg:justify-self-end w-full max-w-md">
            <div className="card-elevated bg-white/95 backdrop-blur-sm p-6 space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Get Started</h3>
                <p className="text-gray-600">Tell us about your event and find the perfect match</p>
              </div>

              <Button 
                className="w-full btn-hero text-lg py-6" 
                onClick={() => setShowOnboarding(true)}
              >
                <Search className="h-5 w-5 mr-2" />
                Start Planning Your Event
              </Button>

              <div className="text-center text-sm text-gray-500">
                Over {stats?.photographers_count || 500} verified photographers available
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Onboarding Popup */}
      <OnboardingPopup
        isOpen={showOnboarding}
        onComplete={handleOnboardingComplete}
        onClose={() => setShowOnboarding(false)}
      />

      {/* Decorative Elements */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};