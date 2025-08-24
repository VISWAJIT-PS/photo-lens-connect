import React, { useState } from 'react';
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PhotographerBookings } from "@/components/photographer/PhotographerBookings";
import { PhotographerChatWindow } from "@/components/photographer/PhotographerChatWindow";
import { PhotographerPortfolio } from "@/components/photographer/PhotographerPortfolio";
import { PhotographerEquipmentRentals } from "@/components/photographer/PhotographerEquipmentRentals";
import { PhotographerEarnings } from "@/components/photographer/PhotographerEarnings";
import { PhotographerNotes } from "@/components/photographer/PhotographerNotes";
import { PhotographerPhotoSpots } from "@/components/photographer/PhotographerPhotoSpots";
import { PhotographerNotifications, NotificationTrigger } from "@/components/photographer/PhotographerNotifications";
import { PhotographerSettings } from "@/components/photographer/PhotographerSettings";
import { 
  Camera, 
  Settings, 
  LogOut, 
  Calendar,
  MessageSquare,
  Package,
  DollarSign,
  StickyNote,
  MapPin,
  BellIcon,
  CalendarPlus,
  Bell,
  User,
  AlertCircle,
  ShoppingCart,
  ImageIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

const PhotographerDashboard = () => {
  const { user, signOut } = useAuthStore();
  const [activeSection, setActiveSection] = useState('bookings');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  
  // Mock unread count - in real app, this would come from your notification state
  const unreadCount = 3;

  const tabs = [
    { id: 'bookings', label: 'Bookings', icon: AlertCircle, description: 'Manage your bookings' },
    { id: 'event', label: 'Event', icon: CalendarPlus, description: 'Message with Event Organizer' },
    { id: 'portfolio', label: 'Portfolio', icon: Camera, description: 'Manage your work' },
    { id: 'equipment', label: 'Equipment', icon: Package, description: 'My equipment & rent from others' },
    { id: 'photo-spots', label: 'Photo Spots', icon: MapPin, description: 'My spots & book from others' },
    { id: 'earnings', label: 'Earnings', icon: DollarSign, description: 'Recent work & earnings' },
    { id: 'notes', label: 'Notes', icon: StickyNote, description: 'Notes & reminders' },
  ];

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'bookings':
        return <PhotographerBookings />;
      case 'event':
        return <PhotographerChatWindow />;
      case 'portfolio':
        return <PhotographerPortfolio />;
      case 'equipment':
        return <PhotographerEquipmentRentals />;
      case 'photo-spots':
        return <PhotographerPhotoSpots />;
      case 'earnings':
        return <PhotographerEarnings />;
      case 'notes':
        return <PhotographerNotes />;
      case 'settings':
        return <PhotographerSettings />;
      default:
        return <PhotographerBookings />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen">
        {/* Sidebar */}
        <div className={cn(sidebarCollapsed ? 'w-20' : 'w-64', 'bg-card border-r border-border flex flex-col')}>
          {/* Logo & User */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className={cn("flex items-center space-x-3 relative", sidebarCollapsed ? 'group' : '')}>
              <div className="bg-gradient-primary p-2 rounded-lg relative z-20 transition-opacity duration-150 group-hover:opacity-0 group-hover:pointer-events-none">
                <Camera className="h-6 w-6 text-primary-foreground" />
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
              {!sidebarCollapsed && <h1 className="text-xl font-bold">PhotoLens Pro</h1>}
            </div>

            {/* Only show the right-side collapse button when sidebar is expanded */}
            {!sidebarCollapsed && (
              <Button variant="ghost" size="sm" onClick={() => setSidebarCollapsed(s => !s)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 -960 960 960" className="shrink-0 h-7 w-7" fill="#29d9cb"><path d="M180-120q-24.75 0-42.37-17.63Q120-155.25 120-180v-600q0-24.75 17.63-42.38Q155.25-840 180-840h600q24.75 0 42.38 17.62Q840-804.75 840-780v600q0 24.75-17.62 42.37Q804.75-120 780-120zm207-60h393v-600H387z"></path></svg>
              </Button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-2 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={cn(
                    "w-full flex items-center px-3 py-3 rounded-lg text-left transition-colors",
                    activeSection === tab.id
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "hover:bg-muted"
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!sidebarCollapsed && (
                    <div className="min-w-0 ml-3">
                      <p className="font-medium">{tab.label}</p>
                      <p className="text-xs text-muted-foreground">{tab.description}</p>
                    </div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-3 border-t border-border space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => setIsNotificationOpen(true)}
            >
              <Bell className="h-4 w-4" />
              {!sidebarCollapsed && (
                <>
                  <span className="ml-3">Notifications</span>
                  <Badge variant="secondary" className="ml-auto">{unreadCount}</Badge>
                </>
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={() => setActiveSection('settings')}
            >
              <Settings className="h-4 w-4" />
              {!sidebarCollapsed && <span className="ml-3">Settings</span>}
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive"
              onClick={signOut}
            >
              <LogOut className="h-4 w-4" />
              {!sidebarCollapsed && <span className="ml-3">Sign Out</span>}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <header className="h-14 border-b border-border py-9 bg-card px-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold capitalize w-[200px]">
                {tabs.find(tab => tab.id === activeSection)?.label || 'Dashboard'}
              </h2>
            </div>
            
            <div className="flex items-center justify-end w-full gap-4">
              <div className="flex items-center space-x-4">
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                    {user?.user_metadata.avatar_url ? (
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
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{user?.email}</p>
                    <p className="text-xs text-muted-foreground">Photographer</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto">
            {renderActiveSection()}
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
              <NotificationTrigger 
                unreadCount={unreadCount}
                onOpenPanel={() => setIsNotificationOpen(true)}
              />
              
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
                  <p className="text-xs text-muted-foreground">Photographer</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => setActiveSection('settings')}>
                  <Settings className="h-3 w-3 mr-1" />
                  Settings
                </Button>
                <Button variant="outline" size="sm" onClick={signOut}>
                  <LogOut className="h-3 w-3 mr-1" />
                  Sign Out
                </Button>
              </div>
            </div>
          )}
        </header>

        {/* Mobile Content */}
        <main className="pb-20 overflow-y-auto">
          {renderActiveSection()}
        </main>

        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
          <div className="grid grid-cols-4 gap-1 p-2">
            {tabs.slice(0, 4).map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={cn(
                    "flex flex-col items-center py-2 px-1 rounded-lg transition-colors",
                    activeSection === tab.id
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
      <PhotographerNotifications 
              isOpen={isNotificationOpen}
              onOpenChange={setIsNotificationOpen}
            />
    </div>
  );
};

export default PhotographerDashboard;