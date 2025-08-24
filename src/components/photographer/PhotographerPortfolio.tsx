import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Upload, Edit, Trash2, Eye, Plus, Camera, Star, MapPin, Package, DollarSign, Clock, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock portfolio data
const portfolioPhotos = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800",
    title: "Romantic Wedding Ceremony",
    description: "Beautiful outdoor wedding ceremony captured during golden hour",
    category: "Wedding",
    tags: ["wedding", "outdoor", "golden hour", "ceremony"],
    uploadDate: "2024-01-15",
    views: 156,
    likes: 42
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
    title: "Corporate Executive Portrait",
    description: "Professional headshot for corporate executive",
    category: "Portrait",
    tags: ["portrait", "corporate", "professional", "headshot"],
    uploadDate: "2024-01-10",
    views: 89,
    likes: 23
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=800",
    title: "Product Photography Session",
    description: "Clean and modern product photography for e-commerce",
    category: "Product",
    tags: ["product", "commercial", "clean", "modern"],
    uploadDate: "2024-01-08",
    views: 134,
    likes: 31
  }
];

const categories = ["All", "Wedding", "Portrait", "Product", "Event", "Fashion"];

// Mock portfolio packages data
const portfolioPackages = [
  {
    id: 1,
    name: "Wedding Essential",
    description: "Complete wedding photography package with all essential services",
    price: 2500,
    duration: "8 hours",
    deliverables: ["500+ edited photos", "Online gallery", "USB drive", "2 photographers"],
    features: ["Engagement session", "Bridal preparation", "Ceremony coverage", "Reception coverage"],
    category: "Wedding",
    isActive: true,
    bookings: 12
  },
  {
    id: 2,
    name: "Corporate Headshots",
    description: "Professional headshot package for corporate teams",
    price: 800,
    duration: "2 hours",
    deliverables: ["50 edited photos", "High-res files", "LinkedIn optimized versions"],
    features: ["Studio setup", "Professional lighting", "Multiple outfit changes"],
    category: "Portrait",
    isActive: true,
    bookings: 8
  },
  {
    id: 3,
    name: "Product Showcase",
    description: "E-commerce product photography with multiple angles",
    price: 600,
    duration: "4 hours",
    deliverables: ["100+ product shots", "White background versions", "Lifestyle shots"],
    features: ["Professional lighting setup", "Multiple angles", "Detail shots"],
    category: "Product",
    isActive: false,
    bookings: 5
  }
];

