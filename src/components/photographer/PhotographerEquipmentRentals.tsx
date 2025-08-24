import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, MapPin, Star, DollarSign, Plus, Edit, Trash2, Package, ShoppingCart, Heart, Minus, Camera, User } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ProductDetailsDialog } from '@/components/ProductDetailsDialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface EquipmentItem {
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
  owner?: {
    name: string;
    avatar: string;
    rating: number;
    totalRentals: number;
  };
}

// Mock equipment data for photographer's own equipment
const mockEquipment: EquipmentItem[] = [
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
  }
];

// Mock equipment data from other photographers
const availableEquipment = [
  {
    id: 101,
    name: "Canon EOS R6",
    category: "Cameras",
    price: "$130/day",
    rating: 4.8,
    location: "New York, NY",
    description: "Professional mirrorless camera with excellent low-light performance.",
    image_url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
    available: true,
    reviews: 35,
    specs: ["20MP Full Frame", "4K Video", "In-body Stabilization"],
    owner: {
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b3d8?w=64&h=64&fit=crop&crop=face",
      rating: 4.8,
      totalRentals: 120
    }
  },
  {
    id: 102,
    name: "Sony FX3",
    category: "Cameras",
    price: "$180/day",
    rating: 4.9,
    location: "Los Angeles, CA",
    description: "Cinema camera with full-frame sensor perfect for video production.",
    image_url: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd",
    available: true,
    reviews: 42,
    specs: ["Full Frame", "Cinema Quality", "S-Log3"],
    owner: {
      name: "Mike Chen",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
      rating: 4.9,
      totalRentals: 98
    }
  },
  {
    id: 103,
    name: "DJI Mini 3 Pro",
    category: "Drones",
    price: "$120/day",
    rating: 4.7,
    location: "San Francisco, CA",
    description: "Compact drone with 4K camera and intelligent features.",
    image_url: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108",
    available: true,
    reviews: 28,
    specs: ["4K Camera", "34min Flight Time", "Obstacle Avoidance"],
    owner: {
      name: "Alex Rivera",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
      rating: 4.7,
      totalRentals: 76
    }
  },
  {
    id: 104,
    name: "Profoto B10",
    category: "Lighting",
    price: "$100/day",
    rating: 4.8,
    location: "Chicago, IL",
    description: "Portable studio flash with modeling light and wireless control.",
    image_url: "https://images.unsplash.com/photo-1519638399535-1b036603ac77",
    available: true,
    reviews: 31,
    specs: ["250Ws Power", "Wireless Control", "Modeling Light"],
    owner: {
      name: "Jessica Liu",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
      rating: 4.6,
      totalRentals: 54
    }
  }
];

const categories = ['Cameras', 'Lenses', 'Lighting', 'Drones', 'Accessories'];

