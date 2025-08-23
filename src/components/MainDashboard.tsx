import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, Package, Images, MessageCircle, Bell, Heart, Settings, User, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { OnboardingPopup } from './OnboardingPopup';
import { WorksTab } from './dashboard/WorksTab';
import { RentalsTab } from './dashboard/RentalsTab';
import { GalleryTab } from './dashboard/GalleryTab';
import ChatApp from './dashboard/ChatTab';
import { NotificationsPanel } from './dashboard/NotificationsPanel';
import { FavoritesPanel } from './dashboard/FavoritesPanel';
import  EcommerceUserSettings  from './SettingsPage';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeIn, SlideIn, StaggerContainer, StaggerItem, Interactive, ConditionalAnimate } from '@/components/ui/motion-wrappers';
import { transitions, pageVariants } from '@/lib/motion';

interface OnboardingData {
  eventDate: Date | undefined;
  location: string;
  serviceTypes: string[];
}

interface MainDashboardProps {
  defaultTab?: string;
  conversationId?: string;
}

export const MainDashboard: React.FC<MainDashboardProps> = ({ defaultTab = 'Book Your Event', conversationId }) => {
  const { user, signOut } = useAuthStore();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  // If onboardingData includes 'photographers', set a filter for WorksTab
  const [worksFilter, setWorksFilter] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Check if user needs onboarding
  useEffect(() => {
    try {
      const hasCompletedOnboarding = localStorage.getItem('onboarding_completed');
      const hasPending = localStorage.getItem('pendingOnboardingData');
      // If there's pending onboarding data (user clicked Get Started), don't show the onboarding popup here
      if (!hasCompletedOnboarding && user && !hasPending) {
        setShowOnboarding(true);
      } else {
        setShowOnboarding(false);
      }
    } catch (e) {
      // ignore storage errors
      if (!localStorage.getItem('onboarding_completed') && user) setShowOnboarding(true);
    }
  }, [user]);

  // Listen for requests to open onboarding popup from child components (WorksTab FAB)
  useEffect(() => {
    const handler = () => setShowOnboarding(true);
    const closeOnAuth = () => setShowOnboarding(false);
    window.addEventListener('open-onboarding', handler as EventListener);
    // If onboarding is completed via Get Started and the OnboardingPopup stored pending data and opened auth modal,
    // listen for that event and ensure the onboarding popup is closed here.
    window.addEventListener('open-auth-modal', closeOnAuth as EventListener);
    return () => {
      window.removeEventListener('open-onboarding', handler as EventListener);
      window.removeEventListener('open-auth-modal', closeOnAuth as EventListener);
    };
  }, []);

  // Initialize onboardingData from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('onboarding_data');
      if (raw) {
        const parsed = JSON.parse(raw);
        // convert eventDate string back to Date if present
        if (parsed.eventDate && typeof parsed.eventDate === 'string') {
          parsed.eventDate = new Date(parsed.eventDate);
        }
        setOnboardingData(parsed);
      }
    } catch (e) {
      // ignore parse errors
    }
  }, []);

  // Persist onboardingData to localStorage whenever it changes
  useEffect(() => {
    try {
      if (onboardingData) {
        const toStore: { eventDate?: string | null; location?: string; serviceTypes?: string[] } = {};
        if (onboardingData.eventDate instanceof Date) toStore.eventDate = onboardingData.eventDate.toISOString();
        else if (typeof onboardingData.eventDate === 'string') toStore.eventDate = onboardingData.eventDate;
        else toStore.eventDate = undefined;
        toStore.location = onboardingData.location;
        toStore.serviceTypes = onboardingData.serviceTypes;
        localStorage.setItem('onboarding_data', JSON.stringify(toStore));
        localStorage.setItem('onboarding_completed', 'true');
      } else {
        localStorage.removeItem('onboarding_data');
        localStorage.removeItem('onboarding_completed');
      }
    } catch (e) {
      // ignore
    }
  }, [onboardingData]);

  // Listen for storage events (updates from other tabs/windows)
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'onboarding_data') {
        try {
          if (e.newValue) {
            const parsed = JSON.parse(e.newValue);
            if (parsed.eventDate && typeof parsed.eventDate === 'string') parsed.eventDate = new Date(parsed.eventDate);
            setOnboardingData(parsed);
          } else {
            setOnboardingData(null);
          }
        } catch (err) {
          // ignore
        }
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleOnboardingComplete = (data: OnboardingData) => {
    setOnboardingData(data);
    setShowOnboarding(false);
    localStorage.setItem('onboarding_completed', 'true');
    localStorage.setItem('onboarding_data', JSON.stringify(data));
    // If only one service type is selected, set the corresponding tab in WorksTab
    if (data.serviceTypes.length === 1) {
      switch (data.serviceTypes[0]) {
        case 'photographers':
          setWorksFilter('photographer');
          setActiveTab('Book Your Event');
          break;
        case 'videographers':
          setWorksFilter('videographer');
          setActiveTab('Book Your Event');
          break;
        case 'events':
          setWorksFilter('event_team');
          setActiveTab('Book Your Event');
          break;
        case 'rentals':
          setActiveTab('rentals');
          setWorksFilter(null);
          break;
        default:
          setWorksFilter(null);
      }
    } else {
      setWorksFilter(null);
      setActiveTab('Book Your Event');
    }
  };

  const tabs = [
    { id: 'Book Your Event', label: 'Book Your Event', icon: Camera, description: 'Find photographers & videographers' },
    { id: 'rentals', label: 'Rentals', icon: Package, description: 'Rent equipment & Find Your Photo Spot' },
    { id: 'gallery', label: 'Gallery', icon: Images, description: 'View your event albums' },
    { id: 'chat', label: 'Chat', icon: MessageCircle, description: 'Message your service providers' },
  ];

  const handleSignOut = async () => {
    await signOut();
    localStorage.removeItem('onboarding_completed');
    localStorage.removeItem('onboarding_data');
  };

  return (
    <motion.div 
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={transitions.default}
    >
      {/* Onboarding Popup */}
      <OnboardingPopup
        isOpen={showOnboarding}
        onComplete={handleOnboardingComplete}
        onClose={() => setShowOnboarding(false)}
      />

      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen">
        {/* Sidebar */}
        <motion.div 
          className={cn(sidebarCollapsed ? 'w-20' : 'w-64', 'bg-card border-r border-border flex flex-col')}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ ...transitions.default, delay: 0.1 }}
        >
          {/* Logo & User */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className={cn("flex items-center space-x-3 relative", sidebarCollapsed ? 'group' : '')}>
              <div className="bg-gradient-primary p-2 rounded-lg relative z-20 transition-opacity duration-150 group-hover:opacity-0 group-hover:pointer-events-none">
                <Camera className="h-6 w-6 text-primary-foreground  " />

              </div>
                {/* When collapsed, render the toggle behind the camera icon and show on hover */}
                {sidebarCollapsed && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute -left-2 z-10 opacity-0 bg-[#e8f9f8] border-[#29d9cb] group-hover:opacity-100 transition-opacity"
                    onClick={() => setSidebarCollapsed(false)}
                    aria-label="Expand sidebar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 -960 960 960" className="shrink-0 h-7 w-7" fill="#29d9cb"><path d="M180-120q-24.75 0-42.37-17.63Q120-155.25 120-180v-600q0-24.75 17.63-42.38Q155.25-840 180-840h600q24.75 0 42.38 17.62Q840-804.75 840-780v600q0 24.75-17.62 42.37Q804.75-120 780-120zm207-60h393v-600H387z"></path></svg>
                  </Button>
                )}
              {!sidebarCollapsed && <h1 className="text-xl font-bold">PhotoLens</h1>}
            </div>

            {/* Only show the right-side collapse button when sidebar is expanded */}
            {!sidebarCollapsed && (
              <Button variant="ghost" size="sm" onClick={() => setSidebarCollapsed(s => !s)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 -960 960 960" className="shrink-0 h-7 w-7" fill="#29d9cb"><path d="M180-120q-24.75 0-42.37-17.63Q120-155.25 120-180v-600q0-24.75 17.63-42.38Q155.25-840 180-840h600q24.75 0 42.38 17.62Q840-804.75 840-780v600q0 24.75-17.62 42.37Q804.75-120 780-120zm207-60h393v-600H387z"></path></svg>
              </Button>
            )}
          </div>

          {/* Navigation */}
          <StaggerContainer 
            className="flex-1 p-2 space-y-2"
            staggerChildren={0.1}
            delayChildren={0.3}
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <StaggerItem key={tab.id}>
                  <Interactive
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "w-full flex items-center px-3 py-3 rounded-lg text-left transition-colors",
                        activeTab === tab.id
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "hover:bg-muted"
                      )}
                    >
                      <motion.div
                        animate={{ rotate: activeTab === tab.id ? 360 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                      </motion.div>
                      <AnimatePresence>
                        {!sidebarCollapsed && (
                          <motion.div 
                            className="min-w-0 ml-3"
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={transitions.fast}
                          >
                            <p className="font-medium">{tab.label}</p>
                            <p className="text-xs text-muted-foreground">{tab.description}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </button>
                  </Interactive>
                </StaggerItem>
              );
            })}
          </StaggerContainer>

          {/* Bottom Actions */}
          <div className="p-3 border-t border-border space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => setShowNotifications(true)}
            >
              <Bell className="h-4 w-4" />
              {!sidebarCollapsed && <><span className="ml-3">Notifications</span><Badge variant="secondary" className="ml-auto">3</Badge></>}
            </Button>
            
            <Button variant="ghost" className="w-full justify-start" onClick={() => setShowFavorites(true)}>
              <Heart className="h-4 w-4" />
              {!sidebarCollapsed && <span className="ml-3">Favorites</span>}
            </Button>
            
            <Button variant="ghost" className="w-full justify-start" onClick={() => setActiveTab('settings')}>
              <Settings className="h-4 w-4" />
              {!sidebarCollapsed && <span className="ml-3">Settings</span>}
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
              {!sidebarCollapsed && <span className="ml-3">Sign Out</span>}
            </Button>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div 
          className="flex-1 flex flex-col"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...transitions.default, delay: 0.2 }}
        >
          <motion.header 
            className="h-14 border-b border-border bg-card px-6 flex items-center justify-between"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ...transitions.default, delay: 0.3 }}
          >
            <div>
              <motion.h2 
                className="text-2xl font-bold capitalize w-[200px] truncate"
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={transitions.fast}
              >
                {activeTab}
              </motion.h2>
            </div>

            <FadeIn className="flex items-center justify-end w-full gap-4">
              <div className="flex items-center space-x-3">
                <motion.div 
                  className="w-10 h-10 rounded-full overflow-hidden bg-muted flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  transition={transitions.fast}
                >
                  {user?.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt={user?.email}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                      <User className="h-5 w-5" />
                    </div>
                  )}
                </motion.div>

                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{user?.email}</p>
                  <p className="text-xs text-muted-foreground">Customer</p>
                </div>
              </div>
            </FadeIn>
          </motion.header>

          <main className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={transitions.default}
              >
                {activeTab === 'Book Your Event' && <WorksTab onboardingData={onboardingData} filter={worksFilter} />}
                {activeTab === 'rentals' && <RentalsTab onboardingData={onboardingData} />}
                {activeTab === 'gallery' && <GalleryTab />}
                {activeTab === 'chat' && <ChatApp />}
                {activeTab === 'settings' && <EcommerceUserSettings />}
              </motion.div>
            </AnimatePresence>
          </main>
        </motion.div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Mobile Header */}
        <header className="bg-card  border-b border-border px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-primary p-2 rounded-lg">
                <Camera className="h-5 w-5 text-primary-foreground" />
              </div>
              <h1 className="text-lg font-bold">PhotoLens</h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNotifications(true)}
              >
                <Bell className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <User className="h-4 w-4" />
              </Button>

              {/* Mobile floating action button (small) */}
              <Button
                variant="default"
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 ml-2 rounded-full h-9 w-9 p-0 flex items-center justify-center"
                onClick={() => setShowOnboarding(true)}
                aria-label="Edit Preferences"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Mobile User Menu */}
          {showMobileMenu && (
            <div className="mt-3 pt-3 border-t border-border">
              <div className="flex items-center space-x-3 mb-3">
                <div className="bg-muted p-2 rounded-full">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">{user?.email}</p>
                  <p className="text-xs text-muted-foreground">Customer</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => setActiveTab('settings')}>
                  <Settings className="h-3 w-3 mr-1" />
                  Settings
                </Button>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-3 w-3 mr-1" />
                  Sign Out
                </Button>
              </div>
            </div>
          )}
        </header>

        {/* Mobile Content */}
        <main className="pb-20 overflow-y-auto">
          {activeTab === 'Book Your Event' && <WorksTab onboardingData={onboardingData} />}
          {activeTab === 'rentals' && <RentalsTab onboardingData={onboardingData} />}
          {activeTab === 'gallery' && <GalleryTab />}
          {activeTab === 'chat' && (
            <ChatApp 
            />
          )}
          {activeTab === 'settings' && <EcommerceUserSettings />}
        </main>

        {/* Mobile Bottom Navigation */}
        <motion.div 
          className="fixed bottom-0 left-0 right-0 bg-card border-t border-border"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ...transitions.default, delay: 0.4 }}
        >
          <StaggerContainer 
            className="grid grid-cols-4 gap-1 p-2"
            staggerChildren={0.1}
            delayChildren={0.5}
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <StaggerItem key={tab.id}>
                  <Interactive
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "flex flex-col items-center py-2 px-1 rounded-lg transition-colors",
                        activeTab === tab.id
                          ? "text-primary bg-primary/10"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <motion.div
                        animate={{ 
                          scale: activeTab === tab.id ? 1.1 : 1,
                          rotate: activeTab === tab.id ? 360 : 0 
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <Icon className="h-5 w-5 mb-1" />
                      </motion.div>
                      <span className="text-xs font-medium">{tab.label}</span>
                    </button>
                  </Interactive>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </motion.div>
      </div>

      {/* Notifications Panel */}
      <NotificationsPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
      <FavoritesPanel
        isOpen={showFavorites}
        onClose={() => setShowFavorites(false)}
      />
    </motion.div>
  );
};