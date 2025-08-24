import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, MapPin, Star, DollarSign, Plus, Edit, Trash2, Camera, Calendar, User } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { EventSpaceDetailsDialog } from '@/components/EventSpaceDetailsDialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface PhotoSpot {
  id: number;
  name: string;
  category: string;
  price: string;
  rating: number;
  location: string;
  description: string;
  image_url: string;
  available: boolean;
  reviews: number;
  specs: string[];
  owner_id?: string;
}

// Mock photo spot data for photographer
const mockPhotoSpots: PhotoSpot[] = [
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
  }
];

// Mock photo spots data from other photographers for booking
const availablePhotoSpots = [
  {
    id: 201,
    name: "Grand Ballroom Studio",
    category: "Ballroom",
    price: "$2,000/day",
    rating: 4.9,
    location: "New York, NY",
    description: "Elegant ballroom for weddings and large events with professional lighting setup.",
    image_url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    available: true,
    reviews: 120,
    specs: ["Up to 500 guests", "Professional Lighting", "AV Equipment"],
    owner: {
      name: "Elena Rodriguez",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b3d8?w=64&h=64&fit=crop&crop=face",
      rating: 4.9,
      totalBookings: 85,
      specialty: "Wedding Photography"
    }
  },
  {
    id: 202,
    name: "Urban Rooftop Venue",
    category: "Rooftop",
    price: "$1,500/day",
    rating: 4.8,
    location: "Los Angeles, CA",
    description: "Modern rooftop space with stunning city views and golden hour lighting.",
    image_url: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca",
    available: true,
    reviews: 85,
    specs: ["Up to 200 guests", "City Views", "Sunset Access"],
    owner: {
      name: "Marcus Thompson",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
      rating: 4.8,
      totalBookings: 67,
      specialty: "Urban Photography"
    }
  },
  {
    id: 203,
    name: "Botanical Garden Pavilion",
    category: "Garden",
    price: "$1,200/day",
    rating: 4.7,
    location: "Miami, FL",
    description: "Beautiful garden pavilion surrounded by tropical plants and natural lighting.",
    image_url: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
    available: false,
    reviews: 60,
    specs: ["Up to 150 guests", "Natural Lighting", "Tropical Setting"],
    owner: {
      name: "Sofia Martinez",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
      rating: 4.7,
      totalBookings: 45,
      specialty: "Nature Photography"
    }
  },
  {
    id: 204,
    name: "Industrial Loft Studio",
    category: "Studio",
    price: "$800/day",
    rating: 4.6,
    location: "Brooklyn, NY",
    description: "Raw industrial loft space perfect for fashion and portrait photography.",
    image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64",
    available: true,
    reviews: 42,
    specs: ["High Ceilings", "Brick Walls", "Professional Lighting"],
    owner: {
      name: "James Wilson",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face",
      rating: 4.6,
      totalBookings: 38,
      specialty: "Fashion Photography"
    }
  },
  {
    id: 205,
    name: "Beachfront Paradise",
    category: "Beach",
    price: "$1,800/day",
    rating: 4.9,
    location: "Malibu, CA",
    description: "Pristine beachfront location with direct ocean access and sunset views.",
    image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    available: true,
    reviews: 98,
    specs: ["Ocean Views", "Beach Access", "Sunset Timing"],
    owner: {
      name: "Isabella Chen",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop&crop=face",
      rating: 4.9,
      totalBookings: 72,
      specialty: "Beach Photography"
    }
  },
  {
    id: 206,
    name: "Historic Library Hall",
    category: "Indoor",
    price: "$600/day",
    rating: 4.5,
    location: "Boston, MA",
    description: "Classic library setting with vintage architecture and natural lighting.",
    image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    available: true,
    reviews: 34,
    specs: ["Classic Architecture", "Natural Light", "Vintage Setting"],
    owner: {
      name: "Oliver Smith",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
      rating: 4.5,
      totalBookings: 28,
      specialty: "Portrait Photography"
    }
  }
];

const categories = ['Ballroom', 'Rooftop', 'Garden', 'Studio', 'Beach', 'Outdoor', 'Indoor'];

