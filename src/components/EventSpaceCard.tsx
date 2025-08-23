import React from "react";
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface EventSpace {
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
}

interface EventSpaceCardProps {
  space: EventSpace;
  onViewDetails?: (space: EventSpace) => void;
}

export const EventSpaceCard: React.FC<EventSpaceCardProps> = ({ space, onViewDetails }) => {
  return (
    <Card className="group hover:shadow-medium transition-all duration-300 cursor-pointer"
          onClick={() => onViewDetails?.(space)}>
      <div className="relative">
        <img
          src={space.image_url}
          alt={space.name}
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
        {!space.available && (
          <div className="absolute inset-0 bg-black/50 rounded-t-lg flex items-center justify-center">
            <Badge variant="destructive">Not Available</Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-lg">{space.name}</h3>
            <Badge variant="secondary" className="text-xs mt-1">{space.category}</Badge>
          </div>
          <div className="text-right">
            <p className="font-bold text-primary">{space.price}</p>
            <div className="flex items-center text-sm text-muted-foreground">
              <Star className="h-3 w-3 fill-current text-yellow-400 mr-1" />
              {space.rating} ({space.reviews})
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {space.description}
        </p>

        <div className="flex flex-wrap gap-1 mb-3">
          {space.specs.map((spec, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {spec}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
          <span className="flex items-center">
            <MapPin className="h-3 w-3 mr-1" />
            {space.location}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            className="flex-1"
            disabled={!space.available}
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails?.(space);
            }}
          >
            Book Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
