/**
 * Example components showing how to use Supabase hooks
 * These examples replace the previous JSON-based data fetching
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Import Supabase hooks
import { useEvents, useEventMutations } from '@/hooks/useEvents';
import { useEventPhotos, usePhotoMutations } from '@/hooks/usePhotos';
import { useEventUsers, useUserMutations } from '@/hooks/useUsers';
import { useCompleteEventAnalytics } from '@/hooks/useAnalytics';

// Example 1: Fetch and display all events
export const EventsList = () => {
  const { data: events, isLoading, error } = useEvents();

  if (isLoading) return <div>Loading events...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">All Events</h2>
      {events?.map((event) => (
        <Card key={event.id}>
          <CardHeader>
            <CardTitle>{event.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Date: {event.date}</p>
            <p>Location: {event.location}</p>
            <p>Photos: {event.total_photos}</p>
            <p>Users: {event.registered_users}</p>
            <Badge variant={event.status === 'active' ? 'default' : 'secondary'}>
              {event.status}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Example 2: Event photos with search and filtering
export const EventPhotosGrid = ({ eventId }: { eventId: string }) => {
  const { data: photos, isLoading } = useEventPhotos(eventId);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Filter photos by selected tags
  const filteredPhotos = photos?.filter(photo => 
    selectedTags.length === 0 || 
    selectedTags.some(tag => photo.tags.includes(tag))
  );

  if (isLoading) return <div>Loading photos...</div>;

  // Get all unique tags
  const allTags = [...new Set(photos?.flatMap(photo => photo.tags) || [])];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {allTags.map(tag => (
          <Button
            key={tag}
            variant={selectedTags.includes(tag) ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setSelectedTags(prev =>
                prev.includes(tag)
                  ? prev.filter(t => t !== tag)
                  : [...prev, tag]
              );
            }}
          >
            #{tag}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredPhotos?.map((photo) => (
          <Card key={photo.id}>
            <div className="aspect-square overflow-hidden rounded-t-lg">
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold">{photo.title}</h3>
              <p className="text-sm text-gray-600">{photo.photographer}</p>
              <p className="text-sm text-gray-600">{photo.people_count} people</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {photo.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Example 3: Analytics dashboard
export const EventAnalyticsDashboard = ({ eventId }: { eventId: string }) => {
  const { analytics, demographics, trends, tags, isLoading } = useCompleteEventAnalytics(eventId);

  if (isLoading) return <div>Loading analytics...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Event Analytics</h2>
      
      {/* Main metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{analytics?.total_registrations || 0}</div>
            <p className="text-sm text-gray-600">Total Registrations</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{analytics?.total_photos_uploaded || 0}</div>
            <p className="text-sm text-gray-600">Photos Uploaded</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{analytics?.total_matches_found || 0}</div>
            <p className="text-sm text-gray-600">Matches Found</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{analytics?.average_match_confidence || 0}%</div>
            <p className="text-sm text-gray-600">Avg Confidence</p>
          </CardContent>
        </Card>
      </div>

      {/* Demographics */}
      <Card>
        <CardHeader>
          <CardTitle>Age Demographics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {demographics?.map((demo) => (
              <div key={demo.age_group} className="flex justify-between">
                <span>{demo.age_group}</span>
                <span>{demo.count} users</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Popular tags */}
      <Card>
        <CardHeader>
          <CardTitle>Popular Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {tags?.map((tag) => (
              <Badge key={tag.tag} variant="secondary">
                {tag.tag} ({tag.count})
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};