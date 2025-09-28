import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { EventPhoto } from '@/lib/supabase-types';

// Fetch photos for a specific event with enhanced options
export const useEventPhotos = (eventId: string, options?: {
  limit?: number;
  featured?: boolean;
  photographer?: string;
  tags?: string[];
}) => {
  return useQuery({
    queryKey: ['event-photos', eventId, options],
    queryFn: async (): Promise<EventPhoto[]> => {
      let query = supabase
        .from('event_photos')
        .select('*')
        .eq('event_id', eventId)
        .eq('is_public', true)
        .order('timestamp', { ascending: false });

      if (options?.featured) {
        query = query.eq('is_featured', true);
      }

      if (options?.photographer) {
        query = query.eq('photographer', options.photographer);
      }

      if (options?.tags && options.tags.length > 0) {
        query = query.overlaps('tags', options.tags);
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    },
    enabled: !!eventId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Fetch photos with detailed analytics
export const useEventPhotosWithDetails = (eventId: string) => {
  return useQuery({
    queryKey: ['event-photos-details', eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('photo_details')
        .select('*')
        .eq('event_id', eventId)
        .eq('is_public', true)
        .order('timestamp', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    },
    enabled: !!eventId,
    staleTime: 2 * 60 * 1000,
  });
};

// Fetch single photo by ID
export const usePhoto = (photoId: string) => {
  return useQuery({
    queryKey: ['photos', photoId],
    queryFn: async (): Promise<EventPhoto | null> => {
      const { data, error } = await supabase
        .from('event_photos')
        .select('*')
        .eq('id', photoId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw new Error(error.message);
      }

      return data || null;
    },
    enabled: !!photoId,
  });
};

// Fetch photos by tags
export const usePhotosByTags = (eventId: string, tags: string[]) => {
  return useQuery({
    queryKey: ['event-photos', eventId, 'tags', tags.join(',')],
    queryFn: async (): Promise<EventPhoto[]> => {
      const { data, error } = await supabase
        .from('event_photos')
        .select('*')
        .eq('event_id', eventId)
        .overlaps('tags', tags)
        .order('timestamp', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    },
    enabled: !!eventId && tags.length > 0,
  });
};

// Fetch photos by photographer
export const usePhotosByPhotographer = (eventId: string, photographer: string) => {
  return useQuery({
    queryKey: ['event-photos', eventId, 'photographer', photographer],
    queryFn: async (): Promise<EventPhoto[]> => {
      const { data, error } = await supabase
        .from('event_photos')
        .select('*')
        .eq('event_id', eventId)
        .eq('photographer', photographer)
        .order('timestamp', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    },
    enabled: !!eventId && !!photographer,
  });
};

// Hook for photo mutations (create, update, delete)
export const usePhotoMutations = () => {
  const queryClient = useQueryClient();

  const createPhoto = async (photo: Omit<EventPhoto, 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('event_photos')
      .insert(photo)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // Invalidate related queries
    queryClient.invalidateQueries({ queryKey: ['event-photos', photo.event_id] });
    
    return data;
  };

  const updatePhoto = async (photoId: string, updates: Partial<Omit<EventPhoto, 'id' | 'created_at' | 'updated_at'>>) => {
    const { data, error } = await supabase
      .from('event_photos')
      .update(updates)
      .eq('id', photoId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // Invalidate related queries
    if (data) {
      queryClient.invalidateQueries({ queryKey: ['event-photos', data.event_id] });
      queryClient.invalidateQueries({ queryKey: ['photos', photoId] });
    }
    
    return data;
  };

  const deletePhoto = async (photoId: string) => {
    // First get the photo to know which event to invalidate
    const { data: photo } = await supabase
      .from('event_photos')
      .select('event_id')
      .eq('id', photoId)
      .single();

    const { error } = await supabase
      .from('event_photos')
      .delete()
      .eq('id', photoId);

    if (error) {
      throw new Error(error.message);
    }

    // Invalidate related queries
    if (photo) {
      queryClient.invalidateQueries({ queryKey: ['event-photos', photo.event_id] });
    }
    queryClient.invalidateQueries({ queryKey: ['photos', photoId] });
    
    return true;
  };

  return {
    createPhoto,
    updatePhoto,
    deletePhoto,
  };
};