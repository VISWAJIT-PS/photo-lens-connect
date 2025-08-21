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
  CalendarDays,
  DollarSign
} from "lucide-react";
import { format, addDays, isSameDay } from 'date-fns';
import { Input } from '@/components/ui/input';
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
                    <Button size="lg" className="flex-1" onClick={handleBookNowClick} disabled={true}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Select Package to Book
                    </Button>

                    <Button variant="outline" size="lg" onClick={() => {
                      const conversationId = `conv-${creator.id}`;
                      navigate(`/chat/${conversationId}?name=${encodeURIComponent(creator.name)}&role=${encodeURIComponent(type)}&avatar=${encodeURIComponent(creator.image_url)}`);
                    }} disabled={true}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Chat (Book First)
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

        {/* Ratings & Reviews and Price Variations Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Ratings & Reviews */}
          <Card className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="flex items-center gap-2 mb-4">
                <Star className="h-5 w-5" />
                Ratings & Reviews
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold">{creator.rating}</div>
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      {[1,2,3,4,5].map((star) => (
                        <Star 
                          key={star} 
                          className={`h-4 w-4 ${star <= Math.floor(creator.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} 
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">{creator.reviews} reviews</p>
                  </div>
                </div>
                
                {/* Sample reviews */}
                <div className="space-y-3 border-t pt-4">
                  {[
                    { name: "John D.", rating: 5, comment: "Outstanding work! Exceeded expectations.", date: "2 weeks ago" },
                    { name: "Sarah M.", rating: 5, comment: "Professional and creative. Highly recommend!", date: "1 month ago" },
                    { name: "Mike R.", rating: 4, comment: "Great experience overall. Will book again.", date: "2 months ago" }
                  ].map((review, idx) => (
                    <div key={idx} className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{review.name}</span>
                          <div className="flex">
                            {[1,2,3,4,5].map((star) => (
                              <Star 
                                key={star} 
                                className={`h-3 w-3 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} 
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">{review.date}</span>
                      </div>
                      <p className="text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Price Variations */}
          <Card className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="flex items-center gap-2 mb-4">
                <DollarSign className="h-5 w-5" />
                Package Options
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="space-y-4">
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors">
                    <input type="radio" name="package" value="basic" className="text-primary" />
                    <div className="flex-1">
                      <div className="font-semibold">Basic Package</div>
                      <div className="text-sm text-muted-foreground">Essential coverage for your event</div>
                      <div className="text-lg font-bold text-primary">$600</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors">
                    <input type="radio" name="package" value="advance" className="text-primary" />
                    <div className="flex-1">
                      <div className="font-semibold">Advance Package</div>
                      <div className="text-sm text-muted-foreground">Extended coverage with editing</div>
                      <div className="text-lg font-bold text-primary">$1,200</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors">
                    <input type="radio" name="package" value="pro" className="text-primary" />
                    <div className="flex-1">
                      <div className="font-semibold">Pro Package</div>
                      <div className="text-sm text-muted-foreground">Full service with premium features</div>
                      <div className="text-lg font-bold text-primary">$2,500</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors">
                    <input type="radio" name="package" value="custom" className="text-primary" />
                    <div className="flex-1">
                      <div className="font-semibold">Custom Package</div>
                      <div className="text-sm text-muted-foreground">Tailored to your budget and needs</div>
                      <Input 
                        placeholder="Enter your budget" 
                        className="mt-2" 
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </label>
                </div>
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
              Select a package above to proceed with booking and enable chat.
            </p>
            <Button size="lg" className="px-8" disabled={true} onClick={handleBookNowClick}>
              <Calendar className="h-5 w-5 mr-2" />
              Select Package to Continue
            </Button>
          </div>
        </Card>
      </div>
      <OnboardingPopup isOpen={showOnboarding} onComplete={handleOnboardingComplete} onClose={() => setShowOnboarding(false)} />
    </div>
  );
};

export default ProfilePage;