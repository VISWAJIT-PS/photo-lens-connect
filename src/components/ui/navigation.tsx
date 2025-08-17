import { useState } from "react";
import { Button } from "./button";
import { Camera, Menu, X, User, LogOut } from "lucide-react";
import { AuthModal } from "./auth-modal";
import { useAuthStore } from "@/stores/auth-store";
import ProfileDialog from "./profile-dialog";

export const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuthStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <Camera className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">PhotoLens</span>
          </div>

          {!user && (
            /* Desktop Navigation */
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="btn-ghost">Find Photographers</a>
              <a href="#" className="btn-ghost">Rentals</a>
              <a href="#" className="btn-ghost">Locations</a>
              <a href="#" className="btn-ghost">Gallery</a>
            </div>
          )}

          {/* Auth / Profile Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {!user ? (
              <>
                <AuthModal>
                  <Button variant="ghost" className="btn-ghost">Sign In</Button>
                </AuthModal>
                <AuthModal defaultTab="register">
                  <Button className="btn-hero">Get Started</Button>
                </AuthModal>
              </>
            ) : (
              <>
                <ProfileDialog trigger={
                  <Button variant="ghost">
                    <User className="h-5 w-5 mr-2" />
                    Profile
                  </Button>
                } />
                <a
                  href={
                    user?.user_metadata.userType === "photographer"
                      ? "/photographer-dashboard"
                      : "/customer-dashboard"
                  }
                >
                  <Button variant="ghost">Dashboard</Button>
                </a>
                <Button variant="ghost" onClick={signOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              <a href="#" className="btn-ghost text-left">Find Photographers</a>
              <a href="#" className="btn-ghost text-left">Rentals</a>
              <a href="#" className="btn-ghost text-left">Locations</a>
              <a href="#" className="btn-ghost text-left">Gallery</a>

              {user ? (
                <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                  <ProfileDialog trigger={
                    <Button variant="ghost" className="justify-start">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Button>
                  } />
                  <a
                    href={
                      user?.user_metadata.userType === "photographer"
                        ? "/photographer-dashboard"
                        : "/customer-dashboard"
                    }
                  >
                    <Button className="justify-start">Dashboard</Button>
                  </a>
                  <Button variant="ghost" className="justify-start" onClick={signOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                  <AuthModal>
                    <Button variant="ghost" className="justify-start">Sign In</Button>
                  </AuthModal>
                  <AuthModal defaultTab="register">
                    <Button className="justify-start">Get Started</Button>
                  </AuthModal>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};