export function PhotographerPhotoSpots() {
  const [activeTab, setActiveTab] = useState('my-photo-spots');
  const [photoSpots, setPhotoSpots] = useState<PhotoSpot[]>(mockPhotoSpots);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('available');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<PhotoSpot | null>(null);
  const [selectedEventSpace, setSelectedEventSpace] = useState<any>(null);
  const [showEventSpaceDialog, setShowEventSpaceDialog] = useState(false);
  const { toast } = useToast();

  // Form states for add/edit modal
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    location: '',
    image_url: '',
    specs: '',
    available: true
  });

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      price: '',
      description: '',
      location: '',
      image_url: '',
      specs: '',
      available: true
    });
    setEditingItem(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newItem: PhotoSpot = {
      id: editingItem ? editingItem.id : Date.now(),
      name: formData.name,
      category: formData.category,
      price: formData.price,
      description: formData.description,
      location: formData.location,
      image_url: formData.image_url || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      available: formData.available,
      rating: editingItem ? editingItem.rating : 0,
      reviews: editingItem ? editingItem.reviews : 0,
      specs: formData.specs.split(',').map(s => s.trim()).filter(s => s.length > 0)
    };

    if (editingItem) {
      setPhotoSpots(prev => prev.map(item => item.id === editingItem.id ? newItem : item));
      toast({
        title: "Photo Spot Updated",
        description: `${newItem.name} has been updated successfully.`
      });
    } else {
      setPhotoSpots(prev => [...prev, newItem]);
      toast({
        title: "Photo Spot Added",
        description: `${newItem.name} has been added to your photo spot list.`
      });
    }

    setShowAddModal(false);
    resetForm();
  };

  const handleEdit = (item: PhotoSpot) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price,
      description: item.description,
      location: item.location,
      image_url: item.image_url,
      specs: item.specs.join(', '),
      available: item.available
    });
    setShowAddModal(true);
  };

  const handleDelete = (id: number) => {
    setPhotoSpots(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Photo Spot Removed",
      description: "Photo spot has been removed from your list."
    });
  };

  const toggleAvailability = (id: number) => {
    setPhotoSpots(prev => prev.map(item => 
      item.id === id ? { ...item, available: !item.available } : item
    ));
  };

  const getFilteredPhotoSpots = () => {
    let filtered = photoSpots;

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter && categoryFilter !== 'all-categories') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    return filtered;
  };

  const getFilteredAvailablePhotoSpots = () => {
    let items = availablePhotoSpots;

    if (categoryFilter && categoryFilter !== 'all-categories') {
      items = items.filter(item => item.category === categoryFilter);
    }

    if (searchQuery) {
      items = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.owner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.owner.specialty.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (availabilityFilter === 'available') {
      items = items.filter(item => item.available);
    }

    return items;
  };

  return (
    <div className="h-full p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Photo Spots Management</h1>
          <p className="text-muted-foreground">Manage your photo spots and book from other photographers</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-photo-spots" className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            My Photo Spots
          </TabsTrigger>
          <TabsTrigger value="book-photo-spots" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Book from Others
          </TabsTrigger>
        </TabsList>

        {/* Shared Filters */}
        <div className="flex flex-wrap gap-4 p-4 bg-card rounded-lg border border-border">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={activeTab === 'my-photo-spots' ? "Search photo spots..." : "Search photo spots or photographer..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48">
              <Camera className="h-4 w-4 mr-2" />
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-categories">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {activeTab === 'book-photo-spots' && (
            <>
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
            </>
          )}

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

        {/* Tab Content */}
        <TabsContent value="my-photo-spots" className="space-y-6">
          {/* Add Photo Spot Button */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">My Photo Spots</h2>
            <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
              <DialogTrigger asChild>
                <Button onClick={() => { resetForm(); setShowAddModal(true); }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Photo Spot
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingItem ? 'Edit Photo Spot' : 'Add New Photo Spot'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Spot Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Grand Ballroom"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Price per Day</Label>
                      <Input
                        id="price"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="e.g., $1,500/day"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="e.g., New York, NY"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Detailed description of the photo spot..."
                      rows={3}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="image_url">Image URL</Label>
                    <Input
                      id="image_url"
                      value={formData.image_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="specs">Features/Amenities (comma-separated)</Label>
                    <Input
                      id="specs"
                      value={formData.specs}
                      onChange={(e) => setFormData(prev => ({ ...prev, specs: e.target.value }))}
                      placeholder="e.g., Up to 500 guests, Catering Available, AV Equipment"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="available"
                      checked={formData.available}
                      onChange={(e) => setFormData(prev => ({ ...prev, available: e.target.checked }))}
                      className="rounded"
                    />
                    <Label htmlFor="available">Available for booking</Label>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingItem ? 'Update Photo Spot' : 'Add Photo Spot'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* My Photo Spots Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredPhotoSpots().map((item) => (
              <Card key={item.id} className="group hover:shadow-lg transition-all duration-300">
                <div className="relative">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  {!item.available && (
                    <div className="absolute inset-0 bg-black/50 rounded-t-lg flex items-center justify-center">
                      <Badge variant="destructive">Not Available</Badge>
                    </div>
                  )}
                </div>

                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <Badge variant="secondary" className="text-xs mt-1">{item.category}</Badge>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{item.price}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Star className="h-3 w-3 fill-current text-yellow-400 mr-1" />
                        {item.rating} ({item.reviews})
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.specs.slice(0, 2).map((spec: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                    {item.specs.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{item.specs.length - 2} more
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                    <span className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {item.location}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleAvailability(item.id)}
                      className="flex-1"
                    >
                      {item.available ? 'Mark Unavailable' : 'Mark Available'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results - My Photo Spots */}
          {getFilteredPhotoSpots().length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  {photoSpots.length === 0 
                    ? "No photo spots added yet. Start by adding your first photo spot."
                    : "No photo spots found. Try adjusting your filters."
                  }
                </p>
                {photoSpots.length === 0 && (
                  <Button onClick={() => { resetForm(); setShowAddModal(true); }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Photo Spot
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="book-photo-spots" className="space-y-6">
          <h2 className="text-xl font-semibold">Book Photo Spots from Other Photographers</h2>
          
          {/* Category Tabs for Booking */}
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

          {/* Available Photo Spots Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredAvailablePhotoSpots().map((spot) => (
              <Card key={spot.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer"
                    onClick={() => {
                      setSelectedEventSpace(spot);
                      setShowEventSpaceDialog(true);
                    }}>
                <div className="relative">
                  <img
                    src={spot.image_url}
                    alt={spot.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  {!spot.available && (
                    <div className="absolute inset-0 bg-black/50 rounded-t-lg flex items-center justify-center">
                      <Badge variant="destructive">Not Available</Badge>
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-primary/90 text-primary-foreground">
                      {spot.category}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{spot.name}</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        {spot.location}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{spot.price}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Star className="h-3 w-3 fill-current text-yellow-400 mr-1" />
                        {spot.rating} ({spot.reviews})
                      </div>
                    </div>
                  </div>

                  {/* Owner Info */}
                  <div className="flex items-center space-x-2 mb-3 p-2 bg-muted/50 rounded-md">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={spot.owner.avatar} alt={spot.owner.name} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{spot.owner.name}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Star className="h-3 w-3 fill-current text-yellow-400 mr-1" />
                        {spot.owner.rating} • {spot.owner.totalBookings} bookings
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {spot.owner.specialty}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {spot.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {spot.specs.slice(0, 2).map((spec: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                    {spot.specs.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{spot.specs.length - 2} more
                      </Badge>
                    )}
                  </div>

                  <Button 
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEventSpace(spot);
                      setShowEventSpaceDialog(true);
                    }}
                    disabled={!spot.available}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    {spot.available ? 'Book This Spot' : 'Unavailable'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results - Book Photo Spots */}
          {getFilteredAvailablePhotoSpots().length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No photo spots found. Try adjusting your filters.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Event Space Details Dialog */}
      <EventSpaceDetailsDialog
        eventSpace={selectedEventSpace}
        isOpen={showEventSpaceDialog}
        onClose={() => setShowEventSpaceDialog(false)}
        onBookNow={(spaceId) => {
          toast({
            title: "Booking Request Sent",
            description: `Your booking request for ${selectedEventSpace?.name} has been sent to ${selectedEventSpace?.owner?.name}.`,
          });
          setShowEventSpaceDialog(false);
        }}
      />
    </div>
  );
}