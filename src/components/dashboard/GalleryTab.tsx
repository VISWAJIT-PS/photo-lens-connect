import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PhotoReviewDialog, Photo } from '@/components/PhotoReviewDialog';
import { useToast } from '@/components/ui/use-toast';
import { Search, Plus, Download, Share2, Calendar, MapPin, Camera, Video, Eye, Heart, Star, Award, CheckCircle, XCircle, ChevronLeft, ChevronRight, Filter, Grid, List, Loader2, Users } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUserAlbums, useEventPhotos, useToggleFavorite, useDownloadPhoto, useShareContent, useFeaturedPhotos } from '@/hooks/use-gallery';
import { useAuth } from '@/hooks/use-auth';

// Types for gallery functionality
interface GalleryViewProps {
  viewMode?: 'grid' | 'list'
  showFilters?: boolean
}

export const GalleryTab: React.FC<GalleryViewProps> = ({
  viewMode = 'grid',
  showFilters = true
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState<any>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showPhotoReview, setShowPhotoReview] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const { user } = useAuth()
  const { toast } = useToast()

  // Use real database hooks
  const { data: albums, isLoading: albumsLoading } = useUserAlbums('')
  const { data: featuredPhotos, isLoading: featuredLoading } = useFeaturedPhotos()
  const { data: eventPhotos, isLoading: photosLoading } = useEventPhotos(selectedAlbum?.id || '')
  const toggleFavorite = useToggleFavorite()
  const downloadPhoto = useDownloadPhoto()
  const shareContent = useShareContent()

  const handleButton = (title: string, description?: string, cb?: () => void) => () => {
    if (cb) cb();
    if (title === 'View Photos') {
      setShowPhotoReview(true);
    } else {
      toast({ title, description });
    }
  };

  const getFilteredAlbums = () => {
    if (!albums) return []

    return albums.filter(album =>
      album.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      album.location.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  const getFilteredPhotos = () => {
    if (!eventPhotos) return []

    let photos = eventPhotos

    // Apply additional filters if needed
    if (filterStatus !== 'all') {
      // Filter by photo status if implemented
    }

    return photos
  }

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


  const renderAlbumCard = (album: any) => (
    <Card key={album.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
      <div className="relative">
        <img
          src={album.coverImage}
          alt={album.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg flex items-center justify-center">
          <Button
            variant="secondary"
            className="opacity-90"
            onClick={() => setSelectedAlbum(album)}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Album
          </Button>
        </div>

        <div className="absolute top-3 left-3">
          <Badge variant={getStatusColor(album.status)}>
            {album.status === 'processing' ? (
              <span className="flex items-center gap-1">
                <svg className="animate-spin h-3 w-3 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8z" />
                </svg>
                {getStatusText(album.status)}
              </span>
            ) : album.status === 'completed' ? (
              <span className="flex items-center gap-1">
                <svg className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
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
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => {
                  setSelectedAlbum(album)
                  setShowPhotoReview(true)
                }}
              >
                <Eye className="h-3 w-3 mr-1" />
                View Photos
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => shareContent.mutate({
                  contentType: 'album',
                  contentId: album.id,
                  title: album.name
                })}
              >
                <Share2 className="h-3 w-3 mr-1" />
                Share
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )


  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Your Event Gallery</h2>
          <p className="text-muted-foreground">View and manage your event photos and videos</p>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" size="sm">
            <Grid className="h-4 w-4 mr-2" />
            View
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search albums..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="location">Location</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{albums?.length || 0}</p>
            <p className="text-sm text-muted-foreground">Total Albums</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">
              {albums?.reduce((sum, album) => sum + album.total_photos, 0) || 0}
            </p>
            <p className="text-sm text-muted-foreground">Total Photos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">
              0
            </p>
            <p className="text-sm text-muted-foreground">Total Videos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-success">
              {albums?.length || 0}
            </p>
            <p className="text-sm text-muted-foreground">Ready Albums</p>
          </CardContent>
        </Card>
      </div>

      {/* Featured Photos Section */}
      {!selectedAlbum && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Featured Photos</h3>
          {featuredLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading featured photos...</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {featuredPhotos?.slice(0, 6).map((photo) => (
                <div key={photo.id} className="relative group cursor-pointer">
                  <img
                    src={photo.url}
                    alt={photo.title || 'Featured photo'}
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setSelectedPhoto(photo)
                        setLightboxIndex(0)
                        setLightboxOpen(true)
                      }}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Albums Grid */}
      {albumsLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading albums...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getFilteredAlbums().map(renderAlbumCard)}
        </div>
      )}

      {/* No Results */}
      {getFilteredAlbums().length === 0 && !albumsLoading && (
        <Card>
          <CardContent className="py-12 text-center">
            <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {albums?.length === 0
                ? "No albums found. Your event photos will appear here."
                : "No albums match your search criteria."
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Photo Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-4xl">
          {selectedPhoto && (
            <div className="relative">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="w-full h-[70vh] object-contain"
              />

              {/* Photo Actions */}
              <div className="absolute top-4 right-4 flex space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => toggleFavorite.mutate({
                    photoId: selectedPhoto.id,
                    isFavorite: selectedPhoto.isFavorite
                  })}
                >
                  <Heart className={`h-4 w-4 mr-2 ${selectedPhoto.isFavorite ? 'fill-current text-red-500' : ''}`} />
                  {selectedPhoto.isFavorite ? 'Favorited' : 'Favorite'}
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => downloadPhoto.mutate(selectedPhoto.id)}
                  disabled={downloadPhoto.isPending}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => shareContent.mutate({
                    contentType: 'photo',
                    contentId: selectedPhoto.id,
                    title: selectedPhoto.title || 'Photo'
                  })}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>

              {/* Photo Info */}
              <div className="absolute bottom-4 left-4 right-4 bg-black/70 text-white p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{selectedPhoto.title}</h4>
                    <p className="text-sm text-gray-300">
                      {selectedPhoto.events?.name} • {new Date(selectedPhoto.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    {selectedPhoto.downloadCount !== undefined && (
                      <span className="flex items-center">
                        <Download className="h-4 w-4 mr-1" />
                        {selectedPhoto.downloadCount}
                      </span>
                    )}
                    {selectedPhoto.matchCount !== undefined && (
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {selectedPhoto.matchCount} matches
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Photo Review Dialog */}
      <PhotoReviewDialog
        isOpen={showPhotoReview}
        onClose={() => setShowPhotoReview(false)}
        photos={eventPhotos?.map(photo => ({
          id: photo.id,
          url: photo.url,
          name: photo.title || 'Untitled',
          status: (photo.is_featured ? 'editors_choice' : 'approved') as 'editors_choice' | 'approved' | 'not_approved',
          rating: 4
        })) || []}
        title={selectedAlbum?.title || 'Album Photos'}
      />
    </div>
  )
};