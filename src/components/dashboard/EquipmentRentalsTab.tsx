import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter, MapPin, Star, DollarSign, ShoppingCart, Heart, Plus, Minus, Loader2, Calendar, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProductDetailsDialog } from '@/components/ProductDetailsDialog';
import { useToast } from '@/hooks/use-toast';
import { useRentals } from '@/hooks/use-rentals';
import { useCart } from '@/hooks/use-cart';

interface OnboardingData {
  eventDate: Date | undefined;
  location: string;
  serviceTypes: string[];
}

interface EquipmentRentalsTabProps {
  onboardingData: OnboardingData | null;
}

const categories = ['Cameras', 'Lenses', 'Lighting', 'Drones', 'Accessories', 'Audio', 'Stabilizers', 'Other'];

export const EquipmentRentalsTab: React.FC<EquipmentRentalsTabProps> = ({ onboardingData }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('available');
  const [showCart, setShowCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [rentalDate, setRentalDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const { toast } = useToast();

  // Use the cart hook
  const {
    cartItems,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartSummary,
    isLoading: cartLoading
  } = useCart();

  // Use the rentals hook with filters
  const { data: rentals, isLoading, error } = useRentals({
    category: categoryFilter || undefined,
    location: locationFilter || undefined,
    available: availabilityFilter === 'available' ? true : undefined,
  });

  const getFilteredItems = () => {
    if (!rentals) return [];

    let items = rentals;

    if (searchQuery) {
      items = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return items.map(rental => ({
      id: rental.id,
      name: rental.name,
      category: rental.category,
      price: rental.price,
      rating: rental.rating || 0,
      location: rental.location,
      description: rental.description || '',
      image_url: rental.image_url || '',
      available: rental.available || false,
      reviews: 0, // Would need to add reviews field to rentals table
      specs: [], // Would need to add specs field to rentals table
    }));
  };

  // Handle adding item to cart with date selection
  const handleAddToCart = (itemId: number) => {
    if (!rentalDate || !returnDate) {
      toast({
        title: 'Select Dates',
        description: 'Please select rental and return dates',
        variant: 'destructive'
      });
      return;
    }

    addToCart({
      rentalId: itemId,
      quantity: 1,
      rentalDate,
      returnDate
    });
  };

  // Get cart item quantity for a specific rental
  const getCartItemQuantity = (rentalId: number) => {
    const cartItem = cartItems.find(item => item.rental_id === rentalId);
    return cartItem?.quantity || 0;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Cart Button */}
      {getCartSummary().totalItems > 0 && (
        <Button className="fixed bottom-[2%] right-[2%] z-[60]" onClick={() => setShowCart(true)}>
          <ShoppingCart className="h-4 w-4 mr-2" />
          View Cart
          <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
            {getCartSummary().totalItems}
          </Badge>
        </Button>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4 p-4 bg-card rounded-lg border border-border">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search equipment..."
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

        {/* Date Selection */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Input
              type="date"
              className="w-40"
              placeholder="Rental Date"
              value={rentalDate}
              onChange={(e) => setRentalDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <span className="text-muted-foreground">to</span>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <Input
              type="date"
              className="w-40"
              placeholder="Return Date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              min={rentalDate || new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        <Button variant="outline" onClick={() => {
          setSearchQuery('');
          setCategoryFilter('all-categories');
          setPriceFilter('');
          setLocationFilter('');
          setRentalDate('');
          setReturnDate('');
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

      {/* Equipment Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading equipment...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getFilteredItems().map((item) => (
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
                {getCartItemQuantity(item.id) > 0 ? (
                  <div className="flex items-center space-x-2 flex-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        const cartItem = cartItems.find(ci => ci.rental_id === item.id);
                        if (cartItem) {
                          if (cartItem.quantity > 1) {
                            updateCartItem({
                              cartItemId: cartItem.id.toString(),
                              quantity: cartItem.quantity - 1,
                              rentalDate: cartItem.rental_date,
                              returnDate: cartItem.return_date
                            });
                          } else {
                            removeFromCart(cartItem.id.toString());
                          }
                        }
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="font-medium">{getCartItemQuantity(item.id)}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        const cartItem = cartItems.find(ci => ci.rental_id === item.id);
                        if (cartItem) {
                          updateCartItem({
                            cartItemId: cartItem.id.toString(),
                            quantity: cartItem.quantity + 1,
                            rentalDate: cartItem.rental_date,
                            returnDate: cartItem.return_date
                          });
                        }
                      }}
                      className="h-8 w-8 p-0"
                      disabled={!item.available}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(item.id);
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
        ))}
        </div>
      )}

      {/* No Results */}
      {getFilteredItems().length === 0 && !isLoading && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No equipment found. Try adjusting your filters.</p>
          </CardContent>
        </Card>
      )}

      {/* Cart Dialog */}
      <Dialog open={showCart} onOpenChange={setShowCart}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Equipment Cart</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Your cart is empty.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cartItems.map((cartItem) => {
                  const item = getFilteredItems().find(i => i.id === cartItem.rental_id);
                  if (!item) return null;

                  return (
                    <div key={cartItem.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center space-x-3">
                        <img src={item.image_url} alt={item.name} className="w-16 h-12 object-cover rounded" />
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">{item.category}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(cartItem.rental_date).toLocaleDateString()} - {new Date(cartItem.return_date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${cartItem.total_price.toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">Qty: {cartItem.quantity}</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(cartItem.id.toString())}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  );
                })}

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-lg font-semibold">Total</div>
                  <div className="text-lg font-bold">
                    ${getCartSummary().totalPrice.toFixed(2)}
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowCart(false)}>Continue Shopping</Button>
                  <Button onClick={() => {
                    clearCart();
                    setShowCart(false);
                    toast({ title: 'Cart cleared', description: 'All items have been removed from your cart.' });
                  }}>Clear Cart</Button>
                  <Button onClick={() => {
                    // TODO: Implement booking flow
                    toast({ title: 'Booking', description: 'Booking functionality will be implemented next.' });
                  }}>Proceed to Booking</Button>
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
          handleAddToCart(productId);
          toast({
            title: "Added to Cart",
            description: `${selectedProduct?.name} has been added to your cart.`,
          });
        }}
      />
    </div>
  );
};