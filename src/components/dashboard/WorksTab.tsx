import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, MapPin, Clock, DollarSign, Settings, Edit } from 'lucide-react';
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

interface BaseCreator {
  id: string;
  name: string;
  specialization: string;
  rating: number;
  reviews: number;
  price: string;
  location: string;
  image_url: string;
  bio: string;
  portfolio_count: number;
  experience_years: number;
  availability: string;
  type: 'photographer' | 'videographer' | 'event_team';
}

// Mock data (kept small for the demo)
const photographers: BaseCreator[] = [
  {
    id: 'p1',
    name: 'David Park',
    specialization: 'Nature & Landscape',
    rating: 4.9,
    reviews: 93,
    price: '$600-$1,200',
    location: 'Seattle, WA',
    image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    bio: 'Passionate about capturing the beauty of nature and stunning landscapes.',
    portfolio_count: 67,
    experience_years: 7,
    availability: 'Available',
    type: 'photographer',
  },
  {
    id: 'p2',
    name: 'Sarah Johnson',
    specialization: 'Wedding Photography',
    rating: 4.9,
    reviews: 127,
    price: '$2,500-$5,000',
    location: 'New York, NY',
    image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    bio: 'Award-winning wedding photographer with 8 years of experience capturing beautiful moments.',
    portfolio_count: 45,
    experience_years: 8,
    availability: 'Booked',
    type: 'photographer',
  },
];

const videographers: BaseCreator[] = [
  {
    id: 'v1',
    name: 'Alex Rodriguez',
    specialization: 'Wedding Cinematography',
    rating: 4.8,
    reviews: 89,
    price: '$3,000-$8,000',
    location: 'Los Angeles, CA',
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    bio: 'Cinematic wedding videographer creating emotional stories that last a lifetime.',
    portfolio_count: 52,
    experience_years: 6,
    availability: 'Available',
    type: 'videographer',
  },
  {
    id: 'v2',
    name: 'Emma Chen',
    specialization: 'Corporate Events',
    rating: 4.7,
    reviews: 74,
    price: '$1,500-$4,000',
    location: 'San Francisco, CA',
    image_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    bio: 'Professional corporate videographer specializing in conferences and company events.',
    portfolio_count: 38,
    experience_years: 5,
    availability: 'Available',
    type: 'videographer',
  },
];

const eventTeams: BaseCreator[] = [
  {
    id: 'e1',
    name: 'Premier Event Co.',
    specialization: 'Full Service Events',
    rating: 4.9,
    reviews: 203,
    price: '$5,000-$25,000',
    location: 'Miami, FL',
    image_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865',
    bio: 'Complete event planning and execution for weddings, corporate events, and celebrations.',
    portfolio_count: 95,
    experience_years: 12,
    availability: 'Available',
    type: 'event_team',
  },
];

