import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Upload, Edit, Trash2, Eye, Plus, Camera, Star, MapPin } from 'lucide-react';
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

export function PhotographerPortfolio() {
  const [photos, setPhotos] = useState(portfolioPhotos);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [editingPhoto, setEditingPhoto] = useState<any>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [newPhoto, setNewPhoto] = useState({
    title: '',
    description: '',
    category: 'Wedding',
    tags: '',
    url: ''
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Portfolio Management</h1>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Preview Portfolio
          </Button>
          <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Upload Photos
              </Button>
            </DialogTrigger>
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
        </div>
      </div>

      {/* Stats */}
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
    </div>
  );
}