export function PhotographerPortfolio() {
  const [photos, setPhotos] = useState(portfolioPhotos);
  const [packages, setPackages] = useState(portfolioPackages);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [editingPhoto, setEditingPhoto] = useState<any>(null);
  const [editingPackage, setEditingPackage] = useState<any>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showPackageDialog, setShowPackageDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("photos");
  const [newPhoto, setNewPhoto] = useState({
    title: '',
    description: '',
    category: 'Wedding',
    tags: '',
    url: ''
  });
  const [newPackage, setNewPackage] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    deliverables: '',
    features: '',
    category: 'Wedding'
  });
  const { toast } = useToast();

  const filteredPhotos = selectedCategory === "All" 
    ? photos 
    : photos.filter(photo => photo.category === selectedCategory);

  const handleUploadPhoto = () => {
    if (!newPhoto.title || !newPhoto.url) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const photo = {
      id: Date.now(),
      ...newPhoto,
      tags: newPhoto.tags.split(',').map(tag => tag.trim()),
      uploadDate: new Date().toISOString().split('T')[0],
      views: 0,
      likes: 0
    };

    setPhotos([...photos, photo]);
    setNewPhoto({ title: '', description: '', category: 'Wedding', tags: '', url: '' });
    setShowUploadDialog(false);
    
    toast({
      title: "Success",
      description: "Photo added to portfolio"
    });
  };

  const handleEditPhoto = (photo: any) => {
    setEditingPhoto(photo);
  };

  const handleSaveEdit = () => {
    setPhotos(photos.map(photo => 
      photo.id === editingPhoto.id ? editingPhoto : photo
    ));
    setEditingPhoto(null);
    
    toast({
      title: "Success",
      description: "Photo updated successfully"
    });
  };

  const handleDeletePhoto = (photoId: number) => {
    setPhotos(photos.filter(photo => photo.id !== photoId));
    
    toast({
      title: "Success",
      description: "Photo removed from portfolio"
    });
  };

  const handleCreatePackage = () => {
    if (!newPackage.name || !newPackage.price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const packageData = {
      id: Date.now(),
      ...newPackage,
      price: parseFloat(newPackage.price),
      deliverables: newPackage.deliverables.split('\n').filter(item => item.trim()),
      features: newPackage.features.split('\n').filter(item => item.trim()),
      isActive: true,
      bookings: 0
    };

    setPackages([...packages, packageData]);
    setNewPackage({ name: '', description: '', price: '', duration: '', deliverables: '', features: '', category: 'Wedding' });
    setShowPackageDialog(false);
    
    toast({
      title: "Success",
      description: "Package created successfully"
    });
  };

  const handleEditPackage = (pkg: any) => {
    setEditingPackage({
      ...pkg,
      price: pkg.price.toString(),
      deliverables: pkg.deliverables.join('\n'),
      features: pkg.features.join('\n')
    });
  };

  const handleSavePackageEdit = () => {
    const updatedPackage = {
      ...editingPackage,
      price: parseFloat(editingPackage.price),
      deliverables: editingPackage.deliverables.split('\n').filter((item: string) => item.trim()),
      features: editingPackage.features.split('\n').filter((item: string) => item.trim())
    };

    setPackages(packages.map(pkg => 
      pkg.id === editingPackage.id ? updatedPackage : pkg
    ));
    setEditingPackage(null);
    
    toast({
      title: "Success",
      description: "Package updated successfully"
    });
  };

  const handleDeletePackage = (packageId: number) => {
    setPackages(packages.filter(pkg => pkg.id !== packageId));
    
    toast({
      title: "Success",
      description: "Package removed successfully"
    });
  };

  const togglePackageStatus = (packageId: number) => {
    setPackages(packages.map(pkg => 
      pkg.id === packageId ? { ...pkg, isActive: !pkg.isActive } : pkg
    ));
    
    toast({
      title: "Success",
      description: "Package status updated"
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">Portfolio Management</h1>
          <div className="flex space-x-2">
            <Button
              variant={activeTab === "photos" ? "default" : "outline"}
              onClick={() => setActiveTab("photos")}
              size="sm"
            >
              <Camera className="h-4 w-4 mr-2" />
              Photos
            </Button>
            <Button
              variant={activeTab === "packages" ? "default" : "outline"}
              onClick={() => setActiveTab("packages")}
              size="sm"
            >
              <Package className="h-4 w-4 mr-2" />
              Packages
            </Button>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Preview Portfolio
          </Button>
          {activeTab === "photos" ? (
            <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Photos
                </Button>
              </DialogTrigger>
              {/* ... existing photo upload dialog content ... */}
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Upload New Photo</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Photo URL</label>
                  <Input
                    value={newPhoto.url}
                    onChange={(e) => setNewPhoto({...newPhoto, url: e.target.value})}
                    placeholder="Enter image URL"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={newPhoto.title}
                    onChange={(e) => setNewPhoto({...newPhoto, title: e.target.value})}
                    placeholder="Photo title"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={newPhoto.description}
                    onChange={(e) => setNewPhoto({...newPhoto, description: e.target.value})}
                    placeholder="Photo description"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <select
                    value={newPhoto.category}
                    onChange={(e) => setNewPhoto({...newPhoto, category: e.target.value})}
                    className="w-full p-2 border rounded-md"
                  >
                    {categories.filter(cat => cat !== "All").map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Tags (comma separated)</label>
                  <Input
                    value={newPhoto.tags}
                    onChange={(e) => setNewPhoto({...newPhoto, tags: e.target.value})}
                    placeholder="wedding, outdoor, golden hour"
                  />
                </div>
                <Button onClick={handleUploadPhoto} className="w-full">
                  Add to Portfolio
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          ) : (
            <Dialog open={showPackageDialog} onOpenChange={setShowPackageDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Package
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Create New Package</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Package Name *</label>
                    <Input
                      value={newPackage.name}
                      onChange={(e) => setNewPackage({...newPackage, name: e.target.value})}
                      placeholder="e.g., Wedding Essential"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={newPackage.description}
                      onChange={(e) => setNewPackage({...newPackage, description: e.target.value})}
                      placeholder="Package description"
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Price *</label>
                      <Input
                        type="number"
                        value={newPackage.price}
                        onChange={(e) => setNewPackage({...newPackage, price: e.target.value})}
                        placeholder="1500"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Duration</label>
                      <Input
                        value={newPackage.duration}
                        onChange={(e) => setNewPackage({...newPackage, duration: e.target.value})}
                        placeholder="6 hours"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <select
                      value={newPackage.category}
                      onChange={(e) => setNewPackage({...newPackage, category: e.target.value})}
                      className="w-full p-2 border rounded-md"
                    >
                      {categories.filter(cat => cat !== "All").map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Deliverables (one per line)</label>
                    <Textarea
                      value={newPackage.deliverables}
                      onChange={(e) => setNewPackage({...newPackage, deliverables: e.target.value})}
                      placeholder="500+ edited photos\nOnline gallery\nUSB drive"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Features (one per line)</label>
                    <Textarea
                      value={newPackage.features}
                      onChange={(e) => setNewPackage({...newPackage, features: e.target.value})}
                      placeholder="2 photographers\nEngagement session\nReception coverage"
                      rows={3}
                    />
                  </div>
                  <Button onClick={handleCreatePackage} className="w-full">
                    Create Package
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Stats */}
      {activeTab === "photos" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Camera className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{photos.length}</p>
              <p className="text-sm text-muted-foreground">Total Photos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Eye className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{photos.reduce((sum, photo) => sum + photo.views, 0)}</p>
              <p className="text-sm text-muted-foreground">Total Views</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{photos.reduce((sum, photo) => sum + photo.likes, 0)}</p>
              <p className="text-sm text-muted-foreground">Total Likes</p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Package className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{packages.length}</p>
              <p className="text-sm text-muted-foreground">Total Packages</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">${packages.reduce((sum, pkg) => sum + pkg.price, 0)}</p>
              <p className="text-sm text-muted-foreground">Total Value</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{packages.reduce((sum, pkg) => sum + pkg.bookings, 0)}</p>
              <p className="text-sm text-muted-foreground">Total Bookings</p>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "photos" ? (
        <>
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Portfolio Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhotos.map(photo => (
              <Card key={photo.id} className="group overflow-hidden">
                <div className="relative">
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleEditPhoto(photo)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeletePhoto(photo.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1">{photo.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {photo.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    <Badge variant="secondary">{photo.category}</Badge>
                    {photo.tags.slice(0, 2).map((tag: string) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <Eye className="h-3 w-3 mr-1" />
                      {photo.views}
                    </span>
                    <span className="flex items-center">
                      <Star className="h-3 w-3 mr-1" />
                      {photo.likes}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Package Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Packages Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {packages.filter(pkg => 
              selectedCategory === "All" || pkg.category === selectedCategory
            ).map(pkg => (
              <Card key={pkg.id} className="group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <Package className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{pkg.name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Badge variant="outline">{pkg.category}</Badge>
                          <span className={`px-2 py-1 rounded-full text-xs ${pkg.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {pkg.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => togglePackageStatus(pkg.id)}
                      >
                        {pkg.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditPackage(pkg)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeletePackage(pkg.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4">{pkg.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <span className="font-semibold">${pkg.price}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>{pkg.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-primary" />
                      <span>{pkg.bookings} bookings</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium mb-2">What's Included:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {pkg.deliverables.map((item, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Features:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {pkg.features.map((feature, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Edit Photo Dialog */}
      {editingPhoto && (
        <Dialog open={!!editingPhoto} onOpenChange={() => setEditingPhoto(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Photo</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={editingPhoto.title}
                  onChange={(e) => setEditingPhoto({...editingPhoto, title: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={editingPhoto.description}
                  onChange={(e) => setEditingPhoto({...editingPhoto, description: e.target.value})}
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <select
                  value={editingPhoto.category}
                  onChange={(e) => setEditingPhoto({...editingPhoto, category: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  {categories.filter(cat => cat !== "All").map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <Button onClick={handleSaveEdit} className="w-full">
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Package Dialog */}
      {editingPackage && (
        <Dialog open={!!editingPackage} onOpenChange={() => setEditingPackage(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Package</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Package Name</label>
                <Input
                  value={editingPackage.name}
                  onChange={(e) => setEditingPackage({...editingPackage, name: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={editingPackage.description}
                  onChange={(e) => setEditingPackage({...editingPackage, description: e.target.value})}
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Price</label>
                  <Input
                    type="number"
                    value={editingPackage.price}
                    onChange={(e) => setEditingPackage({...editingPackage, price: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Duration</label>
                  <Input
                    value={editingPackage.duration}
                    onChange={(e) => setEditingPackage({...editingPackage, duration: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <select
                  value={editingPackage.category}
                  onChange={(e) => setEditingPackage({...editingPackage, category: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  {categories.filter(cat => cat !== "All").map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Deliverables (one per line)</label>
                <Textarea
                  value={editingPackage.deliverables}
                  onChange={(e) => setEditingPackage({...editingPackage, deliverables: e.target.value})}
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Features (one per line)</label>
                <Textarea
                  value={editingPackage.features}
                  onChange={(e) => setEditingPackage({...editingPackage, features: e.target.value})}
                  rows={3}
                />
              </div>
              <Button onClick={handleSavePackageEdit} className="w-full">
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}