import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface Photo {
  id: string;
  url: string;
  title: string;
  description: string;
}

interface ProfileImageGalleryProps {
  photos: Photo[];
  onViewFullSize: (photoIndex: number) => void;
}

export const ProfileImageGallery: React.FC<ProfileImageGalleryProps> = ({ photos, onViewFullSize }) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const handleViewFullSize = (index: number) => {
    setSelectedPhotoIndex(index);
    setIsGalleryOpen(true);
    onViewFullSize(index);
  };

  const goToNext = () => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex < photos.length - 1) {
      setSelectedPhotoIndex(selectedPhotoIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex > 0) {
      setSelectedPhotoIndex(selectedPhotoIndex - 1);
    }
  };

  const currentPhoto = selectedPhotoIndex !== null ? photos[selectedPhotoIndex] : null;

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((photo, index) => (
          <div 
            key={photo.id} 
            className="group relative cursor-pointer rounded-lg overflow-hidden aspect-square"
            onClick={() => handleViewFullSize(index)}
          >
            <img 
              src={photo.url} 
              alt={photo.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end">
              <div className="p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h4 className="font-medium text-sm">{photo.title}</h4>
                <p className="text-xs text-gray-200 line-clamp-2">{photo.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Full Size Gallery Dialog */}
      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogContent className="max-w-4xl w-full h-[80vh] p-0">
          <div className="relative w-full h-full flex flex-col">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 z-10 bg-black/20 text-white hover:bg-black/40"
              onClick={() => setIsGalleryOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Navigation */}
            {selectedPhotoIndex !== null && selectedPhotoIndex > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/20 text-white hover:bg-black/40"
                onClick={goToPrevious}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            )}

            {selectedPhotoIndex !== null && selectedPhotoIndex < photos.length - 1 && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/20 text-white hover:bg-black/40"
                onClick={goToNext}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            )}

            {/* Image */}
            {currentPhoto && (
              <div className="flex-1 flex items-center justify-center p-4">
                <img 
                  src={currentPhoto.url} 
                  alt={currentPhoto.title}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}

            {/* Photo Info */}
            {currentPhoto && (
              <div className="p-6 bg-background border-t">
                <h3 className="text-lg font-semibold mb-2">{currentPhoto.title}</h3>
                <p className="text-muted-foreground">{currentPhoto.description}</p>
                <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
                  <span>Photo {(selectedPhotoIndex ?? 0) + 1} of {photos.length}</span>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};