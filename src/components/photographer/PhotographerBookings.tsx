import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarIcon, Clock, MapPin, User, Check, X, MessageSquare, Plus, Edit, Trash2, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Mock data
const upcomingBookings = [
  {
    id: 1,
    client: "John & Sarah Williams",
    type: "Wedding Photography",
    date: "2024-02-15",
    time: "2:00 PM",
    location: "Central Park, NYC",
    status: "confirmed",
    clientEmail: "john.sarah@email.com",
    phone: "+1 (555) 123-4567",
    package: "Premium Wedding Package",
    price: "$2,500"
  },
  {
    id: 2,
    client: "Tech Corp Inc.",
    type: "Corporate Event",
    date: "2024-02-18",
    time: "10:00 AM",
    location: "Manhattan Office Building",
    status: "confirmed",
    clientEmail: "events@techcorp.com",
    phone: "+1 (555) 987-6543",
    package: "Corporate Photography",
    price: "$800"
  }
];

const bookingRequests = [
  {
    id: 3,
    client: "Emma Thompson",
    type: "Portrait Session",
    requestedDate: "2024-02-20",
    requestedTime: "3:00 PM",
    location: "Studio Downtown",
    status: "pending",
    clientEmail: "emma.thompson@email.com",
    phone: "+1 (555) 456-7890",
    package: "Portrait Package",
    price: "$300",
    message: "Hi! I'd love to book a portrait session for my professional headshots. I'm flexible with timing."
  },
  {
    id: 4,
    client: "Mike & Lisa Johnson",
    type: "Engagement Photos",
    requestedDate: "2024-02-22",
    requestedTime: "5:00 PM",
    location: "Brooklyn Bridge",
    status: "pending",
    clientEmail: "mike.lisa.j@email.com",
    phone: "+1 (555) 321-0987",
    package: "Engagement Package",
    price: "$450",
    message: "We're getting married in June and would love engagement photos at sunset!"
  }
];

// Mock availability data
const mockAvailabilitySlots = [
  {
    id: 1,
    dayOfWeek: 'monday',
    timeSlots: [
      { startTime: '09:00', endTime: '12:00', type: 'Portrait Sessions' },
      { startTime: '14:00', endTime: '17:00', type: 'Event Photography' }
    ],
    isActive: true
  },
  {
    id: 2,
    dayOfWeek: 'tuesday',
    timeSlots: [
      { startTime: '10:00', endTime: '16:00', type: 'Wedding Photography' }
    ],
    isActive: true
  },
  {
    id: 3,
    dayOfWeek: 'friday',
    timeSlots: [
      { startTime: '09:00', endTime: '18:00', type: 'All Types' }
    ],
    isActive: true
  },
  {
    id: 4,
    dayOfWeek: 'saturday',
    timeSlots: [
      { startTime: '08:00', endTime: '20:00', type: 'Weddings & Events' }
    ],
    isActive: true
  }
];

const mockBlockedDates = [
  {
    id: 1,
    date: '2024-02-25',
    reason: 'Personal vacation',
    type: 'blocked'
  },
  {
    id: 2,
    date: '2024-03-01',
    reason: 'Equipment maintenance',
    type: 'blocked'
  }
];

