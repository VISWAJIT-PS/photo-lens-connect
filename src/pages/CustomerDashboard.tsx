import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, MapPin, Calendar, Star, Filter, Search, LogOut } from "lucide-react";
import { Navigation } from "@/components/ui/navigation";

const CustomerDashboard = () => {
  const { user, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const photographers = [
    {
      id: 1,
      name: "Alex Johnson",
      specialization: "Wedding Photography",
      rating: 4.9,
      reviews: 127,
      price: "$150/hour",
      location: "New York, NY",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Sarah Chen",
      specialization: "Portrait & Event",
      rating: 4.8,
      reviews: 89,
      price: "$120/hour",
      location: "Los Angeles, CA",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b586?w=150&h=150&fit=crop&crop=face"
    }
  ];

  const rentals = [
    {
      id: 1,
      name: "Canon EOS R5",
      category: "DSLR Camera",
      price: "$75/day",
      rating: 4.7,
      location: "Available nearby"
    },
    {
      id: 2,
      name: "DJI Mavic Pro",
      category: "Drone",
      price: "$90/day",
      rating: 4.9,
      location: "Available nearby"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Camera className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">PhotoLens</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Welcome, {user?.email}</span>
              <Button variant="ghost" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">Find Your Perfect Photographer</h1>
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by location, photographer type, or event"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="px-6">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Photographers Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Top Photographers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photographers.map((photographer) => (
              <Card key={photographer.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src={photographer.image}
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
        </section>

        {/* Rentals Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Equipment Rentals</h2>
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
        </section>
      </div>
    </div>
  );
};

export default CustomerDashboard;