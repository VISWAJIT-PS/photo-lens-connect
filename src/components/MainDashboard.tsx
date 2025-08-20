import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, Package, Images, MessageCircle, Bell, Heart, Settings, User, LogOut } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { OnboardingPopup } from './OnboardingPopup';
import { WorksTab } from './dashboard/WorksTab';
import { RentalsTab } from './dashboard/RentalsTab';
import { GalleryTab } from './dashboard/GalleryTab';
import { ChatTab } from './dashboard/ChatTab';
import { NotificationsPanel } from './dashboard/NotificationsPanel';
import { cn } from '@/lib/utils';

interface OnboardingData {
  eventDate: Date | undefined;
  location: string;
  serviceTypes: string[];
}

export const MainDashboard: React.FC = () => {
  const { user, signOut } = useAuthStore();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  const [activeTab, setActiveTab] = useState('Event Crew');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Check if user needs onboarding
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('onboarding_completed');
    if (!hasCompletedOnboarding && user) {
      setShowOnboarding(true);
    }
  }, [user]);

  const handleOnboardingComplete = (data: OnboardingData) => {
    setOnboardingData(data);
    setShowOnboarding(false);
    localStorage.setItem('onboarding_completed', 'true');
    localStorage.setItem('onboarding_data', JSON.stringify(data));
  };

  const tabs = [
    { id: 'Event Crew', label: 'Event Crew', icon: Camera, description: 'Find photographers & videographers' },
    { id: 'rentals', label: 'Rentals', icon: Package, description: 'Rent equipment & gear' },
    { id: 'gallery', label: 'Gallery', icon: Images, description: 'View your event albums' },
    { id: 'chat', label: 'Chat', icon: MessageCircle, description: 'Message your service providers' },
  ];

  const handleSignOut = async () => {
    await signOut();
    localStorage.removeItem('onboarding_completed');
    localStorage.removeItem('onboarding_data');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Onboarding Popup */}
      <OnboardingPopup
        isOpen={showOnboarding}
        onComplete={handleOnboardingComplete}
      />

      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-card border-r border-border flex flex-col">
          {/* Logo & User */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-primary p-2 rounded-lg">
                <Camera className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold">PhotoLens</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-muted p-2 rounded-full">
                <User className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{user?.email}</p>
                <p className="text-xs text-muted-foreground">Customer</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors",
                    activeTab === tab.id
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "hover:bg-muted"
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium">{tab.label}</p>
                    <p className="text-xs text-muted-foreground">{tab.description}</p>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-border space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => setShowNotifications(true)}
            >
              <Bell className="h-4 w-4 mr-3" />
              Notifications
              <Badge variant="secondary" className="ml-auto">3</Badge>
            </Button>
            
            <Button variant="ghost" className="w-full justify-start">
              <Heart className="h-4 w-4 mr-3" />
              Favorites
            </Button>
            
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="h-4 w-4 mr-3" />
              Settings
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold capitalize">{activeTab}</h2>
              {onboardingData && (
                <p className="text-sm text-muted-foreground">
                  {onboardingData.location} • {onboardingData.eventDate ? 
                    onboardingData.eventDate.toLocaleDateString() : 'Date TBD'}
                </p>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {onboardingData?.serviceTypes.map((type) => (
                <Badge key={type} variant="secondary" className="capitalize">
                  {type.replace(/s$/, '')}
                </Badge>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowOnboarding(true)}
              >
                Edit Preferences
              </Button>
            </div>
          </header>

          <main className="flex-1 overflow-auto">
            {activeTab === 'Event Crew' && <WorksTab onboardingData={onboardingData} />}
            {activeTab === 'rentals' && <RentalsTab onboardingData={onboardingData} />}
            {activeTab === 'gallery' && <GalleryTab />}
            {activeTab === 'chat' && <ChatTab />}
          </main>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Mobile Header */}
        <header className="bg-card border-b border-border px-4 py-3">
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
                <Button variant="outline" size="sm">
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
        <main className="pb-20">
          {activeTab === 'Event Crew' && <WorksTab onboardingData={onboardingData} />}
          {activeTab === 'rentals' && <RentalsTab onboardingData={onboardingData} />}
          {activeTab === 'gallery' && <GalleryTab />}
          {activeTab === 'chat' && <ChatTab />}
        </main>

        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
          <div className="grid grid-cols-4 gap-1 p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex flex-col items-center py-2 px-1 rounded-lg transition-colors",
                    activeTab === tab.id
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5 mb-1" />
                  <span className="text-xs font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Notifications Panel */}
      <NotificationsPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </div>
  );
};