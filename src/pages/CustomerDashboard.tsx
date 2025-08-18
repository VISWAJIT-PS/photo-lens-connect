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
// import { usePhotographersStore } from "@/stores/photographers-store";
// import { useRentalsStore } from "@/stores/rentals-store";

const CustomerDashboard = () => {
  const { user, signOut } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");

    console.log(user);
    console.log(user?.user_metadata?.user_type);

  // Temporary static data until database is set up
  const [photographersLoading, setPhotographersLoading] = useState(false);
  const [rentalsLoading, setRentalsLoading] = useState(false);
  const photographers: any[] = [];
  const rentals: any[] = [];

  // Modal + filter state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<"photographers" | "rentals">("photographers");

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

  const openFiltersFor = (section: "photographers" | "rentals") => {
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

          <Tabs value={activeSection} onValueChange={(val) => setActiveSection(val as "photographers" | "rentals") }>
            <TabsList>
              <TabsTrigger value="photographers">Photographers</TabsTrigger>
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

        <Tabs value={activeSection} onValueChange={(val) => setActiveSection(val as "photographers" | "rentals")}>
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
                value="photographers"
                className="
                  px-8 py-3 text-lg md:text-xl lg:text-2xl font-semibold rounded-full mx-1
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
                value="rentals"
                className="
                  px-8 py-3 text-lg md:text-xl lg:text-2xl font-semibold rounded-full mx-1
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
              {photographersLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardHeader className="pb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-muted rounded-full"></div>
                          <div className="space-y-2">
                            <div className="h-4 bg-muted rounded w-32"></div>
                            <div className="h-3 bg-muted rounded w-24"></div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="h-3 bg-muted rounded w-20"></div>
                          <div className="h-3 bg-muted rounded w-16"></div>
                          <div className="h-8 bg-muted rounded"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : photographers.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                  <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Photographers Available</h3>
                  <p className="text-muted-foreground mb-4">Database not initialized. Please run the setup script.</p>
                  <Button variant="outline" onClick={() => window.location.reload()}>
                    Retry
                  </Button>
                </div>
              ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {photographers.map((photographer) => (
                      <Card key={photographer.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader className="pb-3">
                          <div className="flex items-center space-x-3">
                            <img
                              src={photographer.image_url || "/src/assets/hero-photographer.jpg"}
                              alt={photographer.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                              <CardTitle className="text-lg">{photographer.name}</CardTitle>
                              <p className="text-sm text-muted-foreground">{photographer.specialization}</p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{photographer.rating}</span>
                              <span className="text-sm text-muted-foreground">({photographer.reviews})</span>
                            </div>
                            <Badge variant="secondary">{photographer.price}</Badge>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground mb-4">
                            <MapPin className="h-4 w-4 mr-1" />
                            {photographer.location}
                          </div>
                          <Button className="w-full">
                            <Calendar className="h-4 w-4 mr-2" />
                            Book Now
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
              )}
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