import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EventSpaceCard } from '@/components/EventSpaceCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, MapPin, Star, DollarSign, ShoppingCart, Heart, Plus, Minus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProductDetailsDialog } from '@/components/ProductDetailsDialog';
import { EventSpaceDetailsDialog } from '@/components/EventSpaceDetailsDialog';
import { useToast } from '@/hooks/use-toast';

interface OnboardingData {
  eventDate: Date | undefined;
  location: string;
  serviceTypes: string[];
}

interface RentalsTabProps {
  onboardingData: OnboardingData | null;
}

// Mock rental data
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
  }
];

// Mock rental data
const rentalItems = [
  {
    id: 1,
    name: "Canon EOS R5",
    category: "Cameras",
    price: "$150/day",
    rating: 4.9,
    location: "New York, NY",
    description: "Professional mirrorless camera with 45MP sensor and 8K video recording.",
    image_url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
    available: true,
    reviews: 45,
    specs: ["45MP Full Frame", "8K Video", "5-axis Stabilization"]
  },
  {
    id: 2,
    name: "Sony A7S III",
    category: "Cameras",
    price: "$120/day",
    rating: 4.8,
    location: "Los Angeles, CA",
    description: "Full-frame mirrorless perfect for video with excellent low-light performance.",
    image_url: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd",
    available: true,
    reviews: 38,
    specs: ["12MP Full Frame", "4K Video", "Dual Base ISO"]
  },
  {
    id: 3,
    name: "DJI Mavic 3",
    category: "Drones",
    price: "$200/day",
    rating: 4.9,
    location: "San Francisco, CA",
    description: "Professional drone with Hasselblad camera and 5.1K video recording.",
    image_url: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108",
    available: true,
    reviews: 62,
    specs: ["Hasselblad Camera", "5.1K Video", "46min Flight Time"]
  },
  {
    id: 4,
    name: "Godox AD200 Pro",
    category: "Lighting",
    price: "$80/day",
    rating: 4.7,
    location: "Chicago, IL",
    description: "Portable flash system with 200Ws power and lithium battery.",
    image_url: "https://images.unsplash.com/photo-1519638399535-1b036603ac77",
    available: true,
    reviews: 29,
    specs: ["200Ws Power", "Lithium Battery", "TTL Compatible"]
  },
  {
    id: 5,
    name: "Sigma 85mm f/1.4",
    category: "Lenses",
    price: "$60/day",
    rating: 4.8,
    location: "Miami, FL",
    description: "Professional portrait lens with beautiful bokeh and sharp optics.",
    image_url: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35",
    available: false,
    reviews: 33,
    specs: ["f/1.4 Aperture", "Art Series", "HSM Autofocus"]
  },
  {
    id: 6,
    name: "Manfrotto Tripod",
    category: "Accessories",
    price: "$25/day",
    rating: 4.6,
    location: "Boston, MA",
    description: "Heavy-duty aluminum tripod with fluid head for smooth movements.",
    image_url: "https://images.unsplash.com/photo-1495707902641-75cac588d2e9",
    available: true,
    reviews: 21,
    specs: ["Aluminum Build", "Fluid Head", "Max Load 8kg"]
  }
];

