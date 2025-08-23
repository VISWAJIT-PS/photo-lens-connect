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
    specialization: string | string[];
    rating: number;
    reviews: number;
    price: string;
    location: string;
    image_url: string;
    bio?: string;
    portfolio_count?: number;
    experience_years?: number;
   distance?: string;
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
      className="relative hover:shadow-lg transition-shadow cursor-pointer group hover:scale-[1.02] duration-200" 
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3 relative">
        {creator.distance && (
          <Button variant="ghost" className=" bg-background/80 backdrop-blur-sm">
            <MapPin className="w-4 h-4 mr-1" /> {creator.distance}
          </Button>
        )}
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
            {/* specialization can be a string or an array */}
            {Array.isArray(creator.specialization) ? (
              (() => {
                const specs = creator.specialization as string[];
                const first = specs[0];
                const more = specs.length - 1;
                const rest = specs.slice(1).join(', ');
                return (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">{first}</Badge>
                    {more > 0 && (
                      <Badge variant="outline" className="text-xs" title={rest}>
                        +{more} more
                      </Badge>
                    )}
                  </div>
                );
              })()
            ) : (
              <p className="text-sm text-muted-foreground">{creator.specialization}</p>
            )}

            {/* Rating: stars + numeric value + reviews */}
            <div className="flex items-center mt-1">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={(i < Math.round(creator.rating) ? 'text-yellow-400' : 'text-muted-foreground') + ' h-4 w-4'}
                    aria-hidden
                  />
                ))}
              </div>
              <span className="ml-2 text-sm font-medium">{Number(creator.rating).toFixed(1)}</span>
              <span className="ml-2 text-sm text-muted-foreground">({creator.reviews})</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-3">
          {/* <Badge variant="secondary">{creator.price}</Badge> */}
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