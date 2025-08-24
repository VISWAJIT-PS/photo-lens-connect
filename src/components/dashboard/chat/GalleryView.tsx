import React from 'react';
import { Lock, Camera, Eye, Award, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../../ui/button';
import type { GalleryPhoto } from '../../../types/chat.types';
import { sortPhotosByStatus, getStatusInfo } from '../../../utils/chatUtils';

interface GalleryViewProps {
  photos?: GalleryPhoto[];
}

const GalleryView: React.FC<GalleryViewProps> = ({ photos }) => {
  if (!photos || photos.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="mb-4 w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
            <Lock className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Gallery Locked</h3>
          <p className="text-gray-500">Photos will be available after the event</p>
        </div>
      </div>
    );
  }

  const sortedPhotos = sortPhotosByStatus(photos);

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'editors_choice':
        return <Award className="h-3 w-3" />;
      case 'approved':
        return <CheckCircle className="h-3 w-3" />;
      case 'not_approved':
        return <XCircle className="h-3 w-3" />;
      default:
        return <CheckCircle className="h-3 w-3" />;
    }
  };

  return (
    <div className="h-full overflow-y-auto p-4 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <Camera className="h-5 w-5 text-blue-600" />
          Event Photos ({photos.length})
        </h3>
        <p className="text-sm text-gray-600">Sorted by review status and upload date</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sortedPhotos.map((photo) => {
          const statusInfo = getStatusInfo(photo.status);
          return (
            <div key={photo.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 group border border-gray-100">
              <div className="aspect-square relative">
                <img
                  src={photo.thumbnail}
                  alt={photo.caption || 'Event photo'}
                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                  onClick={() => window.open(photo.url, '_blank')}
                />
                
                <div className="absolute top-2 left-2">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-sm ${statusInfo.className}`}>
                    {getStatusIcon(photo.status)}
                    <span className="hidden sm:inline">{statusInfo.label}</span>
                  </div>
                </div>

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button variant="ghost" className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 rounded-lg text-sm font-medium flex items-center gap-1 hover:bg-white transition-colors">
                    <Eye className="h-3 w-3" />
                    View
                  </Button>
                </div>
              </div>
              
              {photo.caption && (
                <div className="p-3">
                  <p className="text-sm font-medium text-gray-900 truncate">{photo.caption}</p>
                  <p className="text-xs text-gray-500 mt-1">{photo.uploadDate}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GalleryView;