export function PhotographerEquipmentRentals() {
  const [equipment, setEquipment] = useState<EquipmentItem[]>(mockEquipment);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<EquipmentItem | null>(null);
  const [activeTab, setActiveTab] = useState('my-equipment');
  
  // Cart and marketplace states
  const [cart, setCart] = useState<{[key: number]: number}>({});
  const [showCart, setShowCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showProductDialog, setShowProductDialog] = useState(false);
  
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
    
    const newItem: EquipmentItem = {
      id: editingItem ? editingItem.id : Date.now(),
      name: formData.name,
      category: formData.category,
      price: formData.price,
      description: formData.description,
      location: formData.location,
      image_url: formData.image_url || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32',
      available: formData.available,
      rating: editingItem ? editingItem.rating : 0,
      reviews: editingItem ? editingItem.reviews : 0,
      specs: formData.specs.split(',').map(s => s.trim()).filter(s => s.length > 0)
    };

    if (editingItem) {
      setEquipment(prev => prev.map(item => item.id === editingItem.id ? newItem : item));
      toast({
        title: "Equipment Updated",
        description: `${newItem.name} has been updated successfully.`
      });
    } else {
      setEquipment(prev => [...prev, newItem]);
      toast({
        title: "Equipment Added",
        description: `${newItem.name} has been added to your rental list.`
      });
    }

    setShowAddModal(false);
    resetForm();
  };

  const handleEdit = (item: EquipmentItem) => {
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
    setEquipment(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Equipment Removed",
      description: "Equipment has been removed from your rental list."
    });
  };

  const toggleAvailability = (id: number) => {
    setEquipment(prev => prev.map(item => 
      item.id === id ? { ...item, available: !item.available } : item
    ));
  };

  // Cart functions for marketplace
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

  const getFilteredEquipment = () => {
    let filtered = activeTab === 'my-equipment' ? equipment : availableEquipment;

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (activeTab === 'rent-equipment' && item.owner?.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (categoryFilter && categoryFilter !== 'all-categories') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    return filtered;
  };

  return (
    <div className="h-full p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Equipment Management</h1>
          <p className="text-muted-foreground">Manage your equipment and rent from other photographers</p>
        </div>
      </div>

      {/* Cart Button for Rent Equipment Tab */}
      {getTotalItems() > 0 && activeTab === 'rent-equipment' && (
        <Button className="fixed bottom-[2%] right-[2%] z-[60]" onClick={() => setShowCart(true)}>
          <ShoppingCart className="h-4 w-4 mr-2" />
          View Cart
          <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
            {getTotalItems()}
          </Badge>
        </Button>
      )}

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-equipment" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            My Equipment
          </TabsTrigger>
          <TabsTrigger value="rent-equipment" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Rent from Others
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-equipment" className="space-y-6">         

          {/* Shared Filters */}
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
                <Package className="h-4 w-4 mr-2" />
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-categories">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={() => {
              setSearchQuery('');
              setCategoryFilter('all-categories');
            }}>
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">My Equipment</h2>
              <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
                <DialogTrigger asChild>
                  <Button onClick={() => { resetForm(); setShowAddModal(true); }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Equipment
                  </Button>
                </DialogTrigger>
                {/* Add Equipment Modal Content */}
                <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingItem ? 'Edit Equipment' : 'Add New Equipment'}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* ... existing form fields ... */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Equipment Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., Canon EOS R5"
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
                          placeholder="e.g., $150/day"
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
                        placeholder="Detailed description of the equipment..."
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
                      <Label htmlFor="specs">Specifications (comma-separated)</Label>
                      <Input
                        id="specs"
                        value={formData.specs}
                        onChange={(e) => setFormData(prev => ({ ...prev, specs: e.target.value }))}
                        placeholder="e.g., 45MP Full Frame, 8K Video, 5-axis Stabilization"
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
                      <Label htmlFor="available">Available for rental</Label>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        {editingItem ? 'Update Equipment' : 'Add Equipment'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          {/* My Equipment Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredEquipment().map((item) => (
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

          {/* No Results for My Equipment */}
          {getFilteredEquipment().length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  {equipment.length === 0 
                    ? "No equipment added yet. Start by adding your first equipment."
                    : "No equipment found. Try adjusting your filters."
                  }
                </p>
                {equipment.length === 0 && (
                  <Button onClick={() => { resetForm(); setShowAddModal(true); }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Equipment
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="rent-equipment" className="space-y-6">
          {/* Shared Filters */}
          <div className="flex flex-wrap gap-4 p-4 bg-card rounded-lg border border-border">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search equipment or photographer..."
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

            <Button variant="outline" onClick={() => {
              setSearchQuery('');
              setCategoryFilter('all-categories');
            }}>
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>

          {/* Marketplace Equipment Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredEquipment().map((item) => (
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

                  {/* Owner Info */}
                  <div className="flex items-center space-x-2 mb-3 p-2 bg-muted/50 rounded-md">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={item.owner?.avatar} alt={item.owner?.name} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.owner?.name}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Star className="h-3 w-3 fill-current text-yellow-400 mr-1" />
                        {item.owner?.rating} • {item.owner?.totalRentals} rentals
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
            ))}
          </div>

          {/* No Results for Rent Equipment */}
          {getFilteredEquipment().length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No equipment found. Try adjusting your filters.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Cart Dialog */}
      <Dialog open={showCart} onOpenChange={setShowCart}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Rental Cart</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {Object.keys(cart).length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Your cart is empty.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(cart).map(([idStr, qty]) => {
                  const id = Number(idStr);
                  const item = availableEquipment.find(i => i.id === id);
                  if (!item) return null;

                  const priceNum = Number((item.price || '').replace(/[^0-9.]/g, '')) || 0;
                  return (
                    <div key={id} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center space-x-3">
                        <img src={item.image_url} alt={item.name} className="w-16 h-12 object-cover rounded" />
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">{item.category} • {item.owner?.name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${(priceNum * qty).toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">{qty} x ${priceNum.toFixed(2)}</div>
                      </div>
                    </div>
                  );
                })}

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-lg font-semibold">Total</div>
                  <div className="text-lg font-bold">
                    ${Object.entries(cart).reduce((sum, [idStr, qty]) => {
                      const id = Number(idStr);
                      const item = availableEquipment.find(i => i.id === id);
                      const priceNum = item ? Number((item.price || '').replace(/[^0-9.]/g, '')) || 0 : 0;
                      return sum + priceNum * qty;
                    }, 0).toFixed(2)}
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowCart(false)}>Continue Browsing</Button>
                  <Button onClick={() => {
                    setCart({});
                    setShowCart(false);
                    toast({ 
                      title: 'Rental Request Sent', 
                      description: 'Your rental requests have been sent to the equipment owners.' 
                    });
                  }}>Send Rental Requests</Button>
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
            description: `${selectedProduct?.name} has been added to your rental cart.`,
          });
        }}
      />
    </div>
  );
}