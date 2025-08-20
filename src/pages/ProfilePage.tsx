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
  MessageCircle
} from "lucide-react";

const ProfilePage = () => {
  const { type, id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { creator } = location.state || {};

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

                  <div className="flex gap-3">
                    <Button size="lg" className="flex-1">
                      <Calendar className="h-4 w-4 mr-2" />
                      Book Now
                    </Button>
                    <Button variant="outline" size="lg">
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                    <Button variant="outline" size="lg">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
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
            <Button size="lg" className="px-8">
              <Calendar className="h-5 w-5 mr-2" />
              Book Now - {creator.price}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;