import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Star, MapPin, Navigation, Calendar } from 'lucide-react';

interface EventSpace {
  id: number;
  name: string;
  category: string;
  price: string;
  rating: number;
  location: string;
  description: string;
  image_url: string;
  images?: string[];
  available: boolean;
  reviews: number;
  specs: string[];
  coordinates?: { lat: number; lng: number };
}

interface EventSpaceDetailsDialogProps {
  eventSpace: EventSpace | null;
  isOpen: boolean;
  onClose: () => void;
  onBookNow: (spaceId: number) => void;
}

export const EventSpaceDetailsDialog: React.FC<EventSpaceDetailsDialogProps> = ({
  eventSpace,
  isOpen,
  onClose,
  onBookNow
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!eventSpace) return null;

  const images = eventSpace.images && eventSpace.images.length > 0 ? eventSpace.images : [eventSpace.image_url];

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleGetDirections = () => {
    const query = encodeURIComponent(eventSpace.location);
    window.open(`https://www.google.com/maps/search/${query}`, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Find Your Perfect Photo Spot</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <img
                src={images[currentImageIndex]}
                alt={eventSpace.name}
                className="w-full h-full object-cover"
              />
              
              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 text-white hover:bg-black/40"
                    onClick={goToPrevious}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 text-white hover:bg-black/40"
                    onClick={goToNext}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
              
              {!eventSpace.available && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Badge variant="destructive">Not Available</Badge>
                </div>
              )}
            </div>

            {/* Thumbnail Navigation */}
            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${
                      index === currentImageIndex ? 'border-primary' : 'border-border'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${eventSpace.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Event Space Details */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">{eventSpace.name}</h2>
              <Badge variant="secondary" className="mb-2">{eventSpace.category}</Badge>
              <div className="flex items-center justify-between mb-2">
                <div className="text-2xl font-bold text-primary">{eventSpace.price}</div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-current text-yellow-400" />
                  <span className="font-medium">{eventSpace.rating}</span>
                  <span className="text-muted-foreground">({eventSpace.reviews} reviews)</span>
                </div>
              </div>
              <div className="flex items-center text-muted-foreground mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                {eventSpace.location}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">About This Space</h4>
              <p className="text-muted-foreground">{eventSpace.description}</p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Features & Amenities</h4>
              <div className="flex flex-wrap gap-2">
                {eventSpace.specs.map((spec, index) => (
                  <Badge key={index} variant="outline">
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <Button
                onClick={() => onBookNow(eventSpace.id)}
                disabled={!eventSpace.available}
                className="w-full"
                size="lg"
              >
                <Calendar className="h-4 w-4 mr-2" />
                {eventSpace.available ? 'Book This Space' : 'Not Available'}
              </Button>
              
              <Button
                variant="outline"
                onClick={handleGetDirections}
                className="w-full"
                size="lg"
              >
                <Navigation className="h-4 w-4 mr-2" />
                Get Directions
              </Button>
              
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm">
                  Add to Favorites
                </Button>
                <Button variant="outline" size="sm">
                  Share Space
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};