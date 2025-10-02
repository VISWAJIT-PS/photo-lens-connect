import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface WebsiteStats {
  id: string;
  photographers_count: number;
  events_count: number;
  average_rating: number;
  response_time_hours: number;
  active_photographers: number;
  completed_events: number;
  total_reviews: number;
  updated_at: string;
  created_at: string;
}

/**
 * Hook to fetch website statistics from Supabase
 * Returns real-time data about photographers, events, ratings, etc.
 */
export function useWebsiteStats() {
  return useQuery({
    queryKey: ["website-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("website_stats")
        .select("*")
        .single();

      if (error) {
        console.error("Error fetching website stats:", error);
        // Return default values if there's an error
        return {
          id: "",
          photographers_count: 500,
          events_count: 1000,
          average_rating: 4.9,
          response_time_hours: 2,
          active_photographers: 500,
          completed_events: 1000,
          total_reviews: 850,
          updated_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        } as WebsiteStats;
      }

      return data as WebsiteStats;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook to manually trigger stats update
 * This calls the database function to recalculate all statistics
 */
export function useUpdateWebsiteStats() {
  return async () => {
    const { error } = await supabase.rpc("update_website_stats");
    
    if (error) {
      console.error("Error updating website stats:", error);
      throw error;
    }
    
    return true;
  };
}
