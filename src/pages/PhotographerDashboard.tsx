import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Calendar, DollarSign, Star, Upload, Settings, LogOut, Plus } from "lucide-react";
import { FullName } from "@/lib/utils";

const PhotographerDashboard = () => {
  const { user, signOut } = useAuth();

  console.log(user);
  const upcomingBookings = [
    {
      id: 1,
      client: "John & Sarah",
      type: "Wedding Photography",
      date: "2024-02-15",
      time: "2:00 PM",
      location: "Central Park, NYC",
      status: "confirmed"
    },
    {
      id: 2,
      client: "Tech Corp",
      type: "Corporate Event",
      date: "2024-02-18",
      time: "10:00 AM",
      location: "Manhattan Office",
      status: "pending"
    }
  ];

  const recentWork = [
    {
      id: 1,
      title: "Sunset Wedding",
      client: "Emma & Mike",
      date: "2024-01-20",
      rating: 5,
      earnings: "$1,200"
    },
    {
      id: 2,
      title: "Product Shoot",
      client: "Fashion Brand Co",
      date: "2024-01-18",
      rating: 4.8,
      earnings: "$800"
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
              <span className="text-sm text-muted-foreground">Welcome, {FullName(user)}</span>
              <Button variant="ghost">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="ghost" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Bookings</p>
                  <p className="text-2xl font-bold">24</p>
                </div>
                <Calendar className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">$3,200</p>
                </div>
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Rating</p>
                  <p className="text-2xl font-bold">4.9</p>
                </div>
                <Star className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Portfolio Views</p>
                  <p className="text-2xl font-bold">156</p>
                </div>
                <Camera className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="rentals">Rentals</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Upcoming Bookings</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Availability
              </Button>
            </div>
            <div className="space-y-4">
              {upcomingBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{booking.client}</h3>
                        <p className="text-muted-foreground">{booking.type}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                          <span>{booking.date}</span>
                          <span>{booking.time}</span>
                          <span>{booking.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>
                          {booking.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Portfolio Management</h2>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Upload Photos
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <Card key={item} className="overflow-hidden">
                  <div className="aspect-square bg-muted"></div>
                  <CardContent className="p-4">
                    <h3 className="font-medium">Photo Set {item}</h3>
                    <p className="text-sm text-muted-foreground">Wedding Collection</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rentals" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Equipment Rentals</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Equipment
              </Button>
            </div>
            <Card>
              <CardContent className="p-6 text-center">
                <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No equipment listed yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start earning extra income by renting out your photography equipment
                </p>
                <Button>List Your First Item</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earnings" className="space-y-6">
            <h2 className="text-2xl font-semibold">Recent Work & Earnings</h2>
            <div className="space-y-4">
              {recentWork.map((work) => (
                <Card key={work.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{work.title}</h3>
                        <p className="text-muted-foreground">{work.client}</p>
                        <p className="text-sm text-muted-foreground mt-1">{work.date}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1 mb-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{work.rating}</span>
                        </div>
                        <p className="font-semibold text-primary">{work.earnings}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PhotographerDashboard;