import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, CheckCircle, User, MapPin, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Event {
  id: string;
  eventName: string;
  eventDate: string;
  location: string;
  status: 'registered' | 'waiting' | 'completed';
  photosUploaded?: number;
  matchesFound?: number;
}

const MyEventsTab: React.FC = () => {
  const navigate = useNavigate();

  // Mock data for user's registered events
  const userEvents: Event[] = [
    {
      id: '1',
      eventName: 'Wedding Reception - Smith Family',
      eventDate: '2024-12-15',
      location: 'Grand Ballroom, Downtown Hotel',
      status: 'registered',
    },
    {
      id: '2',
      eventName: 'Corporate Conference 2024',
      eventDate: '2024-11-20',
      location: 'Convention Center, Business District',
      status: 'waiting',
      photosUploaded: 5,
    },
    {
      id: '3',
      eventName: 'Birthday Party - Johnson Family',
      eventDate: '2024-10-30',
      location: 'Private Venue, Riverside',
      status: 'completed',
      photosUploaded: 25,
      matchesFound: 8,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'registered':
        return 'bg-blue-500';
      case 'waiting':
        return 'bg-yellow-500';
      case 'completed':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'registered':
        return 'Registered';
      case 'waiting':
        return 'Waiting for Results';
      case 'completed':
        return 'Results Available';
      default:
        return status;
    }
  };

  const handleEventAction = (event: Event) => {
    switch (event.status) {
      case 'registered':
        navigate(`/event/${event.id}/register`);
        break;
      case 'waiting':
        navigate(`/event/${event.id}/waiting`);
        break;
      case 'completed':
        navigate(`/event/${event.id}/results`);
        break;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Events</h2>
          <p className="text-muted-foreground">Manage your event registrations and view results</p>
        </div>
        <Badge variant="secondary" className="px-3 py-1">
          {userEvents.length} Events
        </Badge>
      </div>

      {userEvents.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Events Yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              You haven't registered for any events yet. Browse available events to get started.
            </p>
            <Button onClick={() => navigate('/user-dashboard')}>
              Browse Events
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {userEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{event.eventName}</CardTitle>
                    <CardDescription className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(event.eventDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </span>
                    </CardDescription>
                  </div>
                  <Badge
                    variant="secondary"
                    className={`${getStatusColor(event.status)} text-white`}
                  >
                    {getStatusText(event.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    {event.photosUploaded !== undefined && (
                      <div className="flex items-center gap-2">
                        <Camera className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {event.photosUploaded} photos uploaded
                        </span>
                      </div>
                    )}
                    {event.matchesFound !== undefined && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {event.matchesFound} matches found
                        </span>
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={() => handleEventAction(event)}
                    variant={event.status === 'completed' ? 'default' : 'outline'}
                  >
                    {event.status === 'registered' && (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Complete Registration
                      </>
                    )}
                    {event.status === 'waiting' && (
                      <>
                        <Clock className="h-4 w-4 mr-2" />
                        View Status
                      </>
                    )}
                    {event.status === 'completed' && (
                      <>
                        <Camera className="h-4 w-4 mr-2" />
                        View Results
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Access event-related features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => navigate('/user-dashboard')}
            >
              <Calendar className="h-6 w-6" />
              <span>Browse Events</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => navigate('/gallery')}
            >
              <Camera className="h-6 w-6" />
              <span>View Gallery</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => navigate('/chat')}
            >
              <User className="h-6 w-6" />
              <span>Contact Support</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyEventsTab;