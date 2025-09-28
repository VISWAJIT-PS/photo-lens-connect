import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { EventUser } from '@/lib/supabase-types';

// Fetch users for a specific event
export const useEventUsers = (eventId: string) => {
  return useQuery({
    queryKey: ['event-users', eventId],
    queryFn: async (): Promise<EventUser[]> => {
      const { data, error } = await supabase
        .from('event_users')
        .select('*')
        .eq('event_id', eventId)
        .order('registration_date', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    },
    enabled: !!eventId,
  });
};

// Fetch single user by ID
export const useEventUser = (userId: string) => {
  return useQuery({
    queryKey: ['event-users', 'single', userId],
    queryFn: async (): Promise<EventUser | null> => {
      const { data, error } = await supabase
        .from('event_users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw new Error(error.message);
      }

      return data || null;
    },
    enabled: !!userId,
  });
};

// Fetch users by status
export const useEventUsersByStatus = (eventId: string, status: 'active' | 'completed' | 'pending') => {
  return useQuery({
    queryKey: ['event-users', eventId, 'status', status],
    queryFn: async (): Promise<EventUser[]> => {
      const { data, error } = await supabase
        .from('event_users')
        .select('*')
        .eq('event_id', eventId)
        .eq('status', status)
        .order('registration_date', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    },
    enabled: !!eventId,
  });
};

// Get user statistics for an event
export const useEventUserStats = (eventId: string) => {
  return useQuery({
    queryKey: ['event-users', eventId, 'stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('event_users')
        .select('status, photos_uploaded, matches_found')
        .eq('event_id', eventId);

      if (error) {
        throw new Error(error.message);
      }

      // Calculate statistics
      const stats = {
        total: data.length,
        active: data.filter(u => u.status === 'active').length,
        completed: data.filter(u => u.status === 'completed').length,
        pending: data.filter(u => u.status === 'pending').length,
        totalPhotosUploaded: data.reduce((sum, u) => sum + u.photos_uploaded, 0),
        totalMatches: data.reduce((sum, u) => sum + u.matches_found, 0),
        avgPhotosPerUser: data.length > 0 ? data.reduce((sum, u) => sum + u.photos_uploaded, 0) / data.length : 0,
        avgMatchesPerUser: data.length > 0 ? data.reduce((sum, u) => sum + u.matches_found, 0) / data.length : 0,
      };

      return stats;
    },
    enabled: !!eventId,
  });
};

// Hook for user mutations
export const useUserMutations = () => {
  const queryClient = useQueryClient();

  const createUser = async (user: Omit<EventUser, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('event_users')
      .insert(user)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // Invalidate related queries
    queryClient.invalidateQueries({ queryKey: ['event-users', user.event_id] });
    queryClient.invalidateQueries({ queryKey: ['event-users', user.event_id, 'stats'] });
    
    return data;
  };

  const updateUser = async (userId: string, updates: Partial<Omit<EventUser, 'id' | 'created_at' | 'updated_at'>>) => {
    const { data, error } = await supabase
      .from('event_users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // Invalidate related queries
    if (data) {
      queryClient.invalidateQueries({ queryKey: ['event-users', data.event_id] });
      queryClient.invalidateQueries({ queryKey: ['event-users', data.event_id, 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['event-users', 'single', userId] });
    }
    
    return data;
  };

  const deleteUser = async (userId: string) => {
    // First get the user to know which event to invalidate
    const { data: user } = await supabase
      .from('event_users')
      .select('event_id')
      .eq('id', userId)
      .single();

    const { error } = await supabase
      .from('event_users')
      .delete()
      .eq('id', userId);

    if (error) {
      throw new Error(error.message);
    }

    // Invalidate related queries
    if (user) {
      queryClient.invalidateQueries({ queryKey: ['event-users', user.event_id] });
      queryClient.invalidateQueries({ queryKey: ['event-users', user.event_id, 'stats'] });
    }
    queryClient.invalidateQueries({ queryKey: ['event-users', 'single', userId] });
    
    return true;
  };

  return {
    createUser,
    updateUser,
    deleteUser,
  };
};