import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Heart,
  Download,
  Share2,
  Eye,
  Calendar,
  MapPin,
  Users,
  MoreVertical,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn
} from 'lucide-react'
import { format } from 'date-fns'
import {
  useGalleryPhotos,
  useUserFavorites,
  usePopularPhotos,
  useRecentPhotos,
  useSearchPhotos,
  useToggleFavorite,
  useDownloadPhoto,
  useSharePhoto,
  usePhotoDetails,
  PhotoFilter
} from '@/hooks/use-photo-gallery'
import { useAuth } from '@/hooks/use-auth'
import { GalleryPhoto } from '@/hooks/use-photo-gallery'

interface PhotoGalleryProps {
  initialFilter?: PhotoFilter
  showFilters?: boolean
  compact?: boolean
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  initialFilter = {},
  showFilters = true,
  compact = false
}) => {
  const { user } = useAuth()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<PhotoFilter>(initialFilter)
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  // Get photos based on current filter
  const { data: photosData, isLoading } = useGalleryPhotos(filter, currentPage, 20)
  const { data: searchResults } = useSearchPhotos(searchQuery)
  const { data: favorites = [] } = useUserFavorites()
  const { data: popularPhotos = [] } = usePopularPhotos(20)
  const { data: recentPhotos = [] } = useRecentPhotos(20)

  const toggleFavoriteMutation = useToggleFavorite()
  const downloadPhotoMutation = useDownloadPhoto()
  const sharePhotoMutation = useSharePhoto()

  // Use search results if there's a search query, otherwise use filtered photos
  const displayPhotos = searchQuery ? searchResults || [] : photosData?.photos || []

  const handleFilterChange = (key: keyof PhotoFilter, value: any) => {
    setFilter(prev => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setFilter({})
    setSearchQuery('')
    setCurrentPage(1)
  }

  const PhotoCard: React.FC<{ photo: GalleryPhoto }> = ({ photo }) => (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-200">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={photo.url}
          alt={photo.title || 'Photo'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />

        {/* Overlay with actions */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setSelectedPhoto(photo)}
            >
              <Eye className="h-4 w-4" />
            </Button>

            {user && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => toggleFavoriteMutation.mutate({
                  photoId: photo.id,
                  isFavorite: photo.isFavorited || false
                })}
              >
                <Heart className={`h-4 w-4 ${photo.isFavorited ? 'fill-current text-red-500' : ''}`} />
              </Button>
            )}

            <Button
              size="sm"
              variant="secondary"
              onClick={() => downloadPhotoMutation.mutate({ photoId: photo.id })}
            >
              <Download className="h-4 w-4" />
            </Button>

            <Button
              size="sm"
              variant="secondary"
              onClick={() => sharePhotoMutation.mutate(photo.id)}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Photo info overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-white">
          <div className="text-sm font-medium truncate">{photo.title || 'Untitled'}</div>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              {photo.people_count > 0 && (
                <div className="flex items-center">
                  <Users className="h-3 w-3 mr-1" />
                  {photo.people_count}
                </div>
              )}
              {photo.location && (
                <div className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span className="truncate">{photo.location}</span>
                </div>
              )}
            </div>
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {format(new Date(photo.created_at), 'MMM d')}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )

  const PhotoListItem: React.FC<{ photo: GalleryPhoto }> = ({ photo }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex space-x-4">
          <img
            src={photo.url}
            alt={photo.title || 'Photo'}
            className="w-24 h-24 object-cover rounded"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium truncate">{photo.title || 'Untitled'}</h3>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                  {photo.event?.name && (
                    <span>{photo.event.name}</span>
                  )}
                  <span>{format(new Date(photo.created_at), 'MMM d, yyyy')}</span>
                  {photo.location && (
                    <span>{photo.location}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {user && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleFavoriteMutation.mutate({
                      photoId: photo.id,
                      isFavorite: photo.isFavorited || false
                    })}
                  >
                    <Heart className={`h-4 w-4 ${photo.isFavorited ? 'fill-current text-red-500' : ''}`} />
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => downloadPhotoMutation.mutate({ photoId: photo.id })}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => sharePhotoMutation.mutate(photo.id)}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-4 text-sm">
                {photo.people_count > 0 && (
                  <div className="flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    {photo.people_count} people
                  </div>
                )}
                {photo.download_count && photo.download_count > 0 && (
                  <div className="flex items-center">
                    <Download className="h-3 w-3 mr-1" />
                    {photo.download_count} downloads
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const PhotoLightbox: React.FC = () => {
    if (!selectedPhoto) return null

    return (
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-4xl w-full max-h-[90vh]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>{selectedPhoto.title || 'Photo'}</DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedPhoto(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title || 'Photo'}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Details</h4>
                <div className="space-y-1">
                  {selectedPhoto.event?.name && (
                    <div>Event: {selectedPhoto.event.name}</div>
                  )}
                  {selectedPhoto.location && (
                    <div>Location: {selectedPhoto.location}</div>
                  )}
                  <div>Date: {format(new Date(selectedPhoto.created_at), 'PPP')}</div>
                  {selectedPhoto.people_count > 0 && (
                    <div>People detected: {selectedPhoto.people_count}</div>
                  )}
                  {selectedPhoto.camera && (
                    <div>Camera: {selectedPhoto.camera}</div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Actions</h4>
                <div className="flex flex-wrap gap-2">
                  {user && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        toggleFavoriteMutation.mutate({
                          photoId: selectedPhoto.id,
                          isFavorite: selectedPhoto.isFavorited || false
                        })
                        setSelectedPhoto(prev => prev ? { ...prev, isFavorited: !prev.isFavorited } : null)
                      }}
                    >
                      <Heart className={`h-4 w-4 mr-2 ${selectedPhoto.isFavorited ? 'fill-current text-red-500' : ''}`} />
                      {selectedPhoto.isFavorited ? 'Remove from' : 'Add to'} Favorites
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => downloadPhotoMutation.mutate({ photoId: selectedPhoto.id })}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => sharePhotoMutation.mutate(selectedPhoto.id)}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Photo Gallery</h2>
          <p className="text-muted-foreground">
            Discover and download event photos
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      {showFilters && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search photos by title, location, or event..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                <Select
                  value={filter.sortBy || 'date'}
                  onValueChange={(value) => handleFilterChange('sortBy', value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="popularity">Popularity</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filter.sortOrder || 'desc'}
                  onValueChange={(value) => handleFilterChange('sortOrder', value)}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Newest</SelectItem>
                    <SelectItem value="asc">Oldest</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" onClick={clearFilters}>
                  <Filter className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gallery Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Photos</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
          {user && <TabsTrigger value="favorites">Favorites</TabsTrigger>}
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <PhotoGrid
            photos={displayPhotos}
            viewMode={viewMode}
            isLoading={isLoading}
            PhotoCard={PhotoCard}
            PhotoListItem={PhotoListItem}
            onPhotoClick={setSelectedPhoto}
          />
        </TabsContent>

        <TabsContent value="recent" className="mt-6">
          <PhotoGrid
            photos={recentPhotos}
            viewMode={viewMode}
            isLoading={false}
            PhotoCard={PhotoCard}
            PhotoListItem={PhotoListItem}
            onPhotoClick={setSelectedPhoto}
          />
        </TabsContent>

        <TabsContent value="popular" className="mt-6">
          <PhotoGrid
            photos={popularPhotos}
            viewMode={viewMode}
            isLoading={false}
            PhotoCard={PhotoCard}
            PhotoListItem={PhotoListItem}
            onPhotoClick={setSelectedPhoto}
          />
        </TabsContent>

        {user && (
          <TabsContent value="favorites" className="mt-6">
            <PhotoGrid
              photos={favorites}
              viewMode={viewMode}
              isLoading={false}
              PhotoCard={PhotoCard}
              PhotoListItem={PhotoListItem}
              onPhotoClick={setSelectedPhoto}
            />
          </TabsContent>
        )}
      </Tabs>

      {/* Photo Lightbox */}
      <PhotoLightbox />

      {/* Pagination */}
      {photosData && photosData.hasMore && !searchQuery && (
        <div className="flex justify-center">
          <Button
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={isLoading}
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  )
}

// Helper component for photo grid/list rendering
interface PhotoGridProps {
  photos: GalleryPhoto[]
  viewMode: 'grid' | 'list'
  isLoading: boolean
  PhotoCard: React.FC<{ photo: GalleryPhoto }>
  PhotoListItem: React.FC<{ photo: GalleryPhoto }>
  onPhotoClick: (photo: GalleryPhoto) => void
}

const PhotoGrid: React.FC<PhotoGridProps> = ({
  photos,
  viewMode,
  isLoading,
  PhotoCard,
  PhotoListItem,
  onPhotoClick
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="aspect-square bg-muted" />
          </Card>
        ))}
      </div>
    )
  }

  if (photos.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="text-muted-foreground">
            <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No photos found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-2">
        {photos.map(photo => (
          <div key={photo.id} onClick={() => onPhotoClick(photo)}>
            <PhotoListItem photo={photo} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {photos.map(photo => (
        <div key={photo.id} onClick={() => onPhotoClick(photo)}>
          <PhotoCard photo={photo} />
        </div>
      ))}
    </div>
  )
}