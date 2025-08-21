import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PhotoReviewDialog, Photo } from '@/components/PhotoReviewDialog';
import { useToast } from '@/components/ui/use-toast';
import { Search, Plus, Download, Share2, Calendar, MapPin, Camera, Video, Eye, Heart, Star, Award, CheckCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';

// Mock photo data for review
const mockPhotos: Photo[] = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600',
    name: 'Ceremony Entrance',
    status: 'editors_choice',
    rating: 5
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600',
    name: 'Ring Exchange',
    status: 'approved',
    rating: 4.8
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600',
    name: 'Reception Dance',
    status: 'editors_choice',
    rating: 4.9
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600',
    name: 'Group Photo',
    status: 'not_approved',
    rating: 3.2
  },
  {
    id: '5',
    url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=600',
    name: 'Bouquet Toss',
    status: 'approved',
    rating: 4.3
  },
  {
    id: '6',
    url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600',
    name: 'Cake Cutting',
    status: 'approved',
    rating: 4.7
  }
];

// Mock gallery data
const eventAlbums = [
  {
    id: '1',
    title: 'Sarah & John Wedding',
    date: '2024-08-15',
    location: 'Central Park, NYC',
    type: 'Wedding',
    photographer: 'Sarah Johnson',
    status: 'completed',
    totalPhotos: 145,
    totalVideos: 3,
    coverImage: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400',
    preview: [
      'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=300',
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=300',
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=300',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=300'
    ]
  },
  {
    id: '2',
    title: 'Corporate Event 2024',
    date: '2024-07-20',
    location: 'Convention Center, LA',
    type: 'Corporate',
    photographer: 'Michael Chen',
    status: 'processing',
    totalPhotos: 89,
    totalVideos: 1,
    coverImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400',
    preview: [
      'https://images.unsplash.com/photo-1511578314322-379afb476865?w=300',
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300',
      'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=300'
    ]
  },
  {
    id: '3',
    title: 'Birthday Celebration',
    date: '2024-06-10',
    location: 'Private Venue, Miami',
    type: 'Birthday',
    photographer: 'Emma Rodriguez',
    status: 'completed',
    totalPhotos: 67,
    totalVideos: 2,
    coverImage: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400',
    preview: [
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=300',
      'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=300',
      'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=300'
    ]
  }
];

