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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const PhotographerDashboard = () => {
  const { user, signOut } = useAuthStore();
  const [activeSection, setActiveSection] = useState('bookings');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  
  // Mock unread count - in real app, this would come from your notification state
  const unreadCount = 3;

  // Toast for notifications
  const { toast } = useToast();

  // Team members data for event assignment
  const [teamMembers] = useState([
    {
      id: "member-1",
      name: "Alex Rivera",
      role: "Assistant Photographer",
      email: "alex@photoassist.com",
      phone: "+1 (555) 123-4567",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
      status: "active",
      specialties: ["Portrait Photography", "Event Coverage"],
      availability: "full-time"
    },
    {
      id: "member-2",
      name: "Jessica Chen",
      role: "Video Specialist",
      email: "jessica@videoteam.com",
      phone: "+1 (555) 987-6543",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
      status: "active",
      specialties: ["Wedding Videography", "Drone Operations"],
      availability: "weekends"
    },
    {
      id: "member-3",
      name: "David Park",
      role: "Photo Editor",
      email: "david@editpro.com",
      phone: "+1 (555) 456-7890",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
      status: "freelance",
      specialties: ["Photo Retouching", "Color Grading"],
      availability: "remote"
    }
  ]);

  // Event form data
  const [eventFormData, setEventFormData] = useState({
    eventName: '',
    eventType: '',
    clientName: '',
    clientEmail: '',
    eventDate: '',
    eventTime: '',
    location: '',
    venueName: '',
    venueContact: '',
    venueAddress: '',
    venueNotes: '',
    budget: '',
    packageType: '',
    paymentStatus: '',
    requirements: '',
    deliverables: '',
    specialNotes: '',
    assignedMembers: [] as string[]
  });

  const tabs = [
    { id: 'bookings', label: 'Bookings', icon: AlertCircle, description: 'Manage your bookings' },
    { id: 'event', label: 'Event', icon: CalendarPlus, description: 'Message with Event Organizer' },
    { id: 'portfolio', label: 'Portfolio', icon: Camera, description: 'Manage your work' },
    { id: 'equipment', label: 'Equipment', icon: Package, description: 'My equipment & rent from others' },
    { id: 'photo-spots', label: 'Photo Spots', icon: MapPin, description: 'My spots & book from others' },
    { id: 'earnings', label: 'Earnings', icon: DollarSign, description: 'Recent work & earnings' },
    { id: 'notes', label: 'Notes', icon: StickyNote, description: 'Notes & reminders' },
  ];

  // State for create event dialog
  const [showCreateEventDialog, setShowCreateEventDialog] = useState(false);

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
                {/* Create Event Button */}
                <Button 
                  onClick={() => setShowCreateEventDialog(true)}
                  className="bg-primary hover:bg-primary/90"
                >
                  <CalendarPlus className="h-4 w-4 mr-2" />
                  Create Event
                </Button>
                
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

      {/* Create Event Dialog */}
      <Dialog open={showCreateEventDialog} onOpenChange={setShowCreateEventDialog}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Create New Event
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Basic Event Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Event Name *</Label>
                <Input 
                  placeholder="e.g., Sarah & John Wedding" 
                  value={eventFormData.eventName}
                  onChange={(e) => setEventFormData({...eventFormData, eventName: e.target.value})}
                />
              </div>
              <div>
                <Label>Event Type *</Label>
                <Select 
                  value={eventFormData.eventType}
                  onValueChange={(value) => setEventFormData({...eventFormData, eventType: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wedding">Wedding Photography</SelectItem>
                    <SelectItem value="engagement">Engagement Session</SelectItem>
                    <SelectItem value="portrait">Portrait Session</SelectItem>
                    <SelectItem value="corporate">Corporate Event</SelectItem>
                    <SelectItem value="family">Family Photography</SelectItem>
                    <SelectItem value="birthday">Birthday Party</SelectItem>
                    <SelectItem value="graduation">Graduation</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Client Name *</Label>
                <Input 
                  placeholder="Enter client name" 
                  value={eventFormData.clientName}
                  onChange={(e) => setEventFormData({...eventFormData, clientName: e.target.value})}
                />
              </div>
              <div>
                <Label>Client Email *</Label>
                <Input 
                  type="email" 
                  placeholder="client@example.com" 
                  value={eventFormData.clientEmail}
                  onChange={(e) => setEventFormData({...eventFormData, clientEmail: e.target.value})}
                />
              </div>
              <div>
                <Label>Event Date *</Label>
                <Input 
                  type="date" 
                  value={eventFormData.eventDate}
                  onChange={(e) => setEventFormData({...eventFormData, eventDate: e.target.value})}
                />
              </div>
              <div>
                <Label>Event Time *</Label>
                <Input 
                  type="time" 
                  value={eventFormData.eventTime}
                  onChange={(e) => setEventFormData({...eventFormData, eventTime: e.target.value})}
                />
              </div>
            </div>

            {/* Location & Venue Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Location & Venue</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label>Event Location *</Label>
                  <Input 
                    placeholder="e.g., Central Park Conservatory Garden, NYC" 
                    value={eventFormData.location}
                    onChange={(e) => setEventFormData({...eventFormData, location: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Venue Name</Label>
                  <Input 
                    placeholder="e.g., Conservatory Garden" 
                    value={eventFormData.venueName}
                    onChange={(e) => setEventFormData({...eventFormData, venueName: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Venue Contact</Label>
                  <Input 
                    placeholder="e.g., +1 (212) 310-6600" 
                    value={eventFormData.venueContact}
                    onChange={(e) => setEventFormData({...eventFormData, venueContact: e.target.value})}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Venue Address</Label>
                  <Input 
                    placeholder="Full venue address" 
                    value={eventFormData.venueAddress}
                    onChange={(e) => setEventFormData({...eventFormData, venueAddress: e.target.value})}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Venue Notes</Label>
                  <Textarea 
                    placeholder="Any special notes about the venue (permits, restrictions, etc.)" 
                    rows={2}
                    value={eventFormData.venueNotes}
                    onChange={(e) => setEventFormData({...eventFormData, venueNotes: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Budget & Package */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Budget & Package</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Total Budget *</Label>
                  <Input 
                    type="number" 
                    placeholder="2500" 
                    value={eventFormData.budget}
                    onChange={(e) => setEventFormData({...eventFormData, budget: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Package Type</Label>
                  <Select 
                    value={eventFormData.packageType}
                    onValueChange={(value) => setEventFormData({...eventFormData, packageType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select package" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic Package</SelectItem>
                      <SelectItem value="standard">Standard Package</SelectItem>
                      <SelectItem value="premium">Premium Package</SelectItem>
                      <SelectItem value="custom">Custom Package</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Payment Status</Label>
                  <Select 
                    value={eventFormData.paymentStatus}
                    onValueChange={(value) => setEventFormData({...eventFormData, paymentStatus: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="deposit-paid">Deposit Paid</SelectItem>
                      <SelectItem value="paid">Fully Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Team Member Assignment */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Assign Team Members</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teamMembers.map((member) => (
                  <div key={member.id} className="border rounded-lg p-4 hover:border-primary/50 transition-colors">
                    <div className="flex items-center space-x-3 mb-3">
                      <img 
                        src={member.avatar} 
                        alt={member.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={eventFormData.assignedMembers.includes(member.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setEventFormData({
                              ...eventFormData,
                              assignedMembers: [...eventFormData.assignedMembers, member.id]
                            });
                          } else {
                            setEventFormData({
                              ...eventFormData,
                              assignedMembers: eventFormData.assignedMembers.filter(id => id !== member.id)
                            });
                          }
                        }}
                        className="w-4 h-4 text-primary"
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <p>Specialties: {member.specialties.join(', ')}</p>
                      <p>Availability: {member.availability}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements & Deliverables */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Requirements</Label>
                <Textarea 
                  placeholder="List event requirements (one per line)\ne.g.,\n2 photographers required\nNo flash during ceremony\nBackup equipment needed"
                  rows={4}
                  value={eventFormData.requirements}
                  onChange={(e) => setEventFormData({...eventFormData, requirements: e.target.value})}
                />
              </div>
              <div>
                <Label>Deliverables</Label>
                <Textarea 
                  placeholder="List deliverables (one per line)\ne.g.,\n500+ edited photos\nOnline gallery\nUSB with full resolution\nWedding album"
                  rows={4}
                  value={eventFormData.deliverables}
                  onChange={(e) => setEventFormData({...eventFormData, deliverables: e.target.value})}
                />
              </div>
            </div>

            {/* Special Notes */}
            <div>
              <Label>Special Notes</Label>
              <Textarea 
                placeholder="Any special instructions, client preferences, or important notes for the event..."
                rows={3}
                value={eventFormData.specialNotes}
                onChange={(e) => setEventFormData({...eventFormData, specialNotes: e.target.value})}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={() => {
                setShowCreateEventDialog(false);
                // Reset form
                setEventFormData({
                  eventName: '',
                  eventType: '',
                  clientName: '',
                  clientEmail: '',
                  eventDate: '',
                  eventTime: '',
                  location: '',
                  venueName: '',
                  venueContact: '',
                  venueAddress: '',
                  venueNotes: '',
                  budget: '',
                  packageType: '',
                  paymentStatus: '',
                  requirements: '',
                  deliverables: '',
                  specialNotes: '',
                  assignedMembers: []
                });
              }}>
                Cancel
              </Button>
              <Button onClick={() => {
                // Validate required fields
                const requiredFields = ['eventName', 'eventType', 'clientName', 'clientEmail', 'eventDate', 'eventTime', 'location', 'budget'];
                const missingFields = requiredFields.filter(field => !eventFormData[field as keyof typeof eventFormData]);
                
                if (missingFields.length > 0) {
                  toast({
                    title: "Missing Required Fields",
                    description: "Please fill in all required fields marked with *",
                    variant: "destructive"
                  });
                  return;
                }

                // Create the event and auto-add chat if client exists
                const handleEventCreation = () => {
                  // Check if client email exists in system (mock check)
                  const existingClients = [
                    'sarah.johnson@email.com',
                    'michael.chen@email.com',
                    'emma.rodriguez@email.com'
                  ];
                  
                  const clientExists = existingClients.includes(eventFormData.clientEmail.toLowerCase());
                  
                  // Create event first
                  toast({
                    title: "Event Created Successfully!",
                    description: `${eventFormData.eventName} has been created and saved to your project list.`,
                  });

                  // Auto-add chat if client exists
                  if (clientExists) {
                    toast({
                      title: "Chat Created",
                      description: `A chat conversation has been automatically created with ${eventFormData.clientName}.`,
                    });
                  } else {
                    toast({
                      title: "New Client Detected",
                      description: `${eventFormData.clientName} is a new client. An invitation will be sent to join the platform.`,
                    });
                  }

                  // Notify assigned team members
                  if (eventFormData.assignedMembers.length > 0) {
                    const assignedNames = teamMembers
                      .filter(member => eventFormData.assignedMembers.includes(member.id))
                      .map(member => member.name)
                      .join(', ');
                    
                    toast({
                      title: "Team Members Notified",
                      description: `${assignedNames} have been notified about their assignment to this event.`,
                    });
                  }

                  setShowCreateEventDialog(false);
                  setActiveSection('event'); // Switch to event/chat tab
                  
                  // Reset form
                  setEventFormData({
                    eventName: '',
                    eventType: '',
                    clientName: '',
                    clientEmail: '',
                    eventDate: '',
                    eventTime: '',
                    location: '',
                    venueName: '',
                    venueContact: '',
                    venueAddress: '',
                    venueNotes: '',
                    budget: '',
                    packageType: '',
                    paymentStatus: '',
                    requirements: '',
                    deliverables: '',
                    specialNotes: '',
                    assignedMembers: []
                  });
                };

                handleEventCreation();
              }}>
                Create Event
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PhotographerDashboard;