export const RentalsTab: React.FC<RentalsTabProps> = ({ onboardingData }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('available');
  const [cart, setCart] = useState<{[key: number]: number}>({});
  const [showCart, setShowCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedEventSpace, setSelectedEventSpace] = useState<any>(null);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [showEventSpaceDialog, setShowEventSpaceDialog] = useState(false);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('rentals');

  const categories = ['Cameras', 'Lenses', 'Lighting', 'Drones', 'Accessories'];

  const getFilteredItems = () => {
    let items = activeTab === 'eventSpaces' ? eventSpaces : rentalItems;

    // Apply category filter (only for rentals)
    if (activeTab === 'rentals' && categoryFilter) {
      items = items.filter(item => item.category === categoryFilter);
    }

    // Apply search filter
    if (searchQuery) {
      items = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply availability filter
    if (availabilityFilter === 'available') {
      items = items.filter(item => item.available);
    }

    return items;
  };

  const addToCart = (itemId: number) => {
    setCart(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));
  };

  const removeFromCart = (itemId: number) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[itemId] > 1) {
        newCart[itemId]--;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };

  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0);
  };

  const renderFilters = () => (
    <div className="flex flex-wrap gap-4 p-4 bg-card rounded-lg border border-border">
      <div className="flex-1 min-w-64">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={activeTab === 'eventSpaces' ? "Search Find Your Photo Spot..." : "Search equipment..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {activeTab === 'rentals' && (
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Select value={priceFilter} onValueChange={setPriceFilter}>
        <SelectTrigger className="w-48">
          <DollarSign className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Price Range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="under-50">Under $50/day</SelectItem>
          <SelectItem value="50-100">$50 - $100/day</SelectItem>
          <SelectItem value="100-200">$100 - $200/day</SelectItem>
          <SelectItem value="over-200">Over $200/day</SelectItem>
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
          <SelectItem value="chicago">Chicago, IL</SelectItem>
          <SelectItem value="miami">Miami, FL</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" onClick={() => {
        setSearchQuery('');
        setCategoryFilter('');
        setPriceFilter('');
        setLocationFilter('');
      }}>
        <Filter className="h-4 w-4 mr-2" />
        Clear Filters
      </Button>
    </div>
  );

  type Item = {
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
  };

  const renderItemCard = (item: Item) => (
    activeTab === 'eventSpaces'
      ? <EventSpaceCard 
          key={item.id} 
          space={item} 
          onViewDetails={(space) => {
            setSelectedEventSpace(space);
            setShowEventSpaceDialog(true);
          }}
        />
      : (
        <Card key={item.id} className="group hover:shadow-medium transition-all duration-300 cursor-pointer"
              onClick={() => {
                setSelectedProduct({...item, images: [item.image_url]});
                setShowProductDialog(true);
              }}>
          <div className="relative">
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="absolute top-3 right-3">
              <Button
                variant="secondary"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  // Add to favorites logic
                }}
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>
            {!item.available && (
              <div className="absolute inset-0 bg-black/50 rounded-t-lg flex items-center justify-center">
                <Badge variant="destructive">Not Available</Badge>
              </div>
            )}
            {/* Always visible Add to Cart button */}
            <div className="absolute bottom-3 right-3">
              {/* <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(item.id);
                }}
                disabled={!item.available}
                className="opacity-90 hover:opacity-100"
              >
                <ShoppingCart className="h-3 w-3 mr-1" />
                Add to Cart
              </Button> */}
            </div>
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
              {item.specs.map((spec: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {spec}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
              <span className="flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                {item.location}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {cart[item.id] ? (
                <div className="flex items-center space-x-2 flex-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromCart(item.id);
                    }}
                    className="h-8 w-8 p-0"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="font-medium">{cart[item.id]}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(item.id);
                    }}
                    className="h-8 w-8 p-0"
                    disabled={!item.available}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <Button variant="secondary"
                  onClick={(e) => {
                  e.stopPropagation();
                  addToCart(item.id);
                }}
                  disabled={!item.available}
                  className="flex-1"
                  size="sm"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header with Cart */}
      <div className="flex items-center justify-between ">
        <div>
          <h2 className="text-2xl font-bold">{activeTab === 'eventSpaces' ? 'Find Your Photo Spot' : 'Equipment Rentals'}</h2>
          <p className="text-muted-foreground">{activeTab === 'eventSpaces' ? 'Find and book venues for your events' : 'Professional gear for your events'}</p>
        </div>
        
        {getTotalItems() > 0 && activeTab === 'rentals' && (
          <Button  className="fixed bottom-[2%] right-[2%] z-[60]" onClick={() => setShowCart(true)}>
            <ShoppingCart className="h-4 w-4 mr-2" />
            View Cart
            <Badge  className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
              {getTotalItems()}
            </Badge>
            </Button>
        )}
      </div>

      {/* Event Info */}
      {onboardingData && onboardingData.eventDate && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Rental Period</h3>
                <p className="text-sm text-muted-foreground">
                  Event Date: {onboardingData.eventDate.toLocaleDateString()}
                </p>
              </div>
              <Badge variant="outline">
                {onboardingData.location}
              </Badge>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Filters */}
      {renderFilters()}

      {/* Tabs for Rentals and Find Your Photo Spot */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
        <TabsList>
          <TabsTrigger value="rentals">Equipment Rentals</TabsTrigger>
          <TabsTrigger value="eventSpaces">Find Your Photo Spot</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Category Tabs for Rentals only */}
      {activeTab === 'rentals' && (
        <Tabs value={categoryFilter} onValueChange={setCategoryFilter}>
          <TabsList>
            <TabsTrigger value="">All Categories</TabsTrigger>
            {categories.map(category => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      {/* Items/Find Your Photo Spot Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getFilteredItems().map(renderItemCard)}
      </div>

      {/* No Results */}
      {getFilteredItems().length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">{activeTab === 'eventSpaces' ? 'No Find Your Photo Spot found. Try adjusting your filters.' : 'No equipment found. Try adjusting your filters.'}</p>
          </CardContent>
        </Card>
      )}
      {/* Cart Dialog */}
      <Dialog open={showCart} onOpenChange={setShowCart}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Cart</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {Object.keys(cart).length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Your cart is empty.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* List cart items */}
                {Object.entries(cart).map(([idStr, qty]) => {
                  const id = Number(idStr);
                  const item = [...rentalItems, ...eventSpaces].find(i => i.id === id) as Item | undefined;
                  if (!item) return null;

                  // parse mock price (e.g. "$150/day") to number
                  const priceNum = Number((item.price || '').replace(/[^0-9.]/g, '')) || 0;
                  return (
                    <div key={id} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center space-x-3">
                        <img src={item.image_url} alt={item.name} className="w-16 h-12 object-cover rounded" />
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">{item.category}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${(priceNum * qty).toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">{qty} x ${priceNum.toFixed(2)}</div>
                      </div>
                    </div>
                  );
                })}

                {/* Totals + Checkout */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-lg font-semibold">Total</div>
                  <div className="text-lg font-bold">
                    ${Object.entries(cart).reduce((sum, [idStr, qty]) => {
                      const id = Number(idStr);
                      const item = [...rentalItems, ...eventSpaces].find(i => i.id === id);
                      const priceNum = item ? Number((item.price || '').replace(/[^0-9.]/g, '')) || 0 : 0;
                      return sum + priceNum * qty;
                    }, 0).toFixed(2)}
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowCart(false)}>Continue Shopping</Button>
                  <Button onClick={() => {
                    // mock checkout
                    setCart({});
                    setShowCart(false);
                    toast({ title: 'Checkout complete', description: 'This is mock data — no payment was processed.' });
                  }}>Checkout</Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Product Details Dialog */}
      <ProductDetailsDialog
        product={selectedProduct}
        isOpen={showProductDialog}
        onClose={() => setShowProductDialog(false)}
        onAddToCart={(productId) => {
          addToCart(productId);
          toast({
            title: "Added to Cart",
            description: `${selectedProduct?.name} has been added to your cart.`,
          });
        }}
      />

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