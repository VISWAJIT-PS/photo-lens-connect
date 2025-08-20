import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Heart, User, X, Star } from 'lucide-react';

interface FavoritesPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialFavorites = [
  {
    id: 'f1',
    name: 'Sarah Johnson',
    role: 'Photographer',
    note: 'Wedding specialist • 5 years experience',
    addedAt: '2 days ago'
  },
  {
    id: 'f2',
    name: 'Camera Rental Co.',
    role: 'Rental Shop',
    note: 'Pickup downtown • Open till 7pm',
    addedAt: '1 week ago'
  },
  {
    id: 'f3',
    name: 'Michael Chen',
    role: 'Videographer',
    note: 'Event highlights and ceremony edits',
    addedAt: '3 weeks ago'
  }
];

export const FavoritesPanel: React.FC<FavoritesPanelProps> = ({ isOpen, onClose }) => {
  const [favorites, setFavorites] = useState(initialFavorites);

  const removeFavorite = (id: string) => {
    setFavorites(prev => prev.filter(f => f.id !== id));
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center">
              <Heart className="h-5 w-5 mr-2" />
              Favorites
              {favorites.length > 0 && (
                <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-primary text-white">
                  {favorites.length}
                </Badge>
              )}
            </SheetTitle>
          </div>
        </SheetHeader>

        <ScrollArea className="h-full mt-6">
          <div className="space-y-3">
            {favorites.map(fav => (
              <div key={fav.id} className="p-4 rounded-lg border bg-white border-gray-200 hover:bg-gray-50">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <h4 className="font-medium text-sm text-gray-900">{fav.name}</h4>
                        <p className="text-xs text-muted-foreground">{fav.role}</p>
                      </div>

                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFavorite(fav.id)}
                          className="h-6 w-6 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50"
                          title="Remove favorite"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-2 leading-relaxed">{fav.note}</p>

                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-400">Added {fav.addedAt}</p>
                      <Button variant="outline" size="sm" className="justify-start">
                        <Star className="h-3 w-3 mr-2" />
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {favorites.length === 0 && (
            <div className="text-center py-12">
              <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No favorites yet</p>
              <p className="text-sm text-gray-400 mt-1">Tap the heart on creators or listings to save them here.</p>
            </div>
          )}
        </ScrollArea>

        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="justify-start">
              <Star className="h-3 w-3 mr-2" />
              Browse More
            </Button>
            <Button variant="outline" size="sm" className="justify-start" onClick={() => setFavorites([])}>
              Clear All
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
