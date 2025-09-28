import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, MapPin, Clock, DollarSign, Settings, Edit, LocateIcon, Loader2 } from 'lucide-react';
import { CreatorCard } from '../CreatorCard';
import { usePhotographers } from '@/hooks/use-photographers';

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
  specialization: string | string[];
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
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

// All creators now come from the database photographers table
// We can filter by specialization to create different categories

export const WorksTab: React.FC<WorksTabProps> = ({ onboardingData, filter }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Use the photographers hook with filters
  const { data: photographers, isLoading, error } = usePhotographers({
    specialization: activeFilter !== 'all' ? activeFilter : undefined,
    location: locationFilter || undefined,
    minRating: 4.0,
  });

  useEffect(() => {
    if (filter && filter !== activeFilter) setActiveFilter(filter);
  }, [filter, activeFilter]);

  // Prefill filters from onboardingData (date & location)
  useEffect(() => {
    if (onboardingData) {
      if (onboardingData.location) {
        setLocationFilter(onboardingData.location);
      }
      if (onboardingData.eventDate) {
        try {
          const d = onboardingData.eventDate instanceof Date ? onboardingData.eventDate : new Date(onboardingData.eventDate as any);
          // format to yyyy-mm-dd for input[type=date]
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, '0');
          const dd = String(d.getDate()).padStart(2, '0');
          setDateFilter(`${yyyy}-${mm}-${dd}`);
        } catch (e) {
          // ignore invalid date
        }
      }
    }
  }, [onboardingData]);

  const getFilteredCreators = () => {
    if (!photographers) return [];

    let creators = photographers;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      creators = creators.filter((c) => {
        return (
          c.name.toLowerCase().includes(q) ||
          c.specialization.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q) ||
          (c.bio && c.bio.toLowerCase().includes(q))
        );
      });
    }

    if (locationFilter) {
      creators = creators.filter((c) => c.location.toLowerCase().includes(locationFilter.toLowerCase()));
    }

    // Add availability and type properties for compatibility with CreatorCard
    return creators.map(creator => ({
      ...creator,
      availability: 'Available', // Default availability
      type: 'photographer' as const, // All from photographers table
    }));
  };

  // Categorize photographers based on specialization
  const getPhotographersByCategory = () => {
    if (!photographers) return { photographers: [], videographers: [], eventTeams: [] };

    const photographersList = photographers.filter(p =>
      p.specialization.toLowerCase().includes('photography') ||
      p.specialization.toLowerCase().includes('portrait') ||
      p.specialization.toLowerCase().includes('wedding')
    );

    const videographersList = photographers.filter(p =>
      p.specialization.toLowerCase().includes('video') ||
      p.specialization.toLowerCase().includes('cinematography') ||
      p.specialization.toLowerCase().includes('film')
    );

    const eventTeamsList = photographers.filter(p =>
      p.specialization.toLowerCase().includes('event') ||
      p.specialization.toLowerCase().includes('planning') ||
      p.specialization.toLowerCase().includes('coordination')
    );

    return {
      photographers: photographersList,
      videographers: videographersList,
      eventTeams: eventTeamsList
    };
  };

  const { photographers: photoCreators, videographers, eventTeams } = getPhotographersByCategory();
  const allCreators = [...photoCreators, ...videographers, ...eventTeams];

  const renderFilters = () => (
    <div className="flex flex-wrap gap-4 p-4 bg-card rounded-lg border border-border">
      <div className="flex-1 min-w-64">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input placeholder="Search photographers, videographers..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>
      </div>

      {/* <Select value={priceFilter} onValueChange={setPriceFilter}>
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
      </Select> */}

      <Select value={locationFilter} onValueChange={setLocationFilter}>
        <SelectTrigger className="w-48">
          <MapPin className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Location" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Seattle, WA">Seattle, WA</SelectItem>
          <SelectItem value="New York, NY">New York, NY</SelectItem>
          <SelectItem value="Los Angeles, CA">Los Angeles, CA</SelectItem>
          <SelectItem value="Miami, FL">Miami, FL</SelectItem>
          <SelectItem value="San Francisco, CA">San Francisco, CA</SelectItem>
        </SelectContent>
      </Select>

      {/* Date Range Picker */}
      <div className="flex items-center space-x-2">
        {/* <label className="text-sm font-medium">Date Range:</label> */}
        <Input type="date" className="w-40" placeholder="From" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
        {/* <span className="text-muted-foreground">to</span>
        <Input type="date" className="w-40" placeholder="To" /> */}
      </div>

      <div className="ml-auto flex items-center gap-2">
  <Button variant="ghost" onClick={() => { setSearchQuery(''); setPriceFilter(''); setLocationFilter(''); setAvailabilityFilter(''); setDateFilter(''); }}>
          <Filter className="h-4 w-4 mr-2" />
          Clear
        </Button>
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
     

      {/* Filters */}
      {renderFilters()}

      {/* Tabs */}
      <Tabs value={activeFilter} onValueChange={setActiveFilter}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({allCreators.length})</TabsTrigger>
          <TabsTrigger value="photographer">Photographers ({photoCreators.length})</TabsTrigger>
          <TabsTrigger value="videographer">Videographers ({videographers.length})</TabsTrigger>
          <TabsTrigger value="event_team">Event Teams ({eventTeams.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading photographers...</span>
            </div>
          ) : (
            renderCreatorGrid(getFilteredCreators())
          )}
        </TabsContent>

        <TabsContent value="photographer" className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading photographers...</span>
            </div>
          ) : (
            renderCreatorGrid(getFilteredCreators().filter(c => c.type === 'photographer'))
          )}
        </TabsContent>

        <TabsContent value="videographer" className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading videographers...</span>
            </div>
          ) : videographers.length > 0 ? (
            renderCreatorGrid(videographers.map(creator => ({
              ...creator,
              availability: 'Available',
              type: 'videographer' as const,
            })))
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No videographers found matching your criteria.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="event_team" className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading event teams...</span>
            </div>
          ) : eventTeams.length > 0 ? (
            renderCreatorGrid(eventTeams.map(creator => ({
              ...creator,
              availability: 'Available',
              type: 'event_team' as const,
            })))
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No event teams found matching your criteria.</p>
              </CardContent>
            </Card>
          )}
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
                specialization: ['Traditional Japanese Weddings'],
                rating: 4.9,
                reviews: 156,
                price: '$2,000-$5,000',
                location: 'Tokyo, Japan',
                image_url: 'https://images.unsplash.com/photo-1642541724214-b0f12b7b50df',
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
                specialization: ['Destination Weddings'],
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
                specialization: ['Indian Wedding Events'],
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
              <div key={creator.id} className="relative pb-2">
                <CreatorCard creator={creator} type={creator.type} />
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Button variant="outline">View More International Creators</Button>
          </div>
        </CardContent>
      </Card>

      {/* No Results */}
      {getFilteredCreators().length === 0 && !isLoading && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No results found. Try adjusting your filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};