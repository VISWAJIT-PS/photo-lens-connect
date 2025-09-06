import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download, Share2, Heart, Users, Calendar, MapPin } from "lucide-react";

// Import static data
import photosData from "@/data/photos.json";
import usersData from "@/data/users.json";
import analyticsData from "@/data/analytics.json";

const EventResults = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [eventPhotos, setEventPhotos] = useState<any[]>([]);

  // Get user registration data
  const [userData, setUserData] = useState<any>(null);

  // Static data for demonstration
  const staticUserData = {
    name: "John Smith",
    whatsappNumber: "+1 (555) 123-4567",
    phoneNumber: "+1 (555) 987-6543",
    registrationDate: "2024-09-01",
    eventName: "Smith Family Wedding Reception"
  };

  const staticEventPhotos = [
    {
      id: "photo-1",
      title: "Wedding Ceremony Moment",
      url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop",
      timestamp: "2024-09-15T14:30:00Z",
      location: "Grand Ballroom, Downtown Hotel",
      peopleCount: 8,
      matchConfidence: 92,
      tags: ["wedding", "ceremony", "family", "smile"]
    },
    {
      id: "photo-2",
      title: "Reception Dance Floor",
      url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=300&fit=crop",
      timestamp: "2024-09-15T19:45:00Z",
      location: "Grand Ballroom, Downtown Hotel",
      peopleCount: 12,
      matchConfidence: 87,
      tags: ["wedding", "dance", "reception", "celebration"]
    },
    {
      id: "photo-3",
      title: "Family Group Photo",
      url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop",
      timestamp: "2024-09-15T16:20:00Z",
      location: "Grand Ballroom, Downtown Hotel",
      peopleCount: 15,
      matchConfidence: 95,
      tags: ["wedding", "family", "group", "portrait"]
    },
    {
      id: "photo-4",
      title: "Cake Cutting Ceremony",
      url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=300&fit=crop",
      timestamp: "2024-09-15T20:15:00Z",
      location: "Grand Ballroom, Downtown Hotel",
      peopleCount: 6,
      matchConfidence: 89,
      tags: ["wedding", "cake", "ceremony", "tradition"]
    },
    {
      id: "photo-5",
      title: "First Dance",
      url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop",
      timestamp: "2024-09-15T20:30:00Z",
      location: "Grand Ballroom, Downtown Hotel",
      peopleCount: 2,
      matchConfidence: 91,
      tags: ["wedding", "dance", "romantic", "couple"]
    },
    {
      id: "photo-6",
      title: "Guest Book Signing",
      url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=300&fit=crop",
      timestamp: "2024-09-15T18:00:00Z",
      location: "Grand Ballroom, Downtown Hotel",
      peopleCount: 4,
      matchConfidence: 76,
      tags: ["wedding", "guests", "signing", "memories"]
    }
  ];

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const registrations = JSON.parse(localStorage.getItem('eventRegistrations') || '[]');
    const latestRegistration = registrations[registrations.length - 1];
    if (latestRegistration) {
      setUserData(latestRegistration);
    } else {
      // Use static data if no registration found
      setUserData(staticUserData);
    }
  }, []);

  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      if (eventId && photosData[eventId]) {
        // Add random match confidence to photos
        const photosWithConfidence = photosData[eventId].map((photo: any) => ({
          ...photo,
          matchConfidence: Math.floor(Math.random() * 30) + 65 // Random confidence between 65-95
        }));
        setEventPhotos(photosWithConfidence);
      } else {
        // Use static data if no event data found
        setEventPhotos(staticEventPhotos);
      }
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [eventId]);

  const toggleFavorite = (photoId: string) => {
    setFavorites(prev =>
      prev.includes(photoId)
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    );
  };

  const handleDownload = (photo: any) => {
    // In a real app, this would download the image
    const link = document.createElement('a');
    link.href = photo.url;
    link.download = `event-photo-${photo.id}.jpg`;
    link.click();
  };

  const handleShare = (photo: any) => {
    if (navigator.share) {
      navigator.share({
        title: photo.title,
        text: `Check out this photo from the event: ${photo.title}`,
        url: photo.url
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${photo.title} - ${photo.url}`);
      alert('Photo link copied to clipboard!');
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return "bg-green-500";
    if (confidence >= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Processing Your Photos</h2>
            <p className="text-muted-foreground mb-4">
              Our AI is analyzing photos to find your face matches...
            </p>
            <div className="flex justify-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Your Photo Matches
            </h1>
            <p className="text-lg text-muted-foreground">
              We found <span className="font-semibold text-primary">{eventPhotos.length}</span> photos that may contain your face
            </p>
          </div>

          {/* Event Summary Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Event Summary
              </CardTitle>
              <CardDescription>
                {userData?.eventName || "Smith Family Wedding Reception"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Photos Found</p>
                    <p className="text-2xl font-bold">{eventPhotos.length}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/10 rounded-lg">
                    <Heart className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Favorites</p>
                    <p className="text-2xl font-bold text-red-600">{favorites.length}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Download className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ready to Download</p>
                    <p className="text-2xl font-bold text-blue-600">{eventPhotos.length}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {userData && (
            <Card>
              <CardHeader>
                <CardTitle>Your Registration Details</CardTitle>
                <CardDescription>
                  Information used for face matching
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                    <p className="font-semibold">{userData.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">WhatsApp</p>
                    <p className="font-semibold">{userData.whatsappNumber}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                    <p className="font-semibold">{userData.phoneNumber}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Registered on {new Date(userData.registrationDate || '2024-09-01').toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {eventPhotos.map((photo) => (
            <Card key={photo.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-48 object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={() => setSelectedPhoto(photo)}
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 bg-white/80 hover:bg-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(photo.id);
                    }}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        favorites.includes(photo.id) ? 'fill-red-500 text-red-500' : ''
                      }`}
                    />
                  </Button>
                </div>
                <div className="absolute bottom-2 left-2">
                  <Badge
                    className={`${getConfidenceColor(photo.matchConfidence)} text-white font-semibold`}
                  >
                    {photo.matchConfidence}% match
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">{photo.title}</h3>
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(photo.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{photo.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{photo.peopleCount} people</span>
                  </div>
                </div>

                <div className="flex gap-2 mb-3">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleDownload(photo)}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleShare(photo)}
                  >
                    <Share2 className="h-3 w-3" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-1">
                  {photo.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold">Need Help?</h3>
              <p className="text-muted-foreground">
                If you don't see your photos or have questions about the matching results,
                our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download All Photos
                </Button>
                <Button variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Results
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Photo Detail Dialog */}
        <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            {selectedPhoto && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl">{selectedPhoto.title}</DialogTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={`${getConfidenceColor(selectedPhoto.matchConfidence)} text-white font-semibold`}>
                      {selectedPhoto.matchConfidence}% Face Match Confidence
                    </Badge>
                    {favorites.includes(selectedPhoto.id) && (
                      <Badge variant="secondary" className="bg-red-50 text-red-700 border-red-200">
                        <Heart className="h-3 w-3 mr-1 fill-red-500" />
                        Favorited
                      </Badge>
                    )}
                  </div>
                </DialogHeader>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="relative">
                      <img
                        src={selectedPhoto.url}
                        alt={selectedPhoto.title}
                        className="w-full rounded-lg shadow-lg"
                      />
                      <div className="absolute top-4 right-4">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="bg-white/90 hover:bg-white shadow-lg"
                          onClick={() => toggleFavorite(selectedPhoto.id)}
                        >
                          <Heart
                            className={`h-5 w-5 ${
                              favorites.includes(selectedPhoto.id) ? 'fill-red-500 text-red-500' : ''
                            }`}
                          />
                        </Button>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        className="flex-1"
                        size="lg"
                        onClick={() => handleDownload(selectedPhoto)}
                      >
                        <Download className="h-5 w-5 mr-2" />
                        Download High Quality
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => handleShare(selectedPhoto)}
                      >
                        <Share2 className="h-5 w-5 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-lg mb-4">Photo Information</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <Calendar className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Captured</p>
                            <p className="font-medium">{new Date(selectedPhoto.timestamp).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <MapPin className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Location</p>
                            <p className="font-medium">{selectedPhoto.location}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <Users className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">People in Photo</p>
                            <p className="font-medium">{selectedPhoto.peopleCount} people</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-lg mb-3">Photo Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedPhoto.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="px-3 py-1">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border">
                      <h4 className="font-semibold mb-2">Face Recognition Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Match Confidence:</span>
                          <span className="font-semibold">{selectedPhoto.matchConfidence}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Algorithm:</span>
                          <span className="font-semibold">AI Face Recognition v2.1</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Processed:</span>
                          <span className="font-semibold">{new Date().toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default EventResults;