import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Award, ChevronLeft, ChevronRight } from 'lucide-react';

export interface Photo {
  id: string;
  url: string;
  name: string;
  status: 'approved' | 'not_approved' | 'editors_choice';
  rating: number;
}

interface PhotoReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  photos: Photo[];
  title: string;
}

export const PhotoReviewDialog: React.FC<PhotoReviewDialogProps> = ({
  isOpen,
  onClose,
  photos,
  title
}) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const sortedPhotos = [...photos].sort((a, b) => {
    // Sort by status priority: editors_choice > approved > not_approved
    const statusPriority = { editors_choice: 3, approved: 2, not_approved: 1 };
    if (statusPriority[a.status] !== statusPriority[b.status]) {
      return statusPriority[b.status] - statusPriority[a.status];
    }
    // Then by rating
    return b.rating - a.rating;
  });

  const currentPhoto = sortedPhotos[currentPhotoIndex];

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'editors_choice':
        return {
          icon: <Award className="h-4 w-4" />,
          label: "Editor's Choice",
          variant: 'default' as const,
          className: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
        };
      case 'approved':
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          label: 'Approved for Editing',
          variant: 'secondary' as const,
          className: 'bg-green-100 text-green-800 border-green-200'
        };
      case 'not_approved':
        return {
          icon: <XCircle className="h-4 w-4" />,
          label: 'Not Approved',
          variant: 'destructive' as const,
          className: 'bg-red-100 text-red-800 border-red-200'
        };
      default:
        return {
          icon: null,
          label: 'Unknown',
          variant: 'secondary' as const,
          className: ''
        };
    }
  };

  const handlePrevious = () => {
    setCurrentPhotoIndex(prev => (prev > 0 ? prev - 1 : sortedPhotos.length - 1));
  };

  const handleNext = () => {
    setCurrentPhotoIndex(prev => (prev < sortedPhotos.length - 1 ? prev + 1 : 0));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{title} - Photo Review</span>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{currentPhotoIndex + 1} of {sortedPhotos.length}</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        {currentPhoto && (
          <div className="space-y-4">
            {/* Main Photo Display */}
            <div className="relative">
              <img
                src={currentPhoto.url}
                alt={currentPhoto.name}
                className="w-full h-96 object-contain rounded-lg bg-muted"
              />
              
              {/* Navigation Arrows */}
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-2 top-1/2 transform -translate-y-1/2"
                onClick={handlePrevious}
                disabled={sortedPhotos.length <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={handleNext}
                disabled={sortedPhotos.length <= 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              {/* Status Badge */}
              <div className="absolute top-3 left-3">
                <Badge className={getStatusInfo(currentPhoto.status).className}>
                  {getStatusInfo(currentPhoto.status).icon}
                  <span className="ml-1">{getStatusInfo(currentPhoto.status).label}</span>
                </Badge>
              </div>

              {/* Rating */}
              <div className="absolute top-3 right-3">
                <Badge variant="secondary">
                  Rating: {currentPhoto.rating}/5
                </Badge>
              </div>
            </div>

            {/* Photo Info */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{currentPhoto.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Status: {getStatusInfo(currentPhoto.status).label}
                </p>
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {sortedPhotos.map((photo, index) => {
                const statusInfo = getStatusInfo(photo.status);
                return (
                  <div
                    key={photo.id}
                    className={`relative cursor-pointer flex-shrink-0 ${
                      index === currentPhotoIndex ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setCurrentPhotoIndex(index)}
                  >
                    <img
                      src={photo.url}
                      alt={photo.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="absolute -top-1 -right-1">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${statusInfo.className}`}>
                        {statusInfo.icon && React.cloneElement(statusInfo.icon, { className: 'h-2 w-2' })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};