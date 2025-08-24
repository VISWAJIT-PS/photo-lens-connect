import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar as CalendarIcon, Clock, MapPin, User, Check, X, MessageSquare, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

export function PhotographerBookings() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showCalendar, setShowCalendar] = useState(false);

  const handleApproveRequest = (requestId: number) => {
    // Logic to approve booking request
    console.log('Approved request:', requestId);
    // This would typically update the backend and move the request to confirmed bookings
  };

  const handleRejectRequest = (requestId: number) => {
    // Logic to reject booking request
    console.log('Rejected request:', requestId);
    // This would typically update the backend
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
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Availability
        </Button>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upcoming">
            Upcoming Bookings ({upcomingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="requests">
            Booking Requests ({bookingRequests.length})
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
      </Tabs>

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