export function PhotographerBookings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  
  // Availability management states
  const [availabilitySlots, setAvailabilitySlots] = useState(mockAvailabilitySlots);
  const [blockedDates, setBlockedDates] = useState(mockBlockedDates);
  const [showAddAvailability, setShowAddAvailability] = useState(false);
  const [showBlockDate, setShowBlockDate] = useState(false);
  const [editingSlot, setEditingSlot] = useState<any>(null);
  
  // Form states for availability
  const [availabilityForm, setAvailabilityForm] = useState({
    dayOfWeek: '',
    startTime: '',
    endTime: '',
    type: '',
    isActive: true
  });
  
  // Form states for blocking dates
  const [blockDateForm, setBlockDateForm] = useState({
    date: '',
    reason: '',
    type: 'blocked' as const
  });

  const handleApproveRequest = (requestId: number) => {
    // Logic to approve booking request
    console.log('Approved request:', requestId);
    toast({
      title: "Booking Approved",
      description: "The booking request has been approved and client will be notified."
    });
    // This would typically update the backend and move the request to confirmed bookings
  };

  const handleRejectRequest = (requestId: number) => {
    // Logic to reject booking request
    console.log('Rejected request:', requestId);
    toast({
      title: "Booking Rejected",
      description: "The booking request has been rejected and client will be notified."
    });
    // This would typically update the backend
  };

  // Availability management functions
  const handleAddAvailability = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newSlot = {
      id: Date.now(),
      dayOfWeek: availabilityForm.dayOfWeek,
      timeSlots: [{
        startTime: availabilityForm.startTime,
        endTime: availabilityForm.endTime,
        type: availabilityForm.type
      }],
      isActive: availabilityForm.isActive
    };
    
    if (editingSlot) {
      setAvailabilitySlots(prev => prev.map(slot => 
        slot.id === editingSlot.id ? { ...newSlot, id: editingSlot.id } : slot
      ));
      toast({
        title: "Availability Updated",
        description: "Your availability has been updated successfully."
      });
    } else {
      setAvailabilitySlots(prev => [...prev, newSlot]);
      toast({
        title: "Availability Added",
        description: "New availability slot has been added to your schedule."
      });
    }
    
    setShowAddAvailability(false);
    resetAvailabilityForm();
  };
  
  const handleBlockDate = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newBlockedDate = {
      id: Date.now(),
      date: blockDateForm.date,
      reason: blockDateForm.reason,
      type: blockDateForm.type
    };
    
    setBlockedDates(prev => [...prev, newBlockedDate]);
    toast({
      title: "Date Blocked",
      description: "The selected date has been blocked from bookings."
    });
    
    setShowBlockDate(false);
    resetBlockDateForm();
  };
  
  const resetAvailabilityForm = () => {
    setAvailabilityForm({
      dayOfWeek: '',
      startTime: '',
      endTime: '',
      type: '',
      isActive: true
    });
    setEditingSlot(null);
  };
  
  const resetBlockDateForm = () => {
    setBlockDateForm({
      date: '',
      reason: '',
      type: 'blocked'
    });
  };
  
  const handleEditAvailability = (slot: any) => {
    setEditingSlot(slot);
    setAvailabilityForm({
      dayOfWeek: slot.dayOfWeek,
      startTime: slot.timeSlots[0]?.startTime || '',
      endTime: slot.timeSlots[0]?.endTime || '',
      type: slot.timeSlots[0]?.type || '',
      isActive: slot.isActive
    });
    setShowAddAvailability(true);
  };
  
  const handleDeleteAvailability = (slotId: number) => {
    setAvailabilitySlots(prev => prev.filter(slot => slot.id !== slotId));
    toast({
      title: "Availability Removed",
      description: "The availability slot has been removed from your schedule."
    });
  };
  
  const handleDeleteBlockedDate = (dateId: number) => {
    setBlockedDates(prev => prev.filter(date => date.id !== dateId));
    toast({
      title: "Date Unblocked",
      description: "The date has been unblocked and is now available for bookings."
    });
  };
  
  const toggleAvailability = (slotId: number) => {
    setAvailabilitySlots(prev => prev.map(slot => 
      slot.id === slotId ? { ...slot, isActive: !slot.isActive } : slot
    ));
  };
  
  const getDayName = (dayOfWeek: string) => {
    const days = {
      monday: 'Monday',
      tuesday: 'Tuesday', 
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday',
      sunday: 'Sunday'
    };
    return days[dayOfWeek as keyof typeof days] || dayOfWeek;
  };

  const handleChatRedirect = (booking: any) => {
    // Redirect to chat with the client
    navigate(`/photographer-dashboard`, { state: { activeSection: 'chat', conversationId: `conv-${booking.id}` } });
  };

  const renderBookingCard = (booking: any, isRequest = false) => (
    <Card key={booking.id} className="mb-4">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg">{booking.client}</h3>
              <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>
                {booking.status}
              </Badge>
            </div>
            <p className="text-muted-foreground mb-2">{booking.type}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center text-muted-foreground">
                <CalendarIcon className="h-4 w-4 mr-2" />
                {isRequest ? booking.requestedDate : booking.date}
              </div>
              <div className="flex items-center text-muted-foreground">
                <Clock className="h-4 w-4 mr-2" />
                {isRequest ? booking.requestedTime : booking.time}
              </div>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2" />
                {booking.location}
              </div>
              <div className="flex items-center text-muted-foreground">
                <User className="h-4 w-4 mr-2" />
                {booking.clientEmail}
              </div>
            </div>
            {booking.message && isRequest && (
              <div className="mt-3 p-3 bg-muted rounded-lg">
                <p className="text-sm">{booking.message}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">{booking.package}</p>
            <p className="font-semibold text-primary text-lg">{booking.price}</p>
          </div>
          
          <div className="flex items-center space-x-2">
            {isRequest ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedRequest(booking);
                    setShowCalendar(true);
                  }}
                  className="text-green-600 border-green-600 hover:bg-green-50"
                >
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  Check Calendar
                </Button>
                <Button
                  variant="outline" 
                  size="sm"
                  onClick={() => handleApproveRequest(booking.id)}
                  className="text-green-600 border-green-600 hover:bg-green-50"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRejectRequest(booking.id)}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  <X className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleChatRedirect(booking)}
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Chat
                </Button>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Bookings Management</h1>
        <div className="flex gap-2">
          <Button onClick={() => {
            // Navigate to chat with option to start new conversation
            navigate('/photographer-dashboard', { 
              state: { 
                activeSection: 'chat', 
                showNewChatDialog: true 
              } 
            });
          }}>
            <MessageSquare className="h-4 w-4 mr-2" />
            New Chat
          </Button>
          <Dialog open={showAddAvailability} onOpenChange={setShowAddAvailability}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetAvailabilityForm(); setShowAddAvailability(true); }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Availability
              </Button>
            </DialogTrigger>
          </Dialog>
          <Dialog open={showBlockDate} onOpenChange={setShowBlockDate}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => { resetBlockDateForm(); setShowBlockDate(true); }}>
                <X className="h-4 w-4 mr-2" />
                Block Date
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upcoming">
            Upcoming Bookings ({upcomingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="requests">
            Booking Requests ({bookingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="availability">
            Availability Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingBookings.length > 0 ? (
            upcomingBookings.map(booking => renderBookingCard(booking))
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Upcoming Bookings</h3>
                <p className="text-muted-foreground">New bookings will appear here once confirmed</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          {bookingRequests.length > 0 ? (
            bookingRequests.map(request => renderBookingCard(request, true))
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Booking Requests</h3>
                <p className="text-muted-foreground">New requests will appear here for your approval</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="availability" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recurring Availability */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Weekly Availability
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {availabilitySlots.length > 0 ? (
                  availabilitySlots.map(slot => (
                    <div key={slot.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{getDayName(slot.dayOfWeek)}</h4>
                          <Badge variant={slot.isActive ? "default" : "secondary"}>
                            {slot.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleAvailability(slot.id)}
                          >
                            <Settings className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditAvailability(slot)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteAvailability(slot.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      {slot.timeSlots.map((timeSlot, index) => (
                        <div key={index} className="text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            {timeSlot.startTime} - {timeSlot.endTime}
                          </div>
                          <p className="mt-1">{timeSlot.type}</p>
                        </div>
                      ))}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Availability Set</h3>
                    <p className="text-muted-foreground mb-4">
                      Set your weekly availability to let clients know when you're available for bookings.
                    </p>
                    <Button onClick={() => { resetAvailabilityForm(); setShowAddAvailability(true); }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Availability
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Blocked Dates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <X className="h-5 w-5" />
                  Blocked Dates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {blockedDates.length > 0 ? (
                  blockedDates.map(blockedDate => (
                    <div key={blockedDate.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{blockedDate.date}</h4>
                          <p className="text-sm text-muted-foreground">{blockedDate.reason}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteBlockedDate(blockedDate.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Blocked Dates</h3>
                    <p className="text-muted-foreground mb-4">
                      Block specific dates when you're not available for bookings.
                    </p>
                    <Button onClick={() => { resetBlockDateForm(); setShowBlockDate(true); }}>
                      <X className="h-4 w-4 mr-2" />
                      Block a Date
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Availability Dialog */}
      <Dialog open={showAddAvailability} onOpenChange={setShowAddAvailability}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingSlot ? 'Edit Availability' : 'Add New Availability'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddAvailability} className="space-y-4">
            <div>
              <Label htmlFor="dayOfWeek">Day of Week</Label>
              <Select 
                value={availabilityForm.dayOfWeek} 
                onValueChange={(value) => setAvailabilityForm(prev => ({ ...prev, dayOfWeek: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monday">Monday</SelectItem>
                  <SelectItem value="tuesday">Tuesday</SelectItem>
                  <SelectItem value="wednesday">Wednesday</SelectItem>
                  <SelectItem value="thursday">Thursday</SelectItem>
                  <SelectItem value="friday">Friday</SelectItem>
                  <SelectItem value="saturday">Saturday</SelectItem>
                  <SelectItem value="sunday">Sunday</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={availabilityForm.startTime}
                  onChange={(e) => setAvailabilityForm(prev => ({ ...prev, startTime: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={availabilityForm.endTime}
                  onChange={(e) => setAvailabilityForm(prev => ({ ...prev, endTime: e.target.value }))}
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="type">Photography Type</Label>
              <Select 
                value={availabilityForm.type} 
                onValueChange={(value) => setAvailabilityForm(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select photography type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Types">All Types</SelectItem>
                  <SelectItem value="Wedding Photography">Wedding Photography</SelectItem>
                  <SelectItem value="Portrait Sessions">Portrait Sessions</SelectItem>
                  <SelectItem value="Event Photography">Event Photography</SelectItem>
                  <SelectItem value="Corporate Photography">Corporate Photography</SelectItem>
                  <SelectItem value="Family Photography">Family Photography</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={availabilityForm.isActive}
                onChange={(e) => setAvailabilityForm(prev => ({ ...prev, isActive: e.target.checked }))}
                className="rounded"
              />
              <Label htmlFor="isActive">Active (clients can book during this time)</Label>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowAddAvailability(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingSlot ? 'Update Availability' : 'Add Availability'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Block Date Dialog */}
      <Dialog open={showBlockDate} onOpenChange={setShowBlockDate}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Block Date</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleBlockDate} className="space-y-4">
            <div>
              <Label htmlFor="blockDate">Date to Block</Label>
              <Input
                id="blockDate"
                type="date"
                value={blockDateForm.date}
                onChange={(e) => setBlockDateForm(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="reason">Reason (Optional)</Label>
              <Textarea
                id="reason"
                placeholder="e.g., Personal vacation, Equipment maintenance, etc."
                value={blockDateForm.reason}
                onChange={(e) => setBlockDateForm(prev => ({ ...prev, reason: e.target.value }))}
                rows={3}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowBlockDate(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Block Date
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Calendar Dialog for checking availability */}
      <Dialog open={showCalendar} onOpenChange={setShowCalendar}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Check Availability</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedRequest && (
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium">{selectedRequest.client}</h4>
                <p className="text-sm text-muted-foreground">
                  Requested: {selectedRequest.requestedDate} at {selectedRequest.requestedTime}
                </p>
              </div>
            )}
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
            <div className="flex space-x-2">
              <Button 
                onClick={() => {
                  if (selectedRequest) {
                    handleApproveRequest(selectedRequest.id);
                  }
                  setShowCalendar(false);
                }}
                className="flex-1"
              >
                Approve Booking
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowCalendar(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}