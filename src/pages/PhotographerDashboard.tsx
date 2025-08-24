import React, { useState } from 'react';
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import { PhotographerSidebar } from "@/components/photographer/PhotographerSidebar";
import { PhotographerBookings } from "@/components/photographer/PhotographerBookings";
import { PhotographerChatWindow } from "@/components/photographer/PhotographerChatWindow";
import { PhotographerPortfolio } from "@/components/photographer/PhotographerPortfolio";
import { PhotographerEquipmentRentals } from "@/components/photographer/PhotographerEquipmentRentals";
import { PhotographerEarnings } from "@/components/photographer/PhotographerEarnings";
import { PhotographerNotes } from "@/components/photographer/PhotographerNotes";
import { PhotographerPhotoSpots } from "@/components/photographer/PhotographerPhotoSpots";
import { PhotographerNotifications } from "@/components/photographer/PhotographerNotifications";
import { PhotographerSettings } from "@/components/photographer/PhotographerSettings";
import { Camera, Settings, LogOut } from "lucide-react";
import { FullName } from "@/lib/utils";

const PhotographerDashboard = () => {
  const { user, signOut } = useAuthStore();
  const [activeSection, setActiveSection] = useState('bookings');

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'bookings':
        return <PhotographerBookings />;
      case 'chat':
        return <PhotographerChatWindow />;
      case 'portfolio':
        return <PhotographerPortfolio />;
      case 'equipment':
        return <PhotographerEquipmentRentals />;
      case 'earnings':
        return <PhotographerEarnings />;
      case 'notes':
        return <PhotographerNotes />;
      case 'photo-spots':
        return <PhotographerPhotoSpots />;
      case 'notifications':
        return <PhotographerNotifications />;
      case 'settings':
        return <PhotographerSettings />;
      default:
        return <PhotographerBookings />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-background">
        <PhotographerSidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection}
          user={user}
          onSignOut={signOut}
        />
        
        <main className="flex-1 overflow-hidden">
          {/* Top Header */}
          <header className="h-16 flex items-center justify-between border-b border-border bg-background/80 backdrop-blur-lg px-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Camera className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">PhotoLens Pro</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Welcome, {FullName(user)}</span>
              <Button variant="ghost" size="sm" onClick={() => setActiveSection('settings')}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <div className="h-[calc(100vh-4rem)] overflow-auto">
            {renderActiveSection()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default PhotographerDashboard;