import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, MapPin, Calendar, Star, Filter, Search, LogOut, Users } from "lucide-react";
import { Navigation } from "@/components/ui/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/stores/auth-store";
import { FullName } from "@/lib/utils";
import { CreatorCard } from "@/components/CreatorCard";

const CustomerDashboard = () => {
  const { user, signOut } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");

    console.log(user);
    console.log(user?.user_metadata?.user_type);

  // Temporary static data until database is set up
  const [photographersLoading, setPhotographersLoading] = useState(false);
  const [rentalsLoading, setRentalsLoading] = useState(false);
  
  const photographers = [
    {
      "id": "7365f749-665d-409e-b765-c01bbf55463c",
      "name": "David Park",
  "specialization": ["Nature & Landscape", "Outdoor Weddings"],
      "rating": 4.9,
      "reviews": 93,
      "price": "$600-$1,200",
      "location": "Seattle, WA",
      "image_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
      "bio": "Passionate about capturing the beauty of nature and stunning landscapes.",
      "portfolio_count": 67,
      "experience_years": 7,
      "user_id": null,
      "created_at": "2025-08-17T08:05:11.521632+00:00",
      "updated_at": "2025-08-17T08:05:11.521632+00:00"
    },
    {
      "id": "a3b38b34-e97f-46ae-87e2-60a578dcf777",
      "name": "Sarah Johnson",
  "specialization": ["Wedding Photography", "Candid"],
      "rating": 4.9,
      "reviews": 127,
      "price": "$2,500-$5,000",
      "location": "New York, NY",
      "image_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
      "bio": "Award-winning wedding photographer with 8 years of experience capturing beautiful moments.",
      "portfolio_count": 45,
      "experience_years": 8,
      "user_id": null,
      "created_at": "2025-08-17T08:05:11.521632+00:00",
      "updated_at": "2025-08-17T08:05:11.521632+00:00"
    },
    {
      "id": "269d8963-7b3f-4d27-8f82-0eed920ced59",
      "name": "Michael Chen",
  "specialization": ["Portrait Photography", "Headshots"],
      "rating": 4.8,
      "reviews": 89,
      "price": "$800-$1,500",
      "location": "San Francisco, CA",
      "image_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      "bio": "Specializing in professional headshots and family portraits with a modern touch.",
      "portfolio_count": 32,
      "experience_years": 6,
      "user_id": null,
      "created_at": "2025-08-17T08:05:11.521632+00:00",
      "updated_at": "2025-08-17T08:05:11.521632+00:00"
    },
    {
      "id": "cbd4feba-60a4-4045-9d43-1cfbecffa71a",
      "name": "Lisa Thompson",
  "specialization": ["Fashion Photography", "Editorial"],
      "rating": 4.8,
      "reviews": 74,
      "price": "$1,500-$4,000",
      "location": "Miami, FL",
      "image_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
      "bio": "High-end fashion and editorial photography for brands and magazines.",
      "portfolio_count": 54,
      "experience_years": 9,
      "user_id": null,
      "created_at": "2025-08-17T08:05:11.521632+00:00",
      "updated_at": "2025-08-17T08:05:11.521632+00:00"
    },
    {
      "id": "e667a310-5e7f-404c-9c69-ef5bb18e276c",
      "name": "Emma Rodriguez",
  "specialization": ["Event Photography", "Corporate"],
      "rating": 4.7,
      "reviews": 156,
      "price": "$1,200-$3,000",
      "location": "Los Angeles, CA",
      "image_url": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
      "bio": "Corporate events, parties, and special occasions captured with creativity and style.",
      "portfolio_count": 78,
      "experience_years": 10,
      "user_id": null,
      "created_at": "2025-08-17T08:05:11.521632+00:00",
      "updated_at": "2025-08-17T08:05:11.521632+00:00"
    }
  ];

  const videographers = [
    {
      "id": "v1-8f4c-4b2e-8a1b-3d5e6f7a8b9c",
      "name": "Alex Rivera",
  "specialization": ["Wedding Videography", "Cinematic"],
      "rating": 4.9,
      "reviews": 145,
      "price": "$3,000-$8,000",
      "location": "Austin, TX",
      "image_url": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
      "bio": "Cinematic wedding films that tell your unique love story with artistic flair.",
      "portfolio_count": 89,
      "experience_years": 12,
      "user_id": null,
      "created_at": "2025-08-17T08:05:11.521632+00:00",
      "updated_at": "2025-08-17T08:05:11.521632+00:00"
    },
    {
      "id": "v2-9a5b-4c3d-9b2c-4e6f7a8b9c0d",
      "name": "Jessica Wong",
  "specialization": ["Corporate Videography", "Promo"],
      "rating": 4.8,
      "reviews": 98,
      "price": "$2,000-$5,000",
      "location": "Portland, OR",
      "image_url": "https://images.unsplash.com/photo-1494790108755-2616b612b634",
      "bio": "Professional corporate videos, commercials, and brand storytelling.",
      "portfolio_count": 156,
      "experience_years": 8,
      "user_id": null,
      "created_at": "2025-08-17T08:05:11.521632+00:00",
      "updated_at": "2025-08-17T08:05:11.521632+00:00"
    },
    {
      "id": "v3-0c6d-5e4f-0c3d-5f7a8b9c0d1e",
      "name": "Carlos Martinez",
  "specialization": ["Music Video Production", "Live Concerts"],
      "rating": 4.7,
      "reviews": 67,
      "price": "$1,800-$4,500",
      "location": "Nashville, TN",
      "image_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      "bio": "Creative music videos and live performance recordings with dynamic cinematography.",
      "portfolio_count": 124,
      "experience_years": 10,
      "user_id": null,
      "created_at": "2025-08-17T08:05:11.521632+00:00",
      "updated_at": "2025-08-17T08:05:11.521632+00:00"
    }
  ];

  const rentals = [
    {
      "id": 1,
      "name": "Canon EOS R5",
      "category": "Cameras",
      "price": "$150/day",
      "rating": 4.9,
      "location": "New York, NY",
      "description": "Professional mirrorless camera with 45MP sensor and 8K video recording.",
      "image_url": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
      "owner_id": null,
      "available": true,
      "created_at": "2025-08-17T08:05:11.521632+00:00",
      "updated_at": "2025-08-17T08:05:11.521632+00:00"
    },
    {
      "id": 2,
      "name": "Sony A7S III",
      "category": "Cameras",
      "price": "$120/day",
      "rating": 4.8,
      "location": "Los Angeles, CA",
      "description": "Full-frame mirrorless perfect for video with excellent low-light performance.",
      "image_url": "https://images.unsplash.com/photo-1502920917128-1aa500764cbd",
      "owner_id": null,
      "available": true,
      "created_at": "2025-08-17T08:05:11.521632+00:00",
      "updated_at": "2025-08-17T08:05:11.521632+00:00"
    },
    {
      "id": 3,
      "name": "DJI Mavic 3",
      "category": "Drones",
      "price": "$200/day",
      "rating": 4.9,
      "location": "San Francisco, CA",
      "description": "Professional drone with Hasselblad camera and 5.1K video recording.",
      "image_url": "https://images.unsplash.com/photo-1527977966376-1c8408f9f108",
      "owner_id": null,
      "available": true,
      "created_at": "2025-08-17T08:05:11.521632+00:00",
      "updated_at": "2025-08-17T08:05:11.521632+00:00"
    },
    {
      "id": 4,
      "name": "Godox AD200 Pro",
      "category": "Lighting",
      "price": "$80/day",
      "rating": 4.7,
      "location": "Chicago, IL",
      "description": "Portable flash system with 200Ws power and lithium battery.",
      "image_url": "https://images.unsplash.com/photo-1519638399535-1b036603ac77",
      "owner_id": null,
      "available": true,
      "created_at": "2025-08-17T08:05:11.521632+00:00",
      "updated_at": "2025-08-17T08:05:11.521632+00:00"
    },
    {
      "id": 5,
      "name": "Sigma 85mm f/1.4",
      "category": "Lenses",
      "price": "$60/day",
      "rating": 4.8,
      "location": "Miami, FL",
      "description": "Professional portrait lens with beautiful bokeh and sharp optics.",
      "image_url": "https://images.unsplash.com/photo-1617005082133-548c4dd27f35",
      "owner_id": null,
      "available": true,
      "created_at": "2025-08-17T08:05:11.521632+00:00",
      "updated_at": "2025-08-17T08:05:11.521632+00:00"
    },
    {
      "id": 6,
      "name": "Manfrotto Tripod",
      "category": "Accessories",
      "price": "$25/day",
      "rating": 4.6,
      "location": "Boston, MA",
      "description": "Heavy-duty aluminum tripod with fluid head for smooth movements.",
      "image_url": "https://images.unsplash.com/photo-1495707902641-75cac588d2e9",
      "owner_id": null,
      "available": true,
      "created_at": "2025-08-17T08:05:11.521632+00:00",
      "updated_at": "2025-08-17T08:05:11.521632+00:00"
    }
  ];

  // Modal + filter state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<"all" | "photographers" | "videographers" | "rentals">("all");

  // Photographers filters
  const [photoLocation, setPhotoLocation] = useState("");
  const [photoType, setPhotoType] = useState("");
  const [photoMinRating, setPhotoMinRating] = useState(0);

  // Rentals filters
  const [rentalCategory, setRentalCategory] = useState("");
  const [rentalLocation, setRentalLocation] = useState("");
  const [rentalAvailableOnly, setRentalAvailableOnly] = useState(false);

  // Remove useEffect that fetches data since stores don't exist yet

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Search functionality will be implemented when database is ready
  };

  const openFiltersFor = (section: "all" | "photographers" | "videographers" | "rentals") => {
    setActiveSection(section);
    setIsFilterOpen(true);
  };

  const applyFilters = () => {
    // Filter functionality will be implemented when database is ready
    setIsFilterOpen(false);
  };

  const clearFilters = () => {
    // Reset all filter fields
    setPhotoLocation("");
    setPhotoType("");
    setPhotoMinRating(0);
    setRentalCategory("");
    setRentalLocation("");
    setRentalAvailableOnly(false);
    setIsFilterOpen(false);
  };


  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Filter Dialog (shared across sections) */}
      <Dialog open={isFilterOpen} onOpenChange={(open) => setIsFilterOpen(open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filters</DialogTitle>
          </DialogHeader>

          <Tabs value={activeSection} onValueChange={(val) => setActiveSection(val as "all" | "photographers" | "videographers" | "rentals") }>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="photographers">Photographers</TabsTrigger>
              <TabsTrigger value="videographers">Videographers</TabsTrigger>
              <TabsTrigger value="rentals">Rentals</TabsTrigger>
            </TabsList>

            <TabsContent value="photographers">
              <div className="space-y-4">
                <div>
                  <Label>Location</Label>
                  <Input value={photoLocation} onChange={(e) => setPhotoLocation(e.target.value)} placeholder="City or area" />
                </div>
                <div>
                  <Label>Photographer Type</Label>
                  <Select onValueChange={(val) => setPhotoType(val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wedding">Wedding</SelectItem>
                      <SelectItem value="portrait">Portrait</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="landscape">Landscape</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Minimum Rating</Label>
                  <Input type="number" value={photoMinRating || ""} onChange={(e) => setPhotoMinRating(Number(e.target.value || 0))} placeholder="e.g. 4" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="rentals">
              <div className="space-y-4">
                <div>
                  <Label>Category</Label>
                  <Select onValueChange={(val) => setRentalCategory(val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="camera">Camera</SelectItem>
                      <SelectItem value="lens">Lens</SelectItem>
                      <SelectItem value="lighting">Lighting</SelectItem>
                      <SelectItem value="accessory">Accessory</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Location</Label>
                  <Input value={rentalLocation} onChange={(e) => setRentalLocation(e.target.value)} placeholder="City or area" />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox checked={rentalAvailableOnly} onCheckedChange={(v) => setRentalAvailableOnly(Boolean(v))} />
                  <Label>Show available only</Label>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <div className="flex gap-2">
              <Button variant="outline" onClick={clearFilters}>Clear</Button>
              <Button onClick={applyFilters}>Apply</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add top padding to offset the fixed/overlapping Navigation so the heading isn’t hidden */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
      {/* Search Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Find Your Perfect Photographer</h1>
        <div className="flex gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
          placeholder="Search by location, photographer type, or event"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10"
          />
        </div>
        </div>
        </div>

        <Tabs value={activeSection} onValueChange={(val) => setActiveSection(val as "all" | "photographers" | "videographers" | "rentals")}>
          <div className="mb-6 flex items-center justify-center">
            {/* Neomorphic tab container */}
            <TabsList
              className="
                inline-flex p-2 rounded-full
                bg-[#e6eef9] dark:bg-[#0f1724]
                shadow-[6px_6px_16px_rgba(16,24,40,0.06),-6px_-6px_16px_rgba(255,255,255,0.9)]
                dark:shadow-[6px_6px_16px_rgba(0,0,0,0.6),-6px_-6px_16px_rgba(255,255,255,0.02)]
              "
            >
              <TabsTrigger
                value="all"
                className="
                  px-6 py-3 text-base md:text-lg font-semibold rounded-full mx-1
                  transition-all duration-200 ease-in-out
                  text-muted-foreground
                  data-[state=active]:text-primary
                  data-[state=active]:bg-[#f8fbff] dark:data-[state=active]:bg-[#0b1220]
                  data-[state=active]:shadow-[6px_6px_16px_rgba(16,24,40,0.08),-6px_-6px_16px_rgba(255,255,255,0.85)]
                  data-[state=active]:scale-105
                "
              >
                All
              </TabsTrigger>

              <TabsTrigger
                value="photographers"
                className="
                  px-6 py-3 text-base md:text-lg font-semibold rounded-full mx-1
                  transition-all duration-200 ease-in-out
                  text-muted-foreground
                  data-[state=active]:text-primary
                  data-[state=active]:bg-[#f8fbff] dark:data-[state=active]:bg-[#0b1220]
                  data-[state=active]:shadow-[6px_6px_16px_rgba(16,24,40,0.08),-6px_-6px_16px_rgba(255,255,255,0.85)]
                  data-[state=active]:scale-105
                "
              >
                Photographers
              </TabsTrigger>

              <TabsTrigger
                value="videographers"
                className="
                  px-6 py-3 text-base md:text-lg font-semibold rounded-full mx-1
                  transition-all duration-200 ease-in-out
                  text-muted-foreground
                  data-[state=active]:text-primary
                  data-[state=active]:bg-[#f8fbff] dark:data-[state=active]:bg-[#0b1220]
                  data-[state=active]:shadow-[6px_6px_16px_rgba(16,24,40,0.08),-6px_-6px_16px_rgba(255,255,255,0.85)]
                  data-[state=active]:scale-105
                "
              >
                Videographers
              </TabsTrigger>

              <TabsTrigger
                value="rentals"
                className="
                  px-6 py-3 text-base md:text-lg font-semibold rounded-full mx-1
                  transition-all duration-200 ease-in-out
                  text-muted-foreground
                  data-[state=active]:text-primary
                  data-[state=active]:bg-[#f8fbff] dark:data-[state=active]:bg-[#0b1220]
                  data-[state=active]:shadow-[6px_6px_16px_rgba(16,24,40,0.08),-6px_-6px_16px_rgba(255,255,255,0.85)]
                  data-[state=active]:scale-105
                "
              >
                Rentals
              </TabsTrigger>
            </TabsList>
            </div>

          <TabsContent value="all">
            {/* All Section - Both Photographers and Videographers */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">All Creators</h2>
                <div>
                  <Button variant="ghost" onClick={() => openFiltersFor("all")}>
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {photographers.map((photographer) => (
                  <CreatorCard key={photographer.id} creator={photographer} type="photographer" />
                ))}
                {videographers.map((videographer) => (
                  <CreatorCard key={videographer.id} creator={videographer} type="videographer" />
                ))}
              </div>
            </section>
          </TabsContent>

          <TabsContent value="photographers">
            {/* Photographers Section */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Featured Photographers</h2>
                <div>
                  <Button variant="ghost" onClick={() => openFiltersFor("photographers")}>
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {photographers.map((photographer) => (
                  <CreatorCard key={photographer.id} creator={photographer} type="photographer" />
                ))}
              </div>
            </section>
          </TabsContent>

          <TabsContent value="videographers">
            {/* Videographers Section */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Featured Videographers</h2>
                <div>
                  <Button variant="ghost" onClick={() => openFiltersFor("videographers")}>
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videographers.map((videographer) => (
                  <CreatorCard key={videographer.id} creator={videographer} type="videographer" />
                ))}
              </div>
            </section>
          </TabsContent>

          <TabsContent value="rentals">
            {/* Rentals Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Equipment Rentals</h2>
                <div>
                  <Button variant="ghost" onClick={() => openFiltersFor("rentals")}>
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </div>
              </div>
              {rentalsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardHeader className="pb-3">
                        <div className="space-y-2">
                          <div className="h-4 bg-muted rounded w-24"></div>
                          <div className="h-3 bg-muted rounded w-20"></div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="h-3 bg-muted rounded w-16"></div>
                          <div className="h-3 bg-muted rounded w-14"></div>
                          <div className="h-8 bg-muted rounded"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : rentals.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                  <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Rentals Available</h3>
                  <p className="text-muted-foreground mb-4">Database not initialized. Please run the setup script.</p>
                  <Button variant="outline" onClick={() => window.location.reload()}>
                    Retry
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {rentals.map((rental) => (
                    <Card key={rental.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">{rental.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{rental.category}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{rental.rating}</span>
                          </div>
                          <Badge variant="secondary">{rental.price}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">{rental.location}</p>
                        <Button className="w-full" variant="outline">
                          Rent Now
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CustomerDashboard;