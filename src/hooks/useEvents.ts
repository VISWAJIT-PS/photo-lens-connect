import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Event } from '@/lib/supabase-types';

// Fetch all events with enhanced data
export const useEvents = (options?: { status?: string; limit?: number }) => {
  return useQuery({
    queryKey: ['events', options],
    queryFn: async (): Promise<Event[]> => {
      let query = supabase
        .from('events')
        .select('*')
        .order('date', { ascending: false });

      if (options?.status) {
        query = query.eq('status', options.status);
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
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Fetch events with summary statistics
export const useEventsSummary = () => {
  return useQuery({
    queryKey: ['events-summary'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('event_summary')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Fetch single event by ID
export const useEvent = (eventId: string) => {
  return useQuery({
    queryKey: ['events', eventId],
    queryFn: async (): Promise<Event | null> => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
        throw new Error(error.message);
      }

      return data || null;
    },
    enabled: !!eventId,
  });
};

// Hook for creating/updating events (for admin use)
export const useEventMutations = () => {
  const queryClient = useQueryClient();

  const createEventMutation = useMutation({
    mutationFn: async (event: Omit<Event, 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('events')
        .insert(event)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['events-summary'] });
    },
  });

  const updateEventMutation = useMutation({
    mutationFn: async ({ eventId, updates }: { 
      eventId: string; 
      updates: Partial<Omit<Event, 'id' | 'created_at' | 'updated_at'>> 
    }) => {
      const { data, error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', eventId)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['events', data.id] });
      queryClient.invalidateQueries({ queryKey: ['events-summary'] });
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) {
        throw new Error(error.message);
      }

      return eventId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['events-summary'] });
    },
  });

  return {
    createEvent: createEventMutation.mutateAsync,
    updateEvent: (eventId: string, updates: any) => 
      updateEventMutation.mutateAsync({ eventId, updates }),
    deleteEvent: deleteEventMutation.mutateAsync,
    isLoading: createEventMutation.isPending || 
                updateEventMutation.isPending || 
                deleteEventMutation.isPending,
  };
};