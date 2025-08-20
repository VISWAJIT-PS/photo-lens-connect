import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, MapPin, Star, Clock, DollarSign, Heart, MessageCircle } from 'lucide-react';
import { CreatorCard } from '../CreatorCard';

interface OnboardingData {
  eventDate: Date | undefined;
  location: string;
  serviceTypes: string[];
}

interface WorksTabProps {
  onboardingData: OnboardingData | null;
  filter?: string | null;
}

// Mock data
const photographers = [
  {
    id: "7365f749-665d-409e-b765-c01bbf55463c",
    name: "David Park",
    specialization: "Nature & Landscape",
    rating: 4.9,
    reviews: 93,
    price: "$600-$1,200",
    location: "Seattle, WA",
    image_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    bio: "Passionate about capturing the beauty of nature and stunning landscapes.",
    portfolio_count: 67,
    experience_years: 7,
    availability: "Available",
    type: "photographer"
  },
  {
    id: "a3b38b34-e97f-46ae-87e2-60a578dcf777",
    name: "Sarah Johnson",
    specialization: "Wedding Photography",
    rating: 4.9,
    reviews: 127,
    price: "$2,500-$5,000",
    location: "New York, NY",
    image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
    bio: "Award-winning wedding photographer with 8 years of experience capturing beautiful moments.",
    portfolio_count: 45,
    experience_years: 8,
    availability: "Booked",
    type: "photographer"
  }
];

const videographers = [
  {
    id: "vid-001",
    name: "Alex Rodriguez",
    specialization: "Wedding Cinematography",
    rating: 4.8,
    reviews: 89,
    price: "$3,000-$8,000",
    location: "Los Angeles, CA",
    image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    bio: "Cinematic wedding videographer creating emotional stories that last a lifetime.",
    portfolio_count: 52,
    experience_years: 6,
    availability: "Available",
    type: "videographer"
  },
  {
    id: "vid-002",
    name: "Emma Chen",
    specialization: "Corporate Events",
    rating: 4.7,
    reviews: 74,
    price: "$1,500-$4,000",
    location: "San Francisco, CA",
    image_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    bio: "Professional corporate videographer specializing in conferences and company events.",
    portfolio_count: 38,
    experience_years: 5,
    availability: "Available",
    type: "videographer"
  }
];

const eventTeams = [
  {
    id: "event-001",
    name: "Premier Event Co.",
    specialization: "Full Service Events",
    rating: 4.9,
    reviews: 203,
    price: "$5,000-$25,000",
    location: "Miami, FL",
    image_url: "https://images.unsplash.com/photo-1511578314322-379afb476865",
    bio: "Complete event planning and execution for weddings, corporate events, and celebrations.",
    portfolio_count: 95,
    experience_years: 12,
    availability: "Available",
    type: "event_team"
  }
];

export const WorksTab: React.FC<WorksTabProps> = ({ onboardingData, filter }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // If filter prop is set, use it as the active filter
  React.useEffect(() => {
    if (filter && filter !== activeFilter) {
      setActiveFilter(filter);
    }
  }, [filter]);

  const allCreators = [...photographers, ...videographers, ...eventTeams];

  const getFilteredCreators = (type: string) => {
    let creators = allCreators;
    
    if (type !== 'all') {
      creators = creators.filter(creator => creator.type === type);
    }

    // Apply search filter
    if (searchQuery) {
      creators = creators.filter(creator =>
        creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply availability filter
    if (availabilityFilter) {
      creators = creators.filter(creator => creator.availability === availabilityFilter);
    }

    return creators;
  };

  const renderFilters = () => (
    <div className="flex flex-wrap gap-4 p-4 bg-card rounded-lg border border-border">
      <div className="flex-1 min-w-64">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search photographers, videographers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Select value={priceFilter} onValueChange={setPriceFilter}>
        <SelectTrigger className="w-48">
          <DollarSign className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Price Range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="under-1000">Under $1,000</SelectItem>
          <SelectItem value="1000-3000">$1,000 - $3,000</SelectItem>
          <SelectItem value="3000-5000">$3,000 - $5,000</SelectItem>
          <SelectItem value="over-5000">Over $5,000</SelectItem>
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
          <SelectItem value="san-francisco">San Francisco, CA</SelectItem>
          <SelectItem value="seattle">Seattle, WA</SelectItem>
          <SelectItem value="miami">Miami, FL</SelectItem>
        </SelectContent>
      </Select>

      <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
        <SelectTrigger className="w-48">
          <Clock className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Availability" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Available">Available</SelectItem>
          <SelectItem value="Booked">Booked</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" onClick={() => {
        setSearchQuery('');
        setPriceFilter('');
        setLocationFilter('');
        setAvailabilityFilter('');
      }}>
        <Filter className="h-4 w-4 mr-2" />
        Clear Filters
      </Button>
    </div>
  );

  const renderCreatorGrid = (creators: any[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {creators.map((creator) => (
        <CreatorCard key={creator.id} creator={creator} type={creator.type} />
      ))}
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header with Event Info */}
      {onboardingData && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Your Event Details</h3>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {onboardingData.location}
                  </span>
                  {onboardingData.eventDate && (
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {onboardingData.eventDate.toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {onboardingData.serviceTypes.map((type) => (
                  <Badge key={type} variant="secondary" className="text-xs">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Filters */}
      {renderFilters()}

      {/* Tabs */}
      <Tabs value={activeFilter} onValueChange={setActiveFilter}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({allCreators.length})</TabsTrigger>
          <TabsTrigger value="photographer">Photographers ({photographers.length})</TabsTrigger>
          <TabsTrigger value="videographer">Videographers ({videographers.length})</TabsTrigger>
          <TabsTrigger value="event_team">Event Teams ({eventTeams.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {renderCreatorGrid(getFilteredCreators('all'))}
        </TabsContent>

        <TabsContent value="photographer" className="mt-6">
          {renderCreatorGrid(getFilteredCreators('photographer'))}
        </TabsContent>

        <TabsContent value="videographer" className="mt-6">
          {renderCreatorGrid(getFilteredCreators('videographer'))}
        </TabsContent>

        <TabsContent value="event_team" className="mt-6">
          {renderCreatorGrid(getFilteredCreators('event_team'))}
        </TabsContent>
      </Tabs>

      {/* No Results */}
      {getFilteredCreators(activeFilter).length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No results found. Try adjusting your filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};