export const WorksTab: React.FC<WorksTabProps> = ({ onboardingData, filter }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    if (filter && filter !== activeFilter) setActiveFilter(filter);
  }, [filter, activeFilter]);

  const allCreators = [...photographers, ...videographers, ...eventTeams];

  const getFilteredCreators = (type: string) => {
    let creators = allCreators;

    if (type !== 'all') {
      creators = creators.filter((c) => c.type === type);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      creators = creators.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.specialization.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q)
      );
    }

    if (availabilityFilter) {
      creators = creators.filter((c) => c.availability === availabilityFilter);
    }

    if (priceFilter) {
      creators = creators.filter((c) => c.price.toLowerCase().includes(priceFilter.toLowerCase()));
    }

    if (locationFilter) {
      creators = creators.filter((c) => c.location.toLowerCase().includes(locationFilter.toLowerCase()));
    }

    return creators;
  };

  const renderFilters = () => (
    <div className="flex flex-wrap gap-4 p-4 bg-card rounded-lg border border-border">
      <div className="flex-1 min-w-64">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input placeholder="Search photographers, videographers..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
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
          <SelectItem value="seattle">Seattle, WA</SelectItem>
          <SelectItem value="new-york">New York, NY</SelectItem>
          <SelectItem value="los-angeles">Los Angeles, CA</SelectItem>
          <SelectItem value="miami">Miami, FL</SelectItem>
          <SelectItem value="san-francisco">San Francisco, CA</SelectItem>
        </SelectContent>
      </Select>

      {/* Date Range Picker */}
      <div className="flex items-center space-x-2">
        <label className="text-sm font-medium">Date Range:</label>
        <Input type="date" className="w-40" placeholder="From" />
        <span className="text-muted-foreground">to</span>
        <Input type="date" className="w-40" placeholder="To" />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" onClick={() => { setSearchQuery(''); setPriceFilter(''); setLocationFilter(''); setAvailabilityFilter(''); }}>
          <Filter className="h-4 w-4 mr-2" />
          Clear
        </Button>
        <Button variant="default" onClick={() => { /* placeholder for advanced */ }}>
          <Filter className="h-4 w-4 mr-2" />
          Advanced
        </Button>
      </div>
    </div>
  );

  const renderCreatorGrid = (creators: BaseCreator[]) => (
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
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <div className='flex flex-row gap-2'>
                  <h3 className="font-semibold">Your Event Details</h3>
                  {onboardingData.serviceTypes.map((type) => (
                    <Badge key={type} variant="secondary" className="text-xs">
                      {type}
                    </Badge>
                  ))}
                </div>
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
              
                {/* Desktop Floating Action Button moved here from MainDashboard */}
                <div className="ml-2">
                  <Button
                    variant="default"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg rounded-full  p-4 flex items-center justify-center"
                    onClick={() => window.dispatchEvent(new CustomEvent('open-onboarding'))}
                    aria-label="Edit Preferences"
                  >
                    Edit Preferences
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
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

      {/* Far Locations Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>
            {activeFilter === 'photographer' ? 'Photographers Far From Location' :
             activeFilter === 'videographer' ? 'Videographers Far From Location' :
             activeFilter === 'event_team' ? 'Event Teams Far From Location' :
             'Events, Photographers & Videographers from Far Locations'}
          </CardTitle>
          <p className="text-muted-foreground">Discover talented creators from other cities and regions</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                id: 'remote-1',
                name: 'Tokyo Wedding Studio',
                specialization: 'Traditional Japanese Weddings',
                rating: 4.9,
                reviews: 156,
                price: '$2,000-$5,000',
                location: 'Tokyo, Japan',
                image_url: 'https://images.unsplash.com/photo-1528195674353-7b4b5b0dad52',
                bio: 'Specializing in traditional Japanese wedding ceremonies with modern photography techniques.',
                portfolio_count: 89,
                experience_years: 12,
                availability: 'Available',
                type: 'photographer' as const,
                distance: '6,200 miles away'
              },
              {
                id: 'remote-2',
                name: 'European Event Films',
                specialization: 'Destination Weddings',
                rating: 4.8,
                reviews: 203,
                price: '$3,500-$8,000',
                location: 'Paris, France',
                image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
                bio: 'Creating cinematic wedding films across Europe for couples seeking luxury destination events.',
                portfolio_count: 67,
                experience_years: 8,
                availability: 'Available',
                type: 'videographer' as const,
                distance: '3,600 miles away'
              },
              {
                id: 'remote-3',
                name: 'Mumbai Celebrations Co.',
                specialization: 'Indian Wedding Events',
                rating: 4.9,
                reviews: 284,
                price: '$1,500-$4,000',
                location: 'Mumbai, India',
                image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
                bio: 'Full-service Indian wedding planning and photography with traditional ceremonies expertise.',
                portfolio_count: 145,
                experience_years: 15,
                availability: 'Available',
                type: 'event_team' as const,
                distance: '8,000 miles away'
              }
            ].map((creator) => (
              <div key={creator.id} className="relative">
                <CreatorCard creator={creator} type={creator.type} />
                <Badge variant="outline" className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm">
                  📍 {creator.distance}
                </Badge>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Button variant="outline">View More International Creators</Button>
          </div>
        </CardContent>
      </Card>

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