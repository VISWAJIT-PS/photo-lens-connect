import { useState } from "react";
import { Button } from "./button";
import { Camera, Menu, X, User, LogOut } from "lucide-react";
import { AuthModal } from "./auth-modal";
import { useAuthStore } from "@/stores/auth-store";
import { motion, AnimatePresence } from "framer-motion";
import { SlideIn, FadeIn, Interactive, StaggerContainer, StaggerItem } from "./motion-wrappers";
import { transitions } from "@/lib/motion";

export const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuthStore();

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <FadeIn>
            <div className="flex items-center space-x-2">
              <motion.div 
                className="p-2 bg-gradient-primary rounded-lg"
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                transition={transitions.fast}
              >
                <Camera className="h-6 w-6 text-primary-foreground" />
              </motion.div>
              <span className="text-xl font-bold text-foreground">PhotoLens</span>
            </div>
          </FadeIn>

          {!user && (
            /* Desktop Navigation */
            <StaggerContainer 
              className="hidden md:flex items-center space-x-8"
              staggerChildren={0.1}
              delayChildren={0.3}
            >
              <StaggerItem>
                <Interactive>
                  <a href="#" className="btn-ghost">Find Photographers</a>
                </Interactive>
              </StaggerItem>
              <StaggerItem>
                <Interactive>
                  <a href="#" className="btn-ghost">Rentals</a>
                </Interactive>
              </StaggerItem>
              <StaggerItem>
                <Interactive>
                  <a href="#" className="btn-ghost">Locations</a>
                </Interactive>
              </StaggerItem>
              <StaggerItem>
                <Interactive>
                  <a href="#" className="btn-ghost">Gallery</a>
                </Interactive>
              </StaggerItem>
            </StaggerContainer>
          )}

          {/* Auth / Profile Buttons */}
          <StaggerContainer 
            className="hidden md:flex items-center space-x-4"
            staggerChildren={0.1}
            delayChildren={0.5}
          >
            {!user ? (
              <>
                <StaggerItem>
                  <AuthModal>
                    <Interactive>
                      <Button variant="ghost" className="btn-ghost">Sign In</Button>
                    </Interactive>
                  </AuthModal>
                </StaggerItem>
                <StaggerItem>
                  <AuthModal defaultTab="register">
                    <Interactive>
                      <Button className="btn-hero">Get Started</Button>
                    </Interactive>
                  </AuthModal>
                </StaggerItem>
              </>
            ) : (
              <>
                <StaggerItem>
                  <a href="/account">
                    <Interactive>
                      <Button variant="ghost">
                        <User className="h-5 w-5 mr-2" />
                        Profile
                      </Button>
                    </Interactive>
                  </a>
                </StaggerItem>
                {typeof window !== "undefined" &&
                  (user?.user_metadata.user_type === "photographer"
                    ? window.location.pathname !== "/photographer-dashboard" && (
                        <StaggerItem>
                          <a href="/photographer-dashboard">
                            <Interactive>
                              <Button variant="ghost">Dashboard</Button>
                            </Interactive>
                          </a>
                        </StaggerItem>
                      )
                    : window.location.pathname !== "/user-dashboard" && (
                        <StaggerItem>
                          <a href="/user-dashboard">
                            <Interactive>
                              <Button variant="ghost">Dashboard</Button>
                            </Interactive>
                          </a>
                        </StaggerItem>
                      ))}
                <StaggerItem>
                  <Interactive>
                    <Button variant="ghost" onClick={signOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </Interactive>
                </StaggerItem>
              </>
            )}
          </StaggerContainer>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Interactive
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                  transition={transitions.fast}
                >
                  {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </motion.div>
              </Button>
            </Interactive>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              className="md:hidden py-4 border-t border-border"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={transitions.default}
            >
              <StaggerContainer 
                className="flex flex-col space-y-4"
                staggerChildren={0.1}
                delayChildren={0.1}
              >
                <StaggerItem>
                  <Interactive>
                    <a href="#" className="btn-ghost text-left">Find Photographers</a>
                  </Interactive>
                </StaggerItem>
                <StaggerItem>
                  <Interactive>
                    <a href="#" className="btn-ghost text-left">Rentals</a>
                  </Interactive>
                </StaggerItem>
                <StaggerItem>
                  <Interactive>
                    <a href="#" className="btn-ghost text-left">Locations</a>
                  </Interactive>
                </StaggerItem>
                <StaggerItem>
                  <Interactive>
                    <a href="#" className="btn-ghost text-left">Gallery</a>
                  </Interactive>
                </StaggerItem>

                {user ? (
                  <StaggerItem>
                    <motion.div 
                      className="flex flex-col space-y-2 pt-4 border-t border-border"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <a href="/account">
                        <Interactive>
                          <Button variant="ghost" className="justify-start">
                            <User className="h-4 w-4 mr-2" />
                            Profile
                          </Button>
                        </Interactive>
                      </a>
                      {typeof window !== "undefined" &&
                        (user?.user_metadata.user_type === "photographer"
                          ? window.location.pathname !== "/photographer-dashboard" && (
                              <a href="/photographer-dashboard">
                                <Interactive>
                                  <Button className="justify-start">Dashboard</Button>
                                </Interactive>
                              </a>
                            )
                          : window.location.pathname !== "/user-dashboard" && (
                              <a href="/user-dashboard">
                                <Interactive>
                                  <Button className="justify-start">Dashboard</Button>
                                </Interactive>
                              </a>
                            ))}
                      <Interactive>
                        <Button variant="ghost" className="justify-start" onClick={signOut}>
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </Button>
                      </Interactive>
                    </motion.div>
                  </StaggerItem>
                ) : (
                  <StaggerItem>
                    <motion.div 
                      className="flex flex-col space-y-2 pt-4 border-t border-border"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <AuthModal>
                        <Interactive>
                          <Button variant="ghost" className="justify-start">Sign In</Button>
                        </Interactive>
                      </AuthModal>
                      <AuthModal defaultTab="register">
                        <Interactive>
                          <Button className="justify-start">Get Started</Button>
                        </Interactive>
                      </AuthModal>
                    </motion.div>
                  </StaggerItem>
                )}
              </StaggerContainer>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};