import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Camera, MapPin, Calendar, Star, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CreatorCardProps {
  creator: {
    id: string;
    name: string;
    specialization: string;
    rating: number;
    reviews: number;
    price: string;
    location: string;
    image_url: string;
    bio?: string;
    portfolio_count?: number;
    experience_years?: number;
  };
  type: 'photographer' | 'videographer' | 'event_team';
}

export const CreatorCard: React.FC<CreatorCardProps> = ({ creator, type }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/profile/${type}/${creator.id}`, { state: { creator, type } });
  };

  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer group hover:scale-[1.02] duration-200" 
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <img
            src={creator.image_url || "/src/assets/hero-photographer.jpg"}
            alt={creator.name}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/10 group-hover:ring-primary/20 transition-all"
          />
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              {creator.name}
              {type === 'videographer' && <Video className="h-4 w-4 text-primary" />}
              {type === 'photographer' && <Camera className="h-4 w-4 text-primary" />}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{creator.specialization}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{creator.rating}</span>
            <span className="text-sm text-muted-foreground">({creator.reviews})</span>
          </div>
          <Badge variant="secondary">{creator.price}</Badge>
        </div>
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <MapPin className="h-4 w-4 mr-1" />
          {creator.location}
        </div>
        <Button className="w-full group-hover:bg-primary/90 transition-colors">
          <Calendar className="h-4 w-4 mr-2" />
          Book Now
        </Button>
      </CardContent>
    </Card>
  );
};