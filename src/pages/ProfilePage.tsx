import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Navigation } from "@/components/ui/navigation";
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Camera, 
  Video, 
  Calendar, 
  Award, 
  Users, 
  Clock,
  Phone,
  MessageCircle,
  CalendarDays
} from "lucide-react";
import { Calendar as DatePicker } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, addDays, isSameDay } from 'date-fns';
import { useState } from 'react';
import { OnboardingPopup } from '@/components/OnboardingPopup';
import { useToast } from '@/components/ui/use-toast';

const ProfilePage = () => {
  const { type, id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { creator } = location.state || {};

  // local UI state for booking flow
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const { toast } = useToast();

  // Mock availability data - in real app this would come from API
  const today = new Date();
  const availableDates = [
    addDays(today, 3),
    addDays(today, 5),
    addDays(today, 7),
    addDays(today, 10),
    addDays(today, 12),
    addDays(today, 15),
    addDays(today, 18),
    addDays(today, 20),
    addDays(today, 22),
    addDays(today, 25),
    addDays(today, 28),
    addDays(today, 30)
  ];

  const bookedDates = [
    addDays(today, 1),
    addDays(today, 2),
    addDays(today, 4),
    addDays(today, 6),
    addDays(today, 8),
    addDays(today, 9),
    addDays(today, 11),
    addDays(today, 14),
    addDays(today, 16),
    addDays(today, 17),
    addDays(today, 19),
    addDays(today, 21)
  ];

  const isDateAvailable = (date: Date) => {
    return availableDates.some(availableDate => isSameDay(availableDate, date));
  };

  const isDateBooked = (date: Date) => {
    return bookedDates.some(bookedDate => isSameDay(bookedDate, date));
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date && isDateAvailable(date)) {
      setSelectedDate(date);
      toast({ 
        title: 'Date Selected', 
        description: `Selected ${format(date, 'PPP')} for booking` 
      });
    } else if (date && isDateBooked(date)) {
      toast({ 
        title: 'Date Unavailable', 
        description: 'This date is already booked',
        variant: 'destructive'
      });
    }
  };

  interface OnboardingData {
    eventDate?: string | Date | null;
    location?: string;
    serviceTypes?: string[];
  }

  const readOnboardingData = (): OnboardingData | null => {
    try {
      const raw = localStorage.getItem('onboarding_data');
      return raw ? JSON.parse(raw) as OnboardingData : null;
    } catch (e) {
      return null;
    }
  };

  const writeOnboardingData = (data: OnboardingData) => {
    try {
      localStorage.setItem('onboarding_data', JSON.stringify(data));
    } catch (e) {
      // noop
    }
  };

  const handleOnboardingComplete = (data: OnboardingData) => {
    // ensure service type is present
    const svc = type === 'photographer' ? 'photographers' : type === 'videographer' ? 'videographers' : null;
    const serviceTypes = Array.isArray(data.serviceTypes) ? data.serviceTypes.slice() : [];
    if (svc && !serviceTypes.includes(svc)) serviceTypes.push(svc);

    const final = { ...data, serviceTypes };
    writeOnboardingData(final);
    setShowOnboarding(false);
    toast({ title: 'Onboarding complete', description: 'Your booking preferences were saved.' });
  };

  const handleBookNowClick = () => {
    const existing = readOnboardingData();

    if (existing) {
      const merged = { ...existing };
      merged.serviceTypes = Array.isArray(merged.serviceTypes) ? merged.serviceTypes.slice() : [];
      const svc = type === 'photographer' ? 'photographers' : type === 'videographer' ? 'videographers' : null;
      if (svc && !merged.serviceTypes.includes(svc)) merged.serviceTypes.push(svc);
      if (selectedDate) merged.eventDate = selectedDate;
      writeOnboardingData(merged);
      toast({ title: 'Booking prepared', description: `Saved booking preferences for ${creator.name}${selectedDate ? ` on ${format(selectedDate, 'PPP')}` : ''}` });
    } else {
      // open onboarding popup to collect missing data
      setShowOnboarding(true);
      toast({ title: 'Complete preferences', description: 'Please provide event date, location and services to continue.' });
    }
  };

  if (!creator) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
          <p>Creator not found</p>
        </div>
      </div>
    );
  }

  // Dummy gallery images
  const galleryImages = [
    "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600",
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=600",
    "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600",
    "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=600",
    "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600"
  ];

  // Dummy events data
  const latestEvents = [
    { name: "Sarah & John Wedding", date: "2024-01-15", location: "Beverly Hills" },
    { name: "Tech Conference 2024", date: "2024-01-10", location: "San Francisco" },
    { name: "Family Portrait Session", date: "2024-01-05", location: "Central Park" }
  ];

  const popularEvents = [
    { name: "Celebrity Gala Night", date: "2023-12-20", attendees: 500 },
    { name: "Fashion Week Finale", date: "2023-11-15", attendees: 800 },
    { name: "Corporate Summit", date: "2023-10-30", attendees: 1200 }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6 hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Search
        </Button>

        {/* Profile Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-start space-x-6">
                <img
                  src={creator.image_url}
                  alt={creator.name}
                  className="w-32 h-32 rounded-full object-cover ring-4 ring-primary/20"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold">{creator.name}</h1>
                    {type === 'videographer' && <Video className="h-6 w-6 text-primary" />}
                    {type === 'photographer' && <Camera className="h-6 w-6 text-primary" />}
                  </div>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center space-x-1">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{creator.rating}</span>
                      <span className="text-muted-foreground">({creator.reviews} reviews)</span>
                    </div>
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                      {creator.price}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-6 mb-4 text-muted-foreground">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {creator.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {creator.experience_years} years
                    </div>
                    <div className="flex items-center">
                      <Camera className="h-4 w-4 mr-1" />
                      {creator.portfolio_count} Event Crew
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-6">{creator.bio}</p>

                  <div className="flex gap-3 items-center">
                    <Button size="lg" className="flex-1" onClick={handleBookNowClick} disabled={!selectedDate}>
                      <Calendar className="h-4 w-4 mr-2" />
                      {selectedDate ? `Book for ${format(selectedDate, 'MMM d')}` : 'Select Date to Book'}
                    </Button>

                    <Button variant="outline" size="lg" onClick={() => {
                      const conversationId = `conv-${creator.id}`;
                      navigate(`/chat/${conversationId}?name=${encodeURIComponent(creator.name)}&role=${encodeURIComponent(type)}&avatar=${encodeURIComponent(creator.image_url)}`);
                    }}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Chat
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Specialization</span>
                  <span className="font-medium">{creator.specialization}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Response Time</span>
                  <span className="font-medium">Within 2 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Booking Rate</span>
                  <span className="font-medium">95%</span>
                </div>
              </div>
            </Card>

            {/* Achievement Badge */}
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10">
              <div className="flex items-center gap-3 mb-2">
                <Award className="h-6 w-6 text-primary" />
                <h3 className="font-semibold">Top Rated</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Consistently rated 4.8+ stars by clients
              </p>
            </Card>
          </div>
        </div>

        {/* Events Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card className="p-6 mb-8">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="flex items-center gap-2 mb-4">
              <CalendarDays className="h-5 w-5" />
              Availability Calendar
            </CardTitle>
            <div className="flex gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span>Booked</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <DatePicker
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => date < today}
              modifiers={{
                available: availableDates,
                booked: bookedDates,
                selected: selectedDate ? [selectedDate] : []
              }}
              modifiersStyles={{
                available: { 
                  backgroundColor: '#22c55e', 
                  color: 'white',
                  fontWeight: 'bold'
                },
                booked: { 
                  backgroundColor: '#ef4444', 
                  color: 'white',
                  fontWeight: 'bold'
                },
                selected: { 
                  backgroundColor: '#3b82f6', 
                  color: 'white',
                  fontWeight: 'bold'
                }
              }}
              className="rounded-md border shadow w-fit mx-auto"
            />
            {selectedDate && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-center font-medium text-blue-900">
                  Selected Date: {format(selectedDate, 'PPPP')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
          {/* Latest Events */}
          <Card className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Latest Events
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="space-y-3">
                {latestEvents.map((event, index) => (
                  <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-accent/50">
                    <div>
                      <p className="font-medium">{event.name}</p>
                      <p className="text-sm text-muted-foreground">{event.location}</p>
                    </div>
                    <Badge variant="outline">{event.date}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Popular Events */}
          <Card className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Popular Events
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="space-y-3">
                {popularEvents.map((event, index) => (
                  <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-accent/50">
                    <div>
                      <p className="font-medium">{event.name}</p>
                      <p className="text-sm text-muted-foreground">{event.attendees} attendees</p>
                    </div>
                    <Badge variant="outline">{event.date}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Portfolio Gallery */}
        <Card className="p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="flex items-center gap-2 mb-6">
              <Camera className="h-5 w-5" />
              Best Work Gallery
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <Carousel className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4">
                {galleryImages.map((image, index) => (
                  <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                    <div className="relative group overflow-hidden rounded-lg">
                      <img
                        src={image}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Badge variant="secondary" className="text-white bg-white/20">
                          View Full Size
                        </Badge>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          </CardContent>
        </Card>

        {/* Book Now Section */}
        <Card className="p-8 mt-8 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Book {creator.name}?</h2>
            <p className="text-muted-foreground mb-6">
              Secure your date and create unforgettable memories with our top-rated {type}.
            </p>
            <Button size="lg" className="px-8" disabled={!selectedDate} onClick={handleBookNowClick}>
              <Calendar className="h-5 w-5 mr-2" />
              {selectedDate ? `Book Now - ${creator.price} for ${format(selectedDate, 'MMM d')}` : `Select a Date to Book - ${creator.price}`}
            </Button>
          </div>
        </Card>
      </div>
      <OnboardingPopup isOpen={showOnboarding} onComplete={handleOnboardingComplete} onClose={() => setShowOnboarding(false)} />
    </div>
  );
};

export default ProfilePage;