export const GalleryTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showPhotoReview, setShowPhotoReview] = useState(false);
  const [previewMeta, setPreviewMeta] = useState<Record<string, { rating: number; status: 'editors_choice'|'approved'|'not_approved' }>>({});
  const { toast } = useToast();

  const handleButton = (title: string, description?: string, cb?: () => void) => () => {
    if (cb) cb();
    if (title === 'View Photos') {
      setShowPhotoReview(true);
    } else {
      toast({ title, description });
    }
  };

  const getFilteredAlbums = () => {
    return eventAlbums.filter(album =>
      album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      album.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      album.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'processing': return 'secondary';
      case 'pending': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Ready';
      case 'processing': return 'Pending';
      case 'pending': return 'Pending';
      default: return status;
    }
  };

  // map star rating to photo review status
  const mapRatingToStatus = (rating: number): 'editors_choice'|'approved'|'not_approved' => {
    if (rating >= 4.8) return 'editors_choice';
    if (rating >= 4.0) return 'approved';
    return 'not_approved';
  };

  const getPhotoStatusText = (status: string) => {
    switch (status) {
      case 'editors_choice': return 'Top Shot';
      case 'approved': return 'Ready for Edit';
      case 'not_approved': return 'Not Approved - Rejected';
      default: return status;
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'editors_choice':
        return { icon: <Award className="h-3 w-3" />, label: 'Top Shot', className: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white' };
      case 'approved':
        return { icon: <CheckCircle className="h-3 w-3" />, label: 'Ready for Edit', className: 'bg-green-100 text-green-800 border-green-200' };
      case 'not_approved':
        return { icon: <XCircle className="h-3 w-3" />, label: 'Not Approved - Rejected', className: 'bg-red-100 text-red-800 border-red-200' };
      default:
        return { icon: null, label: 'Unknown', className: '' };
    }
  };

  const handleSetRating = (imageUrl: string, rating: number) => {
    setPreviewMeta(prev => ({
      ...prev,
      [imageUrl]: { rating, status: mapRatingToStatus(rating) }
    }));
  };

  const handleSetStatus = (imageUrl: string, status: 'editors_choice'|'approved'|'not_approved') => {
    setPreviewMeta(prev => ({
      ...prev,
      [imageUrl]: { rating: prev[imageUrl]?.rating ?? 4, status }
    }));
  };

  const renderAlbumCard = (album) => (
    <Card key={album.id} className="group hover:shadow-medium transition-all duration-300 cursor-pointer">
      <div className="relative">
        <img
          src={album.coverImage}
          alt={album.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg flex items-center justify-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="secondary"
                className="opacity-90"
                onClick={() => {
                  setSelectedAlbum(album);
                  setModalImages(album.preview ? [...album.preview] : []);
                }}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Album
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
        
        <div className="absolute top-3 left-3">
          <Badge variant={getStatusColor(album.status)}>
            {album.status === 'processing' ? (
              <span className="flex items-center gap-1">
                <svg className="animate-spin h-3 w-3 mr-1 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8z" />
                </svg>
                {getStatusText(album.status)}
              </span>
            ) : album.status === 'completed' ? (
              <span className="flex items-center gap-1">
                <svg className="h-3 w-3 mr-1 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
                {getStatusText(album.status)}
              </span>
            ) : getStatusText(album.status)}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg">{album.title}</h3>
            <Badge variant="outline" className="text-xs mt-1">{album.type}</Badge>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-2" />
              {new Date(album.date).toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-2" />
              {album.location}
            </div>
            <div className="flex items-center">
              <Camera className="h-3 w-3 mr-2" />
              By {album.photographer}
            </div>
          </div>

          <div className="flex items-center space-x-4 text-sm">
            <span className="flex items-center">
              <Camera className="h-3 w-3 mr-1" />
              {album.totalPhotos} photos
            </span>
            <span className="flex items-center">
              <Video className="h-3 w-3 mr-1" />
              {album.totalVideos} videos
            </span>
          </div>

          {album.status === 'completed' && (
            <div className="flex space-x-2 pt-2">
              {/* <Button variant="outline" size="sm" className="flex-1" 
                onClick={() => {
                  setSelectedAlbum(album);
                  handleButton('View Photos', `Opening photo review for ${album.title}`)();
                }}
              >
                <Eye className="h-3 w-3 mr-1" />
                View Photos
              </Button> */}
              <Button variant="outline" size="sm" className="flex-1" onClick={handleButton('Download', `Downloading ${album.title}`)}>
                <Download className="h-3 w-3 mr-1" />
                Download
              </Button>
              <Button variant="outline" size="sm" className="flex-1" onClick={handleButton('Share', `Share link copied for ${album.title}`)}>
                <Share2 className="h-3 w-3 mr-1" />
                Share
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderAlbumModal = () => (
    <>
    <Dialog open={!!selectedAlbum} onOpenChange={() => setSelectedAlbum(null)}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{selectedAlbum?.title}</span>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleButton('Favorited', `Added ${selectedAlbum?.title} to favorites`)}>
                <Heart className="h-4 w-4 mr-1" />
                Favorite
              </Button>
              <Button variant="outline" size="sm" onClick={handleButton('Download started', `Preparing download for ${selectedAlbum?.title}`)}>
                <Download className="h-4 w-4 mr-1" />
                Download All
              </Button>
              <Button variant="outline" size="sm" onClick={handleButton('Share', `Share link copied for ${selectedAlbum?.title}`)}>
                <Share2 className="h-4 w-4 mr-1" />
                Share Album
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        {selectedAlbum && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(selectedAlbum.date).toLocaleDateString()}
              </span>
              <span className="flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                {selectedAlbum.location}
              </span>
              <span className="flex items-center">
                <Camera className="h-3 w-3 mr-1" />
                {selectedAlbum.totalPhotos + selectedAlbum.totalVideos} items
              </span>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
              {modalImages.map((image: string, index: number) => {
                const meta = previewMeta[image] || { rating: 4, status: mapRatingToStatus(4) };
                return (
                <div key={index} className="aspect-square relative group cursor-pointer">
                  {/* Status badge on each preview photo */}
                  <div className="absolute top-2 left-2 z-10">
                    <Badge className={getStatusInfo(meta.status).className}>
                      {getStatusInfo(meta.status).icon}
                      <span className="ml-1 text-xs">{getStatusInfo(meta.status).label}</span>
                    </Badge>
                  </div>
                  <img
                    src={image}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <Button variant="secondary" size="sm" onClick={() => { setLightboxIndex(index); setLightboxOpen(true); }}>
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="absolute bottom-2 left-2 right-2 p-2 bg-white/100 rounded-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => {
                          const starIndex = i + 1;
                          return (
                            <button key={i} onClick={() => handleSetRating(image, starIndex)} aria-label={`Rate ${starIndex}`}>
                              <Star className={`h-4 w-4 ${starIndex <= Math.round(meta.rating) ? 'text-yellow-400' : 'text-gray-500'}`} />
                            </button>
                          );
                        })}
                      </div>

                      {/* status select intentionally hidden here (we use badge) */}
                    </div>
                  </div>
                </div>
              )})}
              {/* Show more indicator */}
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Plus className="h-6 w-6 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">
                    +{(selectedAlbum.totalPhotos ?? 0) - modalImages.length} more
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
  </Dialog>
  {/* Lightbox dialog */}
  <Dialog open={lightboxOpen} onOpenChange={() => setLightboxOpen(false)}>
      <DialogContent className="max-w-4xl">
        <div className="relative">
          <img src={modalImages[lightboxIndex]} alt={`Photo ${lightboxIndex + 1}`} className="w-full h-[70vh] object-contain" />
          <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
            <Button variant="secondary" size="icon" onClick={() => setLightboxIndex(i => (i > 0 ? i - 1 : modalImages.length - 1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <Button variant="secondary" size="icon" onClick={() => setLightboxIndex(i => (i < modalImages.length - 1 ? i + 1 : 0))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Your Event Gallery</h2>
          <p className="text-muted-foreground">View and manage your event photos and videos</p>
        </div>
        
        <Button onClick={handleButton('Upload', 'Open upload dialog (mock)')}>
          <Plus className="h-4 w-4 mr-2" />
          Upload Photos
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search albums..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{eventAlbums.length}</p>
            <p className="text-sm text-muted-foreground">Total Albums</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">
              {eventAlbums.reduce((sum, album) => sum + album.totalPhotos, 0)}
            </p>
            <p className="text-sm text-muted-foreground">Total Photos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">
              {eventAlbums.reduce((sum, album) => sum + album.totalVideos, 0)}
            </p>
            <p className="text-sm text-muted-foreground">Total Videos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-success">
              {eventAlbums.filter(album => album.status === 'completed').length}
            </p>
            <p className="text-sm text-muted-foreground">Ready Albums</p>
          </CardContent>
        </Card>
      </div>

      {/* Albums Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getFilteredAlbums().map(renderAlbumCard)}
      </div>

      {/* No Results */}
      {getFilteredAlbums().length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No albums found. Your event photos will appear here.</p>
          </CardContent>
        </Card>
      )}

      {/* Album Modal */}
      {renderAlbumModal()}
      
      {/* Photo Review Dialog */}
      <PhotoReviewDialog
        isOpen={showPhotoReview}
        onClose={() => setShowPhotoReview(false)}
        photos={mockPhotos}
        title={selectedAlbum?.title || 'Album Photos'}
      />
    </div>
  );
};