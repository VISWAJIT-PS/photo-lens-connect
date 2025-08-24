import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { EventSpaceCard } from '@/components/EventSpaceCard';
import { Search, Filter, MapPin, Star, DollarSign } from 'lucide-react';
import { EventSpaceDetailsDialog } from '@/components/EventSpaceDetailsDialog';
import { useToast } from '@/hooks/use-toast';

interface OnboardingData {
  eventDate: Date | undefined;
  location: string;
  serviceTypes: string[];
}

interface PhotoSpotsTabProps {
  onboardingData: OnboardingData | null;
}

// Mock Find Your Photo Spot data
const eventSpaces = [
  {
    id: 101,
    name: "Grand Ballroom",
    category: "Ballroom",
    price: "$2,000/day",
    rating: 4.9,
    location: "New York, NY",
    description: "Elegant ballroom for weddings and large events.",
    image_url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    available: true,
    reviews: 120,
    specs: ["Up to 500 guests", "Catering Available", "AV Equipment"]
  },
  {
    id: 102,
    name: "Rooftop Venue",
    category: "Rooftop",
    price: "$1,500/day",
    rating: 4.8,
    location: "Los Angeles, CA",
    description: "Modern rooftop space with city views.",
    image_url: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca",
    available: true,
    reviews: 85,
    specs: ["Up to 200 guests", "Bar Service", "Outdoor Seating"]
  },
  {
    id: 103,
    name: "Garden Pavilion",
    category: "Garden",
    price: "$1,200/day",
    rating: 4.7,
    location: "Miami, FL",
    description: "Beautiful garden pavilion for outdoor events.",
    image_url: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
    available: false,
    reviews: 60,
    specs: ["Up to 150 guests", "Floral Decor", "Covered Area"]
  },
  {
    id: 104,
    name: "Urban Studio Loft",
    category: "Studio",
    price: "$800/day",
    rating: 4.6,
    location: "Brooklyn, NY",
    description: "Industrial loft space perfect for fashion and portrait photography.",
    image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64",
    available: true,
    reviews: 42,
    specs: ["High Ceilings", "Natural Light", "Brick Walls"]
  },
  {
    id: 105,
    name: "Beachfront Pavilion",
    category: "Beach",
    price: "$1,800/day",
    rating: 4.9,
    location: "Malibu, CA",
    description: "Stunning beachfront location with ocean views.",
    image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    available: true,
    reviews: 98,
    specs: ["Ocean Views", "Sunset Timing", "Beach Access"]
  },
  {
    id: 106,
    name: "Historic Library",
    category: "Indoor",
    price: "$600/day",
    rating: 4.5,
    location: "Boston, MA",
    description: "Classic library setting with vintage architecture.",
    image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    available: true,
    reviews: 34,
    specs: ["Classic Architecture", "Reading Rooms", "Natural Light"]
  }
];

const categories = ['Ballroom', 'Rooftop', 'Garden', 'Studio', 'Beach', 'Indoor', 'Outdoor'];

export const PhotoSpotsTab: React.FC<PhotoSpotsTabProps> = ({ onboardingData }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('available');
  const [selectedEventSpace, setSelectedEventSpace] = useState<any>(null);
  const [showEventSpaceDialog, setShowEventSpaceDialog] = useState(false);
  const { toast } = useToast();

  const getFilteredItems = () => {
    let items = eventSpaces;

    if (categoryFilter && categoryFilter !== 'all-categories') {
      items = items.filter(item => item.category === categoryFilter);
    }

    if (searchQuery) {
      items = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (availabilityFilter === 'available') {
      items = items.filter(item => item.available);
    }

    return items;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 p-4 bg-card rounded-lg border border-border">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search photo spots..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-categories">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={priceFilter} onValueChange={setPriceFilter}>
          <SelectTrigger className="w-48">
            <DollarSign className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Price Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="under-500">Under $500/day</SelectItem>
            <SelectItem value="500-1000">$500 - $1,000/day</SelectItem>
            <SelectItem value="1000-2000">$1,000 - $2,000/day</SelectItem>
            <SelectItem value="over-2000">Over $2,000/day</SelectItem>
          </SelectContent>
        </Select>

        <Select value={locationFilter} onValueChange={setLocationFilter}>
          <SelectTrigger className="w-48">
            <MapPin className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new-york">New York, NY</SelectItem>
            <SelectItem value="los-angeles">Los Angeles, CA</SelectItem>
            <SelectItem value="miami">Miami, FL</SelectItem>
            <SelectItem value="boston">Boston, MA</SelectItem>
            <SelectItem value="malibu">Malibu, CA</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={() => {
          setSearchQuery('');
          setCategoryFilter('all-categories');
          setPriceFilter('');
          setLocationFilter('');
        }}>
          <Filter className="h-4 w-4 mr-2" />
          Clear Filters
        </Button>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button
          variant={categoryFilter === 'all-categories' || categoryFilter === '' ? 'default' : 'outline'}
          onClick={() => setCategoryFilter('all-categories')}
          size="sm"
        >
          All
        </Button>
        {categories.map(category => (
          <Button
            key={category}
            variant={categoryFilter === category ? 'default' : 'outline'}
            onClick={() => setCategoryFilter(category)}
            size="sm"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Photo Spots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getFilteredItems().map((space) => (
          <EventSpaceCard 
            key={space.id} 
            space={space} 
            onViewDetails={(space) => {
              setSelectedEventSpace(space);
              setShowEventSpaceDialog(true);
            }}
          />
        ))}
      </div>

      {/* No Results */}
      {getFilteredItems().length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No photo spots found. Try adjusting your filters.</p>
          </CardContent>
        </Card>
      )}

      {/* Event Space Details Dialog */}
      <EventSpaceDetailsDialog
        eventSpace={selectedEventSpace}
        isOpen={showEventSpaceDialog}
        onClose={() => setShowEventSpaceDialog(false)}
        onBookNow={(spaceId) => {
          toast({
            title: "Booking Request Sent",
            description: `Your booking request for ${selectedEventSpace?.name} has been sent.`,
          });
          setShowEventSpaceDialog(false);
        }}
      />
    </div>
  );
};