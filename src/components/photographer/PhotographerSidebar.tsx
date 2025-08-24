import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Calendar,
  MessageSquare,
  Camera,
  Package,
  DollarSign,
  StickyNote,
  MapPin,
  Bell,
  Settings,
  LogOut
} from "lucide-react";

interface PhotographerSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  user: any;
  onSignOut: () => void;
}

const navigationItems = [
  { id: 'bookings', title: 'Bookings', icon: Calendar },
  { id: 'chat', title: 'Chat Window', icon: MessageSquare },
  { id: 'portfolio', title: 'Create Portfolio', icon: Camera },
  { id: 'equipment', title: 'Equipment Rentals', icon: Package },
  { id: 'earnings', title: 'Recent Work & Earnings', icon: DollarSign },
  { id: 'notes', title: 'Notes & Reminders', icon: StickyNote },
  { id: 'photo-spots', title: 'Photo Spot Rental', icon: MapPin },
  { id: 'notifications', title: 'Notifications', icon: Bell },
  { id: 'settings', title: 'Settings', icon: Settings },
];

export function PhotographerSidebar({ activeSection, onSectionChange, user, onSignOut }: PhotographerSidebarProps) {
  return (
    <Sidebar className="w-60">
      <SidebarTrigger className="m-2 self-end" />
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    isActive={activeSection === item.id}
                    onClick={() => onSectionChange(item.id)}
                    className="cursor-pointer"
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={onSignOut} className="cursor-pointer text-destructive hover:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}