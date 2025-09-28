import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { EventAnalytics, UserDemographics, RegistrationTrend, PopularTag } from '@/lib/supabase-types';

// Fetch analytics for a specific event
export const useEventAnalytics = (eventId: string) => {
  return useQuery({
    queryKey: ['event-analytics', eventId],
    queryFn: async (): Promise<EventAnalytics | null> => {
      const { data, error } = await supabase
        .from('event_analytics')
        .select('*')
        .eq('event_id', eventId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw new Error(error.message);
      }

      return data || null;
    },
    enabled: !!eventId,
  });
};

// Fetch user demographics for a specific event
export const useUserDemographics = (eventId: string) => {
  return useQuery({
    queryKey: ['user-demographics', eventId],
    queryFn: async (): Promise<UserDemographics[]> => {
      const { data, error } = await supabase
        .from('user_demographics')
        .select('*')
        .eq('event_id', eventId);

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    },
    enabled: !!eventId,
  });
};

// Fetch registration trends for a specific event
export const useRegistrationTrends = (eventId: string) => {
  return useQuery({
    queryKey: ['registration-trends', eventId],
    queryFn: async (): Promise<RegistrationTrend[]> => {
      const { data, error } = await supabase
        .from('registration_trends')
        .select('*')
        .eq('event_id', eventId)
        .order('date', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    },
    enabled: !!eventId,
  });
};

// Fetch popular tags for a specific event
export const usePopularTags = (eventId: string) => {
  return useQuery({
    queryKey: ['popular-tags', eventId],
    queryFn: async (): Promise<PopularTag[]> => {
      const { data, error } = await supabase
        .from('popular_tags')
        .select('*')
        .eq('event_id', eventId)
        .order('count', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    },
    enabled: !!eventId,
  });
};

// Fetch comprehensive analytics data for an event
export const useCompleteEventAnalytics = (eventId: string) => {
  const analyticsQuery = useEventAnalytics(eventId);
  const demographicsQuery = useUserDemographics(eventId);
  const trendsQuery = useRegistrationTrends(eventId);
  const tagsQuery = usePopularTags(eventId);

  return {
    analytics: analyticsQuery.data,
    demographics: demographicsQuery.data,
    trends: trendsQuery.data,
    tags: tagsQuery.data,
    isLoading: analyticsQuery.isLoading || demographicsQuery.isLoading || trendsQuery.isLoading || tagsQuery.isLoading,
    error: analyticsQuery.error || demographicsQuery.error || trendsQuery.error || tagsQuery.error,
  };
};

// Fetch analytics for all events (admin overview)
export const useAllEventsAnalytics = () => {
  return useQuery({
    queryKey: ['all-events-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('event_analytics')
        .select(`
          *,
          events (
            id,
            name,
            status
          )
        `);

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    },
  });
};

// Hook for analytics mutations
export const useAnalyticsMutations = () => {
  const queryClient = useQueryClient();

  const updateEventAnalytics = async (eventId: string, updates: Partial<Omit<EventAnalytics, 'id' | 'created_at' | 'updated_at'>>) => {
    const { data, error } = await supabase
      .from('event_analytics')
      .upsert({ event_id: eventId, ...updates })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // Invalidate related queries
    queryClient.invalidateQueries({ queryKey: ['event-analytics', eventId] });
    queryClient.invalidateQueries({ queryKey: ['all-events-analytics'] });
    
    return data;
  };

  const addRegistrationTrend = async (trend: Omit<RegistrationTrend, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('registration_trends')
      .upsert(trend)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // Invalidate related queries
    queryClient.invalidateQueries({ queryKey: ['registration-trends', trend.event_id] });
    
    return data;
  };

  const updatePopularTag = async (tag: Omit<PopularTag, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('popular_tags')
      .upsert(tag)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // Invalidate related queries
    queryClient.invalidateQueries({ queryKey: ['popular-tags', tag.event_id] });
    
    return data;
  };

  const updateUserDemographics = async (demographics: Omit<UserDemographics, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('user_demographics')
      .upsert(demographics)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // Invalidate related queries
    queryClient.invalidateQueries({ queryKey: ['user-demographics', demographics.event_id] });
    
    return data;
  };

  return {
    updateEventAnalytics,
    addRegistrationTrend,
    updatePopularTag,
    updateUserDemographics,
  };
};